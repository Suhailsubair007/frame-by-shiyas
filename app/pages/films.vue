<script setup lang="ts">
import { REELS } from '@shared/constants/REELS'
import { FILMS } from '@shared/constants/FILMS'
import { META } from '@shared/constants/META'
import type { VIDEO_TAB } from '@shared/constants/VIDEO_FILTERS'

definePageMeta({ layout: 'default' })

const activeTab = ref<VIDEO_TAB>('all')

function onTabChange(tab: VIDEO_TAB): void {
  activeTab.value = tab
}

const showLandscape = computed(() => activeTab.value === 'all' || activeTab.value === 'landscape')
const showReels = computed(() => activeTab.value === 'all' || activeTab.value === 'reels')

useSeoMeta({
  title: `Films & Reels — ${META.SITE_NAME}`,
  description: 'The full film and reel archive by Muhammed Shiyas — landscape films and short-form reels from Sharjah, UAE.',
})
</script>

<template>
  <main class="min-h-screen bg-void pb-24 md:pb-36">
    <PageIntro
      eyebrow="Archive — Motion"
      title="Films"
      emphasis="& Reels."
    />

    <!-- Type filter -->
    <div class="mt-12 px-6 md:mt-16 md:px-10">
      <VideoFilter
        :active="activeTab"
        @change="onTabChange"
      />
    </div>

    <!-- Landscape films -->
    <section v-if="showLandscape" class="mt-10 px-6 md:mt-14 md:px-10">
      <h2
        v-if="activeTab === 'all'"
        class="mb-6 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint"
      >
        Landscape
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <VideoTile
          v-for="film in FILMS"
          :key="film.id"
          :src="film.videoUrl"
          :title="film.title"
          :zoom="film.zoom"
          orientation="landscape"
        />
      </div>
    </section>

    <!-- Reels -->
    <section v-if="showReels" class="mt-14 px-6 md:mt-20 md:px-10">
      <h2
        v-if="activeTab === 'all'"
        class="mb-6 font-mono text-[9px] uppercase tracking-[0.3em] text-text-faint"
      >
        Reels
      </h2>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        <VideoTile
          v-for="reel in REELS"
          :key="reel.id"
          :src="reel.videoUrl"
          :title="reel.title"
          orientation="portrait"
        />
      </div>
    </section>
  </main>
</template>
