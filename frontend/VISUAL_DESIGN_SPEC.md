# Visual Design Specification - G.A. Castro Construction Dashboard

## Design Philosophy

**Modern Premium SaaS Aesthetic**
- Clean, minimalist interfaces
- Generous white space
- Professional color gradients
- Smooth animations and transitions
- Data-driven storytelling

---

## Color System

### Primary Palette

#### Blues (Trust, Stability)
```css
Blue-50:  #eff6ff
Blue-100: #dbeafe
Blue-500: #3b82f6  /* Primary */
Blue-600: #2563eb  /* Primary Dark */
Blue-700: #1d4ed8
```

#### Greens (Success, Growth)
```css
Green-50:  #f0fdf4
Green-100: #dcfce7
Green-500: #22c55e
Green-600: #16a34a  /* Success */
Green-700: #15803d
```

### Secondary Palette

#### Purples (Innovation, Premium)
```css
Purple-50:  #faf5ff
Purple-100: #f3e8ff
Purple-500: #a855f7
Purple-600: #9333ea  /* Premium */
Purple-700: #7e22ce
```

#### Indigo (Professional)
```css
Indigo-50:  #eef2ff
Indigo-100: #e0e7ff
Indigo-500: #6366f1
Indigo-600: #4f46e5  /* Professional */
```

### Accent Colors

#### Orange (Warning, Energy)
```css
Orange-50:  #fff7ed
Orange-100: #ffedd5
Orange-500: #f97316
Orange-600: #ea580c  /* Warning */
```

#### Red (Error, Negative)
```css
Red-50:  #fef2f2
Red-100: #fee2e2
Red-500: #ef4444
Red-600: #dc2626  /* Error */
```

#### Teal (Balance, Calm)
```css
Teal-500: #14b8a6
Teal-600: #0d9488  /* Balance */
```

### Neutral Palette

#### Grays
```css
Gray-50:  #f9fafb  /* Background */
Gray-100: #f3f4f6  /* Card background */
Gray-200: #e5e7eb  /* Border */
Gray-300: #d1d5db  /* Border hover */
Gray-500: #6b7280  /* Secondary text */
Gray-600: #4b5563  /* Primary text */
Gray-700: #374151
Gray-800: #1f2937  /* Headings */
```

---

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
             'Fira Sans', 'Droid Sans', 'Helvetica Neue',
             sans-serif;
```

### Font Scales

#### Display (Hero Headers)
```css
font-size: 2.25rem (36px)
font-weight: 700 (Bold)
line-height: 1.2
letter-spacing: -0.02em
```

#### Heading 1 (Section Titles)
```css
font-size: 2rem (32px)
font-weight: 700 (Bold)
line-height: 1.25
```

#### Heading 2 (Card Titles)
```css
font-size: 1.5rem (24px)
font-weight: 700 (Bold)
line-height: 1.3
```

#### Heading 3 (Subsections)
```css
font-size: 1.25rem (20px)
font-weight: 600 (Semi-bold)
line-height: 1.4
```

#### Body Large (Metric Values)
```css
font-size: 1.875rem (30px)
font-weight: 700 (Bold)
line-height: 1.2
```

#### Body (Regular Text)
```css
font-size: 1rem (16px)
font-weight: 400 (Regular)
line-height: 1.5
```

#### Small (Labels, Captions)
```css
font-size: 0.875rem (14px)
font-weight: 500 (Medium)
line-height: 1.4
color: Gray-600
```

#### Tiny (Footnotes)
```css
font-size: 0.75rem (12px)
font-weight: 400 (Regular)
line-height: 1.5
color: Gray-500
```

---

## Component Specifications

### Metric Card

#### Structure
```
┌─────────────────────────────────────┐
│ Label (Small, Gray-600)             │
│                                Icon │
│ VALUE (Large, Gradient)      [🔵] │
│                                     │
│ Subtitle (Tiny, Gray-500)           │
│ 📈 Trend (+X.X%)                    │
└─────────────────────────────────────┘
```

#### Dimensions
- Padding: 24px (1.5rem)
- Border radius: 12px (0.75rem)
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Border: 1px solid Gray-100

#### States
- **Default:** White background, subtle shadow
- **Hover:** Elevated shadow, -4px transform
- **Active:** Scale 0.98, deeper shadow

#### Icon Container
- Size: 48px × 48px
- Border radius: 12px
- Background: Gradient (Primary-500 to Primary-600)
- Icon size: 24px
- Icon color: White

### Hero Section

#### Structure
```
┌────────────────────────────────────────────┐
│ Gradient Background (Primary → Secondary)   │
│                                             │
│  COMPANY NAME (Display)              [🏆]  │
│  Subtitle (Large)                           │
│                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐               │
│  │Stat 1│ │Stat 2│ │Stat 3│               │
│  └──────┘ └──────┘ └──────┘               │
└────────────────────────────────────────────┘
```

#### Dimensions
- Height: 200px minimum
- Padding: 32px (2rem)
- Border radius: 16px (1rem)
- Shadow: 0 10px 25px rgba(0,0,0,0.2)

#### Text Colors
- Heading: White
- Subtitle: Primary-100
- Stats: White (bold)

### Tab Navigation

#### Button Specifications
- Height: 44px
- Padding: 12px 24px
- Border radius: 8px
- Font: 16px, Medium (500)

#### States
- **Inactive:** White background, Gray-600 text, Gray-200 border
- **Hover:** Gray-50 background
- **Active:** Gradient (Primary-600 → Primary-500), White text, Scale 1.05

#### Transition
```css
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Chart Card

