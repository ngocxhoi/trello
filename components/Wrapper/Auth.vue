<template>
  <div class="grid lg:grid-cols-2 h-screen w-full bg-transparent">
    <div
      class="left place-self-center w-full px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-52"
    >
      <div class="header text-center mb-6">
        <div class="flex justify-center">
          <Logo />
        </div>

        <!-- Form -->
        <slot />
      </div>
    </div>

    <div class="right hidden lg:block"></div>
  </div>
</template>

<script setup></script>

<style scoped>
.right {
  background: linear-gradient(-45deg, #22c55e, #10b981, #84cc16, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
