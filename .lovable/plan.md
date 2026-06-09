## KHCWW Public Website

### Architecture
- **Public site** (TanStack Start, current stack) — all content pages, membership registration UI
- **WMS API** (your existing system at `https://your-project.supabase.co/functions/v1`) — handles registration, payment, approval. The site calls it via `fetch`, never stores members itself.
- **Lovable Cloud** (Supabase) — only for website-owned content: blog, gallery, events, downloads, contact messages, newsletter, hero/banner settings.

### Brand
- Gold `#D4A017`, Orange `#F26B1F`, Red-Orange `#E63946`, Black `#0B0B0B`, White `#FFFFFF`
- Logo uploaded → registered as Lovable Asset, used in header, footer, favicon
- Inter for body, Playfair Display for headings (premium healthcare feel)
- Glassmorphism cards, subtle gold gradients, smooth scroll animations

### Phase 1 — Public site shell (this turn)
Routes:
- `/` Home — hero with logo, mission strip, leadership preview, teams grid, latest blog, CTA to register
- `/about` — Vision, Mission, Objectives, Constitution, History
- `/leadership` — Executive Committee + Welfare Committee (placeholder profiles)
- `/teams` — index of welfare teams
- `/teams/$slug` — per-team page (Welfare, Finance, Membership, Events, Communications, Youth)
- `/membership` — 4-step flow wired to WMS API (config → register → STK push → status polling)
- `/blog` + `/blog/$slug` — list & detail (reads from Cloud)
- `/gallery` — masonry + lightbox (reads from Cloud)
- `/events` + `/events/$slug` — upcoming/past + RSVP (reads from Cloud)
- `/downloads` — categorized document list (reads from Cloud)
- `/contact` — form (writes to Cloud) + map placeholder + social links

Shared: sticky glass header, footer with newsletter signup, mobile drawer nav, 404 page.
SEO: per-route `head()`, sitemap.xml route, robots.txt.

### Phase 2 — Admin (next turn, after Cloud is enabled)
- `/admin/login` (email/password)
- `/admin/_authenticated` layout
- CRUD for: blog posts, gallery items, events, downloads, hero banners, contact messages, newsletter list
- Rich text editor for posts, image uploads to Cloud storage

### WMS API integration
Configurable base URL via `VITE_WMS_API_BASE` env var (defaults to the URL you gave). All calls go through `src/lib/wms-api.ts`:
- `getConfig()` → `GET /member-registration/config`
- `register(payload)` → `POST /member-registration/register`
- `initiatePayment({registration_id, phone})` → `POST /member-registration/initiate-payment`
- `getStatus(id)` → `GET /member-registration/status/:id` (polled every 4s during step 4)

CORS note: the WMS API must allow the website's origin. I'll add a clear inline notice on the membership page if requests fail with CORS so it's easy to debug on your side.

### Technical details
- Zod validation on all forms
- Loading skeletons, error boundaries on every route
- `useQuery` + `ensureQueryData` pattern for Cloud reads
- Real placeholder content (not lorem ipsum) so the site looks shipped on day one

### What this plan does NOT include
- Real photos of leadership/teams (you'll swap placeholders later)
- Real blog posts/events/gallery items (you'll add via admin in Phase 2)
- Auth for the admin (Phase 2)
- Custom domain setup (do this from Project Settings after publishing)

I'll do Phase 1 in this turn. After you see it working, I'll enable Lovable Cloud and build the admin in Phase 2.
