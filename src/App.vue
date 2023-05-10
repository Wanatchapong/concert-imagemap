<script setup>
import { RouterView } from "vue-router";
// import Navigation from "./components/Navigation.vue";
</script>

<template>
  <header>
    <!-- <Navigation /> -->
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  margin-bottom: 10px;
}
</style>
