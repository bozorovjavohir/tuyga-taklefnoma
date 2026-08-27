<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useInvitationStore } from "../stores/invitation";
import { useRouter } from "vue-router";

const invitationStore = useInvitationStore();
const router = useRouter();

const {
  groomName,
  brideName,
  mainPhoto,
  weddingDate,
  weddingTime,
  venueName,
  address,
  message,
  googleMapsUrl,
  yandexMapsUrl,
  groomPhone,
  bridePhone,
  instagramUrl,
  telegramUrl,
  facebookUrl,
  tiktokUrl,
} = storeToRefs(invitationStore);

/*
|--------------------------------------------------------------------------
| LOCAL STORAGE
|--------------------------------------------------------------------------
|
| Formadagi o'zgarishlarni avtomatik LocalStorage'ga saqlaymiz.
|
*/

invitationStore.$subscribe(() => {
  invitationStore.save();
});

/*
|--------------------------------------------------------------------------
| ASOSIY FOTO
|--------------------------------------------------------------------------
*/

function handleMainPhoto(event: Event) {
  const target = event.target as HTMLInputElement;

  if (!target.files || !target.files[0]) {
    return;
  }

  const file = target.files[0];

  if (file.size > 2 * 1024 * 1024) {
    alert("Rasm hajmi 2 MB dan kichik bo‘lishi kerak.");

    target.value = "";

    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    mainPhoto.value = reader.result as string;

    invitationStore.save();
  };

  reader.onerror = () => {
    alert("Rasmni o‘qishda xatolik yuz berdi.");
  };

  reader.readAsDataURL(file);
}

/*
|--------------------------------------------------------------------------
| VALIDATSIYA
|--------------------------------------------------------------------------
*/

function validateForm() {
  if (!groomName.value.trim()) {
    alert("Iltimos, kuyovning ismini kiriting.");
    return false;
  }

  if (!brideName.value.trim()) {
    alert("Iltimos, kelinning ismini kiriting.");
    return false;
  }

  if (!weddingDate.value) {
    alert("Iltimos, to‘y sanasini kiriting.");
    return false;
  }

  if (!venueName.value.trim()) {
    alert("Iltimos, to‘y joyini kiriting.");
    return false;
  }

  return true;
}

/*
|--------------------------------------------------------------------------
| DAVOM ETISH
|--------------------------------------------------------------------------
*/

