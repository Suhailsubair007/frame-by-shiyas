<template>
  <div>
    <!-- Preloader sits above everything, including the layout.
         Rendered in SSR so the overlay is in the HTML from the first paint —
         prevents any flash of hero content before the preloader JS loads. -->
    <ThePreloader />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
