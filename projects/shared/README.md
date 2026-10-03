# Shared

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.0.

## Injection tokens

Import shared injection tokens from the `shared/tokens` secondary entry point:

```ts
import { AUTH_GUARD_REDIRECT_PATH } from "shared/tokens";

// Add to application or route providers to override the default "/".
{ provide: AUTH_GUARD_REDIRECT_PATH, useValue: "/login" }
```

Guards can read the configured path with `inject(AUTH_GUARD_REDIRECT_PATH)`.
The token supplies configuration only; the existing auth guard does not yet use it.

## Shared styles

`src/styles/theme.css` contains the Nova Mono font declaration, global font
baseline, and one organized `@theme` block for typography and Material color
aliases. The local font uses `font-display: swap` with a monospace fallback.
Comments separate typography, color families, surfaces, outlines, and inverse
colors. Apps supply their own `--mat-sys-*` palettes and keep app-specific theme
settings and Material configuration locally.

Import the shared theme after Tailwind in an app's global CSS:

```css
@import "tailwindcss";
@import "../../shared/src/styles/theme.css";
```

For Sass entry points, use `@use "../../shared/src/styles/theme.css";`.
The font declaration and baseline also work for the landing app without loading
Tailwind's reset or utilities. The library packages the font in
`dist/shared/fonts` alongside the CSS in `dist/shared/styles`.

Keep each app's `@source "../../shared"` and Iconify plugin registration local.
Use `@plugin "@iconify/tailwind4";` from each app's global stylesheet.
Existing `icon-[set--name]` classes remain unchanged; only icons used by
templates are emitted. Restart the dev server after changing plugin configuration.

`src/styles/utilities.css` optionally supplies `hero-gradient` and the light
`glass-panel` used by auth and plug. Premifly keeps its own dark glass panel.
Import this file only in apps that want those utilities.

The library build copies these CSS files to `dist/shared/styles`. Installed-package
consumers can import `shared/styles/theme.css` and
`shared/styles/utilities.css`; these files require Tailwind's build processing.

## Global animations

`src/styles/animations.css` provides shared Tailwind v4 utilities in admin,
auth, plug, and premifly. Import it after Tailwind using `@import` in CSS
or `@use` in SCSS. Package consumers can use `shared/styles/animations.css`.
The landing app does not load Tailwind and does not import these utilities.

| Classes | Effect |
| --- | --- |
| `animate-fade-in`, `animate-fade-out` | Fade in (200ms) or out (150ms) |
| `animate-slide-in-up`, `animate-slide-in-down` | Enter moving up or down (300ms) |
| `animate-slide-in-left`, `animate-slide-in-right` | Enter from the left or right (300ms) |
| `animate-zoom-in`, `animate-zoom-out` | Fade and scale in (200ms) or out (150ms) |

Animations run once and retain their final state. They are disabled automatically
for `prefers-reduced-motion: reduce`. Built-in Tailwind animations remain available;
use `motion-safe:animate-spin` or `motion-reduce:animate-none` for those.
Existing component-local animation classes take precedence over shared utilities.

```html
<section class="animate-slide-in-up">Page content</section>

@if (isOpen()) {
  <aside animate.enter="animate-zoom-in" animate.leave="animate-fade-out">
    Panel content
  </aside>
}
```

Use Angular's `animate.leave` for exit effects so removal waits for the animation.
Customize timing with `[animation-duration:500ms]` and stagger with
`[animation-delay:100ms]`; Tailwind's `duration-*` and `delay-*` control transitions.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the library, run:

```bash
ng build shared
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/shared
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
