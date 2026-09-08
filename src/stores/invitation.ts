import { defineStore } from "pinia";

export type InvitationTemplate = "elegant" | "romantic" | "minimal" | "luxury";

export interface Invitation {
  template: InvitationTemplate;

  groomName: string;
  brideName: string;

  mainPhoto: string;
  gallery: string[];

  weddingDate: string;
  weddingTime: string;

  venueName: string;
  address: string;

  message: string;

  googleMapsUrl: string;
  yandexMapsUrl: string;

  groomPhone: string;
  bridePhone: string;

  instagramUrl: string;
  telegramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
}

const STORAGE_KEY = "taklifnoma";
const SESSION_KEY = "taklifnoma_session";

const defaultInvitation: Invitation = {
  template: "elegant",

  groomName: "",
  brideName: "",

  mainPhoto: "",
  gallery: [],

  weddingDate: "",
  weddingTime: "",

  venueName: "",
  address: "",

  message: "",

  googleMapsUrl: "",
  yandexMapsUrl: "",

  groomPhone: "",
  bridePhone: "",

  instagramUrl: "",
  telegramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
};

export const useInvitationStore = defineStore("invitation", {
  state: (): Invitation => ({
    ...defaultInvitation,
    gallery: [],
  }),

  actions: {
    /**
     * LocalStorage'ga saqlash
     */
    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state));

        // Joriy brauzer sessiyasi faol ekanini belgilaymiz
        sessionStorage.setItem(SESSION_KEY, "active");
      } catch (error) {
        console.error("Taklifnoma LocalStorage'ga saqlanmadi:", error);
      }
    },

    /**
     * LocalStorage'dan yuklash
     *
     * Muhim:
     * Agar yangi brauzer sessiyasi boshlangan bo'lsa,
     * eski taklifnomani yuklamaymiz.
     */
    load() {
      try {
        const currentSession = sessionStorage.getItem(SESSION_KEY);

        /**
         * Agar bu yangi sessiya bo'lsa:
         *
         * LocalStorage'dagi eski ma'lumotlarni o'chiramiz.
         */
        if (!currentSession) {
          localStorage.removeItem(STORAGE_KEY);

          Object.assign(this.$state, {
            ...defaultInvitation,
            gallery: [],
          });

          sessionStorage.setItem(SESSION_KEY, "active");

          return;
        }

        /**
         * Shu sessiya ichida F5 bo'lsa,
         * eski ma'lumotlarni qayta yuklaymiz.
         */
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
          return;
        }

        const parsed = JSON.parse(saved);

        if (!parsed || typeof parsed !== "object") {
          return;
        }

        Object.assign(this.$state, {
          ...defaultInvitation,
          ...parsed,

          gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [],
        });

        /**
         * Template tekshirish
         */
        const templates: InvitationTemplate[] = [
          "elegant",
          "romantic",
          "minimal",
          "luxury",
        ];

        if (!templates.includes(this.template)) {
          this.template = "elegant";
        }
      } catch (error) {
        console.error(
          "LocalStorage'dan taklifnomani yuklashda xatolik:",
          error
        );
      }
    },

    /**
     * Template almashtirish
     */
    setTemplate(template: InvitationTemplate) {
      this.template = template;
      this.save();
    },

    /**
     * Yangi taklifnoma
     *
     * Eski ma'lumotlar:
     * - Pinia'dan
     * - LocalStorage'dan
     *
     * to'liq o'chiriladi.
     */
    reset() {
      Object.assign(this.$state, {
        ...defaultInvitation,
        gallery: [],
      });

      localStorage.removeItem(STORAGE_KEY);

      /**
       * Sessiya davom etadi.
       * Yangi forma ochiladi.
       */
      sessionStorage.setItem(SESSION_KEY, "active");
    },
  },
});
