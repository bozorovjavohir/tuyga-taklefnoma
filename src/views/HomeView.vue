<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function createInvitation() {
  router.push("/create");
}

function openTemplates() {
  router.push("/templates");
}
</script>

<template>
  <main class="home-page">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <div class="eyebrow">TAKLIFNOMA.UZ</div>

        <h1>
          Sevgi hikoyangizni
          <span>taklifnomaga aylantiring</span>
        </h1>

        <p class="hero-text">
          To‘yingiz uchun nafis va zamonaviy elektron taklifnoma yarating.
          Ma’lumotlaringizni kiriting, dizayn tanlang va tayyor taklifnomani
          ko‘ring.
        </p>

        <div class="hero-buttons">
          <button
            type="button"
            class="primary-button"
            @click="createInvitation"
          >
            Taklifnoma yaratish
            <span>→</span>
          </button>

          <button type="button" class="secondary-button" @click="openTemplates">
            Shablonlarni ko‘rish
          </button>
        </div>
      </div>

      <!-- DECORATIVE INVITATION PREVIEW -->
      <div class="hero-preview">
        <div class="invitation-card">
          <div class="card-top">
            <span>WEDDING</span>
            <span>INVITATION</span>
          </div>

          <div class="heart">♥</div>

          <div class="card-label">BIZNING TO‘YIMIZ</div>

          <h2>
            Azim
            <span>&</span>
            Jasmina
          </h2>

          <div class="card-line"></div>

          <div class="card-date">20 · 09 · 2026</div>

          <p>Sizni hayotimizdagi eng baxtli kunimizga taklif qilamiz.</p>

          <div class="card-place">
            <strong>Nikoh marosimi</strong>
            <span>Toshkent shahri</span>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="features">
      <div class="section-heading">
        <div class="eyebrow">QANDAY ISHLAYDI?</div>

        <h2>
          Bir necha qadamda
          <span>tayyor taklifnoma</span>
        </h2>

        <p>Hech qanday murakkab sozlamalar kerak emas.</p>
      </div>

      <div class="steps">
        <article class="step">
          <div class="step-number">01</div>

          <h3>Ma’lumotlarni kiriting</h3>

          <p>Kuyov-kelin ismi, sana, joy va boshqa ma’lumotlarni kiriting.</p>
        </article>

        <article class="step">
          <div class="step-number">02</div>

          <h3>Dizayn tanlang</h3>

          <p>
            Elegant, Romantic, Minimal yoki Luxury uslublaridan birini tanlang.
          </p>
        </article>

        <article class="step">
          <div class="step-number">03</div>

          <h3>Taklifnomani ko‘ring</h3>

          <p>Tayyor elektron taklifnomangizni darhol ko‘ring.</p>
        </article>
      </div>
    </section>

    <!-- CTA -->
    <section class="bottom-cta">
      <div>
        <div class="eyebrow">BOSHLASHGA TAYYORMISIZ?</div>

        <h2>
          To‘yingiz uchun
          <span>chiroyli taklifnoma yarating.</span>
        </h2>
      </div>

      <button type="button" class="primary-button" @click="createInvitation">
        Taklifnoma yaratish
        <span>→</span>
      </button>
    </section>
  </main>
</template>

<style scoped>
/* =========================================
   PAGE
========================================= */

.home-page {
  min-height: 100vh;

  background: radial-gradient(
      circle at 15% 10%,
      rgba(197, 139, 91, 0.13),
      transparent 32%
    ),
    radial-gradient(
      circle at 90% 45%,
      rgba(197, 139, 91, 0.08),
      transparent 30%
    ),
    #faf8f5;

  color: #302a26;
}

/* =========================================
   HERO
========================================= */

.hero {
  width: min(1200px, calc(100% - 48px));

  min-height: 700px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: 1.05fr 0.95fr;

  align-items: center;

  gap: 70px;
}

.hero-content {
  padding: 70px 0;
}

.eyebrow {
  margin-bottom: 20px;

  color: #b57b50;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 4px;
}

.hero h1 {
  margin: 0;

  max-width: 700px;

  font-family: Georgia, "Times New Roman", serif;

  font-size: clamp(48px, 6vw, 76px);

  line-height: 1.02;

  font-weight: 400;

  letter-spacing: -2px;

  color: #292522;
}

.hero h1 span {
  display: block;

  color: #b57b50;
}

.hero-text {
  max-width: 600px;

  margin: 30px 0 0;

  color: #817a74;

  font-size: 16px;

  line-height: 1.8;
}

/* =========================================
   BUTTONS
========================================= */

.hero-buttons {
  display: flex;

  align-items: center;

  gap: 15px;

  margin-top: 35px;
}

