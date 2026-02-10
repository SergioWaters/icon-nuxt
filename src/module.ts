// modules/svg-assets.ts
import { defineNuxtModule, createResolver, addComponent } from '@nuxt/kit'
import { readdirSync, lstatSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    svgAssets: Record<string, string>
  }
}

function readSvgAssets(dir: string) {
  const svgs: Record<string, string> = {}

  function walk(currentDir: string, prefix = '') {
    if (!existsSync(currentDir)) {
      return
    }
    try {
      const entries = readdirSync(currentDir)
      for (const entry of entries) {
        const fullPath = join(currentDir, entry)
        const stat = lstatSync(fullPath)
        const key = prefix ? `${prefix}/${entry}` : entry

        if (stat.isDirectory()) {
          walk(fullPath, key)
        }
        else if (entry.endsWith('.svg')) {
          const content = readFileSync(fullPath, 'utf-8')
          svgs[String(key).replace('.svg', '')] = String(content).trim()
        }
      }
    }
    catch (e) {
      console.error('SVG module load path error: ', e)
    }
  }

  walk(dir)
  return svgs
}

export default defineNuxtModule({
  meta: {
    name: 'nuxt-svg-icons',
    configKey: 'nuxtSvgIcons',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    iconsDir: 'assets/icons',
    componentName: 'NuxtIcon',
    componentClassname: 'nuxt-icon',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const generateIcons = () => {
      const assetsDir = join(nuxt.options.srcDir, options.iconsDir)
      const svgAssets = readSvgAssets(assetsDir)
      nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || {}
      nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
      nuxt.options.runtimeConfig.public.svgAssets = svgAssets
    }

    generateIcons()

    addComponent({
      filePath: resolver.resolve('./runtime/components/icon-name.vue'),
      name: options.componentName,
      global: true,
      meta: {
        className: options.componentClassname,
      },
    })

    nuxt.hooks.hook('builder:watch', (evt, dir) => {
      if (dir.includes('assets/icons')) {
        console.info('builder:watch', evt, dir)
        generateIcons()
        console.info('assets changes added')
      }
    })
  },
})
