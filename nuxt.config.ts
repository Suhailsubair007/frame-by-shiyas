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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    pageTransition: false,
    layoutTransition: false,
  },
})
