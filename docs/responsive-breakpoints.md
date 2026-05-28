# Responsive Breakpoints

Use a small set of literal breakpoint values across viewport media queries and container queries.

## Standard Breakpoints

- `1120px`: Page-level reflow. Collapse broad two-column sections, sticky side rails, and desktop-first feature layouts.
- `760px`: Narrow viewport reflow. Use single-column grids, stacked actions, full-width CTAs, and reduced horizontal padding.
- `560px`: Component-level simplification. Reserve this for dense container queries where a reusable component needs to hide optional detail or simplify internal chrome.

## Behavior

- Build desktop-first styles by default, then step down with `max-width` queries.
- Prefer `1120px` when the layout structure changes.
- Prefer `760px` when controls, cards, or content need phone-friendly sizing.
- Prefer `560px` only for self-contained component internals, especially `@container` rules.
- Keep accessibility/media-preference queries separate from layout breakpoints.

CSS custom properties cannot be used directly in media query conditions, so keep these values literal in CSS and treat this document plus the note in `_tokens.css` as the source of truth.
