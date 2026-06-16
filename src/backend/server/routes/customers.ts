/**
 * Customers Routes
 * 
 * REST API endpoints for customer management
 */

import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  getCustomer360,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
  getCustomerDownlines,
} from '../../modules/customers/api/customers.api';

const router = Router();

router.get('/', async (req, res) => {
  const result = await getCustomers(req.query);
  res.json(result);
});

router.get('/:id', async (req, res) => {
  const result = await getCustomerById({ id: req.params.id });
  res.json(result);
});

router.get('/:id/360', async (req, res) => {
  const result = await getCustomer360({ id: req.params.id });
  res.json(result);
});

router.post('/', async (req, res) => {
  const result = await createCustomer(req.body);
  res.json(result);
});

router.put('/:id', async (req, res) => {
  const result = await updateCustomer({ id: req.params.id, data: req.body });
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const result = await deleteCustomer({ id: req.params.id });
  res.json(result);
});

router.get('/stats/overview', async (req, res) => {
  const result = await getCustomerStats();
  res.json(result);
});

router.get('/:sponsorId/downlines', async (req, res) => {
  const result = await getCustomerDownlines({ sponsorId: req.params.sponsorId, ...req.query });
  res.json(result);
});

export { router as customersRouter };
