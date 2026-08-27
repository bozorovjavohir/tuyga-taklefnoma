<script setup lang="ts">
import { onMounted } from "vue";
import Navbar from "./components/navbar.vue";
import { useInvitationStore } from "./stores/invitation";

const invitationStore = useInvitationStore();

onMounted(() => {
  invitationStore.load();
});
</script>

<template>
  <Navbar />

  <RouterView />
</template>
