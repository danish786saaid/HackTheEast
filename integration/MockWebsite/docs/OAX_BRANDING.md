# OAX Foundation branding (inferred from oax.org)

No official brand guidelines are published; these tokens are taken from the live site so our frontend matches OAX’s look and feel.

## Colors

| Token        | Hex       | Usage                    |
|-------------|-----------|--------------------------|
| **Navy**    | `#14345E` | Primary (headers, buttons, form placeholders) |
| Navy light  | `#1e4a7a` | Hover states             |
| Navy dark   | `#0e2442` | Dark accents             |
| Cream       | `#f8f7f4` | Section backgrounds      |
| Gray text   | `#4a5568` | Body copy                |
| Gray muted  | `#718096` | Secondary text, footer   |
| Accent      | `#2b6cb0` | Links, CTAs              |

## Typography

- **Sans:** Inter (professional, matches common foundation sites).
- Headings: Navy, bold. Body: gray text.

## UI patterns from oax.org

- Sticky header, white background, navy text.
- Hero: full-width navy background, white headline and subtext.
- Sections alternate white and cream.
- Blockquotes: italic navy, attribution in muted gray.
- Form placeholders: navy, italic (per their contact form CSS).
- Footer: cream background, “Connect with us”, email, nav links.

## Usage in this repo

- **Tailwind:** `tailwind.config.ts` extends `colors` with `oax` (e.g. `bg-oax-navy`, `text-oax-cream`).
- **CSS variables:** `app/globals.css` defines `--oax-*` for use in custom CSS.
- **Components:** `components/oax/Header.tsx` and `Footer.tsx` mirror OAX nav and footer structure.

When adding new screens or components, use these colors and patterns so the app stays visually aligned with OAX Foundation.
