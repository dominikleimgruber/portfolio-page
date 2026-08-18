<script setup lang="ts">
import { education } from "../data";
</script>

<template>
  <section class="section" id="education">
    <p class="section__label">Education</p>
    <div class="section__content entry-list">
      <article class="entry" v-for="item in education" :key="item.title">
        <div class="entry__meta">
          <h3 class="entry__title">{{ item.title }}</h3>
          <p class="entry__period">{{ item.period }}<br />{{ item.school }}</p>
        </div>
        <ul class="entry__points">
          <li class="entry__point" v-for="(point, index) in item.points" :key="index">
            <span class="dot dot--soft" aria-hidden="true"></span>
            <span>{{ point }}</span>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
