---
name: Rung
description: A classroom blackboard that divides into a lesson for every reading level.
colors:
  slate: "#22332b"
  slate-deep: "#1a2822"
  chalk: "#eceee6"
  chalk-soft: "#c9d0c4"
  chalk-faint: "rgba(236, 238, 230, .28)"
  chalk-yellow: "#f3dc6b"
  chalk-pink: "#f4a7bb"
  chalk-orange: "#f5b979"
  chalk-blue: "#a6d4ea"
  chalk-green: "#b8e0a4"
  wood: "#8b5a33"
  wall: "#3f6a78"
  wall-deep: "#335966"
  paper: "#f4f0e2"
  paper-ink: "#1f2a25"
  pin-red: "#c2392f"
  ink-blue: "#1d3f8f"
typography:
  display:
    fontFamily: "Kalam, Hind, 'Segoe Print', cursive"
    fontSize: "clamp(2.7rem, 1.2rem + 4.6vw, 5.1rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Kalam, Hind, 'Segoe Print', cursive"
    fontSize: "clamp(1.9rem, 1.3rem + 2vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Kalam, Hind, 'Segoe Print', cursive"
    fontSize: "1.4rem"
    fontWeight: 700
    lineHeight: 1.2
  hand:
    fontFamily: "Kalam, Hind, 'Segoe Print', cursive"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Hind, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Kalam, Hind, 'Segoe Print', cursive"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.3
  caption:
    fontFamily: "Hind, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  chalk-box: "14px 6px 12px 5px / 6px 12px 5px 14px"
  chalk-box-sm: "10px 5px 9px 4px"
  chalk-ring: "50% 46% 52% 44% / 48% 54% 46% 52%"
  focus: "4px"
  stick: "4px"
spacing:
  frame: "clamp(10px, 1.4vw, 20px)"
  gutter: "clamp(20px, 5vw, 88px)"
  gutter-phone: "18px"
  section: "clamp(56px, 7vw, 100px)"
  measure: "40rem"
components:
  button-chalk:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    typography: "{typography.label}"
    rounded: "{rounded.chalk-box}"
    padding: ".7rem 1.2rem .6rem"
  button-chalk-primary:
    backgroundColor: "transparent"
    textColor: "{colors.chalk-yellow}"
    typography: "{typography.label}"
    rounded: "{rounded.chalk-box}"
    padding: ".7rem 1.2rem .6rem"
  button-chalk-primary-hover:
    backgroundColor: "{colors.chalk-yellow}"
    textColor: "{colors.slate-deep}"
    rounded: "{rounded.chalk-box}"
  toggle-chalk:
    backgroundColor: "transparent"
    textColor: "{colors.chalk-soft}"
    rounded: "{rounded.chalk-box-sm}"
    padding: ".4rem .7rem .3rem"
  toggle-chalk-pressed:
    textColor: "{colors.chalk}"
    rounded: "{rounded.chalk-box-sm}"
  nav-link:
    textColor: "{colors.chalk-soft}"
    typography: "{typography.label}"
  notice:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.body}"
    padding: "2.2rem 2.2rem 1.6rem"
---

# Design System: Rung

## Overview

**Creative North Star: "The Divided Blackboard"**

The whole page is one classroom blackboard: a matte green-black slate held in a raw wooden frame, hung on a painted blue-teal classroom wall, with a wooden chalk ledge along its bottom edge. Everything that appears on the board is either written in chalk or pinned to it on paper. Sections are new stretches of the same board, sometimes a patch the duster has just wiped clean, never separate cards floating on a page.

Chalk does the communicating. White chalk carries the words, yellow chalk marks what a visitor can act on, and the coloured chalks (pink, orange, blue, green, with white for the last level) name the five reading groups. Handwriting is the teacher's voice; a printed sans is the lesson card she reads from. The surface is warm and a little worn: broad duster swipes and specks of dust live in the slate, and the chalk lettering breaks at its edges like real dry chalk.

The board's defining move is that it divides. A chalk line is drawn across it, then vertical chalk dividers split it into five columns, one per reading level. The size of the writing encodes the level: the earliest group gets one huge letter, the most advanced gets a small paragraph. Motion is limited to chalk being drawn, once.

**Key Characteristics:**
- One continuous slate surface inside a textured wooden frame, set on a coloured wall.
- Coloured chalk as the only accent system; yellow is reserved for action.
- Handwritten Kalam for voice, printed Hind for reading; both render Devanagari.
- Lines, boxes and circles are hand-drawn chalk strokes, slightly uneven.
- Paper notices pinned to the board are the only light surfaces.
- Strokes draw once on load or on arrival; nothing loops.

## Colors

A dark, low-chroma slate under bright, softened pastel chalks, framed by warm wood and a cool painted wall.

