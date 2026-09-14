<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useInvitationStore } from "../stores/invitation";

const router = useRouter();
const invitationStore = useInvitationStore();

const {
  template,
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
  musicUrl,
} = storeToRefs(invitationStore);

/* =========================================================
   MUSIC
========================================================= */

const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const musicError = ref(false);

/*
  Musiqani yaratish
*/
function setupAudio(url: string) {
  // Eski audio bo'lsa to'xtatamiz
  if (audio.value) {
    audio.value.pause();

    audio.value.src = "";

    audio.value = null;
  }

  isPlaying.value = false;
  musicError.value = false;

  if (!url) {
    return;
  }

  console.log("Musiqa yuklanmoqda:", url);

  const player = new Audio();

  player.src = url;
  player.preload = "auto";
  player.loop = true;
  player.volume = 0.6;
  player.muted = false;

  // Audio xatosini kuzatamiz
  player.addEventListener("error", () => {
    console.error("Audio faylni yuklashda xato:", player.error);

    musicError.value = true;
    isPlaying.value = false;
  });

  // Musiqa to'xtatilsa
  player.addEventListener("pause", () => {
    isPlaying.value = false;
  });

  // Musiqa ijro qilinsa
  player.addEventListener("play", () => {
    isPlaying.value = true;
    musicError.value = false;
  });

  audio.value = player;

  // Audio faylni oldindan yuklashga harakat qilamiz
  player.load();
}

/*
  musicUrl o'zgarsa ham audio qayta yaratiladi.
  Bu LocalStorage bilan ishlaganda juda muhim.
*/
watch(
  musicUrl,
  (newUrl) => {
    setupAudio(newUrl);
  },
  {
    immediate: true,
  }
);

/*
  Play / Pause
*/
async function toggleMusic() {
  if (!musicUrl.value) {
    console.error("musicUrl mavjud emas");

    return;
  }

  // Agar audio hali yaratilmagan bo'lsa
  if (!audio.value) {
    setupAudio(musicUrl.value);
  }

  if (!audio.value) {
    return;
  }

  if (isPlaying.value) {
    audio.value.pause();

    isPlaying.value = false;

    return;
  }

  try {
    console.log("Musiqa ishga tushmoqda...");

    await audio.value.play();

    isPlaying.value = true;
    musicError.value = false;

    console.log("Musiqa ishga tushdi!");
  } catch (error) {
    console.error("Musiqani ishga tushirib bo'lmadi:", error);

    isPlaying.value = false;
    musicError.value = true;
  }
}

/* =========================================================
   COUNTDOWN
========================================================= */

const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

let countdownInterval: ReturnType<typeof setInterval> | null = null;

function resetCountdown() {
  countdown.value = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
}

function updateCountdown() {
  if (!weddingDate.value) {
    resetCountdown();
    return;
  }

  const targetDate = new Date(
    `${weddingDate.value}T${weddingTime.value || "00:00"}`
  ).getTime();

  if (Number.isNaN(targetDate)) {
    resetCountdown();
    return;
  }

  const difference = targetDate - Date.now();

  if (difference <= 0) {
    resetCountdown();
    return;
  }

  countdown.value = {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),

    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),

    minutes: Math.floor((difference / (1000 * 60)) % 60),

    seconds: Math.floor((difference / 1000) % 60),
  };
}

/* =========================================================
   MOUNT / UNMOUNT
========================================================= */

onMounted(() => {
  updateCountdown();

  countdownInterval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);

    countdownInterval = null;
  }

  if (audio.value) {
    audio.value.pause();

    audio.value.src = "";

    audio.value = null;
  }
});

/* =========================================================
   TEMPLATE
========================================================= */

const currentTemplate = computed(() => {
  const value = template.value;

  if (
    value === "elegant" ||
    value === "romantic" ||
    value === "minimal" ||
    value === "luxury"
  ) {
    return value;
  }

  return "elegant";
});

const templateName = computed(() => {
  const names: Record<string, string> = {
    elegant: "Elegant",
    romantic: "Romantic",
    minimal: "Minimal",
    luxury: "Luxury",
  };

  return names[currentTemplate.value] || "Elegant";
});

/* =========================================================
   DATE
========================================================= */

const formattedDate = computed(() => {
  const value = weddingDate.value;

  if (!value) {
    return "To‘y sanasi";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
});

/* =========================================================
   WEEKDAY
========================================================= */

const weekday = computed(() => {
  const value = weddingDate.value;

  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const days = [
    "Yakshanba",
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
  ];

  return days[date.getDay()];
});

/* =========================================================
   NAVIGATION
========================================================= */

function goBack() {
  router.push("/templates");
}

function editInvitation() {
  router.push("/create");
}

function createNextInvitation() {
  invitationStore.reset();

  router.push("/create");
}

/* =========================================================
   PHONE
========================================================= */

function callPhone(phone: string) {
  if (!phone) {
    return;
  }

  const cleanPhone = phone.replace(/[^\d+]/g, "");

  if (!cleanPhone) {
    return;
  }

  window.location.href = `tel:${cleanPhone}`;
}

/* =========================================================
   LINK
========================================================= */

function openLink(url: string) {
  if (!url) {
    return;
  }

  let finalUrl = url.trim();

  if (!finalUrl) {
    return;
  }

  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = `https://${finalUrl}`;
  }

  window.open(finalUrl, "_blank", "noopener,noreferrer");
}

