---
name: stitched-ui-mastery
description: "High-end frontend UI engineering skill for creating premium, 'Wow'-factor interfaces. Uses Framer Motion, shadcn/ui, Aceternity UI, Magic UI patterns. Features specific guidelines for spring-physics animations (Emil Kowalski style), 'Warm Premium' aesthetics (PhonePe meets government portal), and high-conversion student-focused UX."
---

# Stitched UI Mastery

This skill defines the blueprint for generating high-end, premium web interfaces with a "Warm Premium" aesthetic, primarily using Framer Motion and modern React component patterns. 

**Use this skill specifically when:**
- Rebuilding or creating Hero sections, landing pages, and primary conversion funnels.
- The user requests highly interactive, fluid, or "Wow"-factor animations.
- Designing for a student demographic that requires a balance of excitement, trust, and flawless mobile performance.

## 1. Vibe & Aesthetics: "Warm Premium"

**Goal:** Create a UI that feels like a premium consumer app (e.g., PhonePe) but carries the trustworthiness of a government portal for students.

- **DO NOT** use Apple Minimalism (too plain).
- **DO NOT** use Brutalism (too harsh).
- **DO NOT** use Vercel Dark Mode (needs to be white dominant for trust/accessibility).

### Color System (Strictly Adhere To)
- **Dominant Background/Surface:** White (`#FFFFFF`) or very light gray/slate (`#F8FAFC`, `#F1F5F9`).
- **Primary Action (Trust):** Green (`#047857` - emerald-700/800).
- **Secondary Action (Depth):** Blue (`#2563EB` - blue-600).
- **CTA/Accent (Excitement):** Saffron/Orange (`#EA580C` - orange-600). Use *only* for primary conversion buttons or critical highlights.
- **Structural (Nav/Footer):** Government Blue/Navy (`#1E3A5F`).
- **Typography:** Deep Slate (`#0F172A` - slate-900) for headings, Muted Slate (`#64748B` - slate-500) for descriptions.

### Typography & Icons
- Use large, readable text (mobile-first).
- **Icons:** Use Emojis (e.g., 🎓, 🚀, 💼) instead of SVGs for a more approachable, native-feeling, fast-loading student UX.

## 2. Animation Philosophy: Spring Physics (Emil Kowalski Style)

Every interaction must feel organic, fluid, and responsive.

- **NO ease-in or linear curves.** Never use standard CSS transitions for layout or interactive states if Framer Motion is available.
- **Physics over Durations:** Use `type: "spring"` for all Framer Motion transitions.
  ```tsx
  // Standard Emil Kowalski Spring
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  
  // Snappier Spring
  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
  ```
- **Micro-interactions:**
  - All interactive elements must have a `whileTap={{ scale: 0.97 }}` or similar physical press state.
  - Hover states should slightly elevate or scale up `whileHover={{ y: -2 }}`.
- **Mount/Unmount:** Always wrap dynamic lists or conditionally rendered blocks in `<AnimatePresence>`.
- **List Reveals:** Use `variants` and `staggerChildren` (e.g., `delayChildren: 0.1, staggerChildren: 0.05`) for checklists and benefit lists.

## 3. Core Component Patterns

When generating UI, rely on the mental models of these 10k+ star libraries:
- **Framer Motion:** (Scroll triggers, layout animations)
- **Shadcn UI:** (Accessible primitives, radix-underpinnings)
- **Aceternity UI:** (Complex card hover effects, glowing borders, background beams)
- **Magic UI:** (Marquees, animated borders)
- **Animata / Vaul:** (Bottom sheet drawers for mobile, micro-interactions)

### Specific Structures Required

#### A. The Hero Section Architecture
1. **Split Layout:** Content (Left) + Visual/Interactive Preview (Right). On mobile, stack them.
2. **Animated Result Card:** A floating card that cycles through possible results (Careers, Colleges) every 3 seconds using `AnimatePresence`.
3. **Benefit Checklist:** A staggered list of "What you get" (e.g., "🎯 100% Free", "⚡ Instant Results").
4. **Social Proof Row:** Overlapping avatars (e.g., 👷‍♂️ 👩‍⚕️ 👨‍💻 +10k Students).
5. **CTA Engine:** Big, pill-shaped Saffron button with a subtle pulse or glow.
6. **Stream Selector:** Buttons for MPC/BiPC/MEC/HEC.

#### B. Component Blueprints

**Animated Self-Drawing Underline:**
```tsx
// SVG that draws its path
<motion.path
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 1, ease: "easeInOut" }}
/>
```

**Cycling Content (AnimatePresence Tracker):**
```tsx
const [index, setIndex] = useState(0);
useEffect(() => {
  const timer = setInterval(() => setIndex(prev => (prev + 1) % items.length), 3000);
  return () => clearInterval(timer);
}, []);

<AnimatePresence mode="wait">
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {items[index]}
  </motion.div>
</AnimatePresence>
```

## 4. Student Mobile UX Rules
- **Mobile First:** Start building for max-w-sm, then scale up.
- **Tap Targets:** Minimum 48px height for all buttons and interactive elements.
- **Performance Constraints:** 
  - 60fps on low-end Androids is mandatory.
  - Avoid heavy 3D canvases (React Three Fiber) or deep nested blurs if they drop frames. Stick to performant transform/opacity animations.
  - Emojis serve as zero-cost SVGs.
