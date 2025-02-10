
<script setup>
const emit = defineEmits(['insertScore', 'leaveGame', 'undo']);

const props = defineProps({
  player: {
    type: Object,
    required: false,
  },
  availableScores: {
    type: Array,
    required: true,
  }
});

const double = ref(false);
const triple = ref(false);
const scoresInRows = [
  props.availableScores.slice(0, 7),
  props.availableScores.slice(7, 14),
  props.availableScores.slice(14, 22),
];

const calculateScore = (value) => {

  const multiplier = double.value ? 2 : triple.value ? 3 : 1;
  emit('insertScore', value, multiplier);

  // Reset double and triple
  double.value = false;
  triple.value = false;
};

</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="mx-auto">
      <div class="score-input">
        <div v-for="(row, index) in scoresInRows" :key="index" class="score-row">
          <button
              v-for="score in row"
              :key="score"
              @click="calculateScore(score)"
              :disabled="score === 25 && triple"
              class="btn btn-primary btn-keypad text-white score-button"
          >
            {{ score }}
          </button>
        </div>
      </div>
      <div class="text-center mb-6">
        <button
            @click="calculateScore(0)"
            class="btn btn-keypad mr-2 text-white btn-primary"
        >
          0
        </button>
        <button
            @click="double = !double"
            class="btn btn-keypad mr-2 text-white"
            :class="` ${double ? 'btn-success' : 'btn-primary'}`"
            :disabled="triple"
        >
          Double
        </button>
        <button
            @click="triple = !triple"
            class="btn btn-keypad mr-2 text-white"
            :class="` ${triple ? 'btn-success' : 'btn-primary'}`"
            :disabled="double"
        >
          Triple
        </button>
      </div>
      <button @click="$emit('undo')" class="btn btn-warning btn-block text-white leave-game-button mb-3">Undo</button>
      <button @click="$emit('leaveGame')" class="btn btn-error btn-block text-white leave-game-button">Leave Game</button>
    </div>
  </div>
</template>

<style scoped>
.score-input {
  margin: 1rem 0;
}
.score-row {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
}
.score-button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
}
button.active {
  background-color: lightblue;
}

.btn-keypad {
  width: 8rem;
  height: 8rem;
  font-size: 1.5rem;
  border-radius: 0.5rem;
}

</style>