#### Container
- Background: White
- Padding: 24px
- Border radius: 12px
- Border: 1px solid Gray-100
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

#### Header
- Title: 20px, Bold, Gray-800
- Icon: 24px, Primary color
- Margin bottom: 16px

#### Chart Area
- Height: 300px (standard), 350px (emphasized)
- ResponsiveContainer: 100% width
- Margins: Auto-calculated by Recharts

### Insight Card

#### Structure
```
┌─ Accent Border (Left, 4px)
│ ┌───────────────────────────────┐
│ │ [Icon] Title (Bold)            │
│ │                                │
│ │ Description text...            │
│ │                                │
│ └───────────────────────────────┘
```

#### Dimensions
- Border-left: 4px solid Accent
- Padding: 24px
- Border radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

#### Accent Colors
- Success: Green-500
- Warning: Orange-500
- Info: Blue-500
- Error: Red-500

---

## Gradient Definitions

### Hero Gradients

#### Primary Hero
```css
background: linear-gradient(
  135deg,
  #3b82f6 0%,    /* Blue-500 */
  #2563eb 50%,   /* Blue-600 */
  #4f46e5 100%   /* Indigo-600 */
)
```

#### JobNimbus Analytics Hero
```css
background: linear-gradient(
  135deg,
  #4f46e5 0%,    /* Indigo-600 */
  #7c3aed 50%,   /* Purple-600 */
  #ec4899 100%   /* Pink-500 */
)
```

#### P&L Analysis Hero
```css
background: linear-gradient(
  135deg,
  #059669 0%,    /* Emerald-600 */
  #0d9488 50%,   /* Teal-600 */
  #0891b2 100%   /* Cyan-600 */
)
```

### Text Gradients

#### Primary Metric
```css
background: linear-gradient(
  to right,
  [Color]-600,
  [Color]-400
)
-webkit-background-clip: text
-webkit-text-fill-color: transparent
```

### Card Gradients

#### Metric Card Background
```css
background: linear-gradient(
  to bottom right,
  white 0%,
  gray-50 100%
)
```

#### Icon Container
```css
background: linear-gradient(
  to bottom right,
  [Color]-500,
  [Color]-600
)
```

---

## Shadows & Elevation

### Shadow Scale

#### Level 0 (Flat)
```css
box-shadow: none
```

#### Level 1 (Subtle)
```css
box-shadow: 0 1px 3px rgba(0,0,0,0.1)
```

#### Level 2 (Default)
```css
box-shadow: 0 4px 6px rgba(0,0,0,0.1)
```

#### Level 3 (Elevated)
```css
box-shadow: 0 10px 15px rgba(0,0,0,0.1)
```

#### Level 4 (Prominent)
```css
box-shadow: 0 20px 25px rgba(0,0,0,0.15)
```

#### Hero Shadow
```css
box-shadow: 0 10px 25px rgba(0,0,0,0.2)
```

---

## Spacing System

### Base Unit: 4px (0.25rem)

#### Spacing Scale
```
0:   0px
1:   4px   (0.25rem)
2:   8px   (0.5rem)
3:   12px  (0.75rem)
4:   16px  (1rem)
5:   20px  (1.25rem)
6:   24px  (1.5rem)
8:   32px  (2rem)
10:  40px  (2.5rem)
12:  48px  (3rem)
16:  64px  (4rem)
```

### Component Spacing

#### Card Padding
- Standard: 24px (6)
- Compact: 16px (4)
- Generous: 32px (8)

#### Grid Gaps
- Mobile: 16px (4)
- Tablet: 20px (5)
- Desktop: 24px (6)

#### Section Spacing
- Between sections: 24px (6)
- Between tabs: 32px (8)
- Page padding: 24px (6)

---

## Border Radius

### Radius Scale
```
none: 0px
sm:   4px   (0.25rem)
md:   8px   (0.5rem)
lg:   12px  (0.75rem)
xl:   16px  (1rem)
2xl:  24px  (1.5rem)
full: 9999px
```