async function continueToTemplates() {
  if (!validateForm()) {
    return;
  }

  const button = document.querySelector(
    ".submit-button"
  ) as HTMLButtonElement | null;

  try {
    if (button) {
      button.disabled = true;
      button.textContent = "Saqlanmoqda...";
    }

    // Barcha ma'lumotlarni LocalStorage'ga saqlash
    invitationStore.save();

    console.log("Taklifnoma LocalStorage'ga saqlandi");

    // ID ham yo'q, Firebase ham yo'q
    // To'g'ridan-to'g'ri Templates sahifasiga o'tamiz
    await router.push("/templates");
  } catch (error) {
    console.error("Taklifnomani saqlashda xatolik:", error);

    alert(
      "Taklifnomani saqlashda xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring."
    );

    if (button) {
      button.disabled = false;
      button.textContent = "Taklifnomani davom ettirish";
    }
  }
}
</script>
<template>
  <main class="create-page">
    <div class="page-header">
      <p>TAKLIFNOMA YARATISH</p>

      <h1>
        To‘y ma'lumotlarini
        <span>kiriting</span>
      </h1>

      <div>
        Bir necha ma'lumot kiriting va o'zingizning taklifnomangizni yarating.
      </div>
    </div>

    <section class="form-wrapper">
      <form class="form" @submit.prevent>
        <!-- 01 -->
        <div class="section-title">
          <span>01</span>

          <div>
            <h2>Kuyov va kelin</h2>
            <p>Ismlarni kiriting</p>
          </div>
        </div>

        <div class="fields">
          <div class="field">
            <label>Kuyovning ismi</label>

            <input
              v-model="groomName"
              type="text"
              placeholder="Masalan: Azim"
            />
          </div>

          <div class="field">
            <label>Kelinning ismi</label>

            <input
              v-model="brideName"
              type="text"
              placeholder="Masalan: Jasmina"
            />
          </div>
        </div>

        <!-- 02 -->
        <div class="section-title">
          <span>02</span>

          <div>
            <h2>Asosiy foto</h2>
            <p>Kuyov va kelinning asosiy rasmini yuklang</p>
          </div>
        </div>

        <div class="photo-upload">
          <label class="upload-box">
            <input type="file" accept="image/*" @change="handleMainPhoto" />

            <span v-if="!mainPhoto"> 📷 Rasm tanlash </span>

            <img v-else :src="mainPhoto" alt="Asosiy foto" />
          </label>
        </div>

        <!-- 03 -->
        <div class="section-title">
          <span>03</span>

          <div>
            <h2>To‘y sanasi</h2>
            <p>To‘y qachon bo‘ladi?</p>
          </div>
        </div>

        <div class="fields">
          <div class="field">
            <label>Sana</label>

            <input v-model="weddingDate" type="date" />
          </div>

          <div class="field">
            <label>Boshlanish vaqti</label>

            <input v-model="weddingTime" type="time" />
          </div>
        </div>

        <!-- 04 -->
        <div class="section-title">
          <span>04</span>

          <div>
            <h2>To‘y manzili</h2>
            <p>Mehmonlar qayerga kelishadi?</p>
          </div>
        </div>

        <div class="field">
          <label>To‘y joyi</label>

          <input
            v-model="venueName"
            type="text"
            placeholder="Masalan: Zarafshon restorani"
          />
        </div>

        <div class="field">
          <label>Manzil</label>

          <input
            v-model="address"
            type="text"
            placeholder="Masalan: Toshkent shahri, Chilonzor"
          />
        </div>

        <div class="field">
          <label>Google Maps havolasi</label>

          <input
            v-model="googleMapsUrl"
            type="url"
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div class="field">
          <label>Yandex Maps havolasi</label>

          <input
            v-model="yandexMapsUrl"
            type="url"
            placeholder="https://yandex.uz/maps/..."
          />
        </div>

        <!-- 05 -->
        <div class="section-title">
          <span>05</span>

          <div>
            <h2>Aloqa</h2>
            <p>Mehmonlar siz bilan bog‘lanishi uchun</p>
          </div>
        </div>

        <div class="fields">
          <div class="field">
            <label>Kuyov telefoni</label>

            <input
              v-model="groomPhone"
              type="tel"
              placeholder="+998 90 123 45 67"
            />
          </div>

          <div class="field">
            <label>Kelin telefoni</label>

            <input
              v-model="bridePhone"
              type="tel"
              placeholder="+998 91 123 45 67"
            />
          </div>
        </div>

        <!-- 06 -->
        <div class="section-title">
          <span>06</span>

          <div>
            <h2>Ijtimoiy tarmoqlar</h2>
            <p>Ixtiyoriy</p>
          </div>
        </div>

        <div class="field">
          <label>Instagram</label>

          <input
            v-model="instagramUrl"
            type="url"
            placeholder="https://instagram.com/..."
          />
        </div>

        <div class="field">
          <label>Telegram</label>

          <input
            v-model="telegramUrl"
            type="url"
            placeholder="https://t.me/..."
          />
        </div>

        <div class="field">
          <label>Facebook</label>

          <input
            v-model="facebookUrl"
            type="url"
            placeholder="https://facebook.com/..."
          />
        </div>

        <div class="field">
          <label>TikTok</label>

          <input
            v-model="tiktokUrl"
            type="url"
            placeholder="https://tiktok.com/@..."
          />
        </div>

        <!-- 07 -->
        <div class="section-title">
          <span>07</span>

          <div>
            <h2>Taklifnoma matni</h2>
            <p>Mehmonlarga aytmoqchi bo‘lgan so‘zlaringiz</p>
          </div>
        </div>

        <div class="field">
          <label>Tabrik / taklif matni</label>

          <textarea
            v-model="message"
            rows="6"
            placeholder="Sizni hayotimizdagi eng baxtli kunimizga taklif qilamiz..."
          ></textarea>
        </div>

        <button
          type="button"
          class="submit-button"
          @click="continueToTemplates"
        >
          Taklifnomani davom ettirish
        </button>
      </form>

      <!-- PREVIEW -->
      <aside class="preview">
        <p>OLDINDAN KO‘RISH</p>

        <div class="preview-card">
          <div class="rings">♥</div>

          <img
            v-if="mainPhoto"
            :src="mainPhoto"
            alt="Kuyov va kelin"
            class="preview-photo"
          />

          <h2>
            {{ groomName || "Kuyov" }}
            &
            {{ brideName || "Kelin" }}
          </h2>

          <div class="line"></div>

          <p class="preview-date">
            {{ weddingDate || "To‘y sanasi" }}
          </p>

          <p>
            {{ weddingTime || "To‘y vaqti" }}
          </p>

          <p class="venue">
            {{ venueName || "To‘y joyi" }}
          </p>

          <p>
            {{ address || "To‘y manzili" }}
          </p>
        </div>
      </aside>
    </section>
  </main>
