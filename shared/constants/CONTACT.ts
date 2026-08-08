import { META } from '@shared/constants/META'

export const CONTACT = {
  EMAIL:    META.EMAIL,

  // Phone — same number for calls and WhatsApp.
  // PHONE_DISPLAY is shown to users; PHONE_TEL feeds the tel: dialer link
  // (E.164, no spaces); WHATSAPP is the wa.me path (country code + number, no +).
  PHONE_DISPLAY: '+971 56 473 0503',
  PHONE_TEL:     '+971564730503',
  WHATSAPP:      '971564730503',

  HEADING_TOP:  "Let's Work",
  HEADING_FOOT: 'Together.',
  TAGLINE:  'Available for advertising campaigns, weddings, corporate productions, and social media content across the UAE and beyond.',

  SOCIALS: [
    { label: 'Instagram', url: 'https://www.instagram.com/muhmdshiyas/?hl=en' },
  ],
} as const
