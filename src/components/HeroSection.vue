<script setup lang="ts">
import { computed } from "vue";
import { useTypewriter } from "../composables/useTypewriter";

const LINE_1 = "DevOps and";
const LINE_2 = "platform engineer";
const HERO_TITLE = `${LINE_1} ${LINE_2}`;

const { displayText, typing, done } = useTypewriter(HERO_TITLE);

const line1Text = computed(() => displayText.value.slice(0, LINE_1.length));
const line2Text = computed(() =>
  displayText.value.length > LINE_1.length + 1
    ? displayText.value.slice(LINE_1.length + 1)
    : "",
);
const isTypingLine1 = computed(() => displayText.value.length <= LINE_1.length);
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
      <span class="hero__heading-typed" aria-hidden="true">
        <span class="hero__heading-line" :class="{ 'is-active-line': isTypingLine1 }">{{
          line1Text
        }}</span>
        <span class="hero__heading-line" :class="{ 'is-active-line': !isTypingLine1 }">{{
          line2Text
        }}</span>
      </span>
    </h1>
    <p class="hero__subheading">
      Building the AWS foundation behind a large-scale multi-account platform.
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
        href="https://github.com/dominikleimgruber"
        target="_blank"
        rel="noreferrer"
        >GitHub</a
      >
      <a
        class="button button--secondary"
        href="https://linkedin.com/in/dominik-leimgruber"
        target="_blank"
        rel="noreferrer"
        >LinkedIn</a
      >
    </div>
  </section>
</template>
