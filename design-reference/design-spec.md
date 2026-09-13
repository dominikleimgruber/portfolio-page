# Handoff: Personal Portfolio Site — Dominik Leimgruber

## Overview
A single-page personal portfolio / online CV for a DevOps & Platform Engineer looking for software or solutions engineering roles. One long scrolling page in English, with a sticky top nav and five sections: hero, experience, skills & tools, education, languages, contact. All content is real (drawn from the owner's CV) — no placeholder copy.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show intended look and behaviour, not production code to copy directly. The task is to **recreate these designs in the target codebase's environment** (React/Next, Astro, Vue, plain HTML — whatever fits) using its established patterns. If no codebase exists yet, pick the most appropriate stack; a static site generator or a single static HTML page is entirely sufficient for this design — there is no dynamic behaviour beyond anchor scrolling.

Note on file format: `Portfolio.dc.html` is a streaming "Design Component" file. Its markup lives between `<x-dc>` tags and is driven by a small runtime (`support.js`, included in this bundle for completeness). Content comes from a `renderVals()` method in the file's `<script data-dc-script>` block, looped into the markup by `<sc-for list="…" as="…">` elements. **Do not port the runtime.** Read the file for structure, styles and content, then rebuild it with normal components/templates. Opening the HTML file in a browser renders the design as intended.

## Fidelity
**High fidelity.** Final colors, typography, spacing and copy. Recreate pixel-accurately using the values below.

## Layout Foundation
- Root container: `max-width: 1140px`, centered (`margin: 0 auto`), horizontal padding `clamp(20px, 5vw, 56px)`, bottom padding `140px`, no top padding.
- Page background: `oklch(0.972 0.006 95)` — a warm off-white (≈ `#f9f8f5`).
- Body text color: `oklch(0.21 0.012 95)` (≈ `#2f2c27`).
- Everything is a single column of `<section>` blocks separated by `1px solid oklch(0.89 0.008 95)` top borders (≈ `#e4e1da`).
- Section rhythm: each section (after the hero) has `padding-top: clamp(72px, 9vw, 110px)`, a hairline top rule, then a 24px gap before its mono label, then `clamp(36px, 5vw, 60px)` before its content.
- Two-column rows (experience, education): CSS grid, `grid-template-columns: minmax(150px, 0.42fr) minmax(0, 1fr)`, `gap: clamp(16px, 3vw, 48px)`. Left column = org/date meta, right column = bullet list.

## Typography
Two Google Fonts:
- **Bricolage Grotesque** (variable, opsz 12–96, weights 300/400/500/600) — all display and body text.
- **Geist Mono** (400/500) — labels, nav, dates, metadata, skill tags, buttons.

Font stacks: `'Bricolage Grotesque', system-ui, sans-serif` and `'Geist Mono', ui-monospace, monospace`.

| Role | Family | Size | Weight | Line-height | Letter-spacing | Notes |
|---|---|---|---|---|---|---|
| H1 hero | Bricolage | `clamp(38px, 6.6vw, 86px)` | 400 | 1.0 | −0.032em | `max-width: 960px`, `text-wrap: balance` |
| Hero paragraph | Bricolage | `clamp(17px, 1.5vw, 20px)` | 400 | 1.6 | — | `max-width: 640px`, `text-wrap: pretty` |
| Contact H2 | Bricolage | `clamp(30px, 4.4vw, 58px)` | 400 | 1.05 | −0.028em | `max-width: 640px`, balanced |
| Company name | Bricolage | `clamp(22px, 2.2vw, 28px)` | 500 | 1.15 | −0.02em | |
| Education title | Bricolage | `clamp(19px, 1.8vw, 23px)` | 500 | 1.2 | −0.018em | |
| Language name | Bricolage | `clamp(24px, 2.4vw, 32px)` | 500 | — | −0.022em | |
| Body / bullets | Bricolage | 16.5px | 400 | 1.6 | — | color `oklch(0.32 0.015 95)` |
| Bullet lead-in | Bricolage | 16.5px | 600 | 1.6 | — | color `oklch(0.21 0.012 95)`, inline `<strong>` |
| Skill group heading | Bricolage | 15px | 600 | — | −0.005em | |
| Section label / nav | Geist Mono | 11.5px | 400 (nav home link 500) | — | 0.1em | `text-transform: uppercase` |
| Role line (accent) | Geist Mono | 11.5px | 400 | — | 0.06em | uppercase, accent green |
| Dates / place | Geist Mono | 11.5px | 400 | 1.6 | — | |
| Skill tier label | Geist Mono | 10.5px | 400 | — | 0.1em | uppercase |
| Skill tag | Geist Mono | 12.5px | 400 | — | — | |
| Buttons | Geist Mono | 12.5px | 400 | — | — | |
| Contact links | Geist Mono | 13px | 400 | — | — | |

## Design Tokens

Colors are authored in `oklch()`; sRGB approximations given for convenience — prefer the oklch values if the target supports them.

| Token | Value | ≈ hex | Use |
|---|---|---|---|
| Paper | `oklch(0.972 0.006 95)` | `#f9f8f5` | page background |
| Paper (translucent) | `oklch(0.972 0.006 95 / 0.92)` | — | sticky header background |
| Card / tag fill | `oklch(0.985 0.004 95)` | `#fdfcfa` | skill tag background |
| Ink | `oklch(0.21 0.012 95)` | `#2f2c27` | headings, primary text, primary button fill |
| Body | `oklch(0.32 0.015 95)` | `#4b473f` | bullet and paragraph text |
| Muted | `oklch(0.36 0.015 95)` | `#565149` | hero paragraph, language descriptions |
| Meta | `oklch(0.45 0.02 95)` | `#6b665c` | section labels, availability line |
| Meta dim | `oklch(0.5 0.02 95)` | `#787268` | dates, tier labels (10.5–11.5px) |
| Accent (text) | `oklch(0.5 0.13 145)` | `#2f7a43` | role lines — passes AA on paper |
| Accent (link hover) | `oklch(0.52 0.13 145)` | `#34813f` | `a:hover` |
| Accent (button hover) | `oklch(0.44 0.13 145)` | `#286a38` | primary button hover fill |
| Accent (bright) | `oklch(0.72 0.16 145)` | `#4fbd6a` | 7px availability dot only |
| Accent (soft) | `oklch(0.78 0.05 145)` | `#b4c9b6` | 5px bullet dots |
| Selection | `oklch(0.88 0.12 145)` | `#a7e8b5` | `::selection` background |
| Rule | `oklch(0.89 0.008 95)` | `#e4e1da` | section dividers |
| Border strong | `oklch(0.84 0.012 95)` | `#d6d2c8` | secondary button border |
| Border tag | `oklch(0.87 0.01 95)` | `#dedad1` | skill tag border |
| Border link | `oklch(0.85 0.012 95)` | `#d9d5cb` | contact link underline |

Radii: `2px` on buttons and skill tags (deliberately near-square). Nothing else is rounded except circles (`border-radius: 50%` on the dots).
Shadows: **none anywhere.** Depth comes from hairline rules only.
Spacing: fluid `clamp()` throughout — no fixed scale. Common values: 7px, 8px, 9px, 10px, 12px, 14px, 18px, 20px, 22px, 24px, and the clamps listed per section.

Accessibility: all informational text meets WCAG AA (≥4.5:1) against the paper background. The bright accent green and soft bullet green are decorative only — never used for text.

## Screens / Views

Single page. Sections in order:

### 1. Sticky header
- `position: sticky; top: 0; z-index: 9`, background `oklch(0.972 0.006 95 / 0.92)` with `backdrop-filter: blur(8px)`.
- `padding: 26px 0 22px`, flex row, `justify-content: space-between`, `align-items: baseline`, `gap: 24px`.
- Left: "Dominik Leimgruber", mono 11.5px uppercase, weight 500, links to `#top`.
- Right: nav, flex, `gap: clamp(14px, 2.4vw, 30px)`, wraps, right-justified. Items: Experience, Skills, Education, Languages, Contact → `#experience`, `#skills`, `#education`, `#languages`, `#contact`.
- `html { scroll-behavior: smooth }` handles the anchor jumps.

### 2. Hero (`#top`)
- `padding: clamp(70px, 11vw, 130px) 0 clamp(70px, 9vw, 110px)`. Animates in: `rise .7s ease both` (opacity 0→1, `translateY(16px)`→none).
- **Availability line**: flex row, `gap: 10px`, `align-items: center`, `margin-bottom: clamp(28px, 4vw, 44px)`. A 7×7px circle in bright accent green, then mono 11.5px uppercase in Meta: "Open to software & solutions engineering roles".
- **H1**: "DevOps and platform engineer building the AWS foundation that 2'000+ accounts run on."
- **Paragraph** (`margin-top: clamp(30px, 4vw, 46px)`): "Five years across cloud platform engineering, security operations and software development — infrastructure as code, serverless services, and agentic tooling that removes recurring work. Based in Zürich, working in German and English."
- **Buttons** (`margin-top: clamp(32px, 4vw, 46px)`, flex, `gap: 10px`, wraps):
  - Primary "GitHub" → `https://github.com/dominik.leimgruber`. `padding: 12px 20px`, fill Ink, text Paper, radius 2px, `transition: background .18s ease`. Hover: fill → accent button-hover green.
  - Secondary "LinkedIn" → `https://linkedin.com/in/dominik.leimgruber`. Same padding/radius, transparent fill, `1px solid` Border strong, `transition: border-color .18s ease`. Hover: border → Ink.
  - **Note:** these two URLs are guesses assembled from CV handles (`dominik.leimgruber`). Confirm the real profile URLs before shipping.

### 3. Experience (`#experience`)
Mono uppercase label "Experience", then three entries in a `flex column` with `gap: clamp(48px, 6vw, 76px)`. Each entry is the two-column grid described in Layout Foundation:
- Left: company name (Bricolage 500, large) → role (mono uppercase, accent green, `margin-top: 10px`) → period + place on two lines separated by `<br>` (mono, Meta dim, `margin-top: 8px`, line-height 1.6).
- Right: `<ul>` with `list-style: none`, `gap: 18px`. Each `<li>` is `display: grid; grid-template-columns: auto 1fr; gap: 14px` — a 5×5px soft-green circle with `margin-top: 9px` for optical alignment, then the text. Some bullets open with a bold lead-in phrase (`<strong>`, weight 600, Ink) followed by regular body text.

Content:

**Swisscom Schweiz AG** — DevOps / Platform Engineer — October 2023 – present — Zürich, ZH
- **AWS platform engineering.** Development and operation of Swisscom's central AWS platform, used by more than 2'000 AWS accounts.
- **Infrastructure as code.** Infrastructure automation with Terraform and AWS CDK; reusable modules that standardise the provisioning of new environments.
- **Serverless & platform features.** Platform functionality built on Lambda, Step Functions, DynamoDB, EventBridge and many further services.
- **AI-assisted engineering.** Agentic coding workflows and internal platform services connected through MCP servers; reusable agent skills that automate recurring operations and development tasks.
- **Cloud architecture & governance.** Co-design of the target architecture for new platform services, contributing security and compliance requirements.

**Infoguard AG** — Cyber Security Analyst — July 2021 – September 2023 — Baar, ZG
- Analysis and triage of security incidents in the SOC using cyber defence sensors.
- Development and tuning of cyber defence use cases and sensors, reducing false positives.
- Vulnerability assessment and client advisory on prioritisation and remediation.
- Extension of internal correlation and automation tooling in Python.

**Supertrends AG** — Software Developer — November 2020 – April 2021 — Baar, ZG
- Further development of the company's internal WordPress application.
- Co-development of the backend application in Elixir.

### 4. Skills & tools (`#skills`)
Mono uppercase label "Skills & tools", then a responsive grid: `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))`, `gap: clamp(28px, 4vw, 44px)`. Five groups, each a flex column with `gap: 20px`: a 15px/600 heading, then one or two tiers. A tier is an optional mono uppercase 10.5px label ("Excellent" / "Good", `margin-bottom: 10px`) above a wrapping flex row of tags (`gap: 7px`). Tag: mono 12.5px, `padding: 6px 11px`, `1px solid` Border tag, radius 2px, fill Card, text `oklch(0.3 0.015 95)`. Tags are static — no hover, no interaction.

- **Cloud & platform** — Excellent: AWS (Serverless, IAM, Landing Zone), Terraform, AWS CDK, Docker, Git / CI-CD · Good: Kubernetes, Linux / UNIX
- **AI & automation** — (no tier label): Agentic coding workflows, MCP (Model Context Protocol), Custom agent skills, Prompt engineering, LLM-assisted process automation
- **Software development** — Excellent: Python, Java, TypeScript / JavaScript · Good: Shell, C#
- **Frameworks & libraries** — (no tier label): Spring Boot, React, Vue.js
- **Security** — (no tier label): Incident response & SOC analysis, Vulnerability management, Cloud security & governance

### 5. Education (`#education`)
Mono uppercase label "Education", then three entries, `flex column`, `gap: clamp(36px, 4vw, 52px)`, same two-column grid as Experience. Left: title (Bricolage 500), then period + school on two lines (mono, Meta dim, `margin-top: 9px`). Right: bullet list, `gap: 14px`, same dot treatment, no bold lead-ins.

- **BSc Computer Science** — September 2019 – January 2023 — Hochschule Luzern
  - Focus on IT operations & security and application development; Dean's List member.
  - Bachelor thesis: software-assisted governance assurance in Swisscom's Kubernetes clusters.
- **Berufsmaturität** — August 2018 – July 2019 — BBZ Olten
  - Full-time, focus on engineering, architecture and life sciences — final grade 5.6.
- **Informatiker EFZ** — August 2014 – July 2018 — Avanade Schweiz GmbH
  - Systems engineering specialisation — final grade 5.5.

### 6. Languages (`#languages`)
Mono uppercase label "Languages", then a grid `repeat(auto-fit, minmax(260px, 1fr))`, `gap: clamp(24px, 4vw, 48px)`. Two cells, each a flex column with `gap: 10px`: large Bricolage 500 name, then a 16.5px Muted description.
- **German** — "Native language"
- **English** — "Business fluent — daily working language in international teams"

### 7. Contact (`#contact`)
Hairline top rule, `padding-top: clamp(44px, 6vw, 72px)`, then a flex row, `justify-content: space-between`, `align-items: flex-end`, `gap: 36px`, wrapping.
- Left: H2 "Looking for a software or solutions engineer to join the team?" then a 17px Muted paragraph, `margin-top: 22px`: "Happy to talk. Zürich or remote."
- Right: flex column, `gap: 12px`, two mono 13px links, each with `border-bottom: 1px solid` Border link and `padding-bottom: 6px`: `github.com/dominik.leimgruber` and `linkedin.com/in/dominik.leimgruber`.
- No email address anywhere on the page — the CV didn't supply one. Add a `mailto:` link here if one becomes available.

## Interactions & Behavior
- Anchor navigation only, via smooth scrolling. No routing, no JS-driven interactions.
- Hover states: global `a:hover { color: accent link-hover green }`; primary button background transition (180ms ease); secondary button border-color transition (180ms ease).
- One entry animation: the hero rises 16px and fades in over 700ms on load. Nothing is scroll-triggered. Respect `prefers-reduced-motion` in the port — the original doesn't, and it should.
- Responsive: fluid via `clamp()` and `auto-fit` grids; no media queries. Below roughly 420px the two-column experience/education grids get tight — the port should collapse them to a single column at small widths (the prototype does not).
- No forms, loading states, error states, or validation. No dark mode.

## State Management
None. The page is static. Content in the prototype comes from three arrays (`jobs`, `skillGroups`, `education`) returned by `renderVals()` — port these to whatever content mechanism the codebase uses (a TS data module, MDX, CMS collection). Their shapes:

```ts
type Job = { company: string; role: string; period: string; place: string;
             points: { label: string; text: string }[] };   // label may be ""
type SkillGroup = { title: string;
                    tiers: { label: string; items: string[] }[] };  // label may be ""
type Education = { title: string; period: string; school: string; points: string[] };
```

## Assets
None. No images, no icons, no logos, no SVG. The only graphics are CSS circles. The two web fonts load from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Self-host both if the target project avoids third-party font CDNs.

## Files
- `Portfolio.dc.html` — the design to implement.
- `Portfolio-editorial-alt.dc.html` — an alternative visual direction that was explored and set aside (warm paper ground, oxblood `#7a2a24` accent, Bitter slab serif, numbered sections). Same content, different skin. Reference only; do not implement unless asked.
- `support.js` — the prototype runtime, included so the HTML files open standalone. Not part of the deliverable.

## Open items for the developer to confirm with the owner
1. Real GitHub and LinkedIn URLs (current ones are inferred from CV handles).
2. Whether to add an email address or contact form.
3. Whether to add a downloadable CV (PDF) link — the CV exists but wasn't wired in.
4. A featured-projects / case-studies section was discussed and deliberately left out. If it lands later, the strongest candidates are the Swisscom AWS landing zone work and the Kubernetes governance bachelor thesis.
