<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  image: string;
}>();
</script>

<template>
  <div class="card">
    <div class="image-wrapper">
      <img :src="image" :alt="title" />
    </div>

    <div class="content">
      <h3>{{ title }}</h3>

      <p>{{ description }}</p>

      <RouterLink to="/taklifnoma-yaratish" class="button">
        Shu shablonni tanlash
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.card {
  overflow: hidden;
  background: white;
  border: 1px solid #eee;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.image-wrapper {
  width: 100%;
  height: 380px;
  overflow: hidden;
  background: #f5f5f5;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: 22px;
}

h3 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #292929;
}

p {
  margin: 0 0 20px;
  color: #777;
  line-height: 1.5;
}

.button {
  display: block;
  padding: 13px 18px;
  text-align: center;
  border-radius: 10px;
  background: #c58b5b;
  color: white;
  text-decoration: none;
  font-weight: 600;
}

.button:hover {
  background: #a97045;
}
</style>
