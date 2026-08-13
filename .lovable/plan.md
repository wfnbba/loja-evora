# Plan - Adjust Button Position in Hero Section

The user wants to move the "Explorar Coleção" button further down in the hero section. Specifically, they want it to be positioned about 33% above the bottom of the image.

## Proposed Changes

### Frontend Improvements

- **Adjust Hero Layout**: Change the button container in `src/routes/index.tsx` from a centered layout to a bottom-aligned layout with specific positioning.
- **Implement Custom Positioning**: Use flexbox or absolute positioning to place the button exactly 33% from the bottom of the hero section.

## Technical Details

- Modify `src/routes/index.tsx`:
    - Change the container class `relative flex h-full items-center justify-center` to something that allows bottom alignment, like `relative flex h-full items-end justify-center pb-[33%]`.
    - Alternatively, use `absolute bottom-[33%] left-1/2 -translate-x-1/2` for precise control.
