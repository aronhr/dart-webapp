<script setup>
import { computed } from 'vue';

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
});

const currentPlayerName = computed(
    () => props.game.players[props.game.currentPlayerIndex].name
);

const getCurrentThrows = (playerName) => {
  const playerData = props.game.playerData[playerName];
  const scores = playerData.scores;
  const throwsLeft = playerData.throwsLeft;

  // Total throws in a round
  const totalThrows = 3;

  if (currentPlayerName.value === playerName) {
    const throws = Array(totalThrows).fill('-');
    const completedThrowsInRound = totalThrows - throwsLeft;

    for (let i = 0; i < completedThrowsInRound; i++) {
      throws[i] = scores[scores.length - completedThrowsInRound + i] || '-';
    }
    return throws.map((value) => {
      if (value === '-') return value;
      return value.value * value.multiplier;
    });
  }

  // For other players
  const lastThrows = scores.slice(-totalThrows);
  return lastThrows.length === 0
      ? ['-', '-', '-']
      : lastThrows.map((value) => value.value * value.multiplier);
};

const numberOfPlayers = computed(() => props.game.players.length);

const playerCardClasses = computed(() => {
  if (numberOfPlayers.value === 1) {
    return 'w-full';
  } else {
    return 'flex-1';
  }
});


</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div
        class="flex gap-4 min-h-screen text-center justify-center mx-auto w-full"
        :class="{'flex-row': numberOfPlayers > 1, 'flex-col': numberOfPlayers === 1}"
    >
      <div
          v-for="(player, playerName) in game.playerData"
          :key="playerName"
          class="card"
          :class="`${playerName === currentPlayerName ? 'rounded-lg shadow-xl border-pink-500 border-2 border-t-8 ' : '' }` + playerCardClasses"
      >
        <figure>
          <span v-if="playerName === currentPlayerName" class="text-8xl my-12 font-bold inline-grid">
            <span class="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text blur-xl [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] before:content-[attr(data-text)] [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]"
                  aria-hidden="true"
                  :data-text="player.name">
            </span>
            <span class="[&amp;::selection]:text-base-content relative col-start-1 row-start-1 bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
              {{ player.name }}
            </span>
          </span>
          <span v-else class="text-8xl my-12 font-bold">
            {{ player.name }}
          </span>
        </figure>
        <div class="flex flex-col gap-12 justify-around h-full">
          <div class="h-30" />
          <span v-if="playerName === currentPlayerName" class="my-12 font-bold inline-grid dynamic-text">
            <span class="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text blur-xl [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] before:content-[attr(data-text)] [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]"
                  aria-hidden="true"
                  :data-text="player.score">
            </span>
            <span class="[&amp;::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
              {{ player.score }}
            </span>
          </span>
          <span v-else class="dynamic-text my-12 font-bold">
            {{ player.score }}
          </span>
          <div class="flex stats mx-5 bg-pink-500 text-white stats-horizontal shadow">
            <div
                class="stat border-gray-50"
                v-for="(throwValue, index) in getCurrentThrows(playerName)"
                :key="index"
            >
              <div class="stat-value">{{ throwValue }}</div>
            </div>
          </div>
          <div class="flex stats-horizontal shadow">
            <div
                class="stat"
                v-for="(throwValue, index) in getCurrentThrows(playerName)"
                :key="index"
            >
              <div class="stat-value">{{ throwValue }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dynamic-text {
  font-size: clamp(2rem, 15vw, 25rem);
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
}
</style>
