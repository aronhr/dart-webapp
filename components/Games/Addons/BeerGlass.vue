<template>
  <div class="beer-glass">
    <div class="beer" :style="{ height: beerHeight + '%' }"></div>
    <div class="foam" v-if="level > 0"></div>
  </div>
</template>

<script setup>
// Props for max level and current level
const props = defineProps({
  maxLevel: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
});

// Reactive computation for the beer height
const beerHeight = computed(() => {
  // Calculate the percentage height of the beer
  const percentage = (props.level / props.maxLevel) * 100;
  return Math.max(0, Math.min(percentage, 100)); // Ensure value is between 0 and 100
});
</script>

<style scoped>
.beer-glass {
  width: 100px;
  height: 200px;
  border: 2px solid #000;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background: #fff;
}

.beer {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top, #ffcc00, #ffee99);
  transition: height 0.5s ease-in-out;
}

.foam {
  position: absolute;
  top: 0;
  width: 100%;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  animation: foam-bubbles 2s infinite ease-in-out;
}

@keyframes foam-bubbles {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>
