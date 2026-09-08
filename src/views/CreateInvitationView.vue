<script setup lang="ts">
import { ref, nextTick } from "vue";
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

// ============================================================
// LOCAL STORAGE
// ============================================================

invitationStore.$subscribe(() => {
  invitationStore.save();
});

// ============================================================
// TELEFON MASKASI
// ============================================================

function formatPhone(type: "groomPhone" | "bridePhone") {
  let value = invitationStore[type] || "";

  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("998")) {
    digits = digits.slice(3);
  }

  digits = digits.slice(0, 9);

  let formatted = "+998";

  if (digits.length > 0) {
    formatted += " " + digits.slice(0, 2);
  }

  if (digits.length > 2) {
    formatted += " " + digits.slice(2, 5);
  }

  if (digits.length > 5) {
    formatted += " " + digits.slice(5, 7);
  }

  if (digits.length > 7) {
    formatted += " " + digits.slice(7, 9);
  }

  invitationStore[type] = formatted;
}

// ============================================================
// TELEFON VALIDATSIYA
// ============================================================

function isValidPhone(phone: string) {
  if (!phone) {
    return true;
  }

  const digits = phone.replace(/\D/g, "");

  return digits.length === 12 && digits.startsWith("998");
}

// ============================================================
// RASM TAHRIRLASH
// ============================================================

const showImageEditor = ref(false);

const imageEditorUrl = ref("");

const editorImage = ref<HTMLImageElement | null>(null);

const editorCanvas = ref<HTMLCanvasElement | null>(null);

const zoom = ref(1);

const imageX = ref(0);

const imageY = ref(0);

const isDragging = ref(false);

const CANVAS_SIZE = 360;

let dragStartX = 0;
let dragStartY = 0;

let startImageX = 0;
let startImageY = 0;

// ============================================================
// EDITOR RASM CHIZISH
// ============================================================

function drawEditorImage() {
  const canvas = editorCanvas.value;
  const img = editorImage.value;

  if (!canvas || !img) {
    return;
  }

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  const baseScale = Math.max(
    CANVAS_SIZE / img.naturalWidth,
    CANVAS_SIZE / img.naturalHeight
  );

  const scale = baseScale * zoom.value;

  const width = img.naturalWidth * scale;
  const height = img.naturalHeight * scale;

  const baseX = (CANVAS_SIZE - width) / 2;
  const baseY = (CANVAS_SIZE - height) / 2;

  const x = baseX + imageX.value;
  const y = baseY + imageY.value;

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.fillStyle = "#ffffff";

  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.drawImage(img, x, y, width, height);
}

// ============================================================
// RASM POZITSIYASINI CHEGARALASH
// ============================================================

function clampImagePosition() {
  const img = editorImage.value;

  if (!img) {
    return;
  }

  const baseScale = Math.max(
    CANVAS_SIZE / img.naturalWidth,
    CANVAS_SIZE / img.naturalHeight
  );

  const scale = baseScale * zoom.value;

  const width = img.naturalWidth * scale;
  const height = img.naturalHeight * scale;

  const baseX = (CANVAS_SIZE - width) / 2;
  const baseY = (CANVAS_SIZE - height) / 2;

  const minX = CANVAS_SIZE - width - baseX;
  const maxX = -baseX;

  const minY = CANVAS_SIZE - height - baseY;
  const maxY = -baseY;

  imageX.value = Math.min(maxX, Math.max(minX, imageX.value));

  imageY.value = Math.min(maxY, Math.max(minY, imageY.value));
}

// ============================================================
// ZOOM
// ============================================================

function setZoom(value: number) {
  zoom.value = Math.min(3, Math.max(1, value));

  clampImagePosition();

  drawEditorImage();
}

function zoomIn() {
  setZoom(Number((zoom.value + 0.1).toFixed(2)));
}

function zoomOut() {
  setZoom(Number((zoom.value - 0.1).toFixed(2)));
}

// ============================================================
// RESET
// ============================================================

function resetEditor() {
  zoom.value = 1;

  imageX.value = 0;
  imageY.value = 0;

  clampImagePosition();

  drawEditorImage();
}

// ============================================================
// RASM EDITORNI OCHISH
// ============================================================

