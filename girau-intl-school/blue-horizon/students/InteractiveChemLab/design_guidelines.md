# Design Guidelines: Interactive Chemistry Titration Web Application

## Design Approach

**System Selected:** Material Design with Educational Refinement
- **Justification:** This is a utility-focused educational tool requiring clarity, structured information hierarchy, and intuitive interaction patterns. Material Design provides excellent component states, elevation systems for drag-and-drop affordances, and clear visual feedback mechanisms essential for lab simulation.
- **Key Principles:** 
  - Functional clarity over decoration
  - Consistent interaction patterns across all lab apparatus
  - Clear visual state changes for each simulation step
  - Scientific precision in measurement displays

## Typography System

**Font Families:**
- Primary: Inter or Roboto (via Google Fonts) - Clean, highly legible for scientific data and measurements
- Monospace: Roboto Mono - For precise numerical readings, chemical formulas, and calculation displays

**Hierarchy:**
- **Headings:** 
  - H1 (Page Title): text-4xl font-bold (36px)
  - H2 (Section Headers): text-2xl font-semibold (24px)
  - H3 (Sub-sections): text-xl font-medium (20px)
- **Body Text:**
  - Instructions/Descriptions: text-base (16px) leading-relaxed
  - Data Labels: text-sm font-medium (14px)
  - Chemical Formulas: text-base font-mono (16px monospace)
- **Specialized:**
  - Burette Readings: text-lg font-mono font-semibold (18px monospace)
  - Calculation Results: text-xl font-mono (20px monospace)
  - Error Messages: text-sm font-medium (14px)

## Layout System

**Spacing Primitives:**
Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm throughout the application.
- Component padding: p-4, p-6, p-8
- Section spacing: mb-8, mb-12, mb-16
- Grid gaps: gap-4, gap-6, gap-8
- Button padding: px-6 py-3, px-8 py-4

**Container Structure:**
- Main container: max-w-7xl mx-auto px-4
- Lab workspace: Full-width panel (left 60-70%) for apparatus simulation
- Data entry panel: Fixed sidebar (right 30-40%) for readings and calculations
- Question display: Full-width top banner with max-w-4xl centered text

**Grid Systems:**
- Titration table: 5-column grid (Titration Number, Initial, Final, Volume Used, Actions)
- Apparatus shelf: 4-column grid on desktop, 2-column on tablet, 1-column on mobile
- Calculation sections: 2-column layout (formula display + input fields)

## Component Library

### Navigation & Structure

**Top Navigation Bar:**
- Fixed header with h-16 height
- Logo/title on left, progress indicator center, help/menu buttons right
- Shadow elevation: shadow-md
- Current question number prominently displayed with total count

**Lab Workspace Canvas:**
- Large interactive area with min-h-screen
- Retort stand positioned center-left as anchor point
- Apparatus shelf at bottom: sticky position, full-width, h-32
- Grid overlay (subtle) for precise apparatus placement
- Drop zones with dashed borders (border-2 border-dashed) when dragging

### Interactive Apparatus Components

**Draggable Items:**
- Card-style containers with cursor-grab
- Elevation on hover: shadow-lg transform scale-105 transition
- Elevation on drag: shadow-2xl opacity-90
- Size: Standard apparatus w-24 to w-32, Variable heights for burettes/pipettes
- Labels beneath each item: text-xs font-medium

**Burette Interface:**
- Vertical graduated cylinder: h-96 w-16 (in simulation)
- Calibration marks every 1cm³ with numbers at 0, 5, 10, 15, 20, 25cm³
- Red meniscus indicator line: h-0.5 animated position
- Clip control: Circular button with drip icon, positioned at burette base
- Fill/Rinse controls: Icon buttons with text labels

**Flask & Beaker Components:**
- Conical flask: SVG illustration with transparent fill
- Shake animation: Keyframe rotate-2 to -rotate-2 when triggered
- Indicator drops: Small colored circles that fall with animation
- Liquid level: Animated height transition when adding substances

**Measurement Input Fields:**
- Bordered boxes: border-2 rounded-lg
- Focused state: ring-2 ring-offset-2
- Input size: text-lg font-mono for precise readings
- Placeholder text: "0.00" with text-gray-400
- Unit labels adjacent: text-sm "cm³" or "mol dm⁻³"

### Data Entry & Tables

**Titration Results Table:**
- Full-width responsive table with overflow-x-auto wrapper
- Header row: font-semibold with subtle bottom border (border-b-2)
- Data cells: text-center with p-3 padding
- Input cells: Inline editable fields with border-b-2
- Row spacing: divide-y for clear separation
- Sticky header for scrolling tables

**Calculation Sections:**
- Card containers with rounded-xl border shadow-sm
- Formula display: LaTeX-style rendering or styled HTML with proper subscripts/superscripts
- Input groups: Label + input + unit in horizontal layout (flex items-center gap-2)
- Step-by-step calculation breakdown: Ordered list with pl-6
- Result highlight: Larger text with font-semibold when calculation complete

