/**
 * Payments Routes
 * 
 * REST API endpoints for payment management
 */

import { Router } from 'express';
import {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  processPaymentWebhook,
  getPaymentStats,
} from '../../modules/payments/api/payments.api';

const router = Router();

router.get('/', async (req, res) => {
  const result = await getPayments(req.query);
  res.json(result);
});

router.get('/:id', async (req, res) => {
  const result = await getPaymentById({ id: req.params.id });
  res.json(result);
});

router.post('/', async (req, res) => {
  const result = await createPayment(req.body);
  res.json(result);
});

router.put('/:id', async (req, res) => {
  const result = await updatePayment({ id: req.params.id, data: req.body });
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const result = await deletePayment({ id: req.params.id });
  res.json(result);
});

router.post('/webhook', async (req, res) => {
  const result = await processPaymentWebhook(req.body);
  res.json(result);
});

router.get('/stats/overview', async (req, res) => {
  const result = await getPaymentStats();
  res.json(result);
});

export { router as paymentsRouter };
