/**
 * Network Routes
 * 
 * REST API endpoints for network management
 */

import { Router } from 'express';
import {
  getNetworkTree,
  getDownlines,
  getUpline,
  getNetworkStats,
} from '../../modules/network/api/network.api';

const router = Router();

router.get('/:distributorId/tree', async (req, res) => {
  const result = await getNetworkTree({ distributorId: req.params.distributorId });
  res.json(result);
});

router.get('/:distributorId/downlines', async (req, res) => {
  const result = await getDownlines({ distributorId: req.params.distributorId, ...req.query });
  res.json(result);
});

router.get('/:distributorId/upline', async (req, res) => {
  const result = await getUpline({ distributorId: req.params.distributorId });
  res.json(result);
});

router.get('/:distributorId/stats', async (req, res) => {
  const result = await getNetworkStats({ distributorId: req.params.distributorId });
  res.json(result);
});

export { router as networkRouter };
