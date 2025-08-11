const express =require("express")
import type { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/chat', (req: Request, res: Response) => {
  res.send('Hello from TypeScript Express!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
 