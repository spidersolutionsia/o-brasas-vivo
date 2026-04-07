

## Plan: Scroll to top when clicking the logo on the home page

**Problem**: The logo in the header uses `<Link to="/">`. When the user is already on the home page, clicking the logo doesn't scroll to the top because the pathname doesn't change, so `ScrollToTop` doesn't trigger.

**Solution**: Add an `onClick` handler to the logo `<Link>` that scrolls to the top when the user is already on `/`.

**File to edit**: `src/components/Header.tsx`

**Change**: On line 45, add an `onClick` handler:
```tsx
<Link
  to="/"
  className="flex-shrink-0"
  onClick={() => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }}
>
```

This is a single small change — no other files need modification.

