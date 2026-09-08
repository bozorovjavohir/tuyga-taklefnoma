<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import {
  useInvitationStore,
  type InvitationTemplate,
} from "../stores/invitation";

const router = useRouter();
const invitationStore = useInvitationStore();

const { template, groomName, brideName, mainPhoto, weddingDate } =
  storeToRefs(invitationStore);

/* =========================================================
   STATE
========================================================= */

const loading = ref(false);
const error = ref("");

/* =========================================================
   TEMPLATES
========================================================= */

const templates: Array<{
  id: InvitationTemplate;
  name: string;
  description: string;
  className: string;
}> = [
  {
    id: "elegant",
    name: "Elegant",
    description: "Nafis va klassik to‘y taklifnomasi",
    className: "template-elegant",
  },
  {
    id: "romantic",
    name: "Romantic",
    description: "Romantik va iliq dizayn",
    className: "template-romantic",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Oddiy, zamonaviy va toza dizayn",
    className: "template-minimal",
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Hashamatli va premium ko‘rinish",
    className: "template-luxury",
  },
];

/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date: string) {
  if (!date) {
    return "20 · 09 · 2026";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();

  return `${day} · ${month} · ${year}`;
}

/* =========================================================
   SELECT TEMPLATE
========================================================= */

function selectTemplate(id: InvitationTemplate) {
  invitationStore.setTemplate(id);
  invitationStore.save();

  error.value = "";

  console.log("Tanlangan template:", id);
}

/* =========================================================
   OPEN INVITATION
========================================================= */

async function openInvitation() {
  error.value = "";

  if (!template.value) {
    error.value = "Iltimos, shablon tanlang.";
    return;
  }

  try {
    loading.value = true;

    // Barcha ma'lumotlarni LocalStorage'ga saqlash
    invitationStore.save();

    console.log("Taklifnoma LocalStorage'ga saqlandi:", template.value);

    // Firebase ID va query parameter kerak emas
    await router.push("/invitation");
  } catch (err) {
    console.error("Taklifnomani ochishda xatolik:", err);

    error.value = "Taklifnomani ochishda xatolik yuz berdi.";
  } finally {
    loading.value = false;
  }
}

/* =========================================================
   BACK
========================================================= */

function goBack() {
  router.push("/create");
}

/* =========================================================
   SELECTED TEMPLATE NAME
========================================================= */

const selectedTemplateName = computed(() => {
  return (
    templates.find((item) => item.id === template.value)?.name || "Tanlanmagan"
  );
});

/* =========================================================
   INITIALIZE
========================================================= */

onMounted(() => {
  // LocalStorage'dan ma'lumotlarni yuklash
  invitationStore.load();

  // Template tanlanmagan bo'lsa Elegant
  if (!template.value) {
    invitationStore.setTemplate("elegant");
  }

  invitationStore.save();

  console.log("Templates sahifasi ochildi.");
  console.log("Hozirgi template:", template.value);
});
</script>

<template>
  <main class="templates-page">
    <!-- =================================================
         HEADER
    ================================================== -->

    <header class="page-header">
      <div class="eyebrow">TAKLIFNOMA DIZAYNI</div>

      <h1>
        O‘zingizga mos
        <span>uslubni tanlang</span>
      </h1>

      <p>
        Taklifnomangiz uchun dizayn tanlang. Keyin uni mehmonlaringizga
        yuborishingiz mumkin.
      </p>
    </header>

    <!-- =================================================
         ERROR
    ================================================== -->

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- =================================================
         TEMPLATES
    ================================================== -->

    <section class="templates-container">
      <div class="templates-grid">
        <article
          v-for="item in templates"
          :key="item.id"
          class="template-item"
          :class="{
            selected: template === item.id,
          }"
          @click="selectTemplate(item.id)"
        >
          <!-- PREVIEW -->

          <div class="template-preview" :class="item.className">
            <div class="preview-content">
              <div class="preview-small">WEDDING INVITATION</div>

              <!-- PHOTO -->

              <div class="preview-photo">
                <img v-if="mainPhoto" :src="mainPhoto" alt="Kuyov va kelin" />

                <div v-else class="photo-placeholder">♥</div>
              </div>

              <!-- NAMES -->

              <h2>
                {{ groomName || "Azim" }}

                <span>&</span>

                {{ brideName || "Jasmina" }}
              </h2>

              <!-- DATE -->

              <div class="preview-date">
                {{ formatDate(weddingDate) }}
              </div>

              <div class="preview-line"></div>

              <div class="preview-location">Wedding Ceremony</div>
            </div>
          </div>

          <!-- INFO -->

          <div class="template-info">
            <div>
              <h2>
                {{ item.name }}
              </h2>

              <p>
                {{ item.description }}
              </p>
            </div>

            <div
              class="select-circle"
              :class="{
                active: template === item.id,
              }"
            >
              <span v-if="template === item.id"> ✓ </span>
            </div>
          </div>
        </article>
      </div>

      <!-- =================================================
           BOTTOM PANEL
      ================================================== -->

      <div class="bottom-panel">
        <div class="selected-info">
          <span> Tanlangan dizayn: </span>

          <strong>
            {{ selectedTemplateName }}
          </strong>
        </div>

        <button
          type="button"
          class="continue-button"
          :disabled="loading"
          @click="openInvitation"
        >
          <span v-if="loading"> Yuklanmoqda... </span>

          <span v-else>
            Taklifnomani ko‘rish
            <b>→</b>
          </span>
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* =====================================================
   PAGE
