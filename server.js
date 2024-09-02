import express from 'express';
import cors from 'cors';
import pg from 'pg';
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database_name',
  password: 'your_password',
  port: 5432,
});

// SharePoint configuration
const tenantId = 'your_tenant_id';
const clientId = 'your_client_id';
const clientSecret = 'your_client_secret';
const siteId = 'your_sharepoint_site_id';
const driveId = 'your_sharepoint_drive_id';

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
});

const graphClient = Client.initWithMiddleware({ authProvider });

// Multer configuration for file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.get('/api/submissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM submissions ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching submissions' });
  }
});

app.post('/api/submissions', upload.single('video'), async (req, res) => {
  const { name, talentDescription, discordUsername } = req.body;
  const videoFile = req.file;

  try {
    // Upload file to SharePoint
    const fileName = `${Date.now()}_${videoFile.originalname}`;
    const fileContent = videoFile.buffer;

    const uploadedFile = await graphClient.api(`/sites/${siteId}/drives/${driveId}/root:/${fileName}:/content`)
      .put(fileContent);

    const videoUrl = uploadedFile.webUrl;

    // Save submission to database
    const result = await pool.query(
      'INSERT INTO submissions (name, talent_description, discord_username, video_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, talentDescription, discordUsername, videoUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while submitting the talent' });
  }
});

app.get('/api/video/:submissionId', async (req, res) => {
  const { submissionId } = req.params;

  try {
    // Get video URL from database
    const result = await pool.query('SELECT video_url FROM submissions WHERE id = $1', [submissionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const { video_url } = result.rows[0];

    // Get file content from SharePoint
    const fileContent = await graphClient.api(video_url)
      .get();

    // Set appropriate headers
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'inline');

    // Stream the file content to the response
    fileContent.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the video' });
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
    video_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Error creating table:', err));