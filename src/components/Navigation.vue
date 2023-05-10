<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { RouterLink } from "vue-router";
import { routePaths } from "../router";
</script>

<template>
  <nav>
    <RouterLink :to="routePaths.Home">Image Map Parser</RouterLink>
    <RouterLink :to="routePaths.ImageMapeGenerator"
      >Image Map - Generator</RouterLink
    >
    <RouterLink :to="routePaths.ImageMapeParser">Image Map - Parser</RouterLink>
  </nav>
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  /* margin-top: 2rem; */
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  nav {
    font-size: 1rem;
    padding: 1rem 0;
  }
}
</style>
