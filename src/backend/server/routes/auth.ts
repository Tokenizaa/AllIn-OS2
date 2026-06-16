/**
 * Auth Routes
 * 
 * REST API endpoints for authentication
 */

import { Router } from 'express';
import { login, register, refreshToken, changePassword, logout } from '../../modules/auth/api/auth.api';

const router = Router();

router.post('/login', async (req, res) => {
  const result = await login(req.body);
  res.json(result);
});

router.post('/register', async (req, res) => {
  const result = await register(req.body);
  res.json(result);
});

router.post('/refresh', async (req, res) => {
  const result = await refreshToken(req.body);
  res.json(result);
});

router.post('/change-password', async (req, res) => {
  const result = await changePassword(req.body);
  res.json(result);
});

router.post('/logout', async (req, res) => {
  const result = await logout(req.body);
  res.json(result);
});

export { router as authRouter };
