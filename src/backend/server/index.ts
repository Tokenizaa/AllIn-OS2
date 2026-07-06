/**
 * Backend HTTP Server
 *
 * Express server that exposes backend modules via REST API
 * This provides a clean separation between frontend and backend
 */

// Load environment variables from .env file
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
import { authRouter } from './routes/auth';
import { customersRouter } from './routes/customers';
import { plansRouter } from './routes/plans';
import { ordersRouter } from './routes/orders';
import { paymentsRouter } from './routes/payments';
import { networkRouter } from './routes/network';
import { analyticsRouter } from './routes/analytics';
import { distributorsRouter } from './routes/distributors';

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175'],
  credentials: true,
}));
app.use(express.json());
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/customers', customersRouter);
app.use('/api/distributors', distributorsRouter);
app.use('/api/plans', plansRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/network', networkRouter);
app.use('/api/analytics', analyticsRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

export { app };