===================================================== */

.templates-page {
  min-height: 100vh;
  padding: 60px 24px 90px;

  background: radial-gradient(
      circle at top left,
      rgba(197, 139, 91, 0.1),
      transparent 35%
    ),
    #faf8f5;

  color: #302a26;
}

/* =====================================================
   HEADER
===================================================== */

.page-header {
  position: relative;

  max-width: 900px;

  margin: 0 auto 55px;

  text-align: center;
}

.eyebrow {
  margin-bottom: 18px;

  color: #b57b50;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 4px;
}

.page-header h1 {
  margin: 0;

  font-family: Georgia, "Times New Roman", serif;

  font-size: clamp(40px, 6vw, 65px);

  line-height: 1.05;

  font-weight: 400;
  color: #3b3029;
}

.page-header p {
  max-width: 600px;

  margin: 22px auto 0;

  color: #8c847e;

  font-size: 15px;

  line-height: 1.7;
}

/* =====================================================
   ERROR
===================================================== */

.error-message {
  max-width: 700px;

  margin: 0 auto 25px;

  padding: 15px 20px;

  border: 1px solid #edcaca;

  border-radius: 12px;

  background: #fff2f2;

  color: #a94442;

  text-align: center;

  font-size: 14px;
}

/* =====================================================
   CONTAINER
===================================================== */

.templates-container {
  max-width: 1200px;

  margin: 0 auto;
}

/* =====================================================
   GRID
===================================================== */

.templates-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 30px;
}

/* =====================================================
   ITEM
===================================================== */

.template-item {
  padding: 14px;

  background: rgba(255, 255, 255, 0.9);

  border: 1px solid #eee5de;

  border-radius: 24px;

  cursor: pointer;

  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}

.template-item:hover {
  transform: translateY(-5px);

  box-shadow: 0 20px 50px rgba(70, 45, 25, 0.1);
}

.template-item.selected {
  border: 2px solid #b57b50;

  box-shadow: 0 20px 50px rgba(181, 123, 80, 0.15);
}

/* =====================================================
   PREVIEW
===================================================== */

.template-preview {
  min-height: 430px;

  border-radius: 17px;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;
}

.preview-content {
  width: 80%;

  text-align: center;
}

.preview-small {
  margin-bottom: 22px;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 3px;
}

/* =====================================================
   PHOTO
===================================================== */

.preview-photo {
  width: 145px;
  height: 145px;

  margin: 0 auto 20px;

  overflow: hidden;

  border-radius: 50%;
}

.preview-photo img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
}

.photo-placeholder {
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 45px;
}

/* =====================================================
   NAME
===================================================== */

.preview-content h2 {
  margin: 10px 0;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 30px;

  font-weight: 400;
}

.preview-content h2 span {
  margin: 0 5px;
}

/* =====================================================
   DATE
===================================================== */

.preview-date {
  font-size: 11px;

  letter-spacing: 3px;
}

.preview-line {
  width: 45px;
  height: 1px;

  margin: 20px auto;
}

.preview-location {
  font-size: 10px;

  letter-spacing: 2px;
}

/* =====================================================
   INFO
===================================================== */

.template-info {
  padding: 20px 10px 8px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;
}

.template-info h2 {
  margin: 0 0 6px;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 23px;

  font-weight: 400;
}

.template-info p {
  margin: 0;

  color: #948b84;

  font-size: 13px;
}

/* =====================================================
   SELECT CIRCLE
===================================================== */

.select-circle {
  flex: 0 0 auto;

  width: 34px;
  height: 34px;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 1px solid #d8cec6;

  border-radius: 50%;

  color: white;

  transition: 0.2s;
}

.select-circle.active {
  border-color: #b57b50;

  background: #b57b50;
}

/* =====================================================
   BOTTOM
===================================================== */