.primary-button {
  border: 0;

  padding: 17px 25px;

  border-radius: 13px;

  background: linear-gradient(135deg, #c58b5b, #a97045);

  color: white;

  font-size: 14px;

  font-weight: 800;

  cursor: pointer;

  box-shadow: 0 12px 25px rgba(165, 105, 65, 0.2);

  transition: transform 0.2s, box-shadow 0.2s;
}

.primary-button:hover {
  transform: translateY(-2px);

  box-shadow: 0 16px 32px rgba(165, 105, 65, 0.28);
}

.primary-button span {
  margin-left: 12px;

  font-size: 18px;
}

.secondary-button {
  padding: 16px 23px;

  border: 1px solid #d9cec4;

  border-radius: 13px;

  background: rgba(255, 255, 255, 0.7);

  color: #665c55;

  font-size: 14px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.secondary-button:hover {
  border-color: #b57b50;

  color: #b57b50;

  transform: translateY(-2px);
}

/* =========================================
   INVITATION PREVIEW
========================================= */

.hero-preview {
  display: flex;

  justify-content: center;

  align-items: center;
}

.invitation-card {
  position: relative;

  width: 340px;

  min-height: 520px;

  box-sizing: border-box;

  padding: 55px 35px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  background: linear-gradient(145deg, #fffefc, #f5e9dd);

  border: 1px solid #eaded3;

  box-shadow: 0 35px 80px rgba(70, 45, 25, 0.14);

  transform: rotate(2deg);

  transition: transform 0.4s;
}

.invitation-card:hover {
  transform: rotate(0deg) translateY(-5px);
}

.invitation-card::before {
  content: "";

  position: absolute;

  inset: 12px;

  border: 1px solid rgba(181, 123, 80, 0.3);

  pointer-events: none;
}

.card-top {
  display: flex;

  flex-direction: column;

  gap: 4px;

  margin-bottom: 35px;

  color: #b57b50;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 4px;
}

.heart {
  margin-bottom: 18px;

  color: #c58b5b;

  font-size: 42px;
}

.card-label {
  color: #8d8178;

  font-size: 9px;

  letter-spacing: 3px;
}

.invitation-card h2 {
  margin: 12px 0 15px;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 37px;

  font-weight: 400;

  color: #3b3029;
}

.invitation-card h2 span {
  margin: 0 7px;

  color: #b57b50;

  font-size: 25px;
}

.card-line {
  width: 55px;

  height: 1px;

  margin-bottom: 20px;

  background: #b57b50;
}

.card-date {
  color: #9c7455;

  font-size: 12px;

  font-weight: 800;

  letter-spacing: 3px;
}

.invitation-card p {
  max-width: 230px;

  margin: 20px 0;

  color: #857b74;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 13px;

  line-height: 1.7;
}

.card-place {
  display: flex;

  flex-direction: column;

  gap: 6px;

  margin-top: 20px;

  color: #84766b;

  font-size: 10px;

  letter-spacing: 1px;
}

.card-place strong {
  color: #5e4c3f;

  font-size: 9px;

  letter-spacing: 2px;
}

/* =========================================
   FEATURES
========================================= */

.features {
  width: min(1150px, calc(100% - 48px));

  margin: 0 auto;

  padding: 100px 0;
}

.section-heading {
  text-align: center;
}

.section-heading h2 {
  margin: 0;

  font-family: Georgia, "Times New Roman", serif;

  font-size: clamp(36px, 5vw, 54px);

  font-weight: 400;
}

.section-heading h2 span {
  color: #b57b50;
}

.section-heading p {
  margin: 18px 0 0;

  color: #8b837d;

  font-size: 15px;
}

.steps {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 25px;

  margin-top: 55px;
}

.step {
  padding: 30px;

  background: rgba(255, 255, 255, 0.75);

  border: 1px solid #eee4dc;

  border-radius: 20px;

  transition: 0.25s;
}

.step:hover {
  transform: translateY(-5px);

  box-shadow: 0 20px 45px rgba(70, 45, 25, 0.08);
}

.step-number {
  width: 45px;

  height: 45px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 25px;

  border-radius: 50%;

  background: #f7e9dd;

  color: #b57b50;

  font-size: 12px;

  font-weight: 800;
}

.step h3 {
  margin: 0 0 10px;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 21px;

  font-weight: 400;
}

.step p {
  margin: 0;

  color: #8c837c;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================================
   CTA
========================================= */

.bottom-cta {
  width: min(1150px, calc(100% - 48px));

  margin: 0 auto 70px;

  padding: 45px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 30px;

  border-radius: 25px;

  background: linear-gradient(135deg, #fffaf5, #f5e6d9);

  border: 1px solid #eadbd0;
}

.bottom-cta .eyebrow {
  margin-bottom: 10px;
}

.bottom-cta h2 {
  margin: 0;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 34px;

  font-weight: 400;

  line-height: 1.2;
}

.bottom-cta h2 span {
  color: #b57b50;
}

/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;

    gap: 20px;

    padding: 50px 0 80px;

    text-align: center;
  }

  .hero-content {
    padding: 20px 0;
  }

  .hero-text {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-buttons {
    justify-content: center;

    flex-wrap: wrap;
  }

  .steps {
    grid-template-columns: 1fr;
  }

  .bottom-cta {
    flex-direction: column;

    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .hero,
  .features,
  .bottom-cta {
    width: min(100% - 30px, 1150px);
  }

  .hero {
    min-height: auto;
  }

  .hero h1 {
    font-size: 45px;

    letter-spacing: -1px;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }

  .invitation-card {
    width: 300px;

    min-height: 470px;
  }

  .invitation-card h2 {
    font-size: 32px;
  }

  .features {
    padding: 60px 0;
  }

  .bottom-cta {
    padding: 30px 25px;
  }

  .bottom-cta h2 {
    font-size: 28px;
  }
}
</style>
