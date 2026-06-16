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
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission, requireAdmin } from '../middleware/rbac.middleware';
import { PermissionEnum } from '@shared/types/permissions';

const router = Router();

// Apply authentication to all routes
router.use(authMiddleware);

router.get('/', requirePermission(PermissionEnum.ORDERS_READ), async (req, res) => {
  const result = await getOrders(req.query);
  res.json(result);
});

router.get('/:id', requirePermission(PermissionEnum.ORDERS_READ), async (req, res) => {
  const result = await getOrderById({ id: req.params.id });
  res.json(result);
});

router.get('/:id/summary', requirePermission(PermissionEnum.ORDERS_READ), async (req, res) => {
  const result = await getOrderSummary({ id: req.params.id });
  res.json(result);
});

router.get('/:id/items', requirePermission(PermissionEnum.ORDERS_READ), async (req, res) => {
  const result = await getOrderItems({ id: req.params.id });
  res.json(result);
});

router.post('/', requirePermission(PermissionEnum.ORDERS_WRITE), async (req, res) => {
  const result = await createOrder(req.body);
  res.json(result);
});

router.put('/:id', requirePermission(PermissionEnum.ORDERS_WRITE), async (req, res) => {
  const result = await updateOrder({ id: req.params.id, data: req.body });
  res.json(result);
});

router.delete('/:id', requireAdmin(), async (req, res) => {
  const result = await deleteOrder({ id: req.params.id });
  res.json(result);
});

router.get('/stats/overview', requirePermission(PermissionEnum.ORDERS_READ), async (req, res) => {
  const result = await getOrderStats();
  res.json(result);
});

export { router as ordersRouter };
