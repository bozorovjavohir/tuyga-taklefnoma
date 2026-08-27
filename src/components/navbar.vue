<template>
  <header class="navbar">
    <div class="container">
      <!-- Logo -->
      <RouterLink to="/" class="logo"> Taklef<span>.uz</span> </RouterLink>

      <!-- Desktop menu -->
      <nav class="nav-links">
        <RouterLink to="/">Bosh sahifa</RouterLink>
        <RouterLink to="/shablonlar">Shablonlar</RouterLink>
        <RouterLink to="/taklifnoma-yaratish"> Taklifnoma yaratish </RouterLink>
      </nav>

      <!-- Desktop button -->
      <RouterLink to="/taklifnoma-yaratish" class="create-button">
        Taklifnoma yaratish
      </RouterLink>

      <!-- Mobile menu button -->
      <button
        class="menu-button"
        @click="menuOpen = !menuOpen"
        aria-label="Menyuni ochish"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="menuOpen" class="mobile-menu">
      <RouterLink to="/" @click="menuOpen = false"> Bosh sahifa </RouterLink>

      <RouterLink to="/shablonlar" @click="menuOpen = false">
        Shablonlar
      </RouterLink>

      <RouterLink to="/taklifnoma-yaratish" @click="menuOpen = false">
        Taklifnoma yaratish
      </RouterLink>

      <RouterLink
        to="/taklifnoma-yaratish"
        class="mobile-create-button"
        @click="menuOpen = false"
      >
        Taklifnoma yaratish
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";

const menuOpen = ref(false);
</script>

<style scoped>
.navbar {
  width: 100%;
  background: white;
  border-bottom: 1px solid #eee;
  position: relative;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

/* Logo */
.logo {
  font-size: 26px;
  font-weight: 800;
  color: #222;
  text-decoration: none;
  white-space: nowrap;
}

.logo span {
  color: #c58b5b;
}

/* Desktop menu */
.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-links a {
  color: #444;
  text-decoration: none;
  font-size: 15px;
  transition: 0.2s ease;
}

.nav-links a:hover {
  color: #c58b5b;
}

/* Create button */
.create-button {
  padding: 11px 18px;
  background: #c58b5b;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  transition: 0.2s ease;
}

.create-button:hover {
  background: #a97045;
}

/* Mobile button */
.menu-button {
  display: none;
  width: 42px;
  height: 42px;
  border: none;
  background: transparent;
  cursor: pointer;

  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.menu-button span {
  width: 24px;
  height: 2px;
  background: #333;
  border-radius: 2px;
}

/* Mobile menu */
.mobile-menu {
  display: none;
}

/* =========================
   TABLET
========================= */

@media (max-width: 900px) {
  .container {
    padding: 16px 20px;
    gap: 20px;
  }

  .nav-links {
    gap: 18px;
  }

  .nav-links a {
    font-size: 14px;
  }

  .create-button {
    padding: 10px 14px;
    font-size: 13px;
  }
}

/* =========================
   MOBILE
========================= */

@media (max-width: 700px) {
  .container {
    padding: 14px 18px;
  }

  .logo {
    font-size: 23px;
  }

  /* Desktop menyuni yashirish */
  .nav-links,
  .create-button {
    display: none;
  }

  /* Hamburger */
  .menu-button {
    display: flex;
  }

  /* Mobile menu */
  .mobile-menu {
    display: flex;
    flex-direction: column;
    gap: 0;

    padding: 10px 18px 20px;

    background: white;
    border-top: 1px solid #eee;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }

  .mobile-menu a {
    padding: 14px 4px;
    color: #444;
    text-decoration: none;
    font-size: 15px;
    border-bottom: 1px solid #f1f1f1;
  }

  .mobile-menu a:hover {
    color: #c58b5b;
  }

  .mobile-create-button {
    margin-top: 12px;
    padding: 13px 16px !important;

    background: #c58b5b;
    color: white !important;

    text-align: center;
    border-radius: 8px;
    border: none !important;
    font-weight: 600;
  }

  .mobile-create-button:hover {
    background: #a97045;
  }
}

/* Kichik telefonlar */
@media (max-width: 380px) {
  .container {
    padding: 12px 14px;
  }

  .logo {
    font-size: 21px;
  }
}
</style>
