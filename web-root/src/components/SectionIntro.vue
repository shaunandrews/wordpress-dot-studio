<!--
@component SectionIntro
@description Centers section heading and body copy with a shared max line length.
@slots default - Heading, body copy, and any supporting intro content.
-->
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
