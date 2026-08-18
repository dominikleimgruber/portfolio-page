<script setup lang="ts">
import { skillGroups } from "../data";
</script>

<template>
  <section class="section" id="skills">
    <p class="section__label">Skills &amp; tools</p>
    <div class="section__content skills-grid">
      <div class="skill-group" v-for="group in skillGroups" :key="group.title">
        <h3 class="skill-group__title">{{ group.title }}</h3>
        <div class="skill-tier" v-for="(tier, index) in group.tiers" :key="index">
          <p class="skill-tier__label" v-if="tier.label">{{ tier.label }}</p>
          <div class="skill-tier__tags">
            <span class="skill-tag" v-for="item in tier.items" :key="item">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
