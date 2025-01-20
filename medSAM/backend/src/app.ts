import express from 'express';
import helmet from 'helmet';
import uploadRoutes from './routes/uploadRoutes';
import { logger } from './utils/logger';
import { config } from './config/config';

const app = express();
const cors = require('cors');

app.use(cors({
  origin: `http://localhost:${config.localhostFrontend}`, // Allow requests from your frontend
  methods: 'GET, POST, PUT, DELETE', // Allow specific HTTP methods
  allowedHeaders: 'Content-Type',
}));

app.use(helmet());
app.use(express.json());
app.use('/api', uploadRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