</template>

<style scoped>
/* ================================
   PAGE
================================ */

.create-page {
  min-height: 100vh;
  padding: 80px 24px;

  background: radial-gradient(
      circle at top left,
      rgba(197, 139, 91, 0.08),
      transparent 35%
    ),
    #faf8f5;

  color: #2d2926;
}

/* ================================
   HEADER
================================ */

.page-header {
  max-width: 850px;
  margin: 0 auto 55px;

  text-align: center;
}

.page-header > p {
  margin: 0 0 18px;

  color: #b57b50;

  font-size: 12px;
  font-weight: 800;

  letter-spacing: 4px;
}

.page-header h1 {
  margin: 0;

  font-family: Georgia, "Times New Roman", serif;

  font-size: clamp(40px, 6vw, 70px);

  line-height: 1.05;
  font-weight: 400;

  color: #292522;
}

.page-header h1 span {
  color: #b57b50;
}

.page-header > div {
  max-width: 600px;

  margin: 22px auto 0;

  color: #85807b;

  font-size: 16px;
  line-height: 1.7;
}

/* ================================
   MAIN LAYOUT
================================ */

.form-wrapper {
  width: 100%;
  max-width: 1250px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);

  gap: 45px;

  align-items: start;
}

/* ================================
   FORM
================================ */

.form {
  padding: 38px;

  background: rgba(255, 255, 255, 0.95);

  border: 1px solid #eee7e1;

  border-radius: 24px;

  box-shadow: 0 20px 60px rgba(70, 45, 25, 0.07);
}

/* ================================
   SECTION TITLE
================================ */

.section-title {
  display: flex;

  align-items: center;

  gap: 16px;

  margin-top: 35px;
  margin-bottom: 25px;

  padding-bottom: 18px;

  border-bottom: 1px solid #eee8e2;
}

.section-title:first-child {
  margin-top: 0;
}

.section-title > span {
  flex: 0 0 auto;

  width: 42px;
  height: 42px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #f8eadf;

  color: #b57b50;

  font-size: 13px;
  font-weight: 800;
}

.section-title h2 {
  margin: 0 0 4px;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 22px;
  font-weight: 400;

  color: #302a26;
}

.section-title p {
  margin: 0;

  color: #98918b;

  font-size: 13px;
}

/* ================================
   FIELDS
================================ */

.fields {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 20px;

  margin-bottom: 25px;
}

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;

  margin-bottom: 8px;

  color: #514a45;

  font-size: 13px;
  font-weight: 700;
}

.field input,
.field textarea {
  width: 100%;

  box-sizing: border-box;

  padding: 15px 16px;

  border: 1px solid #ded8d2;

  border-radius: 12px;

  background: #fff;

  color: #332e2a;

  font-family: inherit;

  font-size: 15px;

  outline: none;

  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #b5afa9;
}

.field input:hover,
.field textarea:hover {
  border-color: #cdb9a9;
}

.field input:focus,
.field textarea:focus {
  border-color: #b57b50;

  box-shadow: 0 0 0 4px rgba(181, 123, 80, 0.1);
}

.field textarea {
  min-height: 150px;

  resize: vertical;

  line-height: 1.7;
}

/* ================================
   PHOTO UPLOAD
================================ */

.photo-upload {
  margin-bottom: 35px;
}

