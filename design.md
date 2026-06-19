# Porokh Design System

## Brand Identity

- **Name**: Porokh
- **Tagline**: AI-Powered Assessment Platform
- **Brand Color**: Violet `#7C3AED`
- **Logo**: Stylized "P" lettermark — update fill to brand violet

---

## Color System

### Primary Brand Color

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--primary` | `oklch(0.49 0.265 293)` | `oklch(0.55 0.255 293)` |
| `--primary-foreground` | White | White |
| `--ring` | Same as primary | Same as primary |

### Tailwind Color Usage

| Purpose | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Brand gradient | `from-violet-600 to-indigo-600` | `from-violet-500 to-indigo-500` |
| Gradient text | `from-violet-600 via-indigo-500 to-blue-500` | `from-violet-400 via-indigo-400 to-cyan-400` |
| Subtle background | `bg-violet-50` | `bg-violet-500/10` |
| Icon container bg | `bg-violet-100` | `bg-violet-500/10` |
| Icon color | `text-violet-600` | `text-violet-400` |
| Badge bg | `bg-violet-50` | `bg-violet-500/10` |
| Badge border | `border-violet-200` | `border-violet-500/20` |
| Badge text | `text-violet-700` | `text-violet-300` |

### Chart Colors (violet → indigo gradient)

| Token | Value | Hue |
|-------|-------|-----|
| `--chart-1` | `oklch(0.637 0.237 293)` | Violet |
| `--chart-2` | `oklch(0.585 0.233 277)` | Indigo |
| `--chart-3` | `oklch(0.55 0.205 261)` | Blue |
| `--chart-4` | `oklch(0.65 0.18 245)` | Sky |
| `--chart-5` | `oklch(0.714 0.14 230)` | Light Blue |

---

## Typography

| Element | Classes |
|---------|---------|
| Hero H1 | `text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]` |
| Section H2 | `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight` |
| Section overline | `text-sm font-semibold uppercase tracking-widest text-primary` |
| Section subtitle | `text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed` |
| Card title | `text-xl font-semibold` |
| Body | `text-base text-muted-foreground leading-relaxed` |

- **Font**: Inter (loaded as `--font-sans`)
- **Heading font**: Same as body (`--font-heading: var(--font-sans)`)

---

## Component Patterns

### Glassmorphism Card

```
bg-white/80 dark:bg-white/5
backdrop-blur-xl
border border-black/[0.08] dark:border-white/[0.08]
rounded-2xl p-6
hover:border-violet-500/30 dark:hover:border-violet-400/20
transition-all duration-300
```

### Icon Container

```
bg-violet-100 dark:bg-violet-500/10
text-violet-600 dark:text-violet-400
w-12 h-12 rounded-xl
flex items-center justify-center
```

### Form & Button Elements

- **Border Radius**: Use standard `rounded-md` for all input fields, textareas, and buttons to maintain clean, default styling that works well in structured forms.
- **Button Sizing**: Base sizes use `h-9` with `px-2.5` (default shadcn).
- **Primary Button Styling**:
  - Background: Solid `bg-primary text-primary-foreground`
  - Hover: Standard `hover:bg-primary/80`
- **Secondary/Outline Button Styling**:
  - Background: Standard `bg-background` / `dark:bg-input/30`
  - Hover: Standard `hover:bg-muted`

### Gradient Text

```
bg-gradient-to-r
from-violet-600 via-indigo-500 to-blue-500
dark:from-violet-400 dark:via-indigo-400 dark:to-cyan-400
bg-clip-text text-transparent
```

### Section Header Group

```tsx
<div className="text-center mb-16 md:mb-20">
  <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
    OVERLINE
  </p>
  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
    Title
  </h2>
  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
    Subtitle
  </p>
</div>
```

### Floating Orbs (Background Decoration)

```tsx
<div className="absolute top-20 -left-32 w-96 h-96 bg-violet-400/20 dark:bg-violet-500/10 rounded-full blur-3xl animate-pulse-glow" />
<div className="absolute bottom-20 -right-32 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse-glow [animation-delay:2s]" />
```

### Grid Dot Pattern

```
bg-[radial-gradient(circle,_rgba(124,58,237,0.12)_1px,_transparent_1px)]
dark:bg-[radial-gradient(circle,_rgba(139,92,246,0.06)_1px,_transparent_1px)]
bg-[size:24px_24px]
```

---

## Animations

| Token | Description | Value |
|-------|-------------|-------|
| `animate-float` | Gentle up/down float | `float 6s ease-in-out infinite` |
| `animate-fade-up` | Entrance from below | `fade-up 0.6s ease-out both` |
| `animate-pulse-glow` | Subtle pulsing glow | `pulse-glow 4s ease-in-out infinite` |
| `animate-gradient-shift` | Shifting gradient bg | `gradient-shift 8s ease infinite` |
| `animate-shimmer` | Shimmer effect | `shimmer 2s linear infinite` |

Use `style={{ animationDelay: 'Xms' }}` for staggered entrance animations.

---

## Layout & Spacing

| Pattern | Classes |
|---------|---------|
| Container | `container mx-auto max-w-7xl px-6 md:px-8` |
| Section padding | `py-24 md:py-32` |
| Header-to-content gap | `mb-16 md:mb-20` |
| Card grid | `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` |

### Section Background Alternation

1. Default: `bg-background`
2. Muted: `bg-muted/30`
3. Gradient: `bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20`
4. Brand: `bg-gradient-to-r from-violet-600 to-indigo-600`

---

## Dark Mode

- Uses `next-themes` with `class` strategy
- Custom variant: `@custom-variant dark (&:is(.dark *))`
- Default theme: `system`
- All components must look excellent in both modes
- Logo uses `invert dark:invert-0` (pending logo color update to violet)

---

## Image & Asset Guidelines

### Hero Dashboard Mockup

- **File**: `/public/dashboard-preview.png`
- **Size**: 1920×1080 or 2560×1440
- **Content**: Show the dashboard or exam builder view
- **Theme**: Use dark theme screenshot for best contrast in the hero

### Logo

- **Current**: White SVG with `invert` class for light mode
- **Target**: Update SVG fill to violet `#7C3AED` / `rgb(124, 58, 237)`
- **Sizes**: 20px (sidebar), 24px (navbar/footer), 32px (auth pages)

---

## Voice & Tone

- Professional yet approachable
- Focus on educator pain points: manual grading, cheating, time
- Emphasize AI capability without being gimmicky
- Use strong action verbs: "Create", "Grade", "Monitor", "Analyze"
- Avoid jargon — write for educators, not developers
