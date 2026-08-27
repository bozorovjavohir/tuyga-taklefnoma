import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import CreateInvitationView from "../views/CreateInvitationView.vue";
import TemplatesView from "../views/TemplatesView.vue";
import InvitationView from "../views/InvitationView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },

    {
      path: "/create",
      name: "create",
      component: CreateInvitationView,
    },

    {
      path: "/taklifnoma-yaratish",
      redirect: "/create",
    },

    {
      path: "/templates",
      name: "templates",
      component: TemplatesView,
    },

    {
      path: "/shablonlar",
      redirect: "/templates",
    },

    {
      path: "/invitation",
      name: "invitation",
      component: InvitationView,
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
