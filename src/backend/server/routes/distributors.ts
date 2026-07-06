/**
 * Distributors API Routes
 * 
 * Routes for managing distributors (mlm.distribuidores)
 * This is separate from customers (crm.customers) as not all customers are distributors
 */

import { Router } from 'express';
import { requirePermission } from '../middleware/rbac.middleware';
import { PermissionEnum } from '../../../shared/types/permissions';
import { DistributorService } from '../../modules/distributors/services/distributor.service';
import { paginationSchema, filterSchema } from '../../shared/dto/pagination.dto';

const router = Router();
const distributorService = new DistributorService();

// GET /api/distributors - Get all distributors with pagination and filters
router.get('/', requirePermission(PermissionEnum.NETWORK_READ), async (req, res) => {
  try {
    const parsed = paginationSchema.merge(filterSchema).parse(req.query);
    const result = await distributorService.findAll(parsed);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch distributors' });
  }
});

// GET /api/distributors/stats - Get distributor statistics
// This must be defined before /:id to avoid being caught as an ID parameter
router.get('/stats', requirePermission(PermissionEnum.NETWORK_READ), async (req, res) => {
  try {
    const stats = await distributorService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch distributor stats' });
  }
});

// GET /api/distributors/usuario/:usuario - Get distributor by username
// This must be defined before /:id to avoid being caught as an ID parameter
router.get('/usuario/:usuario', requirePermission(PermissionEnum.NETWORK_READ), async (req, res) => {
  try {
    const distributor = await distributorService.findByUsuario(req.params.usuario);
    if (!distributor) {
      return res.status(404).json({ error: 'Distributor not found' });
    }
    res.json(distributor);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch distributor' });
  }
});

// GET /api/distributors/:id - Get distributor by ID
router.get('/:id', requirePermission(PermissionEnum.NETWORK_READ), async (req, res) => {
  try {
    const distributor = await distributorService.findById(req.params.id);
    if (!distributor) {
      return res.status(404).json({ error: 'Distributor not found' });
    }
    res.json(distributor);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch distributor' });
  }
});

export { router as distributorsRouter };
