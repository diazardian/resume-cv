# Technical Context: Live Resume Template

## Technology Stack

| Technology      | Version | Purpose                               |
| --------------- | ------- | ------------------------------------- |
| Next.js         | 16.x    | React framework with App Router       |
| React           | 19.x    | UI library                            |
| TypeScript      | 5.9.x   | Type-safe JavaScript                  |
| Tailwind CSS    | 4.x     | Utility-first CSS                     |
| Framer Motion   | 12.x    | Animations                            |
| Lucide React    | 0.562.x | Icon library                          |
| React Hook Form | 7.x     | Form handling                         |
| Zod             | 4.x     | Schema validation                     |
| Recharts        | 3.x     | Charts (optional skill visualization) |
| Drizzle ORM     | 0.45.x  | Database ORM for SQLite               |
| Bun             | Latest  | Package manager & runtime             |

## Development Environment

### Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 20+ (for compatibility)

### Commands

```bash
bun install        # Install dependencies
bun dev            # Start dev server (http://localhost:3000)
bun build          # Production build
bun start          # Start production server
bun lint           # Run ESLint
bun typecheck      # Run TypeScript type checking
bun db:generate    # Generate Drizzle migrations
bun db:migrate     # Run database migrations
```

## Project Configuration

### Next.js Config (`next.config.ts`)

- App Router enabled
- Default settings for static export compatibility

### TypeScript Config (`tsconfig.json`)

- Strict mode enabled
- Path alias: `@/*` → `src/*`
- Target: ESNext

### Tailwind CSS 4 (`postcss.config.mjs`)

- Uses `@tailwindcss/postcss` plugin
- CSS-first configuration (v4 style)

### ESLint (`eslint.config.mjs`)

- Uses `eslint-config-next`
- Flat config format

## Key Dependencies

### Production Dependencies

```json
{
  "lucide-react": "^0.562.0",
  "next": "^16.1.3",
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "framer-motion": "^12.27.0",
  "react-hook-form": "^7.71.1",
  "@hookform/resolvers": "^5.2.2",
  "@kilocode/app-builder-db": "github:Kilo-Org/app-builder-db#main",
  "drizzle-orm": "^0.45.1",
  "zod": "^4.3.5",
  "recharts": "^3.6.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0"
}
```

### Dev Dependencies

```json
{
  "typescript": "^5.9.3",
  "@types/node": "^24.10.2",
  "@types/react": "^19.2.7",
  "@types/react-dom": "^19.2.3",
  "@tailwindcss/postcss": "^4.1.17",
  "tailwindcss": "^4.1.17",
  "drizzle-kit": "^0.31.10",
  "eslint": "^9.39.1",
  "eslint-config-next": "^16.0.0"
}
```

## File Structure Explained

```
/
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── bun.lock                # Bun lockfile
├── drizzle.config.ts       # Drizzle ORM configuration
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── postcss.config.mjs      # PostCSS (Tailwind) config
├── eslint.config.mjs       # ESLint configuration
├── public/                 # Static assets
│   ├── images/             # Profile photo, etc.
│   └── projects/           # Project screenshots
└── src/                    # Source code
    ├── app/                # Next.js App Router
    │   └── api/            # API routes (contact, pdf)
    ├── components/         # React components
    ├── config/             # Site configuration
    ├── data/               # User content data files
    ├── db/                 # Database schema, client, migrations
    └── lib/                # Utilities
```

## Technical Constraints

### Static by Default with Backend Support

- All resume content is static in data files
- SQLite database for contact form message persistence
- Backend runs in sandbox environment

### API Routes Available

- Contact form handler (POST/GET) - stores messages in SQLite database
- PDF/text/JSON export endpoints
- Can be extended for additional functionality

### Database

- SQLite database via `@kilocode/app-builder-db`
- Drizzle ORM for schema and queries
- Migrations in `src/db/migrations/`
- Contact messages table: `contact_messages`

### Browser Support

- Modern browsers (ES2020+)
- No IE11 support

## Performance Considerations

### Image Optimization

- Uses Next.js `Image` component for optimization
- Profile photo and project screenshots should be optimized
- SVG for icons via Lucide

### Bundle Size

- Lucide icons are tree-shaken (only used icons included)
- Framer Motion for animations (code-split)
- Tailwind CSS purges unused styles

### Core Web Vitals

- LCP: Images optimized with `priority` prop where needed
- CLS: Layout is stable (no dynamic content shifts)
- FID: Minimal JavaScript for interactivity

## Deployment

### Build Output

- Static HTML + JS bundles
- Can be deployed to any static hosting
- API routes require serverless support

### Environment Variables

- None required for base template
- Add as needed for analytics, form integrations

## Development Workflow

1. Edit data files in `src/data/` for content changes
2. Modify `src/config/site.config.ts` for settings/theme
3. Adjust components in `src/components/` for structure
4. Preview changes at `http://localhost:3000`
5. Use `/print` route for print preview
6. Run `bun build` to validate production build
7. Deploy to hosting platform
