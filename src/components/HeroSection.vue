<script setup lang="ts">
import { useTypewriter } from "../composables/useTypewriter";

const heroTitle = "DevOps and platform engineer";
const { displayText, typing, done } = useTypewriter(heroTitle);
</script>

<template>
  <section class="hero" id="top">
    <p class="hero__availability">
      <span class="hero__dot" aria-hidden="true"></span>
      Open to software &amp; solutions engineering roles
    </p>
    <h1
      class="hero__heading"
      :class="{ 'is-typing': typing, 'is-done': done }"
      aria-label="DevOps and platform engineer"
    >
      <span class="hero__heading-typed" aria-hidden="true">{{ displayText }}</span>
    </h1>
    <p class="hero__subheading">
      Building the AWS foundation that 2'000+ accounts run on.
    </p>
    <p class="hero__paragraph">
      Five years across cloud platform engineering, security operations and
      software development — infrastructure as code, serverless services, and
      agentic tooling that removes recurring work. Based in Zürich, working
      in German and English.
    </p>
    <div class="hero__buttons">
      <a
        class="button button--primary"
        href="https://github.com/dominik.leimgruber"
        target="_blank"
        rel="noreferrer"
        >GitHub</a
      >
      <a
        class="button button--secondary"
        href="https://linkedin.com/in/dominik.leimgruber"
        target="_blank"
        rel="noreferrer"
        >LinkedIn</a
      >
    </div>
  </section>
</template>
