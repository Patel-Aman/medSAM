import express from 'express';
import helmet from 'helmet';
import uploadRoutes from './routes/uploadRoutes';
import { logger } from './utils/logger';

const app = express();

app.use(helmet());
app.use(express.json());
app.use('/api', uploadRoutes);

app.get('/i', (req, res) => {
  res.send("Hello there");
})

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
