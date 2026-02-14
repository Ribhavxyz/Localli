# Phase 3.5 End-to-End Test Plan

## Preconditions
- Run DB migration for ADMIN role:
  - `npx prisma migrate deploy`
- Regenerate Prisma client:
  - `npx prisma generate`
- Seed admin user:
  - `npm run seed:admin`

## Flow 1: Vendor
1. `POST /api/auth/signup` with role `VENDOR` -> `201`.
2. `POST /api/auth/login` (vendor credentials) -> `200` + `token`.
3. `GET /api/vendor/store` with vendor token before creation -> `404`.
4. `POST /api/vendor/store` -> `201`.
5. `POST /api/vendor/products` -> `201`.
6. `GET /api/vendor/products` -> `200` with created products.
7. `GET /api/vendor/analytics` -> `200` with:
   - `totalProducts`
   - `totalPurchases`
   - `totalRevenue`
   - `categorySales`
8. Vendor UI access checks:
   - `/vendor` loads for vendor.
   - `/vendor/products` loads for vendor.
   - `/vendor/orders` loads for vendor.
   - `/vendor/analytics` loads for vendor.

## Flow 2: Customer
1. `POST /api/auth/signup` with role `CUSTOMER` -> `201`.
2. `POST /api/auth/login` (customer credentials) -> `200` + `token`.
3. `GET /api/products` -> `200`.
4. `POST /api/cart` with customer token -> `201`/`200`.
5. `GET /api/cart` -> `200` with cart entries.
6. `POST /api/checkout` -> `201`.
7. `GET /api/orders` -> `200` with placed order.
8. Customer UI access checks:
   - `/` product browsing works.
   - `/cart` works with customer token.
   - `/checkout` works with customer token.
   - `/orders` works with customer token.

## Flow 3: Admin
1. `POST /api/auth/signup` with role `ADMIN` -> `403`.
2. Seed admin (`npm run seed:admin`) -> success.
3. `POST /api/auth/login` using `admin@localli.com` -> `200` + `token`.
4. `GET /api/auth/me` with admin token -> `200` and `role: "ADMIN"`.
5. Admin UI route checks:
   - `/admin` allowed
   - `/admin/clusters` allowed
   - `/admin/heatmap` allowed
   - `/admin/logs` allowed
6. Admin user-creation API:
   - `POST /api/admin/users` with admin token -> `201`.
   - `POST /api/admin/users` without token -> `401`.
   - `POST /api/admin/users` with non-admin token -> `403`.

## Authorization Protection Matrix
- Customer-only:
  - `/api/cart*`, `/api/checkout`, `/api/orders`
  - Non-customer token -> `403`
  - No token -> `401`
- Vendor-only:
  - `/api/vendor/store`, `/api/vendor/products*`, `/api/vendor/orders`, `/api/vendor/analytics`
  - Non-vendor token -> `403`
  - No token -> `401`
- Admin-only:
  - `/api/admin/users`
  - Non-admin token -> `403`
  - No token -> `401`

## Frontend Route Guards
- Unauthenticated user visiting protected pages -> redirect to `/login`.
- Authenticated user with wrong role visiting protected page -> redirect to `/`.
- Admin, Vendor, Customer land on:
  - Admin -> `/admin`
  - Vendor -> `/vendor`
  - Customer -> `/`