.bottom-panel {
  margin-top: 45px;

  padding: 22px 25px;

  background: white;

  border: 1px solid #eee5de;

  border-radius: 20px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  box-shadow: 0 15px 45px rgba(70, 45, 25, 0.06);
}

.selected-info {
  display: flex;

  flex-direction: column;

  gap: 4px;
}

.selected-info span {
  color: #958b84;

  font-size: 12px;
}

.selected-info strong {
  color: #403731;

  font-size: 16px;
}

/* =====================================================
   BUTTON
===================================================== */

.continue-button {
  padding: 16px 25px;

  border: 0;

  border-radius: 12px;

  background: linear-gradient(135deg, #c58b5b, #a97045);

  color: white;

  font-size: 14px;

  font-weight: 800;

  cursor: pointer;

  box-shadow: 0 10px 25px rgba(165, 105, 65, 0.2);

  transition: 0.2s;
}

.continue-button:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 15px 30px rgba(165, 105, 65, 0.3);
}

.continue-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

.continue-button b {
  margin-left: 10px;

  font-size: 18px;
}

/* =====================================================
   ELEGANT
===================================================== */

.template-elegant {
  background: linear-gradient(145deg, #fffdfb, #f4e8dc);

  color: #49382e;
}

.template-elegant .preview-small {
  color: #b57b50;
}

.template-elegant .preview-photo {
  border: 5px solid white;

  box-shadow: 0 10px 30px rgba(70, 45, 25, 0.15);
}

.template-elegant .photo-placeholder {
  background: #ead8c8;

  color: #b57b50;
}

.template-elegant .preview-date {
  color: #9b7658;
}

.template-elegant .preview-line {
  background: #b57b50;
}

.template-elegant .preview-location {
  color: #85766b;
}

/* =====================================================
   ROMANTIC
===================================================== */

.template-romantic {
  background: linear-gradient(145deg, #fff7f8, #f7dfe2);

  color: #68444b;
}

.template-romantic .preview-small {
  color: #a35d6b;
}

.template-romantic .preview-photo {
  border: 5px solid white;

  box-shadow: 0 10px 30px rgba(100, 50, 60, 0.15);
}

.template-romantic .photo-placeholder {
  background: #ecc8ce;

  color: #a35d6b;
}

.template-romantic .preview-date {
  color: #a35d6b;
}

.template-romantic .preview-line {
  background: #b86c7a;
}

.template-romantic .preview-location {
  color: #9a7279;
}

/* =====================================================
   MINIMAL
===================================================== */

.template-minimal {
  background: #f5f5f2;

  color: #292929;
}

.template-minimal .preview-small {
  color: #555;
}

.template-minimal .preview-photo {
  border-radius: 8px;

  border: 1px solid #ddd;
}

.template-minimal .photo-placeholder {
  background: #e6e6e2;

  color: #777;
}

.template-minimal .preview-date {
  color: #555;
}

.template-minimal .preview-line {
  background: #777;
}

.template-minimal .preview-location {
  color: #777;
}

/* =====================================================
   LUXURY
===================================================== */

.template-luxury {
  background: radial-gradient(circle at center, #45352a, #211a16);

  color: #ead0a4;
}

.template-luxury .preview-small {
  color: #d6b47c;
}

.template-luxury .preview-photo {
  border: 3px solid #c9a76b;
}

.template-luxury .photo-placeholder {
  background: #392c24;

  color: #c9a76b;
}

.template-luxury .preview-date {
  color: #d6b47c;
}

.template-luxury .preview-line {
  background: #c9a76b;
}

.template-luxury .preview-location {
  color: #bca98f;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 800px) {
  .templates-page {
    padding: 45px 15px 70px;
  }

  .back-button {
    position: static;

    display: block;

    margin-bottom: 30px;
  }

  .templates-grid {
    grid-template-columns: 1fr;
  }

  .bottom-panel {
    flex-direction: column;

    align-items: stretch;
  }

  .continue-button {
    width: 100%;
  }
}

@media (max-width: 500px) {
  .template-preview {
    min-height: 380px;
  }

  .preview-photo {
    width: 120px;
    height: 120px;
  }

  .preview-content h2 {
    font-size: 25px;
  }

  .page-header h1 {
    font-size: 42px;
  }
}
/* =========================================
   TEXT COLORS
========================================= */

.templates-page h1,
.templates-page h2,
.templates-page h3 {
  color: #302a26;
}

.templates-page p {
  color: #6f665f;
}

.templates-page span {
  color: inherit;
}

.page-header h1 {
  color: #302a26;
}

.page-header h1 span {
  color: #b57b50;
}

.template-info h2 {
  color: #302a26;
}

.template-info p {
  color: #817870;
}

.selected-info span {
  color: #817870;
}

.selected-info strong {
  color: #302a26;
}
</style>