async function openImageEditor(url: string) {
  imageEditorUrl.value = url;

  showImageEditor.value = true;

  zoom.value = 1;

  imageX.value = 0;
  imageY.value = 0;

  editorImage.value = null;

  await nextTick();

  const img = new Image();

  img.onload = () => {
    editorImage.value = img;

    drawEditorImage();
  };

  img.onerror = () => {
    alert("Rasmni yuklashda xatolik yuz berdi.");

    closeImageEditor();
  };

  img.src = url;
}

// ============================================================
// RASM UPLOAD
// ============================================================

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

  if (!file.type.startsWith("image/")) {
    alert("Iltimos, faqat rasm faylini tanlang.");

    target.value = "";

    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result as string;

    openImageEditor(imageUrl);
  };

  reader.onerror = () => {
    alert("Rasmni o‘qishda xatolik yuz berdi.");
  };

  reader.readAsDataURL(file);

  // Keyingi safar aynan shu faylni ham qayta tanlashga ruxsat
  target.value = "";
}

// ============================================================
// MAVJUD RASMNI TAHRIRLASH
// ============================================================

function editCurrentPhoto() {
  if (!mainPhoto.value) {
    return;
  }

  openImageEditor(mainPhoto.value);
}

// ============================================================
// DRAG
// ============================================================

function startDrag(event: PointerEvent) {
  if (!editorImage.value) {
    return;
  }

  isDragging.value = true;

  dragStartX = event.clientX;
  dragStartY = event.clientY;

  startImageX = imageX.value;
  startImageY = imageY.value;

  const canvas = editorCanvas.value;

  if (canvas) {
    canvas.setPointerCapture(event.pointerId);
  }
}

function dragImage(event: PointerEvent) {
  if (!isDragging.value) {
    return;
  }

  const canvas = editorCanvas.value;

  if (!canvas) {
    return;
  }

  const rect = canvas.getBoundingClientRect();

  const scaleX = CANVAS_SIZE / rect.width;
  const scaleY = CANVAS_SIZE / rect.height;

  imageX.value = startImageX + (event.clientX - dragStartX) * scaleX;

  imageY.value = startImageY + (event.clientY - dragStartY) * scaleY;

  clampImagePosition();

  drawEditorImage();
}

function stopDrag() {
  isDragging.value = false;
}

// ============================================================
// EDITORNI SAQLASH
// ============================================================

function saveImageEdit() {
  const canvas = editorCanvas.value;

  if (!canvas || !editorImage.value) {
    return;
  }

  clampImagePosition();

  drawEditorImage();

  // Rasmni siqib, LocalStorage uchun qulay hajmda saqlaymiz
  const result = canvas.toDataURL("image/jpeg", 0.9);

  mainPhoto.value = result;

  invitationStore.save();

  closeImageEditor();
}

// ============================================================
// EDITORNI YOPISH
// ============================================================

function closeImageEditor() {
  showImageEditor.value = false;

  imageEditorUrl.value = "";

  editorImage.value = null;

  isDragging.value = false;
}

// ============================================================
// VALIDATSIYA
// ============================================================

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

  if (groomPhone.value && !isValidPhone(groomPhone.value)) {
    alert(
      "Kuyov telefon raqami +998 dan keyin 9 ta raqamdan iborat bo‘lishi kerak."
    );

    return false;
  }

  if (bridePhone.value && !isValidPhone(bridePhone.value)) {
    alert(
      "Kelin telefon raqami +998 dan keyin 9 ta raqamdan iborat bo‘lishi kerak."
    );

    return false;
  }

  return true;
}

