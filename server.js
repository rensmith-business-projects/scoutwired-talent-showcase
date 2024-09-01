import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let submissions = [
  { id: 1, name: "John Doe", talentDescription: "Juggling", discordUsername: "johnd#1234", videoUrl: "https://example.com/video1.mp4" },
  { id: 2, name: "Jane Smith", talentDescription: "Singing", discordUsername: "janes#5678", videoUrl: "https://example.com/video2.mp4" },
  { id: 3, name: "Alex Johnson", talentDescription: "Magic Tricks", discordUsername: "alexj#9012", videoUrl: "https://example.com/video3.mp4" },
];

app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

app.post('/api/submissions', (req, res) => {
  const newSubmission = {
    id: submissions.length + 1,
    ...req.body
  };
  submissions.push(newSubmission);
  res.status(201).json(newSubmission);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
