# nuxt-svg-to-icon

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module that turns your local SVG files into a globally available, fully typed icon component. Drop `.svg` files into a folder and use them anywhere as `<NuxtIcon name="..." />` — with autocompletion for icon names and automatic `currentColor` theming.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 🧩 &nbsp;**Global `<NuxtIcon>` component** — auto-registered, no imports needed
- 🔤 &nbsp;**Typed icon names** — generates an `IconName` union type from your SVG files, so `name` is autocompleted and type-checked
- 📁 &nbsp;**Nested folders** — `assets/icons/arrows/left.svg` becomes `name="arrows/left"`
- 🎨 &nbsp;**`currentColor` theming** — icons inherit the surrounding text color via `fill`/`stroke`; opt out per icon with the `filled` prop
- ⚡️ &nbsp;**Two loading modes** — inline all SVGs at build time (default), or lazy-load each icon on demand
- 🔄 &nbsp;**Hot reload** — adding, changing, or removing SVGs updates icons and types during `nuxt dev`

## Quick Setup

Install the module in your Nuxt application with one command:

```bash
npx nuxt module add nuxt-svg-to-icon
```

Put your SVG files into `assets/icons`:

```
assets/
  icons/
    file.svg
    search.svg
    arrows/
      left.svg
```

Then use them anywhere in your app:

```vue
<template>
  <button>
    <NuxtIcon name="search" /> Search
  </button>

  <!-- nested folders are part of the name -->
  <NuxtIcon name="arrows/left" />

  <!-- keep the SVG's original colors -->
  <NuxtIcon name="file" filled />
</template>
```

That's it! Icon names are typed — your editor will suggest every icon in the folder. ✨

## Configuration

Configure the module under the `nuxtSvgToIcon` key in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-svg-to-icon'],
  nuxtSvgToIcon: {
    iconsDir: 'assets/icons',
    asyncComponent: false,
    componentName: 'NuxtIcon',
    componentClassName: 'nuxt-icon',
  },
})
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `iconsDir` | `string` | `'assets/icons'` | Directory (relative to `srcDir`) that is scanned recursively for `.svg` files. |
| `asyncComponent` | `boolean` | `false` | `false`: all SVGs are read at build time and inlined into the public runtime config. `true`: each icon is lazy-loaded on demand via `import.meta.glob`. |
| `componentName` | `string` | `'NuxtIcon'` | Name of the globally registered component. |
| `componentClassName` | `string` | `'nuxt-icon'` | Base CSS class applied to the rendered `<span>` wrapper. |

## Component

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `IconName` | — (required) | Icon name: the SVG file path relative to `iconsDir`, without the `.svg` extension. Typed as a union of all available icons. |
| `filled` | `boolean` | `false` | By default the icon's `fill` (and `stroke`, when the SVG uses strokes) is forced to `currentColor`. Set `filled` to keep the SVG's own colors. |

All other attributes (`class`, `style`, event listeners, …) fall through to the wrapper `<span>`.

### Rendering & styling

The component renders the raw SVG inside a `<span>`:

- The SVG is sized `1em × 1em` and vertically aligned with text, so icon size follows `font-size`.
- Without `filled`, a `<componentClassName>_fill` class forces `fill: currentColor`; if the SVG contains strokes, `<componentClassName>_stroke` also forces `stroke: currentColor`. Color follows the CSS `color` of the surrounding text.
- The wrapper carries a `data-icon-name` attribute for styling or testing hooks.

```vue
<span style="color: tomato; font-size: 24px">
  <NuxtIcon name="search" /> <!-- 24px tomato icon -->
</span>
```

### Typed icon names

The module generates a type declaration (`#build/nuxt-svg-to-icon-icon-names`) with a union of every icon name:

```ts
export type IconName = 'file' | 'search' | 'arrows/left'
```

Passing an unknown `name` is a type error, and the type regenerates automatically when files in `iconsDir` change.

## Loading modes

**Inline (default).** Every SVG is read at build time and shipped in the public runtime config, so icons render synchronously on server and client with no extra requests. Best for small-to-medium icon sets.

**Async (`asyncComponent: true`).** Icons are loaded individually with `useAsyncData` + `import.meta.glob(..., { query: '?raw' })`, so only the icons actually used are fetched. Best for large icon sets where inlining everything would bloat the payload.

## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  # Install dependencies
  npm install

  # Generate type stubs
  npm run dev:prepare

  # Develop with the playground
  npm run dev

  # Build the playground
  npm run dev:build

  # Run ESLint
  npm run lint

  # Run Vitest
  npm run test
  npm run test:watch

  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-svg-to-icon/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-svg-to-icon

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-svg-to-icon.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-svg-to-icon

[license-src]: https://img.shields.io/npm/l/nuxt-svg-to-icon.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-svg-to-icon

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
