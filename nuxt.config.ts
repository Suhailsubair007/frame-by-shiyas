import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
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
      include: ['gsap', 'gsap/ScrollTrigger', 'gsap/CSSPlugin'],
    },
  },

  nitro: {
    // Ship Brotli + Gzip precompressed copies of every static asset so the host serves
    // them directly instead of compressing per-request — smaller transfers, faster FCP.
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  alias: {
    '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    '@server': fileURLToPath(new URL('./server', import.meta.url)),
  },

  fonts: {
    // Only the weights the design actually uses are requested — Playfair 500/600 and
    // Inter 500 were unused and are dropped to cut font payload. @nuxt/fonts self-hosts
    // each face with `font-display: swap` and injects size-adjust fallback metrics to
    // keep the swap reflow (CLS) near zero.
    families: [
      {
        name: 'Playfair Display',
        provider: 'google',
        weights: [400, 700],
        styles: ['normal', 'italic'],
        subsets: ['latin'],
      },
      {
        name: 'Inter',
        provider: 'google',
        weights: [300, 400],
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

  app: {
    head: {
      htmlAttrs: { lang: 'en-AE' },
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
        // Resource hints — warm TCP+TLS to the media origins before the hero video/poster
        // and reel videos are requested. These MUST match the real domains: the hero
        // streams from cdn.muhmdshiyas.com (previously had no hint at all — a key cause of
        // the poster lingering on slow links) and reels from the R2 bucket. dns-prefetch
        // is the graceful fallback for browsers that cap concurrent preconnects.
        { rel: 'preconnect', href: 'https://cdn.muhmdshiyas.com' },
        { rel: 'preconnect', href: 'https://pub-280c846562404d5fb4b22563df800c7e.r2.dev' },
        { rel: 'dns-prefetch', href: 'https://cdn.muhmdshiyas.com' },
        { rel: 'dns-prefetch', href: 'https://pub-280c846562404d5fb4b22563df800c7e.r2.dev' },
      ],
    },
    pageTransition: false,
    layoutTransition: false,
  },
})
