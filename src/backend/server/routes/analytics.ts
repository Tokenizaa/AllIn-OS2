/**
 * Analytics Routes
 * 
 * REST API endpoints for analytics
 */

import { Router } from 'express';
import {
  getExecutiveAnalytics,
  getSalesAnalytics,
  getNetworkAnalytics,
  getPlanAnalytics,
  getPlanAnalyticsById,
  getBonusDistribution,
} from '../../modules/analytics/api/analytics.api';

const router = Router();

router.get('/executive', async (req, res) => {
  const result = await getExecutiveAnalytics(req.query);
  res.json(result);
});

router.get('/sales', async (req, res) => {
  const result = await getSalesAnalytics(req.query);
  res.json(result);
});

router.get('/network', async (req, res) => {
  const result = await getNetworkAnalytics(req.query);
  res.json(result);
});

router.get('/plans', async (req, res) => {
  const result = await getPlanAnalytics(req.query);
  res.json(result);
});

router.get('/plans/:id', async (req, res) => {
  const result = await getPlanAnalyticsById({ id: req.params.id });
  res.json(result);
});

router.get('/bonus-distribution', async (req, res) => {
  const result = await getBonusDistribution(req.query);
  res.json(result);
});

export { router as analyticsRouter };
