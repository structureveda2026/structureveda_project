# Project memory

## Product intent & audience

- Veda AI: AI-powered Vedic astrology platform landing page
- Audience: users interested in Vedic astrology, Kundli analysis, planetary influences
- Initial scope only: single landing page, no dashboards/auth/backend/payments/chat APIs
- Visual reference provided: JyAI screenshot to recreate with Veda AI branding

## Brand personality & voice

- Premium, cosmic, mystical yet clean
- Elegant serif/handwritten-style headings
- Calm, inviting tone; astrology-native terminology (Kundli, planetary positions)

## Visual design & UX direction

- Framework: Vite + React, JavaScript only, Tailwind CSS, Lucide React icons
- Theme colors:
  - Background: #05040B
  - Primary gold: #F5B82E, Light gold: #FFD978
  - White: #FFFFFF, Muted text: #C5C2CE
  - Purple accents: #7138A8
- Background: near-black with dark purple/navy nebula, scattered glowing stars; CSS gradients + simple CSS animations only (no heavy animation libraries, no heavy images)
- Hero: centered "Talk to Veda AI" heading with small circular logo + subtitle
- Question input: dark transparent bg, thin gold border, rounded, comfortable padding, light text
- Prompt Library: outlined gold button with lightbulb icon, modal with 6 prompts (Career, Love, Marriage, Finance, Health, Education); clicking inserts example question into input
- CTA: large golden gradient "Ask Veda AI" button, dark text, gold shadow, hover animation
- Login: "Already have an account? Log in" inline, demo notification only
- Testimonials: 4 cards, italic text, subtle borders, dark transparent bg, muted white; horizontal row on desktop, scrollable/stacked on mobile
- Responsive: centered hero, stacked on mobile, full-width buttons on mobile, no horizontal overflow
- Animations: slow moving stars, subtle glow, button hovers, smooth modal open, card hovers

## Decisions, constraints & rationale

- No Next.js, no backend/database, no external AI APIs, no extra pages
- Local static data only for prompts and testimonials
- CTA behavior: empty question → validation message; non-empty → demo "ready" message (no real AI call)
- Login click → demo notification only
- Reusable components: CosmicBackground, HeroSection, QuestionInput, PromptLibrary, LoginPrompt, Testimonials
- Build verified passing cleanly

## Open questions & assumptions

- No authoritative `.bolt/prompt` exists; all context inferred from initial request
- Real AI integration, auth, dashboard, Kundli engine deferred to later phases
- Exact logo design for Veda AI not specified beyond "small circular"