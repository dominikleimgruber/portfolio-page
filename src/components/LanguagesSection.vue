<script setup lang="ts">
import { languages } from "../data";
</script>

<template>
  <section class="section" id="languages">
    <p class="section__label">Languages</p>
    <div class="section__content languages-grid">
      <div class="language" v-for="language in languages" :key="language.name">
        <h3 class="language__name">{{ language.name }}</h3>
        <p class="language__description">{{ language.description }}</p>
      </div>
    </div>
  </section>
</template>
