# Grainger Products Service

A Spring Boot REST API and React/Vite frontend for viewing and creating product records backed by PostgreSQL.

## Prerequisites

- Java Development Kit 17 or newer
- Maven 3.9 or newer
- Node.js LTS and npm
- PostgreSQL 14 or newer, or Docker Desktop with Docker Compose
- A PostgreSQL role with permission to create and use the `grainger` database

Check the installed tools:

```bash
java -version
mvn -version
node --version
npm --version
psql --version
```

## Database setup

The backend defaults to:

| Setting | Value |
| --- | --- |
| Host | `localhost` |
| Port | `5432` |
| Database | `grainger` |
| Username | `postgres` |
| Password | `postgres` |

The username and password are defaults, not guaranteed to exist on every local PostgreSQL installation. Homebrew PostgreSQL installations often use a role matching the local macOS username. Use an existing role or create the expected role before continuing.

### Option A: Existing local PostgreSQL

Start PostgreSQL using the method for your installation, then create the database:

```bash
createdb grainger
```

If the `postgres` role exists, create the schema from the repository root:

```bash
psql -h localhost -U postgres -d grainger -f db/create_products.sql
```

If your local role is different, replace `postgres` with that role:

```bash
createdb -U YOUR_ROLE grainger
psql -h localhost -U YOUR_ROLE -d grainger -f db/create_products.sql
```

The SQL script enables `pgcrypto` and creates the `products` table with a UUID primary key and required `name` column. Hibernate is configured with `ddl-auto: validate`, so the application checks the schema but does not create or modify it.

Verify the table:

```bash
psql -h localhost -U YOUR_ROLE -d grainger -c "\\d products"
```

### Option B: Docker

No Docker Compose file is checked into this repository. To run a temporary PostgreSQL instance with Docker:

```bash
docker run --name grainger-postgres \
  -e POSTGRES_DB=grainger \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16
```

Then create the schema:

```bash
psql -h localhost -U postgres -d grainger -f db/create_products.sql
```

Stop and remove the container when finished:

```bash
docker stop grainger-postgres
docker rm grainger-postgres
```

## Start the backend

From the repository root, configure credentials if they differ from the defaults:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/grainger
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
```

Start Spring Boot:

```bash
mvn spring-boot:run
```

The API listens on `http://localhost:8080`.

Useful API requests:

```bash
curl http://localhost:8080/api/products

curl -X POST http://localhost:8080/api/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Safety Gloves"}'
```

`POST /api/products` returns `201 Created`. The `name` field is required.

## Start the frontend

Keep the backend running, open a second terminal, and run:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend displays all products and provides a form to create a product. It calls `http://localhost:8080/api` by default.

For a backend running at another address:

```bash
VITE_API_URL=http://localhost:8080/api npm run dev
```

To create a production frontend build:

```bash
npm run build
```

## Verify

1. Start PostgreSQL and create the `products` table.
2. Start the backend with `mvn spring-boot:run`.
3. Start the frontend with `cd frontend && npm run dev`.
4. Open `http://localhost:5173`, create a product named `P1`, and confirm it appears in the product list.

## Tests

Run the backend tests from the repository root:

```bash
mvn test
```

Run the frontend production build from `frontend/`:

```bash
npm run build
```

## Notes

- The preferred stack is Spring Boot, PostgreSQL, React, and Vite. Vite was used for the frontend because it provides a small, fast development setup without introducing a larger frontend framework.
- The backend and frontend run as separate development processes rather than being packaged into one Spring Boot artifact.
- The repository uses a SQL setup script instead of a migration framework. For a production application with evolving schemas, Flyway or Liquibase would be a better next step.
- CORS is configured for the local Vite origin `http://localhost:5173`.

## How it was built

- Inspected the existing Spring Boot controller, service, repository, entity, SQL schema, and tests before adding the UI.
- Used InnteliJ to organize the backend into controller, service, repository, model, and DTO layers and to create the React/Vite frontend.
- Kept the existing REST contract and added a small API client so the UI can list and create products without duplicating backend logic.
- Added loading, empty, validation, and error states to make the basic product workflow usable during local development.
- If extending this further, I would add Flyway migrations, integration tests against PostgreSQL, and a Docker Compose file for reproducible local setup.
