<!-- eslint-disable vue/no-v-html -->
<template>
  <span
    v-bind="$attrs"
    :class="['nuxt-icon', { 'nuxt-icon_fill': !filled, 'nuxt-icon_stroke': icon.hasStroke && !filled }]"
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

const config = useRuntimeConfig()

const icon = computed(() => {
  let hasStroke = false
  const raw = config.public.svgAssets?.[props.name]

  if (raw) {
    hasStroke = String(raw).includes('stroke')
  }
  return { raw, hasStroke }
})
</script>

<style scoped>
.nuxt-icon>:deep(*) {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  margin-bottom: .125em;
}

.nuxt-icon_fill,
.nuxt-icon_fill * {
  fill: currentColor !important;
}

.nuxt-icon_stroke,
.nuxt-icon_stroke * {
  stroke: currentColor !important;
}
</style>