/* =========================================================
   MAPS
========================================================= */

function openGoogleMaps() {
  if (!googleMapsUrl.value) {
    alert("Google Maps havolasi kiritilmagan.");
    return;
  }

  openLink(googleMapsUrl.value);
}

function openYandexMaps() {
  if (!yandexMapsUrl.value) {
    alert("Yandex Maps havolasi kiritilmagan.");
    return;
  }

  openLink(yandexMapsUrl.value);
}

/* =========================================================
   INVITATION TEXT
========================================================= */

const invitationText = computed(() => {
  const names = `${groomName.value || "Kuyov"} & ${brideName.value || "Kelin"}`;

  const date = formattedDate.value;

  const time = weddingTime.value ? ` Soat ${weddingTime.value}.` : "";

  const venue = venueName.value
    ? ` Manzil: ${venueName.value}${address.value ? `, ${address.value}` : ""}.`
    : "";

  return `💍 ${names}ning to‘yiga taklif qilamiz!

📅 ${date}.${time}${venue}

Sizni baxtli kunimizda kutib qolamiz! ❤️`;
});

/* =========================================================
   TELEGRAM
========================================================= */

function shareTelegram() {
  const text = encodeURIComponent(invitationText.value);

  const url = encodeURIComponent(window.location.href);

  const telegramUrl = `https://t.me/share/url?url=${url}&text=${text}`;

  window.open(telegramUrl, "_blank", "noopener,noreferrer");
}

/* =========================================================
   WHATSAPP
========================================================= */

