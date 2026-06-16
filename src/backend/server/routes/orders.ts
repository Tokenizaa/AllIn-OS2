/**
 * Orders Routes
 * 
 * REST API endpoints for order management
 */

import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  getOrderSummary,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderItems,
  getOrderStats,
} from '../../modules/orders/api/orders.api';

const router = Router();

router.get('/', async (req, res) => {
  const result = await getOrders(req.query);
  res.json(result);
});

router.get('/:id', async (req, res) => {
  const result = await getOrderById({ id: req.params.id });
  res.json(result);
});

router.get('/:id/summary', async (req, res) => {
  const result = await getOrderSummary({ id: req.params.id });
  res.json(result);
});

router.get('/:id/items', async (req, res) => {
  const result = await getOrderItems({ id: req.params.id });
  res.json(result);
});

router.post('/', async (req, res) => {
  const result = await createOrder(req.body);
  res.json(result);
});

router.put('/:id', async (req, res) => {
  const result = await updateOrder({ id: req.params.id, data: req.body });
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const result = await deleteOrder({ id: req.params.id });
  res.json(result);
});

router.get('/stats/overview', async (req, res) => {
  const result = await getOrderStats();
  res.json(result);
});

export { router as ordersRouter };
