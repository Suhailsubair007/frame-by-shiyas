<template>
  <div>
    <!-- Preloader sits above everything, including the layout.
         Rendered in SSR so the overlay is in the HTML from the first paint —
         prevents any flash of hero content before the preloader JS loads. -->
    <ThePreloader />

    <!-- One-time prompt shown to mobile visitors after the splash wipes,
         recommending the desktop experience. Non-blocking — both actions dismiss. -->
    <TheMobilePrompt />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
