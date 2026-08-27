export type InvitationTemplate = "elegant" | "romantic" | "minimal" | "luxury";

export interface Invitation {
  groomName: string;
  brideName: string;

  mainPhoto: string;
  gallery: string[];

  weddingDate: string;
  weddingTime: string;

  message: string;

  venueName: string;
  address: string;

  googleMapsUrl: string;
  yandexMapsUrl: string;

  groomPhone: string;
  bridePhone: string;

  instagramUrl: string;
  telegramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;

  template: InvitationTemplate;
}
