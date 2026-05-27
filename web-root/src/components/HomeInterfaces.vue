<script setup>
import Button from './Button.vue';

const interfaces = [
  {
    title: 'Studio App',
    body: 'A local agentic environment for managing your WordPress sites and apps.',
    cta: 'About the apps',
  },
  {
    title: 'Studio CLI',
    body: 'Perfect for automation and agentic workflows anywhere you can launch a terminal.',
    cta: 'Meet the CLI',
  },
  {
    title: 'Studio Web',
    body: 'Access your Studio from anywhere and collaborate with your team.',
    cta: 'Get started on Web',
  },
];
</script>

<template>
  <section class="home-interfaces px-l">
    <h2 class="type-heading type-xxl">Three tools. One Studio.</h2>
    <p class="type-body type-l">Use the tool that fits the work: a desktop workspace, an automation-ready CLI, and a web dashboard for teams and remote state.</p>

    <div class="interface-desk hstack gap-xl">
      <article v-for="item in interfaces" :key="item.title">
        <h3 class="type-heading type-xl">{{ item.title }}</h3>
        <p class="type-body type-m">{{ item.body }}</p>
        <Button>{{ item.cta }}</Button>
      </article>
    </div>
  </section>
</template>
