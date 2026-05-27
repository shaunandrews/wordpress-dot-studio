<script setup>
import { computed } from 'vue';

const props = defineProps({
  direction: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value),
  },
  strength: {
    type: Number,
    default: 20,
  },
  layers: {
    type: Number,
    default: 8,
  },
  extent: {
    type: Number,
    default: 2,
  },
  tint: {
    type: String,
    default: 'rgb(255 255 255 / 0.76)',
  },
});

const gradientAngle = {
  top: '0deg',
  right: '90deg',
  bottom: '180deg',
  left: '270deg',
};

const spreadAxis = {
  top: 'height',
  bottom: 'height',
  left: 'width',
  right: 'width',
};

const spreadPosition = {
  top: { top: '0', bottom: 'auto' },
  right: { right: '0', left: 'auto' },
  bottom: { bottom: '0', top: 'auto' },
  left: { left: '0', right: 'auto' },
};

const safeLayerCount = computed(() => Math.max(1, Math.min(Math.round(props.layers), 16)));
const safeStrength = computed(() => Math.max(props.strength, 0));
const safeExtent = computed(() => Math.max(props.extent, 0.1));

const rootStyle = computed(() => ({
  '--progressive-blur-angle': gradientAngle[props.direction],
  '--progressive-blur-tint': props.tint,
}));

const coverStyle = computed(() => {
  const axis = spreadAxis[props.direction];
  const position = spreadPosition[props.direction];

  return {
    ...position,
    [axis]: `${safeExtent.value * 100}%`,
  };
});

const layerStyles = computed(() => {
  const count = safeLayerCount.value;
  const axis = spreadAxis[props.direction];
  const position = spreadPosition[props.direction];
  const segmentSize = 1 / (count + 1);

  return Array.from({ length: count }, (_, index) => {
    const [transparentStart, solidStart, solidEnd, transparentEnd] = [
      index,
      index + 1,
      index + 2,
      index + 3,
    ].map((stop) => stop * segmentSize * 100);
    const blur = count === 1 ? safeStrength.value : (safeStrength.value * index) / (count - 1);

    return {
      ...position,
      [axis]: `${safeExtent.value * 100}%`,
      '--progressive-blur-filter': `blur(${blur.toFixed(2)}px)`,
      '--progressive-blur-mask': `linear-gradient(${gradientAngle[props.direction]}, transparent ${transparentStart.toFixed(2)}%, black ${solidStart.toFixed(2)}%, black ${solidEnd.toFixed(2)}%, transparent ${transparentEnd.toFixed(2)}%)`,
    };
  });
});
</script>

<template>
  <div class="progressive-blur" aria-hidden="true" :style="rootStyle">
    <span
      v-for="(style, index) in layerStyles"
      :key="index"
      class="progressive-blur-layer"
      :style="style"
    />
    <span class="progressive-blur-tint" :style="coverStyle" />
  </div>
</template>

<style scoped>
.progressive-blur {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.progressive-blur-tint {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    var(--progressive-blur-angle),
    transparent 0%,
    color-mix(in srgb, var(--progressive-blur-tint) 70%, transparent) 64%,
    var(--progressive-blur-tint) 100%
  );
}

.progressive-blur-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: rgb(255 255 255 / 0.001);
  -webkit-backdrop-filter: var(--progressive-blur-filter);
  backdrop-filter: var(--progressive-blur-filter);
  -webkit-mask-image: var(--progressive-blur-mask);
  mask-image: var(--progressive-blur-mask);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  will-change: backdrop-filter;
}
</style>
