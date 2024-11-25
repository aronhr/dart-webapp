<script setup>
const emit = defineEmits(['insertScore', 'leaveGame']);

const double = ref(false);
const triple = ref(false);
const availableScores = [25, 20, 19, 18, 17, 16, 15];
const scoresInRows = [
  availableScores.slice(0, 7),
  availableScores.slice(7, 14),
  availableScores.slice(14, 22),
];

const calculateScore = (score) => {
  if (double.value) {
    emit('insertScore', score * 2);
  } else if (triple.value) {
    emit('insertScore', score * 3);
  } else {
    emit('insertScore', score);
  }
  // Reset double and triple
  double.value = false;
  triple.value = false;
};
</script>

<template>
  <div>
    <div v-for="(row, rowIndex) in scoresInRows" :key="'row-' + rowIndex" class="flex justify-center mb-2">
      <button
          v-for="score in row"
          :key="score"
          @click="calculateScore(score)"
          class="btn btn-primary m-1 disable-dbl-tap-zoom"
          :disabled="score === 25 && triple"
      >
        {{ score }}
      </button>
    </div>
    <div class="divider" />
    <div class="flex justify-center">
      <button @click="$emit('insertScore', 0)" class="btn btn-error m-1">
        0
      </button>
      <button
          @click="double = !double"
          class="btn text-white m-1"
          :class="double ? 'btn-success' : 'btn-primary'"
          :disabled="triple"
      >
        Double
      </button>
      <button
          @click="triple = !triple"
          class="btn text-white m-1"
          :class="triple ? 'btn-success' : 'btn-primary'"
          :disabled="double"
      >
        Triple
      </button>
    </div>
    <div class="flex justify-center">
      <button
          @click="emit('leaveGame')"
          class="btn btn-block mt-10 text-white btn-error m-1"
      >
        Leave
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