// ============================================================
// DAVOM ETISH
// ============================================================

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

    invitationStore.save();

    console.log("Taklifnoma LocalStorage'ga saqlandi");

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
        <!-- =====================================================
             01
        ====================================================== -->

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

        <!-- =====================================================
             02
        ====================================================== -->

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

            <span v-if="!mainPhoto">📷 Rasm tanlash</span>

            <img v-else :src="mainPhoto" alt="Asosiy foto" />
          </label>
        </div>

        <!-- =====================================================
             03
        ====================================================== -->

        <div class="section-title">
          <span>03</span>

          <div>
            <h2>To‘y sanasi</h2>
            <p>To‘y qachon bo‘ladi?</p>
          </div>
        </div>

        <div class="fields date-fields">
          <div class="field">
            <label>Sana</label>

            <input v-model="weddingDate" type="date" class="date-input" />
          </div>

          <div class="field">
            <label>Boshlanish vaqti</label>

            <input v-model="weddingTime" type="time" class="time-input" />
          </div>
        </div>

        <!-- =====================================================
             04
        ====================================================== -->

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

        <!-- =====================================================
             05
        ====================================================== -->

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
              inputmode="numeric"
              autocomplete="tel"
              maxlength="17"
              placeholder="+998 90 123 45 67"
              @input="formatPhone('groomPhone')"
            />
          </div>

          <div class="field">
            <label>Kelin telefoni</label>

            <input
              v-model="bridePhone"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              maxlength="17"
              placeholder="+998 91 123 45 67"
              @input="formatPhone('bridePhone')"
            />
          </div>
        </div>

        <!-- =====================================================
             06
        ====================================================== -->

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

        <!-- =====================================================
             07
        ====================================================== -->

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

      <!-- =====================================================
           PREVIEW
      ====================================================== -->

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
/* =========================================================
   GLOBAL
========================================================= */

* {
  box-sizing: border-box;
}

.create-page {
  width: 100%;
  min-height: 100vh;

  padding: 80px 24px;

  overflow-x: hidden;

  background: radial-gradient(
      circle at top left,
      rgba(197, 139, 91, 0.08),
      transparent 35%
    ),
    #faf8f5;

  color: #2d2926;
}

/* =========================================================
   HEADER
========================================================= */

.page-header {
  width: 100%;
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
  width: 100%;
  max-width: 600px;

  margin: 22px auto 0;

  color: #85807b;

  font-size: 16px;
  line-height: 1.7;
}

/* =========================================================
   MAIN LAYOUT
========================================================= */

.form-wrapper {
  width: 100%;
  max-width: 1250px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1.35fr)
    minmax(300px, 0.65fr);

  gap: 45px;

  align-items: start;
}

/* =========================================================
   FORM
========================================================= */

.form {
  width: 100%;
  min-width: 0;

  padding: 38px;

  overflow: hidden;

  background: rgba(255, 255, 255, 0.95);

  border: 1px solid #eee7e1;

  border-radius: 24px;

  box-shadow: 0 20px 60px rgba(70, 45, 25, 0.07);
}

/* =========================================================
   SECTION TITLE
========================================================= */

.section-title {
  width: 100%;
  min-width: 0;

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

.section-title > div {
  min-width: 0;
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

  line-height: 1.5;
}

/* =========================================================
   FIELDS
========================================================= */

.fields {
  width: 100%;
  min-width: 0;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);

  gap: 20px;

  margin-bottom: 25px;
}

