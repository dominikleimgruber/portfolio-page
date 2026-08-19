<script setup lang="ts">
import ThemeToggle from "./ThemeToggle.vue";
</script>

<template>
  <header class="site-header">
    <a class="site-header__home" href="#top">Dominik Leimgruber</a>
    <nav class="site-header__nav" aria-label="Section navigation">
      <a href="#experience">Experience</a>
      <a href="#skills">Skills</a>
      <a href="#education">Education</a>
      <a href="#languages">Languages</a>
      <a href="#contact">Contact</a>
      <ThemeToggle />
    </nav>
  </header>
</template>
