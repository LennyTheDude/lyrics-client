# Utility Classes Documentation

This document describes all the utility classes available in the SCSS setup for the lyrics translation app.

## Table of Contents

- [Layout Utilities](#layout-utilities)
- [Flexbox Utilities](#flexbox-utilities)
- [Grid Utilities](#grid-utilities)
- [Spacing Utilities](#spacing-utilities)
- [Typography Utilities](#typography-utilities)
- [Form Utilities](#form-utilities)
- [Button Utilities](#button-utilities)
- [Responsive Utilities](#responsive-utilities)

---

## Layout Utilities

### Container
```scss
.container
```
- **Description**: Centers content with max-width and horizontal padding
- **Properties**: `max-width: 1200px`, `margin: 0 auto`, `padding: 0 20px`
- **Usage**: Main content wrapper for pages

---

## Flexbox Utilities

### Display Flex
```scss
.flex
```
- **Description**: Sets display to flex
- **Properties**: `display: flex`

### Flex Direction
```scss
.flex-col
```
- **Description**: Sets flex direction to column
- **Properties**: `flex-direction: column`

### Alignment
```scss
.items-center
```
- **Description**: Aligns items to center (cross-axis)
- **Properties**: `align-items: center`

### Justification
```scss
.justify-between
```
- **Description**: Distributes space between items
- **Properties**: `justify-content: space-between`

---

## Grid Utilities

### Display Grid
```scss
.grid
```
- **Description**: Sets display to grid
- **Properties**: `display: grid`

### Grid Columns
```scss
.grid-cols-2
```
- **Description**: Creates 2 equal columns
- **Properties**: `grid-template-columns: 1fr 1fr`

---

## Spacing Utilities

### Gap
```scss
.gap-1  // 0.25rem (4px)
.gap-2  // 0.5rem (8px)
.gap-3  // 0.75rem (12px)
.gap-4  // 1rem (16px)
```
- **Description**: Sets gap between flex/grid items
- **Usage**: Use with `.flex` or `.grid` containers

### Margin
```scss
.m-0    // margin: 0
.mb-1   // margin-bottom: 0.25rem (4px)
.mb-2   // margin-bottom: 0.5rem (8px)
.mb-3   // margin-bottom: 0.75rem (12px)
.mb-4   // margin-bottom: 1rem (16px)
```
- **Description**: Sets margin values
- **Usage**: Common for spacing between elements

### Padding
```scss
.p-0    // padding: 0
.p-1    // padding: 0.25rem (4px)
.p-2    // padding: 0.5rem (8px)
.p-3    // padding: 0.75rem (12px)
.p-4    // padding: 1rem (16px)
```
- **Description**: Sets padding values
- **Usage**: Common for container spacing

---

## Typography Utilities

### Text Alignment
```scss
.text-center  // text-align: center
.text-left    // text-align: left
.text-right   // text-align: right
```
- **Description**: Controls text alignment
- **Usage**: Headers, paragraphs, buttons

---

## Form Utilities

### Form Group
```scss
.form-group
```
- **Description**: Container for form elements
- **Properties**: `margin-bottom: 1rem`

### Form Labels
```scss
.form-label
```
- **Description**: Styled form labels
- **Properties**: `display: block`, `margin-bottom: 0.5rem`, `font-weight: 500`

### Form Inputs
```scss
.form-input
.form-select
.form-textarea
```
- **Description**: Base styles for form elements
- **Properties**: 
  - `width: 100%`
  - `padding: 0.5rem`
  - `border: 1px solid`
  - `font-size: 1rem`
  - `outline: none` on focus

### Form Textarea
```scss
.form-textarea
```
- **Additional Properties**: `resize: vertical`, `min-height: 100px`

### Form Checkbox
```scss
.form-checkbox
```
- **Description**: Styled checkbox
- **Properties**: `margin-right: 0.5rem`

---

## Button Utilities

### Base Button
```scss
.btn
```
- **Description**: Base button styles
- **Properties**:
  - `display: inline-block`
  - `padding: 0.5rem 1rem`
  - `border: none`
  - `cursor: pointer`
  - `text-decoration: none`
  - `font-size: 1rem`

### Button States
```scss
.btn:disabled
```
- **Description**: Disabled button state
- **Properties**: `cursor: not-allowed`

### Button Variants
```scss
.btn-primary
.btn-secondary
```
- **Description**: Button style variants
- **Usage**: Apply these classes to `.btn` elements
- **Note**: Currently empty - add your own styling

---

## Responsive Utilities

### Mobile Breakpoint
```scss
@media (max-width: 768px)
```
- **Description**: Mobile-first responsive design
- **Effects**:
  - `.grid-cols-2` becomes single column
  - `.flex` becomes column direction

---

## Usage Examples

### Basic Layout
```html
<div class="container">
  <div class="flex justify-between items-center mb-4">
    <h1>Page Title</h1>
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Form Layout
```html
<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="form-input" />
</div>
```

### Grid Layout
```html
<div class="grid grid-cols-2 gap-4">
  <div class="p-3">Left Column</div>
  <div class="p-3">Right Column</div>
</div>
```

### Navigation
```html
<nav class="flex justify-between items-center p-4">
  <a href="/" class="btn">Home</a>
  <div class="flex gap-2">
    <a href="/login" class="btn">Login</a>
    <a href="/signup" class="btn">Signup</a>
  </div>
</nav>
```

---

## Extending Utilities

### Adding New Spacing Values
```scss
// Add to main.scss
.gap-5 { gap: 1.25rem; }
.gap-6 { gap: 1.5rem; }
.mb-5 { margin-bottom: 1.25rem; }
.mb-6 { margin-bottom: 1.5rem; }
```

### Adding New Colors
```scss
// Add to main.scss
.btn-success {
  // Add your success button styles
}

.text-muted {
  // Add your muted text styles
}
```

### Adding New Layout Classes
```scss
// Add to main.scss
.absolute { position: absolute; }
.relative { position: relative; }
.w-full { width: 100%; }
.h-full { height: 100%; }
```

---

## Best Practices

1. **Combine Utilities**: Use multiple utility classes together for complex layouts
2. **Mobile First**: Start with mobile layout, then add responsive classes
3. **Semantic HTML**: Use appropriate HTML elements with utility classes
4. **Consistent Spacing**: Use the spacing scale (1, 2, 3, 4) for consistency
5. **Extend Carefully**: Add new utilities only when needed across multiple components

---

## File Structure

```
src/
├── styles/
│   └── main.scss          # Main utility classes
├── components/
│   └── Navbar.scss        # Component-specific styles
└── pages/
    ├── Home.scss          # Page-specific styles
    ├── Login.scss
    ├── Signup.scss
    └── ...
```

Each component/page SCSS file extends utility classes from `main.scss` using `@extend`.