.field {
  width: 100%;
  min-width: 0;

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
  display: block;

  width: 100%;
  max-width: 100%;
  min-width: 0;

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

/* =========================================================
   DATE / TIME
========================================================= */

.field input[type="date"],
.field input[type="time"] {
  width: 100%;
  min-width: 0;

  height: 52px;

  padding: 12px;

  appearance: none;
  -webkit-appearance: none;

  font-size: 15px;

  color: #332e2a;
}

.field input[type="date"]::-webkit-date-and-time-value {
  text-align: left;
}

.field input[type="date"]::-webkit-calendar-picker-indicator,
.field input[type="time"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

/* =========================================================
   PHOTO UPLOAD
========================================================= */

.photo-upload {
  width: 100%;

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
  max-width: calc(100% - 30px);

  padding: 14px 22px;

  border-radius: 30px;

  background: white;

  color: #b57b50;

  font-size: 14px;
  font-weight: 700;

  text-align: center;

  box-shadow: 0 8px 25px rgba(80, 50, 30, 0.08);
}

.upload-box img {
  display: block;

  width: 100%;
  height: 320px;

  object-fit: cover;
}

/* =========================================================
   BUTTON
========================================================= */

.submit-button {
  display: block;

  width: 100%;
  max-width: 100%;

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

.submit-button:disabled {
  opacity: 0.65;

  cursor: not-allowed;

  transform: none;
}

/* =========================================================
   PREVIEW
========================================================= */

.preview {
  position: sticky;

  top: 25px;

  width: 100%;
  min-width: 0;

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

  text-align: center;
}

/* =========================================================
   PHONE PREVIEW
========================================================= */

.preview-card {
  position: relative;

  width: min(330px, 100%);

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

/* =========================================================
   PREVIEW PHOTO
========================================================= */

.preview-photo {
  width: 155px;
  height: 155px;

  margin: 10px 0 20px;

  object-fit: cover;

  border-radius: 50%;

  border: 5px solid white;

  box-shadow: 0 10px 30px rgba(50, 35, 25, 0.15);
}

/* =========================================================
   PREVIEW HEART
========================================================= */

.rings {
  margin-bottom: 10px;

  color: #c58b5b;

  font-size: 38px;
}

/* =========================================================
   PREVIEW NAME
========================================================= */

.preview-card h2 {
  max-width: 100%;

  margin: 10px 0 18px;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 28px;
  line-height: 1.25;

  font-weight: 400;

  color: #3b3029;

  overflow-wrap: anywhere;
}

.line {
  width: 55px;
  height: 1px;

  margin-bottom: 20px;

  flex: 0 0 auto;

  background: #c58b5b;
}

.preview-card p {
  max-width: 100%;

  margin: 5px 0;

  color: #807872;

  font-size: 14px;

  overflow-wrap: anywhere;
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

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1050px) {
  .form-wrapper {
    grid-template-columns: 1fr;

    gap: 35px;
  }

  .preview {
    position: static;

    margin-top: 10px;
  }

  .preview-card {
    width: min(350px, 100%);
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {
  .create-page {
    padding: 45px 12px;
  }

  .page-header {
    margin-bottom: 30px;
  }

  .page-header > p {
    margin-bottom: 14px;

    font-size: 10px;

    letter-spacing: 3px;
  }

  .page-header h1 {
    font-size: clamp(34px, 10vw, 42px);

    line-height: 1.1;
  }

  .page-header > div {
    margin-top: 17px;

    font-size: 14px;

    line-height: 1.6;
  }

  .form-wrapper {
    width: 100%;

    display: flex;

    flex-direction: column;

    gap: 30px;
  }

  .form {
    width: 100%;

    padding: 20px 15px;

    border-radius: 18px;
  }

  .fields {
    width: 100%;

    grid-template-columns: minmax(0, 1fr);

    gap: 0;

    margin-bottom: 5px;
  }

  .field {
    width: 100%;

    margin-bottom: 18px;
  }

  .field input,
  .field textarea {
    width: 100%;
    max-width: 100%;

    font-size: 16px;
  }

  .field input[type="date"],
  .field input[type="time"] {
    width: 100%;
    max-width: 100%;

    height: 50px;

    padding: 12px;

    font-size: 15px;
  }

  .section-title {
    width: 100%;

    margin-top: 28px;
    margin-bottom: 20px;

    gap: 12px;
  }

  .section-title > span {
    width: 38px;
    height: 38px;

    font-size: 11px;
  }

  .section-title h2 {
    font-size: 19px;
  }

  .section-title p {
    font-size: 12px;
  }

  .upload-box {
    min-height: 220px;
  }

  .upload-box img {
    width: 100%;
    height: 220px;
  }

  .submit-button {
    width: 100%;

    padding: 16px 12px;

    font-size: 14px;
  }

  .preview {
    width: 100%;
  }

  .preview-card {
    width: min(350px, 100%);

    min-height: 580px;

    padding: 40px 22px;
  }
}

/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 400px) {
  .create-page {
    padding: 35px 8px;
  }

  .page-header h1 {
    font-size: 34px;
  }

  .page-header > div {
    font-size: 13px;
  }

  .form {
    padding: 18px 12px;

    border-radius: 16px;
  }

  .section-title {
    gap: 10px;
  }

  .section-title > span {
    width: 34px;
    height: 34px;

    font-size: 10px;
  }

  .section-title h2 {
    font-size: 18px;
  }

  .section-title p {
    font-size: 11px;
  }

  .field label {
    font-size: 12px;
  }

  .field input,
  .field textarea {
    padding: 13px 12px;

    font-size: 16px;
  }

  .field input[type="date"],
  .field input[type="time"] {
    height: 48px;

    padding: 10px;

    font-size: 14px;
  }

  .preview-card {
    width: 100%;

    min-height: 560px;

    padding: 35px 18px;

    border-width: 6px;

    border-radius: 30px;
  }

  .preview-photo {
    width: 135px;
    height: 135px;
  }

  .preview-card h2 {
    font-size: 25px;
  }
}
</style>
