import express from 'express';
import cors from 'cors';
import pg from 'pg';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'talent_submissions',
  password: 'your_password',
  port: 5432,
});

app.get('/api/submissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM submissions ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching submissions' });
  }
});

app.post('/api/submissions', async (req, res) => {
  const { name, talentDescription, discordUsername, videoUrl } = req.body;
  try {
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