.upload-box {
  position: relative;

  width: 100%;
  min-height: 260px;

  display: flex;

  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  border: 2px dashed #d8c3b2;

  border-radius: 18px;

  background: linear-gradient(135deg, #fffaf6, #fdf5ee);

  cursor: pointer;

  overflow: hidden;

  transition: border-color 0.25s, background 0.25s, transform 0.25s;
}

.upload-box:hover {
  border-color: #b57b50;

  background: #fff8f2;

  transform: translateY(-2px);
}

.upload-box input {
  display: none;
}

.upload-box span {
  padding: 14px 22px;

  border-radius: 30px;

  background: white;

  color: #b57b50;

  font-size: 14px;
  font-weight: 700;

  box-shadow: 0 8px 25px rgba(80, 50, 30, 0.08);
}

.upload-box img {
  width: 100%;
  height: 320px;

  object-fit: cover;
}

/* ================================
   BUTTON
================================ */

.submit-button {
  width: 100%;

  margin-top: 15px;

  padding: 17px 20px;

  border: 0;

  border-radius: 13px;

  background: linear-gradient(135deg, #c58b5b, #a97045);

  color: white;

  font-size: 15px;
  font-weight: 800;

  cursor: pointer;

  box-shadow: 0 12px 25px rgba(165, 105, 65, 0.2);

  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-button:hover {
  transform: translateY(-2px);

  box-shadow: 0 16px 30px rgba(165, 105, 65, 0.28);
}

.submit-button:active {
  transform: translateY(0);
}

/* ================================
   PREVIEW
================================ */

.preview {
  position: sticky;

  top: 25px;

  display: flex;

  flex-direction: column;

  align-items: center;
}

.preview > p {
  margin: 0 0 15px;

  color: #b57b50;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 3px;
}

/* ================================
   PHONE PREVIEW
================================ */

.preview-card {
  position: relative;

  width: 330px;

  min-height: 620px;

  box-sizing: border-box;

  padding: 45px 28px;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  background: linear-gradient(180deg, #fffdfb, #fff7f1);

  border: 8px solid #292522;

  border-radius: 38px;

  box-shadow: 0 30px 70px rgba(40, 30, 20, 0.18);

  overflow: hidden;
}

/* Telefon yuqorisidagi kamera */

.preview-card::before {
  content: "";

  position: absolute;

  top: 10px;
  left: 50%;

  width: 75px;
  height: 5px;

  transform: translateX(-50%);

  border-radius: 10px;

  background: #292522;
}

/* ================================
   PREVIEW PHOTO
================================ */

.preview-photo {
  width: 155px;
  height: 155px;

  margin: 10px 0 20px;

  object-fit: cover;

  border-radius: 50%;

  border: 5px solid white;

  box-shadow: 0 10px 30px rgba(50, 35, 25, 0.15);
}

/* ================================
   PREVIEW HEART
================================ */

.rings {
  margin-bottom: 10px;

  color: #c58b5b;

  font-size: 38px;
}

/* ================================
   PREVIEW NAME
================================ */

.preview-card h2 {
  margin: 10px 0 18px;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 28px;
  line-height: 1.25;

  font-weight: 400;

  color: #3b3029;
}

.line {
  width: 55px;
  height: 1px;

  margin-bottom: 20px;

  background: #c58b5b;
}

.preview-card p {
  margin: 5px 0;

  color: #807872;

  font-size: 14px;
}

.preview-date {
  font-weight: 800;

  color: #4a4039 !important;
}

.venue {
  margin-top: 22px !important;

  color: #4a4039 !important;

  font-weight: 800;
}

/* ================================
   RESPONSIVE
================================ */

@media (max-width: 1050px) {
  .form-wrapper {
    grid-template-columns: 1fr;
  }

  .preview {
    position: static;

    margin-top: 10px;
  }

  .preview-card {
    width: 350px;
  }
}

@media (max-width: 700px) {
  .create-page {
    padding: 50px 15px;
  }

  .page-header {
    margin-bottom: 35px;
  }

  .page-header h1 {
    font-size: 42px;
  }

  .form {
    padding: 22px 18px;

    border-radius: 18px;
  }

  .fields {
    grid-template-columns: 1fr;

    gap: 0;
  }

  .section-title {
    margin-top: 30px;
  }

  .preview-card {
    width: min(350px, 92vw);

    min-height: 580px;
  }
}

@media (max-width: 400px) {
  .page-header h1 {
    font-size: 36px;
  }

  .section-title h2 {
    font-size: 19px;
  }

  .preview-card {
    width: 92vw;

    border-width: 6px;
  }
}
</style>
