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
      } catch (error) {
        console.error("Taklifnoma LocalStorage'ga saqlanmadi:", error);
      }
    },

    /**
     * LocalStorage'dan yuklash
     */
    load() {
      try {
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
         * Noto‘g‘ri template bo‘lsa
         * elegant ishlatiladi
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
     * Shablonni almashtirish
     */
    setTemplate(template: InvitationTemplate) {
      this.template = template;
      this.save();
    },

    /**
     * Barcha ma'lumotlarni tozalash
     */
    reset() {
      Object.assign(this.$state, {
        ...defaultInvitation,
        gallery: [],
      });

      localStorage.removeItem(STORAGE_KEY);
    },
  },
});
