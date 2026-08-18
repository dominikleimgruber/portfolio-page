<script setup lang="ts">
import { jobs } from "../data";
</script>

<template>
  <section class="section" id="experience">
    <p class="section__label">Experience</p>
    <div class="section__content entry-list">
      <article class="entry" v-for="job in jobs" :key="job.company">
        <div class="entry__meta">
          <h3 class="entry__company">{{ job.company }}</h3>
          <p class="entry__role">{{ job.role }}</p>
          <p class="entry__period">{{ job.period }}<br />{{ job.place }}</p>
        </div>
        <ul class="entry__points">
          <li class="entry__point" v-for="(point, index) in job.points" :key="index">
            <span class="dot dot--soft" aria-hidden="true"></span>
            <span v-if="point.label"><strong>{{ point.label }}</strong> {{ point.text }}</span>
            <span v-else>{{ point.text }}</span>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
