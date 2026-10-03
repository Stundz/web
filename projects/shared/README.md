# Shared

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.0.

## Shared styles

`src/styles/material-tokens.css` maps Tailwind color utilities to the consuming
application's `--mat-sys-*` variables. Apps keep their palettes, typography,
Material configuration, and global element styling locally.

Import the tokens after Tailwind in an app's global CSS:

```css
@import "tailwindcss";
@import "../../shared/src/styles/material-tokens.css";
```

For the existing Sass entry point, use
`@use "../../shared/src/styles/material-tokens.css";` after its Tailwind `@use`.
Keep each app's `@source "../../shared"` and Iconify plugin registration local.

`src/styles/utilities.css` optionally supplies `hero-gradient` and the light
`glass-panel` used by auth and plug. Premifly keeps its own dark glass panel.
Import this file only in apps that want those utilities.

The library build copies both files to `dist/shared/styles`. Installed-package
consumers can import `shared/styles/material-tokens.css` and
`shared/styles/utilities.css`; these files require Tailwind's build processing.

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