### Primary
- **Action Chalk Yellow** (chalk-yellow): the colour of anything clickable that matters: the primary chalk-boxed action, step numerals, citation markers, the "we are here" marker, focus outlines and text selection. On hover the primary action fills solid yellow with slate-deep text.

### Secondary
- **Group Chalks** (chalk-pink, chalk-orange, chalk-blue, chalk-green, plus chalk for the top level): one per reading level, in order Beginning, Letters, Words, Paragraph, Story. They colour a group's name and sample writing, and are reused for audience headings that map onto the same order. Pink also circles the problem sentence and writes the annotation beside it.

### Neutral
- **Board Slate** (slate): the writing surface for the whole page; also the browser theme colour.
- **Deep Slate** (slate-deep): text on yellow fills and selection.
- **White Chalk** (chalk): headings, the wordmark, active states and primary reading text on the board.
- **Worn Chalk** (chalk-soft): body copy, navigation at rest, supporting lines.
- **Faint Chalk** (chalk-faint): dashed and solid chalk rules, inactive outlines, link underlines.
- **Raw Wood** (wood): the frame, the ledge and the base of the generated grain texture. Never used for text.
- **Classroom Wall** (wall, wall-deep): the page background around the board and the footer area; wall-deep is the scrollbar track.
- **Notice Paper** (paper) with **Paper Ink** (paper-ink): pinned notices and the sources slip.
- **Pin Red** (pin-red): the drawing pin head and list markers on pinned paper.
- **Ballpoint Blue** (ink-blue): links printed on paper.

### Named Rules
**The Yellow Means Act Rule.** Yellow chalk is for actions, markers of position and focus only. Never use it for a heading or a group.

**The Group Order Rule.** The five group chalks always run pink, orange, blue, green, white from the first rung to the last. A colour that names a level names that level everywhere on the page.

**The Two Surfaces Rule.** Text sits either on slate (chalk colours) or on paper (paper ink). There is no third surface, and chalk colours never appear on paper.

## Typography

**Display Font:** Kalam (with Hind, then a cursive fallback)
**Body Font:** Hind (with system-ui, sans-serif)

**Character:** Kalam is Indian classroom handwriting, the teacher's chalk print, in both Latin and Devanagari. Hind is the printed lesson card: plain, sturdy and legible at small sizes on cheap phones. Both are self-hosted and split by script so Hindi costs nothing until it appears.

### Hierarchy
- **Display** (Kalam 700, fluid up to about 5rem, line-height 1): the opening statement only, broken one phrase per line.
- **Headline** (Kalam 700, fluid 1.9 to 3rem, line-height 1.12, max about 22ch): section headings, balanced wrapping.
- **Title** (Kalam 700, 1.4rem): sub-heads such as steps and audience groups.
- **Hand** (Kalam 400, 1.25rem, line-height 1.45): chalked asides and worked examples written on the board.
- **Body** (Hind 400, 1.0625rem, line-height 1.65): all paragraphs; supporting prose is capped at a 40rem measure.
- **Label** (Kalam 400 to 700, about 1.15rem): navigation, toggles and chalk-boxed button words.
- **Caption** (Hind 400, about 0.9rem): disclaimers, board notes and group tasks.

### Named Rules
**The Chalk Size Rule.** In the group columns, writing size encodes the rung: the earliest level is written largest (a single letter at display scale) and each later level smaller, down to a paragraph near body size. Size is information there, not decoration.

**The Hand Speaks, Print Explains Rule.** Kalam carries headings, labels and short chalked lines; anything longer than two sentences is set in Hind.

**The Devanagari Breathing Rule.** Hindi sample lines get extra line-height (1.6) so matras and conjuncts never collide.

## Layout

The board fills the viewport width inside a thin wall margin (8 to 26px), and every section shares the board's fluid side gutter (gutter, dropping to gutter-phone on phones). Sections stack vertically on the same slate with generous top padding (section) and lighter bottom padding, so the board reads as one surface rather than bands.

Desktop compositions are asymmetric two-column grids: statement on the left, worked example or pinned notice on the right. The group board is a five-column grid whose widths grow from the first level to the last (.8 to 1.45 fr), so the columns themselves widen as reading grows. At 1080px the two-column grids collapse to one; at 820px the five columns become stacked rows, name on the left and writing on the right, divided by horizontal chalk lines; at 560px the navigation reduces to the single "Get involved" action boxed in yellow chalk.

**The No Horizontal Scroll Rule.** The page clips overflow at the root; long words and email addresses wrap anywhere rather than push the board wider.

## Elevation & Depth

Depth is physical and sparing. The board itself sits on the wall with one soft drop shadow beneath it and a deep inset vignette that darkens the slate toward its edges. The wooden ledge casts a short shadow downward. Paper notices pinned to the board cast a soft shadow below and are tilted a degree or so, and the drawing pin casts its own tiny shadow. Chalk never casts a shadow: anything written on the slate is flat to it.

