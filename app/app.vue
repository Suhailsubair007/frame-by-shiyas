<template>
  <div>
    <!-- Preloader sits above everything, including the layout -->
    <ClientOnly>
      <ThePreloader />
    </ClientOnly>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