**Question Display Card:**
- Prominent card at top: rounded-lg shadow-lg with p-6 to p-8 padding
- Question text: text-lg leading-relaxed for readability
- Chemical equations: Display with proper formatting, text-base font-mono
- Sub-questions (a, b, c): Nested list with pl-4 indentation
- "Next Question" button: Positioned bottom-right of card

### Feedback & Grading Components

**Step Validation Indicators:**
- Checklist on right sidebar showing completed steps
- Checkmark icons (✓) for completed, circle outline for pending
- Current step highlighted with slightly larger size and font-semibold
- Icons: w-6 h-6 with appropriate spacing

**Grading Results Panel:**
- Full-screen modal overlay with backdrop-blur
- Results card: max-w-2xl centered with p-8
- Score display: text-6xl font-bold at top
- Breakdown sections with accordion/expandable design
- Improvement suggestions: Bulleted list with icon indicators
- "Try Again" and "Next Question" action buttons at bottom

**Progress Indicators:**
- Linear progress bar at top: h-2 full-width
- Circular progress for current question: SVG circle with animated stroke
- Steps completed counter: fraction display "3/8 steps" with text-sm

### Buttons & Controls

**Primary Actions:**
- Large buttons: px-8 py-4 rounded-lg text-lg font-semibold
- Submit button: Prominent placement, full-width on mobile
- Icon + text combination for clarity

**Secondary Actions:**
- Smaller buttons: px-4 py-2 rounded-md text-base
- Icon-only buttons for compact actions: w-10 h-10 rounded-full
- Grouped button sets: flex gap-2 for related actions

**Control Buttons (Lab Equipment):**
- Icon buttons with tooltips: rounded-lg p-3
- Toggle states for clip open/close: Clear visual distinction
- Droplet release control: Circular button with animation on press

### Forms & Inputs

**Text Inputs:**
- Standard height: h-12 with px-4 padding
- Rounded corners: rounded-lg
- Border treatment: border-2 with focus ring
- Disabled state: opacity-50 cursor-not-allowed

**Number Inputs (Readings):**
- Monospace font for precision
- Increment/decrement arrows visible
- Min/max constraints displayed
- Step indicators for 0.05cm³ precision

### Modals & Overlays

**Instruction Modal:**
- Opens on first load with tutorial
- Step-by-step guide with numbered sections
- Illustrations for each apparatus
- "Got it" button to dismiss: Large, centered

**Help Overlay:**
- Semi-transparent backdrop: backdrop-blur-sm
- Floating help cards with arrows pointing to relevant UI elements
- "Skip Tutorial" option always visible

**Confirmation Dialogs:**
- Compact centered cards: max-w-md
- Clear yes/no or continue/cancel options
- Icon indicators for warning/info/success states

## Images

This application relies primarily on custom SVG illustrations and icons rather than photography. However, include:

**Illustrations Needed:**
- **Apparatus Illustrations:** SVG drawings of burette, pipette, conical flask, beaker, retort stand, clamp, funnel, dropper bottles (for acid/base/indicator). These should be semi-realistic with transparent/glass-like appearance
- **Diagram References:** Chemical apparatus setup diagrams for reference panels
- **No Hero Image Required:** This is a functional web app, not a marketing page

**Icon Library:**
Use **Heroicons** via CDN for all interface icons:
- Check circle (success states)
- X circle (error states)
- Beaker icon (chemistry context)
- Question mark circle (help)
- Arrow icons (navigation)
- Settings/menu icons

## Responsive Behavior

**Desktop (lg: 1024px+):**
- Side-by-side layout: Lab workspace 65% | Data panel 35%
- Full apparatus visibility
- Expanded titration table

**Tablet (md: 768px - 1023px):**
- Stacked layout with tabs: "Simulation" and "Data Entry"
- Collapsible panels
- Touch-friendly controls (larger hit areas: min-h-12)

**Mobile (< 768px):**
- Single column flow
- Accordion sections for each step
- Bottom sheet for apparatus selection
- Sticky submit button at bottom

## Accessibility Considerations

- All interactive elements: min-h-12 for adequate touch targets
- Form inputs: Associated labels with for/id attributes
- ARIA labels for drag-and-drop regions
- Keyboard navigation for all controls (tab order logical)
- Focus indicators: ring-2 on all focusable elements
- High contrast text: Maintain 4.5:1 minimum ratio
- Screen reader announcements for state changes (e.g., "Burette filled to 0cm³")

## Animation Strategy

**Use Sparingly - Only for:**
- Liquid pouring animation: Smooth height transition (0.5s ease)
- Apparatus drag: Transform scale on pickup/drop (0.2s)
- Color change in flask: Gradual transition (1s) when endpoint reached
- Progress indicator: Smooth width/stroke animation
- Modal entry/exit: Fade + scale (0.3s)

**Avoid:**
- Unnecessary hover effects
- Distracting background animations
- Auto-playing elements

This design creates a professional, focused educational environment that prioritizes usability and scientific precision while maintaining visual clarity and intuitive interaction patterns.