function shareWhatsApp() {
  const text = encodeURIComponent(
    `${invitationText.value}\n\n${window.location.href}`
  );

  const whatsappUrl = `https://wa.me/?text=${text}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

/* =========================================================
   COPY LINK
========================================================= */

async function copyInvitationLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);

    alert("Taklifnoma havolasi nusxalandi!");
  } catch (error) {
    console.error("Link nusxalashda xato:", error);

    alert("Havolani nusxalab bo‘lmadi.");
  }
}
</script>

<template>
  <main class="invitation-page" :class="`theme-${currentTemplate}`">
    <!-- =====================================================
         TOP BAR
    ====================================================== -->

    <header class="top-bar">
      <button type="button" class="top-button" @click="goBack">
        ← Shablonlar
      </button>

      <div class="top-title">TAKLIFNOMA</div>

      <button type="button" class="top-button" @click="editInvitation">
        ✎ Tahrirlash
      </button>
    </header>

    <!-- =====================================================
         MUSIC BUTTON
    ====================================================== -->

    <button
      v-if="musicUrl"
      type="button"
      class="music-button"
      :class="{ playing: isPlaying }"
      @click="toggleMusic"
      :aria-label="isPlaying ? 'Musiqani to‘xtatish' : 'Musiqani yoqish'"
    >
      <span class="music-icon">
        {{ isPlaying ? "Ⅱ" : "▶" }}
      </span>

      <span class="music-text">
        {{ isPlaying ? "Musiqa ijro etilmoqda" : "Musiqani yoqish" }}
      </span>

      <span v-if="isPlaying" class="music-waves"> ♪ ♫ ♪ </span>
    </button>

    <div v-if="musicError" class="music-error">
      Musiqani ishga tushirish uchun tugmani yana bosing.
    </div>

    <!-- =====================================================
         INVITATION
    ====================================================== -->

    <article class="invitation">
      <!-- ===================================================
           HERO
      ===================================================== -->

      <section class="hero-section">
        <div class="decor decor-one">✦</div>
        <div class="decor decor-two">♡</div>
        <div class="decor decor-three">✦</div>

        <div class="hero-inner">
          <div class="small-title">WEDDING INVITATION</div>

          <div class="welcome-text">Sizni baxtli kunimizga taklif qilamiz</div>

          <!-- PHOTO -->

          <div v-if="mainPhoto" class="main-photo-wrapper">
            <img :src="mainPhoto" alt="Kuyov va kelin" class="main-photo" />
          </div>

          <div v-else class="main-photo-wrapper no-photo">
            <div class="photo-heart">♡</div>
          </div>

          <!-- NAMES -->

          <h1 class="couple-names">
            <span>
              {{ groomName || "Kuyov" }}
            </span>

            <small>&</small>

            <span>
              {{ brideName || "Kelin" }}
            </span>
          </h1>

          <!-- ORNAMENT -->

          <div class="ornament">
            <span></span>
            <b>♡</b>
            <span></span>
          </div>

          <!-- DATE -->

          <div class="date-block">
            <div v-if="weekday" class="weekday">
              {{ weekday }}
            </div>

            <div class="date">
              {{ formattedDate }}
            </div>

            <div v-if="weddingTime" class="time">Soat {{ weddingTime }}</div>
          </div>
        </div>
      </section>

      <!-- ===================================================
           MESSAGE
      ===================================================== -->

      <section v-if="message" class="message-section">
        <div class="section-label">BIZNING TAKLIFIMIZ</div>

        <div class="quote-mark">“</div>

        <p class="message">
          {{ message }}
        </p>

        <div class="quote-mark quote-end">”</div>
      </section>

      <!-- ===================================================
           INFO
      ===================================================== -->

      <section class="info-section">
        <div class="section-label">TO‘Y MA’LUMOTLARI</div>

        <h2 class="section-title">Sizni kutamiz</h2>

        <div class="info-grid">
          <!-- DATE -->

          <div class="info-card">
            <div class="info-icon">♡</div>

            <div class="info-label">SANA</div>

            <div class="info-value">
              {{ formattedDate }}
            </div>

            <div v-if="weekday" class="info-sub">
              {{ weekday }}
            </div>
          </div>

          <!-- TIME -->

          <div class="info-card">
            <div class="info-icon">◷</div>

            <div class="info-label">BOSHLANISH VAQTI</div>

            <div class="info-value">
              {{ weddingTime || "Belgilanmagan" }}
            </div>
          </div>

          <!-- VENUE -->

          <div class="info-card">
            <div class="info-icon">♧</div>

            <div class="info-label">TO‘Y JOYI</div>

            <div class="info-value">
              {{ venueName || "To‘y joyi" }}
            </div>

            <div v-if="address" class="info-sub">
              {{ address }}
            </div>
          </div>
        </div>

        <!-- =================================================
             COUNTDOWN
        ================================================== -->

        <div class="countdown-wrapper">
          <div class="countdown-title">TO‘YIMIZGACHA QOLDI</div>

          <div class="countdown">
            <div class="countdown-item">
              <strong>{{ countdown.days }}</strong>
              <span>Kun</span>
            </div>

            <div class="countdown-item">
              <strong>
                {{ String(countdown.hours).padStart(2, "0") }}
              </strong>
              <span>Soat</span>
            </div>

            <div class="countdown-item">
              <strong>
                {{ String(countdown.minutes).padStart(2, "0") }}
              </strong>
              <span>Daqiqa</span>
            </div>

            <div class="countdown-item">
              <strong>
                {{ String(countdown.seconds).padStart(2, "0") }}
              </strong>
              <span>Soniya</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================
           LOCATION
      ===================================================== -->

      <section
        v-if="venueName || address || googleMapsUrl || yandexMapsUrl"
        class="location-section"
      >
        <div class="section-label">MANZIL</div>

        <h2 class="section-title">To‘y manzili</h2>

        <div class="location-card">
          <div class="location-icon">♧</div>

          <h3>
            {{ venueName || "To‘y o‘tkaziladigan joy" }}
          </h3>

          <p v-if="address">
            {{ address }}
          </p>

          <div v-if="googleMapsUrl || yandexMapsUrl" class="map-buttons">
            <button v-if="googleMapsUrl" type="button" @click="openGoogleMaps">
              📍 Google Maps
              <span>↗</span>
            </button>

            <button v-if="yandexMapsUrl" type="button" @click="openYandexMaps">
              📍 Yandex Maps
              <span>↗</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ===================================================
           CONTACT
      ===================================================== -->

      <section v-if="groomPhone || bridePhone" class="contact-section">
        <div class="section-label">ALOQA</div>

        <h2 class="section-title">Biz bilan bog‘laning</h2>

        <div class="contact-grid">
          <button
            v-if="groomPhone"
            type="button"
            class="contact-card"
            @click="callPhone(groomPhone)"
          >
            <div class="contact-icon">☎</div>

            <div class="contact-role">KUYOV</div>

            <div class="contact-name">
              {{ groomName || "Kuyov" }}
            </div>

            <div class="contact-phone">
              {{ groomPhone }}
            </div>
          </button>

          <button
            v-if="bridePhone"
            type="button"
            class="contact-card"
            @click="callPhone(bridePhone)"
          >
            <div class="contact-icon">☎</div>

            <div class="contact-role">KELIN</div>

            <div class="contact-name">
              {{ brideName || "Kelin" }}
            </div>

            <div class="contact-phone">
              {{ bridePhone }}
            </div>
          </button>
        </div>
      </section>

      <!-- ===================================================
           SOCIAL
      ===================================================== -->

      <section
        v-if="instagramUrl || telegramUrl || facebookUrl || tiktokUrl"
        class="social-section"
      >
        <div class="section-label">IJTIMOIY TARMOQLAR</div>

        <h2 class="section-title">Bizni kuzating</h2>

        <div class="social-list">
          <button
            v-if="instagramUrl"
            type="button"
            @click="openLink(instagramUrl)"
          >
            <span>Instagram</span>
            <b>↗</b>
          </button>

          <button
            v-if="telegramUrl"
            type="button"
            @click="openLink(telegramUrl)"
          >
            <span>Telegram</span>
            <b>↗</b>
          </button>

          <button
            v-if="facebookUrl"
            type="button"
            @click="openLink(facebookUrl)"
          >
            <span>Facebook</span>
            <b>↗</b>
          </button>

          <button v-if="tiktokUrl" type="button" @click="openLink(tiktokUrl)">
            <span>TikTok</span>
            <b>↗</b>
          </button>
        </div>
      </section>

      <!-- ===================================================
           SHARE
      ===================================================== -->

      <section class="sharing-section">
        <div class="section-label">ULASHISH</div>

        <h2 class="section-title">Mehmonlaringizga yuboring</h2>

        <div class="sharing-buttons">
          <button type="button" @click="shareTelegram">Telegram</button>

          <button type="button" @click="shareWhatsApp">WhatsApp</button>

          <button type="button" @click="copyInvitationLink">
            Linkni nusxalash
          </button>
        </div>
      </section>

      <!-- ===================================================
           ENDING
      ===================================================== -->

      <section class="ending-section">
        <div class="ending-heart">♡</div>

        <h2>Sizni kutib qolamiz!</h2>

        <p>Hurmat bilan,</p>

        <div class="ending-names">
          {{ groomName || "Kuyov" }}
          &
          {{ brideName || "Kelin" }}
        </div>

        <div class="template-badge">
          {{ templateName }}
        </div>
      </section>
    </article>

    <!-- =====================================================
         NEW INVITATION
    ====================================================== -->

    <div class="share-panel">
      <button
        type="button"
        class="share-button new-invitation-button"
        @click="createNextInvitation"
      >
        <span>＋</span>
        Yangi taklifnoma yaratish
      </button>
    </div>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.invitation-page {
  min-height: 100vh;
  padding: 0 20px 80px;

  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  transition: background 0.4s, color 0.4s;

  color: #3d332d;
}

.invitation-page h1,
.invitation-page h2,
.invitation-page h3 {
  color: #3d332d;
}

.invitation-page p {
  color: #766c65;
}

/* =========================================================
   TOP BAR
========================================================= */

.top-bar {
  position: sticky;
  top: 0;
  z-index: 50;

  width: 100%;
  max-width: 1050px;

  margin: 0 auto;

  min-height: 65px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  backdrop-filter: blur(15px);

  background: rgba(255, 255, 255, 0.82);

  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.top-button {
  padding: 10px 14px;

  border: 0;
  background: transparent;

  color: #756d67;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.top-button:hover {
  color: #a97045;
}

.top-title {
  color: #8b7a6d;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 4px;
}

/* =========================================================
   MUSIC BUTTON
========================================================= */

.music-button {
  position: fixed;

  right: 25px;
  bottom: 25px;

  z-index: 100;

  min-height: 54px;

  padding: 10px 17px;

  display: flex;
  align-items: center;

  gap: 10px;

  border: 1px solid rgba(180, 123, 80, 0.25);

  border-radius: 30px;

  background: rgba(255, 253, 250, 0.94);

  color: #a97045;

  box-shadow: 0 12px 35px rgba(40, 25, 15, 0.15);

  backdrop-filter: blur(15px);

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.music-button:hover {
  transform: translateY(-3px);

  box-shadow: 0 16px 40px rgba(40, 25, 15, 0.2);
}

.music-button.playing {
  animation: musicPulse 2s infinite;
}

.music-icon {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #a97045;

  color: white;

  font-size: 11px;
  font-weight: 800;
}

.music-text {
  font-size: 11px;
  font-weight: 800;

  letter-spacing: 0.3px;
}

.music-waves {
  font-size: 14px;

  letter-spacing: -3px;

  animation: musicWave 1s infinite alternate;
}

.music-error {
  position: fixed;

  right: 25px;
  bottom: 90px;

  z-index: 100;

  padding: 10px 14px;

  border-radius: 12px;

  background: #fff;

  color: #a44;

  font-size: 11px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

@keyframes musicPulse {
  0%,
  100% {
    box-shadow: 0 12px 35px rgba(40, 25, 15, 0.15);
  }

  50% {
    box-shadow: 0 12px 45px rgba(169, 112, 69, 0.3);
  }
}

@keyframes musicWave {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-3px);
  }
}

/* =========================================================
   INVITATION
========================================================= */

.invitation {
  width: 100%;
  max-width: 900px;

  margin: 25px auto 0;

  overflow: hidden;

  border-radius: 30px;

  background: white;

  box-shadow: 0 30px 100px rgba(40, 25, 15, 0.12);
}

/* =========================================================
   HERO
========================================================= */

.hero-section {
  position: relative;

  min-height: 850px;

  padding: 90px 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
}

.hero-inner {
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 650px;

  text-align: center;
}

.small-title {
  margin-bottom: 18px;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 5px;
}

.welcome-text {
  margin-bottom: 30px;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 18px;
  font-style: italic;

  opacity: 0.75;
}

/* =========================================================
   PHOTO
========================================================= */

.main-photo-wrapper {
  width: 245px;
  height: 245px;

  margin: 0 auto 30px;

  padding: 8px;

  border-radius: 50%;

  background: white;

  box-shadow: 0 20px 60px rgba(50, 30, 20, 0.16);
}

.main-photo {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  border-radius: 50%;
}

.no-photo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-heart {
  font-size: 90px;
  opacity: 0.45;
}

/* =========================================================
   NAMES
========================================================= */

.couple-names {
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-wrap: wrap;

  gap: 12px;

  font-family: Georgia, "Times New Roman", serif;

  font-size: clamp(40px, 7vw, 72px);

  line-height: 1.05;

  font-weight: 400;
}

.couple-names small {
  font-size: 32px;
  font-weight: 400;

  opacity: 0.65;
}

/* =========================================================
   ORNAMENT
========================================================= */

.ornament {
  margin: 28px auto;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 15px;
}

.ornament span {
  width: 70px;
  height: 1px;

  background: currentColor;

  opacity: 0.35;
}

.ornament b {
  font-size: 20px;
  font-weight: 400;
}

/* =========================================================
   DATE
========================================================= */

.date-block {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 5px;
}

.weekday {
  font-size: 11px;
  font-weight: 800;

  letter-spacing: 3px;

  text-transform: uppercase;

  opacity: 0.65;
}

.date {
  font-family: Georgia, "Times New Roman", serif;

  font-size: 27px;
}

.time {
  margin-top: 5px;

  font-size: 14px;
  font-weight: 700;

  letter-spacing: 2px;
}

/* =========================================================
   COUNTDOWN
========================================================= */

.countdown-wrapper {
  width: 100%;
  max-width: 570px;

  margin: 40px auto 0;
}

.countdown-title {
  margin-bottom: 15px;

  text-align: center;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 4px;

  opacity: 0.65;
}

.countdown {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 12px;
}

.countdown-item {
  min-width: 0;

  padding: 18px 10px;

  border: 1px solid rgba(0, 0, 0, 0.08);

  border-radius: 16px;

  background: rgba(255, 255, 255, 0.55);

  backdrop-filter: blur(10px);

  text-align: center;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.countdown-item:hover {
  transform: translateY(-3px);

  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.countdown-item strong {
  display: block;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 32px;

  font-weight: 400;

  line-height: 1;
}

.countdown-item span {
  display: block;

  margin-top: 8px;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 2px;

  opacity: 0.65;
}

/* =========================================================
   DECOR
========================================================= */

.decor {
  position: absolute;
  z-index: 1;

  font-size: 90px;

  opacity: 0.12;
}

.decor-one {
  top: 50px;
  left: 8%;
}

.decor-two {
  right: 7%;
  top: 18%;
}

.decor-three {
  bottom: 50px;
  left: 10%;
}

/* =========================================================
   COMMON SECTIONS
========================================================= */

.message-section,
.info-section,
.location-section,
.contact-section,
.social-section,
.sharing-section,
.ending-section {
  padding: 75px 50px;
}

.section-label {
  margin-bottom: 12px;

  text-align: center;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 4px;

  opacity: 0.65;
}

.section-title {
  margin: 0 0 35px;

  text-align: center;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 40px;

  font-weight: 400;
}

/* =========================================================
   MESSAGE
========================================================= */

.message-section {
  text-align: center;

  border-top: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.quote-mark {
  height: 30px;

  font-family: Georgia, serif;

  font-size: 55px;
  line-height: 1;

  opacity: 0.35;
}

.quote-end {
  margin-top: 5px;
}

.message {
  max-width: 680px;

  margin: 0 auto;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 19px;
  line-height: 1.9;

  white-space: pre-line;
}

/* =========================================================
   INFO
========================================================= */

.info-grid {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 20px;
}

.info-card {
  min-height: 190px;

  padding: 28px 20px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  border: 1px solid rgba(0, 0, 0, 0.08);

  border-radius: 18px;

  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.info-card:hover {
  transform: translateY(-3px);
}

.info-icon {
  margin-bottom: 15px;

  font-size: 28px;
}

.info-label {
  margin-bottom: 9px;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 2px;

  opacity: 0.6;
}

.info-value {
  font-family: Georgia, "Times New Roman", serif;

  font-size: 18px;
  line-height: 1.4;
}

.info-sub {
  margin-top: 7px;

  font-size: 12px;
  line-height: 1.5;

  opacity: 0.65;
}

/* =========================================================
   LOCATION
========================================================= */

.location-section {
  background: rgba(0, 0, 0, 0.025);

  text-align: center;
}

.location-card {
  max-width: 650px;

  margin: 0 auto;

  padding: 40px 30px;

  border-radius: 22px;

  border: 1px solid rgba(0, 0, 0, 0.08);

  background: rgba(255, 255, 255, 0.65);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.location-card:hover {
  transform: translateY(-3px);
}

.location-icon {
  margin-bottom: 15px;

  font-size: 35px;
}

.location-card h3 {
  margin: 0 0 10px;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 26px;
  font-weight: 400;
}

.location-card p {
  max-width: 500px;

  margin: 0 auto;

  font-size: 14px;
  line-height: 1.7;
}

.map-buttons {
  margin-top: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-wrap: wrap;

  gap: 10px;
}

.map-buttons button {
  padding: 13px 18px;

  border: 1px solid currentColor;

  border-radius: 30px;

  background: transparent;

  color: inherit;

  font-size: 12px;
  font-weight: 800;

  cursor: pointer;

  transition: 0.2s;
}

.map-buttons button:hover {
  transform: translateY(-2px);

  background: rgba(0, 0, 0, 0.05);
}

.map-buttons span {
  margin-left: 6px;
}

/* =========================================================
   CONTACT
========================================================= */

.contact-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 20px;

  max-width: 650px;

  margin: 0 auto;
}

.contact-card {
  padding: 30px 20px;

  border: 1px solid rgba(0, 0, 0, 0.08);

  border-radius: 20px;

  background: transparent;

  color: inherit;

  text-align: center;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.contact-card:hover {
  transform: translateY(-4px);

  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

.contact-icon {
  margin-bottom: 12px;

  font-size: 25px;
}

.contact-role {
  margin-bottom: 5px;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 3px;

  opacity: 0.6;
}

.contact-name {
  font-family: Georgia, "Times New Roman", serif;

  font-size: 22px;
}

.contact-phone {
  margin-top: 8px;

  font-size: 13px;

  opacity: 0.65;
}

/* =========================================================
   SOCIAL
========================================================= */

.social-section {
  text-align: center;

  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.social-list {
  max-width: 600px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 12px;
}

.social-list button {
  padding: 17px 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border: 1px solid rgba(0, 0, 0, 0.09);

  border-radius: 14px;

  background: transparent;

  color: inherit;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.social-list button:hover {
  transform: translateY(-2px);

  background: rgba(0, 0, 0, 0.035);
}

.social-list b {
  font-size: 17px;
}

/* =========================================================
   SHARING
========================================================= */

.sharing-section {
  text-align: center;

  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.sharing-buttons {
  display: flex;

  justify-content: center;

  flex-wrap: wrap;

  gap: 10px;
}

.sharing-buttons button {
  padding: 13px 20px;

  border: 1px solid currentColor;

  border-radius: 30px;

  background: transparent;

  color: inherit;

  font-size: 12px;
  font-weight: 800;

  cursor: pointer;

  transition: 0.2s;
}

.sharing-buttons button:hover {
  transform: translateY(-2px);

  background: rgba(0, 0, 0, 0.05);
}

/* =========================================================
   ENDING
========================================================= */

.ending-section {
  text-align: center;

  background: rgba(0, 0, 0, 0.025);
}

.ending-heart {
  margin-bottom: 20px;

  font-size: 55px;
}

.ending-section h2 {
  margin: 0 0 15px;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 42px;

  font-weight: 400;
}

.ending-section p {
  margin: 0 0 8px;

  font-size: 13px;

  opacity: 0.65;
}

.ending-names {
  font-family: Georgia, "Times New Roman", serif;

  font-size: 28px;
}

.template-badge {
  width: fit-content;

  margin: 30px auto 0;

  padding: 8px 14px;

  border: 1px solid currentColor;

  border-radius: 30px;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 2px;

  opacity: 0.55;
}

/* =========================================================
   NEW INVITATION BUTTON
========================================================= */

.share-panel {
  max-width: 900px;

  margin: 20px auto 0;

  text-align: center;
}

.share-button {
  padding: 16px 25px;

  border: 0;

  border-radius: 30px;

  background: #302a26;

  color: white;

  font-size: 13px;
  font-weight: 800;

  cursor: pointer;

  box-shadow: 0 10px 30px rgba(30, 20, 10, 0.18);

  transition: 0.2s;
}

.share-button:hover {
  transform: translateY(-2px);
}

.share-button span {
  margin-right: 8px;
}

/* =========================================================
   ELEGANT
========================================================= */

.theme-elegant {
  color: #46382f;

  background: radial-gradient(
      circle at 10% 5%,
      rgba(205, 163, 125, 0.18),
      transparent 30%
    ),
    linear-gradient(180deg, #faf6f1 0%, #f5eee7 100%);
}

.theme-elegant .invitation {
  background: #fffdfa;
}

.theme-elegant .hero-section {
  background: radial-gradient(
      circle at 50% 35%,
      rgba(255, 255, 255, 0.95),
      transparent 45%
    ),
    linear-gradient(145deg, #fffdf9, #f3e4d5);
}

.theme-elegant .couple-names,
.theme-elegant .section-title,
.theme-elegant .ending-section h2 {
  color: #49382e;
}

.theme-elegant .small-title,
.theme-elegant .section-label,
.theme-elegant .date,
.theme-elegant .info-icon,
.theme-elegant .ending-heart {
  color: #b47b50;
}

.theme-elegant .welcome-text {
  color: #806f61;
}

.theme-elegant .main-photo-wrapper {
  border: 1px solid #dcc2ad;
}

.theme-elegant .info-card,
.theme-elegant .location-card,
.theme-elegant .contact-card {
  background: rgba(255, 250, 245, 0.8);

  border-color: rgba(180, 123, 80, 0.18);
}

.theme-elegant .info-value,
.theme-elegant .location-card h3,
.theme-elegant .contact-name,
.theme-elegant .ending-names {
  color: #49382e;
}

.theme-elegant .info-sub,
.theme-elegant .location-card p,
.theme-elegant .contact-phone {
  color: #887b70;
}

.theme-elegant .countdown-item {
  border-color: rgba(180, 123, 80, 0.22);

  background: rgba(255, 250, 245, 0.72);
}

.theme-elegant .countdown-item strong,
.theme-elegant .countdown-title {
  color: #a97045;
}

/* =========================================================
   ROMANTIC
========================================================= */

.theme-romantic {
  color: #63434a;

  background: radial-gradient(
      circle at 10% 5%,
      rgba(224, 164, 177, 0.22),
      transparent 30%
    ),
    linear-gradient(180deg, #fff9fa 0%, #f9eaed 100%);
}

.theme-romantic .invitation {
  background: #fffdfd;
}

.theme-romantic .hero-section {
  background: radial-gradient(
      circle at 50% 35%,
      rgba(255, 255, 255, 0.9),
      transparent 45%
    ),
    linear-gradient(145deg, #fffafb, #f4dadd);
}

.theme-romantic .couple-names,
.theme-romantic .section-title,
.theme-romantic .ending-section h2 {
  color: #663f47;
}

.theme-romantic .small-title,
.theme-romantic .section-label,
.theme-romantic .date,
.theme-romantic .info-icon,
.theme-romantic .ending-heart {
  color: #b85f73;
}

.theme-romantic .welcome-text {
  color: #8c626b;
}

.theme-romantic .main-photo-wrapper {
  border: 1px solid #dfb5bd;
}

.theme-romantic .info-card,
.theme-romantic .location-card,
.theme-romantic .contact-card {
  background: rgba(255, 247, 249, 0.85);

  border-color: rgba(184, 95, 115, 0.18);
}

.theme-romantic .info-value,
.theme-romantic .location-card h3,
.theme-romantic .contact-name,
.theme-romantic .ending-names {
  color: #673f47;
}

.theme-romantic .info-sub,
.theme-romantic .location-card p,
.theme-romantic .contact-phone {
  color: #92727a;
}

.theme-romantic .countdown-item {
  border-color: rgba(184, 95, 115, 0.2);

  background: rgba(255, 247, 249, 0.8);
}

.theme-romantic .countdown-item strong,
.theme-romantic .countdown-title {
  color: #ad5d70;
}

/* =========================================================
   MINIMAL
========================================================= */

.theme-minimal {
  color: #30302e;

  background: radial-gradient(
      circle at 15% 10%,
      rgba(210, 205, 194, 0.25),
      transparent 30%
    ),
    #f3f2ed;
}

.theme-minimal .invitation {
  background: #fcfcf9;
}

.theme-minimal .hero-section {
  background: #f7f7f3;
}

.theme-minimal .couple-names,
.theme-minimal .section-title,
.theme-minimal .ending-section h2 {
  color: #252525;
}

.theme-minimal .small-title,
.theme-minimal .section-label {
  color: #77736c;
}

.theme-minimal .date,
.theme-minimal .info-icon,
.theme-minimal .ending-heart {
  color: #57554f;
}

.theme-minimal .welcome-text {
  color: #77756f;
}

.theme-minimal .main-photo-wrapper {
  border-radius: 18px;

  padding: 5px;
}

.theme-minimal .main-photo {
  border-radius: 14px;
}

.theme-minimal .couple-names {
  font-family: Arial, Helvetica, sans-serif;

  font-weight: 300;

  letter-spacing: -2px;
}

.theme-minimal .info-card {
  border-radius: 5px;

  background: #fafaf8;
}

.theme-minimal .location-card {
  border-radius: 5px;
}

.theme-minimal .contact-card {
  border-radius: 5px;
}

.theme-minimal .info-value,
.theme-minimal .location-card h3,
.theme-minimal .contact-name,
.theme-minimal .ending-names {
  color: #30302e;
}

.theme-minimal .info-sub,
.theme-minimal .location-card p,
.theme-minimal .contact-phone {
  color: #77756f;
}

.theme-minimal .countdown-item {
  border-color: #deddd7;

  background: rgba(255, 255, 255, 0.7);
}

.theme-minimal .countdown-item strong,
.theme-minimal .countdown-title {
  color: #4f4d48;
}

/* =========================================================
   LUXURY
========================================================= */

.theme-luxury {
  color: #ead8b5;

  background: radial-gradient(
      circle at 50% 0%,
      rgba(184, 145, 75, 0.16),
      transparent 35%
    ),
    #120e0b;
}

.theme-luxury .top-bar {
  background: rgba(23, 18, 15, 0.88);

  border-color: rgba(234, 208, 164, 0.12);
}

.theme-luxury .top-button {
  color: #bfae91;
}

.theme-luxury .top-title {
  color: #c9a76b;
}

.theme-luxury .invitation {
  background: #1d1713;

  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5);
}

.theme-luxury .hero-section {
  background: radial-gradient(
      circle at 50% 35%,
      rgba(104, 77, 44, 0.42),
      transparent 45%
    ),
    linear-gradient(145deg, #34271e, #17110d);
}

.theme-luxury .small-title,
.theme-luxury .section-label {
  color: #d6b47c;
}

.theme-luxury .main-photo-wrapper {
  background: #c9a76b;

  padding: 4px;
}

.theme-luxury .main-photo {
  border: 3px solid #211a16;
}

.theme-luxury .date {
  color: #d6b47c;
}

.theme-luxury .message-section,
.theme-luxury .social-section,
.theme-luxury .sharing-section {
  border-color: rgba(234, 208, 164, 0.12);
}

.theme-luxury .location-section,
.theme-luxury .ending-section {
  background: #191310;
}

.theme-luxury .info-card,
.theme-luxury .location-card,
.theme-luxury .contact-card,
.theme-luxury .social-list button,
.theme-luxury .sharing-buttons button {
  border-color: rgba(234, 208, 164, 0.2);

  background: rgba(255, 255, 255, 0.025);
}

.theme-luxury .info-icon,
.theme-luxury .ending-heart {
  color: #d6b47c;
}

.theme-luxury .couple-names,
.theme-luxury .section-title,
.theme-luxury .ending-section h2 {
  color: #f0d8a8;
}

.theme-luxury .info-value,
.theme-luxury .location-card h3,
.theme-luxury .contact-name,
.theme-luxury .ending-names {
  color: #ead3a3;
}

.theme-luxury .info-sub,
.theme-luxury .location-card p,
.theme-luxury .contact-phone {
  color: #bca989;
}

.theme-luxury .countdown-item {
  border-color: rgba(216, 181, 111, 0.3);

  background: rgba(255, 255, 255, 0.04);
}

.theme-luxury .countdown-item strong,
.theme-luxury .countdown-title {
  color: #d8b56f;
}

.theme-luxury .share-button {
  background: #c9a76b;

  color: #211a16;
}

/* =========================================================
   BUTTON COLORS
========================================================= */

.theme-elegant .sharing-buttons button,
.theme-elegant .map-buttons button {
  color: #a97045;
}

.theme-romantic .sharing-buttons button,
.theme-romantic .map-buttons button {
  color: #ad5d70;
}

.theme-minimal .sharing-buttons button,
.theme-minimal .map-buttons button {
  color: #4f4d48;
}

.theme-luxury .sharing-buttons button,
.theme-luxury .map-buttons button {
  color: #d8b56f;
}

/* =========================================================
   MUSIC COLORS
========================================================= */

.theme-romantic .music-button {
  color: #ad5d70;

  border-color: rgba(173, 93, 112, 0.25);
}

.theme-romantic .music-icon {
  background: #ad5d70;
}

.theme-minimal .music-button {
  color: #4f4d48;

  border-color: rgba(79, 77, 72, 0.2);
}

.theme-minimal .music-icon {
  background: #4f4d48;
}

.theme-luxury .music-button {
  color: #d8b56f;

  background: rgba(30, 23, 18, 0.94);

  border-color: rgba(216, 181, 111, 0.25);
}

.theme-luxury .music-icon {
  background: #c9a76b;

  color: #211a16;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 800px) {
  .invitation-page {
    padding: 0 10px 50px;
  }

  .invitation {
    margin-top: 10px;

    border-radius: 20px;
  }

  .hero-section {
    min-height: 700px;

    padding: 70px 20px;
  }

  .main-photo-wrapper {
    width: 190px;
    height: 190px;
  }

  .couple-names {
    font-size: 42px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .message-section,
  .info-section,
  .location-section,
  .contact-section,
  .social-section,
  .sharing-section,
  .ending-section {
    padding: 55px 22px;
  }

  .section-title {
    font-size: 34px;
  }

  .contact-grid,
  .social-list {
    grid-template-columns: 1fr;
  }

  .countdown {
    gap: 8px;
  }

  .countdown-item {
    padding: 15px 7px;
  }

  .countdown-item strong {
    font-size: 27px;
  }

  .countdown-item span {
    font-size: 8px;
    letter-spacing: 1px;
  }
}

@media (max-width: 500px) {
  .top-bar {
    min-height: 58px;
  }

  .top-button {
    padding: 8px 5px;

    font-size: 11px;
  }

  .top-title {
    font-size: 8px;

    letter-spacing: 2px;
  }

  .music-button {
    right: 15px;
    bottom: 15px;

    min-height: 48px;

    padding: 8px 12px;

    gap: 7px;
  }

  .music-icon {
    width: 27px;
    height: 27px;
  }

  .music-text {
    font-size: 9px;
  }

  .music-waves {
    display: none;
  }

  .music-error {
    right: 15px;
    bottom: 72px;

    max-width: 240px;
  }

  .hero-section {
    min-height: 650px;

    padding: 55px 15px;
  }

  .small-title {
    font-size: 8px;

    letter-spacing: 3px;
  }

  .welcome-text {
    font-size: 15px;
  }

  .main-photo-wrapper {
    width: 165px;
    height: 165px;
  }

  .couple-names {
    font-size: 34px;

    gap: 7px;
  }

  .couple-names small {
    font-size: 20px;
  }

  .date {
    font-size: 23px;
  }

  .section-title {
    font-size: 30px;
  }

  .message {
    font-size: 17px;
  }

  .ending-section h2 {
    font-size: 34px;
  }

  .ending-names {
    font-size: 23px;
  }

  .countdown-wrapper {
    margin-top: 30px;
  }

  .countdown-title {
    font-size: 8px;

    letter-spacing: 2px;
  }

  .countdown {
    gap: 5px;
  }

  .countdown-item {
    padding: 12px 4px;

    border-radius: 12px;
  }

  .countdown-item strong {
    font-size: 23px;
  }

  .countdown-item span {
    margin-top: 6px;

    font-size: 7px;

    letter-spacing: 0.5px;
  }
}
</style>
