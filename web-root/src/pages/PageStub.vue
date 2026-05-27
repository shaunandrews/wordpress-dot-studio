<!--
@component PageStub
@description Provides a minimal reusable placeholder layout for early routed pages.
@notes Uses existing global type and spacing utilities to avoid introducing a new page system too early.
-->
<script setup>
defineProps({
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <main id="main" class="page-stub vstack align-center justify-center px-l">
    <section class="page-stub-content vstack gap-l">
      <p class="type-label type-s">{{ eyebrow }}</p>
      <h1 class="type-heading type-xxxl">{{ title }}</h1>
      <p class="type-body type-l">{{ body }}</p>
    </section>
  </main>
</template>

<style scoped>
.page-stub {
  min-height: 100vh;
  padding-top: calc(var(--site-header-height, 72px) + var(--space-xxl));
  padding-bottom: var(--space-xxl);
}

.page-stub-content {
  width: min(100%, var(--line-length-m));
}

.page-stub-content p {
  color: var(--color-chrome-fg-muted);
}
</style>
