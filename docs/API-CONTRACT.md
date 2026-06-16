# API Contract Documentation

## Overview

This document defines the HTTP API contract between the frontend and backend. The backend is an Express server running on port 3001 (configurable via `BACKEND_PORT` environment variable).

**Base URL:** `http://localhost:3001` (configurable via `VITE_BACKEND_URL`)

**Authentication:** Bearer token in Authorization header

---

## Response Format

All API responses follow this standard format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

---

## Endpoints

### Auth Endpoints

#### POST `/api/auth/login`
Login user with email and password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "distributor",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### POST `/api/auth/register`
Register new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:** Same as login

#### POST `/api/auth/refresh`
Refresh access token

**Request:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response:** Same as login

#### POST `/api/auth/change-password`
Change user password

**Request:**
```json
{
  "userId": "uuid",
  "data": {
    "currentPassword": "old-password",
    "newPassword": "new-password"
  }
}
```

#### POST `/api/auth/logout`
Logout user

**Request:**
```json
{
  "userId": "uuid"
}
```

---

### Customer Endpoints

#### GET `/api/customers`
Get all customers with pagination

**Query Params:**
- `page` (number, optional)
- `limit` (number, optional)
- `offset` (number, optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+55 11 99999-9999",
      "cpf": "123.456.789-00",
      "status": "active",
      "sponsorId": "uuid",
      "distributorId": "uuid",
      "allinId": 12345,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET `/api/customers/:id`
Get customer by ID

#### GET `/api/customers/:id/360`
Get customer 360 view (includes metrics, network metrics, scores, plans)

#### POST `/api/customers`
Create new customer

#### PUT `/api/customers/:id`
Update customer

#### DELETE `/api/customers/:id`
Delete customer

#### GET `/api/customers/stats/overview`
Get customer statistics

#### GET `/api/customers/:sponsorId/downlines`
Get customer downlines with pagination

---

### Plan Endpoints

#### GET `/api/plans`
Get all plans with pagination

#### GET `/api/plans/:id`
Get plan by ID

#### POST `/api/plans`
Create new plan

#### PUT `/api/plans/:id`
Update plan

#### DELETE `/api/plans/:id`
Delete plan

#### GET `/api/plans/:id/bonuses`
Get plan bonuses

#### POST `/api/plans/:id/bonuses`
Create plan bonus

#### DELETE `/api/plans/:id/bonuses/:bonusId`
Delete plan bonus

#### POST `/api/plans/customers/:customerId/activate`
Activate customer plan

#### POST `/api/plans/customers/:customerId/deactivate`
Deactivate customer plan

#### GET `/api/plans/customers/:customerId`
Get customer plans

#### GET `/api/plans/customers/:customerId/active`
Get customer active plan

#### GET `/api/plans/stats/overview`
Get plan statistics

#### GET `/api/plans/stats/all`
Get all plan statistics

---

### Order Endpoints

#### GET `/api/orders`
Get all orders with pagination

#### GET `/api/orders/:id`
Get order by ID

#### GET `/api/orders/:id/summary`
Get order summary

#### GET `/api/orders/:id/items`
Get order items

#### POST `/api/orders`
Create new order

#### PUT `/api/orders/:id`
Update order

#### DELETE `/api/orders/:id`
Delete order

#### GET `/api/orders/stats/overview`
Get order statistics

---

### Payment Endpoints

#### GET `/api/payments`
Get all payments with pagination

#### GET `/api/payments/:id`
Get payment by ID

#### POST `/api/payments`
Create new payment

#### PUT `/api/payments/:id`
Update payment

#### DELETE `/api/payments/:id`
Delete payment

#### POST `/api/payments/webhook`
Process payment webhook (for payment gateway callbacks)

#### GET `/api/payments/stats/overview`
Get payment statistics

---

### Network Endpoints

#### GET `/api/network/:distributorId/tree`
Get network tree for distributor

#### GET `/api/network/:distributorId/downlines`
Get distributor downlines with pagination

#### GET `/api/network/:distributorId/upline`
Get distributor upline

#### GET `/api/network/:distributorId/stats`
Get network statistics

---

### Analytics Endpoints

#### GET `/api/analytics/executive`
Get executive analytics

#### GET `/api/analytics/sales`
Get sales analytics

#### GET `/api/analytics/network`
Get network analytics

#### GET `/api/analytics/plans`
Get plan analytics

#### GET `/api/analytics/plans/:id`
Get plan analytics by ID

#### GET `/api/analytics/bonus-distribution`
Get bonus distribution

---

## Error Handling

All errors return the following format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Environment Variables

### Backend
- `BACKEND_PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `SUPABASE_URL` - Supabase URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### Frontend
- `VITE_BACKEND_URL` - Backend API URL (default: http://localhost:3001)
- `VITE_SUPABASE_URL` - Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

---

## Running the Backend

```bash
# Install dependencies
npm install

# Run backend only
npm run backend

# Run both frontend and backend
npm run dev:all
```

---

## Usage Example

```typescript
import { httpClient } from '@/lib/api-client/http-client';

// Login
const loginResult = await httpClient.login({
  email: 'user@example.com',
  password: 'password123'
});

if (loginResult.success) {
  const { user, accessToken } = loginResult.data;
  localStorage.setItem('access_token', accessToken);
}

// Get customers
const customersResult = await httpClient.getCustomers({ page: 1, limit: 10 });

if (customersResult.success) {
  const customers = customersResult.data;
}
```
