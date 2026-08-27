<template>
  <header class="navbar">
    <div class="container">
      <RouterLink to="/" class="logo"> Taklef<span>.uz</span> </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/">Bosh sahifa</RouterLink>
        <RouterLink to="/shablonlar">Shablonlar</RouterLink>
        <RouterLink to="/taklifnoma-yaratish"> Taklifnoma yaratish </RouterLink>
      </nav>

      <RouterLink to="/taklifnoma-yaratish" class="create-button">
        Taklifnoma yaratish
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  width: 100%;
  background: white;
  border-bottom: 1px solid #eee;
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

.logo {
  font-size: 26px;
  font-weight: 800;
  color: #222;
  text-decoration: none;
}

.logo span {
  color: #c58b5b;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-links a {
  color: #444;
  text-decoration: none;
  font-size: 15px;
}

.nav-links a:hover {
  color: #c58b5b;
}

.create-button {
  padding: 11px 18px;
  background: #c58b5b;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.create-button:hover {
  background: #a97045;
}
</style>
