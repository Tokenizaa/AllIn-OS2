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
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission, requireAdmin } from '../middleware/rbac.middleware';
import { PermissionEnum } from '@shared/types/permissions';

const router = Router();

// Apply authentication to all routes
router.use(authMiddleware);

// GET /api/customers - List customers (requires read permission)
router.get('/', requirePermission(PermissionEnum.CUSTOMERS_READ), async (req, res) => {
  const result = await getCustomers(req.query);
  res.json(result);
});

// GET /api/customers/with-order-stats - Get customers with order statistics (requires read permission)
// This must be defined before the /:id route to avoid being caught as an ID parameter
router.get('/with-order-stats', requirePermission(PermissionEnum.CUSTOMERS_READ), async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;

  const result = await getCustomers({ page, limit: pageSize });
  
  // Transform the response to match the expected ApiResponse format
  const response = {
    success: true,
    data: {
      customers: result.data || [],
      orderStats: result.orderStats || {},
      totalCount: result.meta?.total || 0,
      page: result.meta?.page || page,
      pageSize: result.meta?.limit || pageSize,
    }
  };
  res.json(response);
});

// GET /api/customers/:id - Get customer by ID (requires read permission)
router.get('/:id', requirePermission(PermissionEnum.CUSTOMERS_READ), async (req, res) => {
  const result = await getCustomerById({ id: req.params.id });
  res.json(result);
});

// GET /api/customers/:id/360 - Get customer 360 view (requires read permission)
router.get('/:id/360', requirePermission(PermissionEnum.CUSTOMERS_READ), async (req, res) => {
  const result = await getCustomer360({ id: req.params.id });
  res.json(result);
});

// POST /api/customers - Create customer (requires write permission)
router.post('/', requirePermission(PermissionEnum.CUSTOMERS_WRITE), async (req, res) => {
  const result = await createCustomer(req.body);
  res.json(result);
});

// PUT /api/customers/:id - Update customer (requires write permission)
router.put('/:id', requirePermission(PermissionEnum.CUSTOMERS_WRITE), async (req, res) => {
  const result = await updateCustomer({ id: req.params.id, data: req.body });
  res.json(result);
});

// DELETE /api/customers/:id - Delete customer (requires admin)
router.delete('/:id', requireAdmin(), async (req, res) => {
  const result = await deleteCustomer({ id: req.params.id });
  res.json(result);
});

// GET /api/customers/stats/overview - Get customer stats (requires read permission)
router.get('/stats/overview', requirePermission(PermissionEnum.CUSTOMERS_READ), async (req, res) => {
  const result = await getCustomerStats();
  res.json(result);
});

// GET /api/customers/:sponsorId/downlines - Get customer downlines (requires network read permission)
router.get('/:sponsorId/downlines', requirePermission(PermissionEnum.NETWORK_READ), async (req, res) => {
  const result = await getCustomerDownlines({ sponsorId: req.params.sponsorId, ...req.query });
  res.json(result);
});

export { router as customersRouter };
