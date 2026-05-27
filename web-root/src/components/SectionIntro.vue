<template>
  <div class="section-intro">
    <slot />
  </div>
</template>

<style scoped>
.section-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: var(--line-length-l);
  margin-inline: auto;
}
</style>
