/**
 * Plans Routes
 * 
 * REST API endpoints for plan management
 */

import { Router } from 'express';
import {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getPlanBonuses,
  createPlanBonus,
  deletePlanBonus,
  activateCustomerPlan,
  deactivateCustomerPlan,
  getCustomerPlans,
  getActiveCustomerPlan,
  getPlanStats,
  getAllPlanStats,
} from '../../modules/plans/api/plans.api';

const router = Router();

router.get('/', async (req, res) => {
  const result = await getPlans(req.query);
  res.json(result);
});

router.get('/:id', async (req, res) => {
  const result = await getPlanById({ id: req.params.id });
  res.json(result);
});

router.post('/', async (req, res) => {
  const result = await createPlan(req.body);
  res.json(result);
});

router.put('/:id', async (req, res) => {
  const result = await updatePlan({ id: req.params.id, data: req.body });
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const result = await deletePlan({ id: req.params.id });
  res.json(result);
});

router.get('/:id/bonuses', async (req, res) => {
  const result = await getPlanBonuses({ id: req.params.id });
  res.json(result);
});

router.post('/:id/bonuses', async (req, res) => {
  const result = await createPlanBonus({ planId: req.params.id, ...req.body });
  res.json(result);
});

router.delete('/:id/bonuses/:bonusId', async (req, res) => {
  const result = await deletePlanBonus({ planId: req.params.id, bonusId: req.params.bonusId });
  res.json(result);
});

router.post('/customers/:customerId/activate', async (req, res) => {
  const result = await activateCustomerPlan({ customerId: req.params.customerId, ...req.body });
  res.json(result);
});

router.post('/customers/:customerId/deactivate', async (req, res) => {
  const result = await deactivateCustomerPlan({ customerId: req.params.customerId });
  res.json(result);
});

router.get('/customers/:customerId', async (req, res) => {
  const result = await getCustomerPlans({ customerId: req.params.customerId });
  res.json(result);
});

router.get('/customers/:customerId/active', async (req, res) => {
  const result = await getActiveCustomerPlan({ customerId: req.params.customerId });
  res.json(result);
});

router.get('/stats/overview', async (req, res) => {
  const result = await getPlanStats();
  res.json(result);
});

router.get('/stats/all', async (req, res) => {
  const result = await getAllPlanStats();
  res.json(result);
});

export { router as plansRouter };