Wiped regions are the board's other depth cue: a blurred, slightly lighter patch of slate behind a heading or aside, as if the duster has just been across it.

### Shadow Vocabulary
- **Board on wall** (`box-shadow: 0 18px 40px -14px rgba(20, 35, 40, .55), inset 0 0 140px rgba(0, 0, 0, .38)`): the board only.
- **Pinned paper** (`box-shadow: 0 14px 26px -12px rgba(0, 0, 0, .6)`): notices on the board; the footer slip uses a lighter variant.
- **Ledge** (`box-shadow: 0 10px 16px -8px rgba(0, 0, 0, .5)`): the chalk ledge.

### Named Rules
**The Chalk Is Flat Rule.** Only wood and paper have thickness. Chalk lettering, chalk boxes and chalk lines never get shadows, glows or gradients.

## Shapes

Every drawn shape is a hand-made chalk shape. Chalk boxes use deliberately uneven corner radii (chalk-box) so no two corners match; small toggles use a smaller uneven box (chalk-box-sm); numerals sit inside wobbly chalk rings (chalk-ring). Lines and circles are SVG strokes with round caps and joins, about 3px wide, passed through a speck mask so their edges break. Rules between rows are plain 2px chalk lines; the selected-group detail is separated by a dashed chalk line. Paper is the only rectangular, sharp-cornered material.

**The No Perfect Shape Rule.** Nothing on the slate is a geometric rectangle or circle. If a box or ring is needed, give it uneven radii or draw it as a stroke.

## Components

### Buttons
Chalk-boxed words: a word written in chalk with a box drawn round it.
- **Shape:** uneven chalk box (chalk-box), 2.5px outline in the text colour.
- **Primary:** yellow chalk text and outline on slate. Hover fills the box solid yellow with slate-deep text.
- **Secondary:** white chalk text and outline; hover adds a faint chalk haze behind the word.
- **Large:** the closing contact action scales up fluidly and wraps anywhere so a long address fits on a phone.
- **Focus:** a dashed yellow outline offset 4px, shared with every focusable element.

### Navigation
- The chalked wordmark (a small ladder drawn in chalk, then "Rung" in Kalam 700) sits top left; section links are worn-chalk Kalam words top right. Hover brightens to white chalk with a yellow underline. On phones only the join link remains, as a small yellow chalk box.

### Language Toggle
- Two chalk words (English, हिन्दी) with an invisible box; the pressed word brightens to white chalk and gains a faint chalk box (chalk-box-sm). Swapping the language rewrites the group samples in place.

### The Group Board (signature)
- A chalk line draws across the board, then four vertical chalk dividers draw downward to split it into five columns. Each column is a tab: group name in its chalk colour, a sample of what that group reads (sized by the Chalk Size Rule), and a short printed task at the foot.
- Selecting a group underlines its name and lifts a faint chalk haze behind the column; once a visitor has chosen, the other columns dim to about 40% opacity. Choosing the same group again restores the full board. Arrow keys, Home and End move between groups; Escape undims.
- Below the columns, a dashed chalk rule introduces a two-part detail ("can" and "do") in hand-titled printed text.

### Pinned Notice
- A sheet of notice paper, tilted about a degree, held by a red drawing pin at top centre, with a soft shadow. Paper-ink heading in Kalam without the chalk speck mask, printed list in Hind with pin-red markers. The footer sources slip is the same material, tilted the other way.

### Plan Rows
- A timeline written as ruled rows: chalk-line rules above and below, a handwritten date column, printed description, and for the current row a yellow chalk dash and "we are here" in yellow Kalam. The current row brightens to white chalk; future rows stay worn chalk.

### Numbered Steps
- Two-column list whose numerals are yellow Kalam figures inside wobbly yellow chalk rings.

## Do's and Don'ts

### Do:
- **Do** keep the slate continuous: start a new section as more of the same board or a freshly wiped patch, not a new coloured band.
- **Do** draw lines, dividers, circles and arrows as chalk strokes with round caps, and draw each one only once.
- **Do** honour reduced motion by showing every stroke already drawn.
- **Do** keep chalk text at or above the contrast of worn chalk on slate (about 8:1); faint chalk is for lines, never for words.
- **Do** load Kalam and Hind locally with script-split subsets so Devanagari renders without a network font service.

### Don't:
- **Don't** use yellow for anything that isn't an action, a position marker or focus.
- **Don't** reorder or reassign the group chalk colours.
- **Don't** put chalk colours on paper or paper colours on the slate.
- **Don't** add shadows, glows or gradients to chalk lettering or chalk boxes.
- **Don't** use geometric, evenly rounded content boxes or icon-font glyphs on the board; draw the shape in chalk instead (the focus outline is the one exception).
- **Don't** add looping, ambient or scroll-driven animation; chalk is drawn once and stays.
