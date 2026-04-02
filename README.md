# AI Product Search (Machine Test)

Backend system for searching products using natural-language queries, with JWT authentication and role-based access.

## Tech

- Node.js + Express
- MySQL + Sequelize ORM
- JWT auth (`jsonwebtoken`)

## Setup

1. Install dependencies:
   - `npm install`
2. Create `.env` (see `.env.example`).
3. Seed database:
   - `node src/seeders/seed.js`
4. Start server:
   - `npm start` (or `npm run dev`)

## Environment

Create a `.env` file:

- `PORT=5000`
- `DB_HOST=localhost`
- `DB_USER=...`
- `DB_PASSWORD=...`
- `DB_NAME=...`
- `JWT_SECRET=...`

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Search (Protected)

- `GET /api/search?q=cheap laptop under 50000&page=1&limit=10`

Search flow:

1. Receive query
2. Parse into filters (price/category/color/keyword)
3. Build ORM filters
4. Fetch products + category
5. Return JSON

NLP parsing rules:

- Price filters:
  - Max: `under 50000`, `below 50k`, `less than 50000`
  - Min: `above 10000`, `over 10k`, `more than 5000`
  - Range: `between 10000 and 30000`
  - Supports `k`/`m` suffixes (e.g., `50k`, `1.5m`)
- Category and color are matched from DB values (no hardcoded lists)
- Generic words like `cheap`, `best`, `buy`, `search` are ignored as keywords

### Products (Protected)

- `GET /api/products?page=1&limit=10`
- `POST /api/products` (ADMIN)
- `PUT /api/products/:id` (ADMIN)
- `DELETE /api/products/:id` (ADMIN)

### Dashboard (Protected)

- `GET /api/dashboard/overview` (SUPER_ADMIN)
- `GET /api/dashboard/products?page=1&limit=10` (MANAGER)

## Roles

User roles are stored in `users.role` (string). Expected role values:

- `SUPER_ADMIN`
- `ADMIN`
- `MANAGER`
- `EMPLOYEE`
- `USER`

Note: registration defaults to `USER`.
