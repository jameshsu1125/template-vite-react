import express from 'express';
import { env } from 'process';

const app = new express();
app.get('/api/hi', (_, res) => {
  res.send('hello');
});

app.listen(env.port, () => console.log(`server is served. port = ${env.port}`));