### Component Radii
- Buttons: 8px (lg)
- Cards: 12px (xl)
- Hero sections: 16px (2xl)
- Inputs: 8px (lg)
- Pills/Badges: 9999px (full)
- Icons: 12px (xl)

---

## Animation & Transitions

### Timing Functions

#### Standard Easing
```css
cubic-bezier(0.4, 0, 0.2, 1)
```

#### Ease Out
```css
cubic-bezier(0, 0, 0.2, 1)
```

#### Ease In
```css
cubic-bezier(0.4, 0, 1, 1)
```

### Duration Scale
```
fast:     150ms
normal:   300ms
slow:     500ms
```

### Common Transitions

#### Hover Effect
```css
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
transform: translateY(-4px);
box-shadow: 0 10px 20px rgba(0,0,0,0.15);
```

#### Active Tab
```css
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
transform: scale(1.05);
```

#### Fade In
```css
transition: opacity 300ms ease-out;
opacity: 0 → 1;
```

---

## Chart Styling

### Grid Lines
```css
stroke: #f0f0f0 (Gray-100)
strokeDasharray: "3 3"
```

### Axes
```css
stroke: #6b7280 (Gray-500)
fontSize: 12px
fontWeight: 500
```

### Tooltips
```css
backgroundColor: white
border: 1px solid #e5e7eb (Gray-200)
borderRadius: 8px
padding: 12px
boxShadow: 0 4px 6px rgba(0,0,0,0.1)
```

### Legend
```css
fontSize: 14px
fontWeight: 500
color: #4b5563 (Gray-600)
```

### Data Colors

#### Bar Charts
```
Primary:   #3b82f6 (Blue-500)
Secondary: #8b5cf6 (Purple-500)
Success:   #10b981 (Green-500)
Warning:   #f59e0b (Orange-500)
```

#### Line Charts
```
Primary:   #3b82f6 (Blue-500) - Stroke width: 3px
Secondary: #10b981 (Green-500) - Stroke width: 3px
Tertiary:  #f59e0b (Orange-500) - Stroke width: 2px (dashed)
```

#### Pie Charts
```
Slice 1: #10b981 (Green-500)
Slice 2: #3b82f6 (Blue-500)
Slice 3: #f59e0b (Orange-500)
Slice 4: #ef4444 (Red-500)
```

### Area Chart Gradients
```css
<linearGradient id="areaGradient">
  <stop offset="5%" stopColor="[Color]" stopOpacity={0.8}/>
  <stop offset="95%" stopColor="[Color]" stopOpacity={0.1}/>
</linearGradient>
```

---

## Responsive Breakpoints

### Mobile First Approach

#### Breakpoints
```css
sm:  640px   /* Small tablet */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Component Adaptations

#### Grid Columns
```css
Mobile (< 768px):     1 column
Tablet (768-1024px):  2 columns
Desktop (> 1024px):   4 columns
```

#### Font Sizes
```css
/* Display */
Mobile:  28px (1.75rem)
Desktop: 36px (2.25rem)

/* Body */
Mobile:  14px (0.875rem)
Desktop: 16px (1rem)
```

#### Padding
```css
Mobile:  16px (1rem)
Tablet:  20px (1.25rem)
Desktop: 24px (1.5rem)
```

---

## Accessibility

### Contrast Ratios

#### Text Contrast
- Large text (18px+): 3:1 minimum
- Regular text: 4.5:1 minimum
- UI components: 3:1 minimum

#### Focus States
```css
outline: 2px solid Blue-500
outline-offset: 2px
```

### Interactive Elements

#### Minimum Touch Target
```css
min-height: 44px
min-width: 44px
```

#### Keyboard Navigation
- Tab order follows visual order
- Focus visible on all interactive elements
- Skip links for main content

---

## Brand Elements

### Logo Placement
- Position: Top-left of hero sections
- Size: 32px × 32px (icon), Auto (text)
- Color: White on colored backgrounds

### Icons (Lucide React)
- Style: Rounded, consistent stroke
- Size: 24px standard, 32px hero
- Stroke width: 2px
- Color: Matches context

### Awards/Badges
- Size: 128px × 128px
- Opacity: 0.3 (background)
- Position: Right side of hero
- Color: White

---

## Print Styles

### When Printing
```css
@media print {
  /* Hide navigation */
  nav { display: none; }

  /* Remove shadows */
  * { box-shadow: none !important; }

  /* High contrast */
  * { color: black !important; }

  /* Page breaks */
  .page-break { page-break-after: always; }
}
```

---

## Design Tokens (For Future CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

---

**Design System Version:** 1.0
**Last Updated:** November 2025
**Maintained by:** G.A. Castro Construction Design Team
