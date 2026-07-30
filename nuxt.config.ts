import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/eslint',
  ],

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    // GSAP ships gsap-core and each plugin (ScrollTrigger, CSSPlugin, …) as separate
    // entry points. Without deduping, Vite can bundle more than one copy of gsap-core,
    // so plugins register on a different instance than the one components import —
    // surfacing as "Missing plugin? gsap.registerPlugin()" on opacity/transform tweens.
    resolve: {
      dedupe: ['gsap'],
    },
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/Flip', 'gsap/Observer', 'gsap/CSSPlugin'],
    },
  },

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  alias: {
    '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    '@server': fileURLToPath(new URL('./server', import.meta.url)),
  },

  fonts: {
    families: [
      {
        name: 'Playfair Display',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal', 'italic'],
        subsets: ['latin'],
      },
      {
        name: 'Inter',
        provider: 'google',
        weights: [300, 400, 500],
        styles: ['normal'],
        subsets: ['latin'],
      },
      {
        name: 'Space Mono',
        provider: 'google',
        weights: [400],
        styles: ['normal'],
        subsets: ['latin'],
      },
    ],
  },

  image: {
    quality: 85,
    format: ['avif', 'webp'],
    screens: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0a0a0a' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
    pageTransition: false,
    layoutTransition: false,
  },
})
