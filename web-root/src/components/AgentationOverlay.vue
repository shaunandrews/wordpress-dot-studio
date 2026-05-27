<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const host = ref(null);
let root;

onMounted(async () => {
  if (!import.meta.env.DEV || !host.value) return;

  const [{ Agentation }, { createElement }, { createRoot }] = await Promise.all([
    import('agentation'),
    import('react'),
    import('react-dom/client'),
  ]);

  if (!host.value) return;

  root = createRoot(host.value);
  root.render(createElement(Agentation));
});

onBeforeUnmount(() => {
  root?.unmount();
});
</script>

<template>
  <div ref="host" />
</template>
