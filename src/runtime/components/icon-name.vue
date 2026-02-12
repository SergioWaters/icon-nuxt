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
import { computed, useRuntimeConfig } from '#imports'

const props = (defineProps<{
  name: string
  filled?: boolean
}>())

const options = useRuntimeConfig().public.svgToIcon
const className = options.componentClassName

const icon = computed(() => {
  let hasStroke = false
  const raw = options.svgAssets?.[props.name]

  if (raw) {
    hasStroke = String(raw).includes('stroke')
  }
  return { raw, hasStroke }
})
</script>

<style>
span > svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  margin-bottom: .125em;
}

span[class$="_fill"],
span[class$="_fill"] * {
  fill: currentColor !important;
}

span[class$="_stroke"],
span[class$="_stroke"] * {
  fill: currentColor !important;
}
</style>
