<template>
  <figure class="fpo-image" aria-hidden="true">
    <p class="type-caption type-s">FPO</p>
  </figure>
</template>

<style scoped>
.fpo-image {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  min-height: 100%;
  margin: 0;
  border-radius: var(--space-m);
  backdrop-filter: blur(4px);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.fpo-image > * {
  margin: 0;
}
</style>
