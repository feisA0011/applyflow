# ApplyFlow — Career Operating System

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database ORM | Prisma + PostgreSQL via Supabase |
| Auth | Supabase Auth + @supabase/ssr |
| AI | @anthropic-ai/sdk (Claude claude-sonnet-4-6 default) |
| Async/Queue | Inngest |
| Email | Resend + @react-email/components |
| Payments | Stripe |
| PDF | @react-pdf/renderer |
| Validation | Zod |

## Directory Structure

```
src/
├── app/
│   ├── (marketing)/
│   │   └── pricing/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── onboard/
│   │   ├── cv/
│   │   ├── apply/[id]/
│   │   ├── tracker/[id]/
│   │   ├── interviews/
│   │   ├── linkedin/
│   │   ├── portfolio/
│   │   ├── career/
│   │   ├── billing/
│   │   └── settings/
│   └── api/
│       ├── inngest/          ← Inngest serve endpoint
│       ├── cv/parse/
│       ├── jobs/[id]/
│       ├── apply/
│       ├── applications/[id]/
│       └── webhooks/
│           ├── stripe/
│           └── resend/
├── agents/
│   ├── minions/              ← Individual focused agents
│   └── prompts/              ← Prompt templates
├── components/
│   ├── onboarding/
│   └── ui/                   ← shadcn components
├── emails/                   ← React Email templates
├── cv-templates/             ← @react-pdf/renderer templates
├── lib/
│   ├── db.ts                 ← Prisma singleton
│   ├── anthropic.ts          ← Anthropic client singleton
│   ├── inngest.ts            ← Inngest client
│   ├── design-tokens.ts      ← Design system constants
│   ├── utils.ts              ← cn() helper
│   └── supabase/
│       ├── client.ts         ← Browser Supabase client
│       └── server.ts         ← Server Supabase client
└── hooks/                    ← Custom React hooks
```

## Design System

Slite-inspired warm neutral aesthetic.

### Colors

```
Background:
  bg.primary   = #FAFAF8   ← page background
  bg.secondary = #F5F3EF   ← card/surface
  bg.tertiary  = #EDEAE4   ← subtle dividers
  bg.inverse   = #1C1917   ← dark mode / hero

Text:
  text.primary   = #1C1917
  text.secondary = #57534E
  text.muted     = #A8A29E

Accent (teal):
  accent.default = #0D9488
  accent.light   = #CCFBF1
  accent.hover   = #0F766E
```

### Typography

```
font.display = "Fraunces, serif"       ← headings
font.body    = "General Sans, sans-serif"
font.mono    = "JetBrains Mono, monospace"
```

### Radius & Shadows

```
radius.sm = 8px  | radius.md = 12px  | radius.lg = 16px

shadows: warm-tinted using rgba(28, 25, 23, ...)
  sm → 0 1px 2px rgba(28,25,23,0.06)
  md → 0 4px 8px rgba(28,25,23,0.08)
  lg → 0 8px 24px rgba(28,25,23,0.10)
```

## Agent Architecture — Stripe Minions Pattern

Each agent (minion) is a small, focused function with:
- **Zod-validated I/O** — input schema + output schema, validated at every boundary
- **Scope contracts** — explicit `canRead`, `canWrite`, `canNever` declarations
- **Parallel execution** — orchestrated via `inngest step.run` + `Promise.all`
- **Verification built-in** — each minion self-verifies output before returning; no post-hoc validation step
- **No fabrication** — agents may only use data from the Fact Vault (verified user data); hallucinations are a hard failure

```ts
// Example minion contract
const MinionsInput = z.object({ userId: z.string(), jobId: z.string() });
const MinionsOutput = z.object({ score: z.number(), reasoning: z.string() });

const scope = {
  canRead:  ["jobs", "userProfile", "cv"],
  canWrite: ["matchScores"],
  canNever: ["payments", "authTokens"],
};
```

Orchestration runs inside an Inngest function using `step.run` to fan out minions, then `Promise.all` to collect results before the next pipeline stage.

## Coding Rules

1. **Server Components by default** — only add `"use client"` when interactivity is required
2. **`userId` on every Prisma model** — no orphaned records, enforce at schema level
3. **No fabrication** — AI output must be grounded in Fact Vault data; validate before writing
4. **Inngest for all async work** — never fire-and-forget in API routes; always enqueue
5. **Zod at every boundary** — parse, don't trust; use `z.parse()` not `as`
6. **Strict TypeScript** — `tsconfig.json` has `"strict": true`, never use type assertions to bypass

## Off-Limits

- `any` types — use `unknown` and narrow properly
- `console.log` — use structured logging or remove before merge
- CSS-in-JS — Tailwind classes only, no `style={{}}` for layout
- Hardcoded secrets or API keys in source
- Code outside `src/` (except config files at root)
- Non-Zod-validated agent I/O
