<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# AllIn-OS2

AllIn-OS2 is a comprehensive MLM (Multi-Level Marketing) management system built with React, TypeScript, TanStack Router, and Supabase.

## Architecture

### Canonical Identifier Strategy

**IMPORTANT**: The application uses `customers.id_comprador` (text) as the canonical identifier for customers and distributors throughout the codebase.

- **Canonical Identifier**: `id_comprador` (text) - Used consistently across services, hooks, and components
- **Technical Primary Key**: `customers.id` (UUID) - Used only for database integrity, not in application logic
- **Rationale**: The system was built around the legacy `id_comprador` from the original scrape. Attempting to migrate to UUID-based identifiers would require a massive rewrite (247 occurrences across 54 files).

For detailed migration planning and analysis, see [docs/IDENTITY_MIGRATION_MASTER_PLAN.md](docs/IDENTITY_MIGRATION_MASTER_PLAN.md).

### Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Routing**: TanStack Router
- **Backend**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS
- **State Management**: TanStack Query (React Query)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Configure Supabase credentials in `.env`
4. Run the app:
   `npm run dev`

## Documentation

- [Identity Migration Master Plan](docs/IDENTITY_MIGRATION_MASTER_PLAN.md) - Comprehensive analysis and refactoring plan for identifier unification
- [Database Tables](docs/database/TABELAS_COMPLETAS.md) - Complete inventory of database tables
- [Complete Database Audit](docs/AUDITORIA_COMPLETA_BANCO_DADOS_ALLIN_NEXT.md) - Detailed database architecture audit
