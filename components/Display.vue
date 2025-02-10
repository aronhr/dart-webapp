<script setup>
import QRCode from "qrcode.vue";
import { socket } from "./socket";
import Standard from "~/components/Games/Standard.vue";

const sessionId = ref("");
const game = ref(null);
const gameType = ref('');
const controllerConnected = ref(false);
const players = ref([]);

// Array of dart app names
const dartAppNames = ref([
  "Bullseye Buddy",
  "Dart Vader",
  "180° Zone",
  "Flight Club",
  "Aim High",
  "Dart Dynasty",
  "Throw & Glow",
  "SharpShooter",
  "Dartsy",
  "Hit & Giggle"
]);
// Array of funny slogans
const dartAppSlogans = ref([
  "Because missing is not an option (but it happens).",
  "Where every throw's a gamble and every game's a laugh.",
  "180 reasons to miss the board.",
  "Aim small, miss big.",
  "For players who excel at excuses.",
  "When life throws darts, we keep score.",
  "Less math, more banter.",
  "Hit it or quit it.",
  "Serious darts, silly players.",
  "Because scoring’s more fun than arguing."
]);
const randomDartAppName = ref(dartAppNames.value[Math.floor(Math.random() * dartAppNames.value.length)]);
const randomDartAppSlogan = ref(dartAppSlogans.value[Math.floor(Math.random() * dartAppSlogans.value.length)]);

useHead({
  title: "Dart Scoreboard | Display",
  meta: [
    {
      name: "description",
      content: "A fun dart scoreboard for your next game night."
    }
  ]
});

const generateSessionId = () => Math.random().toString(36).substr(2, 5);

const generateRandomPosition = () => ({
  top: `${Math.random() * 80}%`,
  left: `${Math.random() * 80}%`,
});

const handleControllerJoined = (isControllerConnected) => {
  console.log(isControllerConnected);
  controllerConnected.value = isControllerConnected;
};

const handleGameStarted = (gameData) => {
  console.log('gameStarted:', gameData);
  game.value = gameData;
};

const handleGameStateUpdate = (updatedGame) => {
  console.log(updatedGame);
  game.value = updatedGame;
};

const handlePlayerJoined = (player) => {
  console.log(player);
  players.value.push(player);
};

const handleGameSelected = (selectedGame) => {
  console.log(selectedGame);
  gameType.value = selectedGame;
  randomDartAppSlogan.value = dartAppSlogans.value[Math.floor(Math.random() * dartAppSlogans.value.length)];
};

const handleGameOver = () => {
  game.value = null;
  gameType.value = '';
};

onMounted(() => {
  sessionId.value = generateSessionId();
  socket.emit("joinSession", { sessionId: sessionId.value, role: "display" });
});

socket.on("gameStarted", handleGameStarted);
socket.on("gameStateUpdate", handleGameStateUpdate);
socket.on("gameOver", handleGameOver);
socket.on("gameSelected", handleGameSelected);
socket.on("playerJoined", handlePlayerJoined);
socket.on("controllerJoined", handleControllerJoined);
socket.on('gameReset', () => {
  game.value = null;
  gameType.value = '';
});

socket.on('gameState', (gameState) => {
  console.log('gameState:', gameState);
  gameType.value = gameState.gameType;
  players.value = gameState.players;
  game.value = gameState.game;
});

onUnmounted(() => {
  socket.off("gameStarted", handleGameStarted);
  socket.off("gameStateUpdate", handleGameStateUpdate);
  socket.off("playerJoined", handlePlayerJoined);
});

const host = () => `${window.location.origin}/controller?sessionId=${sessionId.value}`;

</script>

<template>
  <div>
    <div v-if="!game" class="hero bg-base-200 min-h-screen">
      <div class="hero-content text-center">
        <div class="">
          <span class="text-9xl mb-10 font-bold inline-grid">
            <span class="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text blur-xl [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] before:content-[attr(data-text)] [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]"
                  aria-hidden="true"
                  :data-text="gameType ? gameType : randomDartAppName">
            </span>
            <span class="[&amp;::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
              {{ gameType ? gameType : randomDartAppName }}
            </span>
          </span>
          <h2 class="text-7xl font-bold">{{ randomDartAppSlogan }}</h2>
          <p class="py-6 flex justify-center">
            <div v-if="controllerConnected">
              <p>Controller is connected!</p>
              <div v-for="(player, index) in players" :key="index" class="mt-3 avatar placeholder ml-1">
                <div :style="'background:' + player.color" class="text-neutral-content w-16 rounded-full">
                  <span class="text-xl">{{ player.initials }}</span>
                </div>
              </div>
              <GameCard v-if="gameType" :game="gameType" class="mt-5" />
            </div>
            <div v-else>
              <QRCode background="#191E24" foreground="#A6ADBB" render-as="svg" :value="host()" :size="300" level="H"/>
              <p class="text-2xl">Session ID: {{ sessionId }}</p>
            </div>
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      <Standard :game="game" />
    </div>
  </div>
</template>
