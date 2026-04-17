# BarberCyber Pro

A futuristic-themed barbershop management dashboard with a cyberpunk aesthetic.

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI, Lucide React, Motion (Framer Motion), Base UI
- **Routing:** React Router DOM v7
- **Utilities:** date-fns, clsx, tailwind-merge
- **Package Manager:** npm

## Project Structure

- `src/components/` - UI and layout components (Shadcn UI in `ui/`, layout in `layout/`)
- `src/pages/` - View components (Dashboard, AgendaView, FinanceView, TeamView)
- `src/lib/` - Utilities
- `src/types/` - TypeScript definitions

## Development

The app runs on port 5000 via Vite (`npm run dev`). Vite is configured in `vite.config.ts` with:
- Host: `0.0.0.0`
- Port: `5000`
- `allowedHosts: true` (for Replit proxy)

## Deployment

Configured as a static site deployment:
- Build: `npm run build`
- Public dir: `dist`

## Features

- Agenda Inteligente: scheduling grid mapping appointments to barbers
- Staff commission management
- Finance tracking
- WhatsApp integration simulation
- Forced dark mode with cyberpunk neon aesthetic
