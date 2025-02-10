<script setup lang="ts">

import QRCode from "qrcode.vue";
</script>

<template>

  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
      <div class="">
        <span class="text-9xl mb-10 font-bold inline-grid">
          <span class="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text blur-xl [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] before:content-[attr(data-text)] [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]"
                aria-hidden="true"
                data-text="The dart game">
          </span>
          <span class="[&amp;::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
            The dart game
          </span>
        </span>
        <p class="py-6 flex justify-center">
          <nuxt-link to="/display">
            <button class="btn btn-primary text-white">Display</button>
          </nuxt-link>
          <nuxt-link to="/controller">
            <button class="btn btn-primary text-white">Controller</button>
          </nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
