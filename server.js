import express from 'express';
import cors from 'cors';
import pg from 'pg';
import multer from 'multer';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// SharePoint configuration
const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const siteId = process.env.SHAREPOINT_SITE_ID;
const driveId = process.env.SHAREPOINT_DRIVE_ID;

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
});

const graphClient = Client.initWithMiddleware({ authProvider });

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed!'), false);
    }
  }
});

app.post('/api/create-submission', upload.single('file'), async (req, res) => {
  const { name, drawingDescription, discordUsername } = req.body;
  const file = req.file;

  try {
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileContent = file.buffer;

    const uploadedFile = await graphClient.api(`/sites/${siteId}/drives/${driveId}/root:/${fileName}:/content`)
      .put(fileContent);

    const fileUrl = uploadedFile.webUrl;

    const result = await pool.query(
      'INSERT INTO submissions (name, talent_description, discord_username, file_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, drawingDescription, discordUsername, fileUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while submitting the file' });
  }
});

app.get('/api/get-submissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM submissions ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching submissions' });
  }
});

app.get('/api/get-file/:submissionId', async (req, res) => {
  const { submissionId } = req.params;

  try {
    const result = await pool.query('SELECT file_url FROM submissions WHERE id = $1', [submissionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const { file_url } = result.rows[0];

    const fileContent = await graphClient.api(file_url).get();

    res.setHeader('Content-Type', fileContent.contentType);
    res.setHeader('Content-Disposition', 'inline');

    fileContent.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the file' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Initialize the database table
pool.query(`
  CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    talent_description TEXT NOT NULL,
    discord_username VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Error creating table:', err));