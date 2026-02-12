<!-- eslint-disable vue/no-v-html -->
<template>
  <span
    v-bind="$attrs"
    :class="[
      className,
      {
        [className + '_fill']: !filled,
        [className + '_stroke']: icon.hasStroke && !filled,
      },
    ]"
    :data-icon-name="name"
    v-html="icon.raw"
  />
</template>

<script setup lang="ts">
import { useAsyncData, useRuntimeConfig } from '#imports'

const props = (defineProps<{
  name: string
  filled?: boolean
}>())

const options = useRuntimeConfig().public.svgToIcon
const className = options.componentClassName

async function importIcon(name: string) {
  let raw = ''
  let hasStroke = false

  try {
    const iconsImport = import.meta.glob<string>('@/assets/icons/**/**.svg', {
      query: '?raw',
      import: 'default',
    })
    raw = await iconsImport[`/assets/icons/${name}.svg`]!()
    if (String(raw).includes('stroke')) {
      hasStroke = true
    }
  }
  catch (e) {
    console.error(`Import of icon <${name}> caused error: ${e}`)
  }

  return {
    raw,
    hasStroke,
  }
}

const { data: icon } = await useAsyncData(
  'icon' + props.name,
  () => importIcon(props.name),
  {
    watch: [() => props.name],
    default: () => ({
      raw: '',
      hasStroke: false,
    }),
  })
</script>

<style scoped>
span > :deep(svg) {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  margin-bottom: .125em;
}

span[class$="_fill"],
span[class$="_fill"]:deep(*) {
  fill: currentColor !important;
}

span[class$="_stroke"],
span[class$="_stroke"]:deep(*) {
  stroke: currentColor !important;
}
</style>
