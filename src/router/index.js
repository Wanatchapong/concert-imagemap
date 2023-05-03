import { createRouter, createWebHistory } from "vue-router";
// import ImageMapGenerator from "../views/ImageMapGenerator.vue";
import ImageMapParser from "../views/ImageMapParser.vue";

export const routePaths = {
  Home: "/",
  ImageMapeGenerator: "/image-map/generator",
  ImageMapeParser: "/image-map/parser",
};

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: routePaths.Home,
      name: "home",
      component: ImageMapParser,
    },
    // {
    //   path: routePaths.ImageMapeGenerator,
    //   name: "imageMapGenerator",
    //   component: ImageMapGenerator,
    // },
    // {
    //   path: routePaths.ImageMapeParser,
    //   name: "imageMapParser",
    //   component: ImageMapParser,
    // },
  ],
});
