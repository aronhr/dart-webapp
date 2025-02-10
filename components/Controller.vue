<script setup>
import { socket } from "./socket";
import { QrCodeIcon } from "@heroicons/vue/24/outline";
import { QrcodeStream } from 'vue-qrcode-reader'
import GameCard from "~/components/GameCard.vue";
import StandardController from "~/components/Controllers/StandardController.vue";

const route = useRoute();

const sessionId = ref(route.query.sessionId ?? '');
const connected = ref(false);
const gameType = ref('');
const availableGames = ['301', '501', 'Cricket', 'Around the Clock', 'Chugit', 'x', 'x', 'x', 'x'];
const players = ref([]);
const player = ref('');
const game = ref(null);

useHead({
  title: "Dart Scoreboard | Controller",
  meta: [
    {
      name: "description",
      content: "A fun dart scoreboard for your next game night."
    }
  ]
});

const handleConnect = () => {
  if (sessionId.value.trim()) {
    connected.value = true;
    socket.emit('joinSession', { sessionId: sessionId.value, role: 'controller' });
  } else {
    alert('Please enter a valid session ID.');
  }
};

const handleAddPlayer = () => {
  if (!player.value.trim()) {
    alert('Player name cannot be empty.');
    return;
  }

  const name = player.value.trim();
  const randomColor = Math.floor(Math.random()*16777215).toString(16);

  const playerObj = {
    name: name,
    initials: name.slice(0, 2).toUpperCase(),
    color: `#${randomColor}`
  };

  players.value.push(playerObj);
  socket.emit('playerJoined', { sessionId: sessionId.value, player: playerObj });
  player.value = '';
};

const handleGameSelected = (game) => {
  gameType.value = game;

  socket.emit('gameSelected', {
    sessionId: sessionId.value,
    gameType: gameType.value
  });
};

const handleStartGame = () => {
  if (!gameType.value) {
    alert('Please select a game type.');
    return;
  }

  if (players.value.length < 1) {
    alert('You need at least one player to start the game.');
    return;
  }

  socket.emit('startGame', {
    sessionId: sessionId.value
  });
};

const handleScore = (score, multiply) => {
  console.log(score, multiply);
  console.log(game.value);
  socket.emit('scoreUpdate', {
    dart: {
      value: score,
      multiplier: multiply,
    },
  });
};

const handleUndo = () => {
  socket.emit('undo', { sessionId: sessionId.value });
};

const handleLeaveGame = () => {
  socket.emit('leaveGame', { sessionId: sessionId.value });
};

socket.on('gameStarted', (gameData) => {
  console.log(gameData);
  game.value = gameData
});

socket.on('gameStateUpdate', (updatedGame) => {
  game.value = updatedGame
});

socket.on('gameOver', (data) => {
  alert(`${data.winner} has won the game!`);
  game.value = null;
});

socket.on('gameReset', () => {
  game.value = null;
});

socket.on('gameState', (gameState) => {
  console.log('gameState:', gameState);
  gameType.value = gameState.gameType;
  players.value = gameState.players;
  game.value = gameState.game;
});

socket.on('error', (data) => alert(`Error: ${data.message}`));


onBeforeUnmount(() => {
  socket.off('gameStarted');
  socket.off('gameStateUpdate');
  socket.off('gameOver');
  socket.off('gameReset');
  socket.off('error');
});

const qrReader = ref(false);

const onDetect = (result) => {
  if (result) {
    sessionId.value = result;
    handleConnect();
  }
  qrReader.value = false;
};

</script>

<template>
  <div>
    <div v-if="!connected">
      <div class="hero bg-base-200 min-h-screen">
        <div class="hero-content text-center">
          <div class="">
            <span class="text-6xl mb-10 font-bold inline-grid">
              <span class="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text blur-xl [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] before:content-[attr(data-text)] [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]"
                    aria-hidden="true"
                    data-text="Connect to Display">
              </span>
              <span class="[&amp;::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
                Connect to Display
              </span>
            </span>
            <p v-if="!sessionId" class="py-3">
              <button class="btn btn-primary" @click="qrReader = !qrReader"><QrCodeIcon class="h-10 text-white" /></button>
              <qrcode-stream v-if="qrReader" @detect="onDetect"></qrcode-stream>
            </p>
            <div v-if="!sessionId" class="divider">OR</div>
            <p class="py-3 flex justify-center join">
              <label class="join-item input input-bordered flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-4 w-4 opacity-70">
                  <path
                      fill-rule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clip-rule="evenodd" />
                </svg>
                <input v-model="sessionId" type="text" class="grow" placeholder="Session ID" />
              </label>
              <button class="join-item btn btn-primary text-white" @click="handleConnect">Connect!</button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!game">
      <div class="hero bg-base-200 min-h-screen">
        <div class="hero-content text-center">
          <div class="">
            <span class="text-6xl mb-10 font-bold inline-grid">
              <span class="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text blur-xl [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] before:content-[attr(data-text)] [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]"
                    aria-hidden="true"
                    data-text="Players">
              </span>
              <span class="[&amp;::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
                Players
              </span>
            </span>
            <p class="py-3">
              <div v-for="(player, index) in players" :key="index" class="avatar placeholder ml-1">
                <div :style="'background:' + player.color" class="text-white w-16 rounded-full">
                  <span class="text-xl">{{ player.initials }}</span>
                </div>
              </div>
            </p>
            <p class="py-3 flex justify-center join">
              <label class="join-item input input-bordered flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-4 w-4 opacity-70">
                  <path
                      d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input v-model="player" type="text" class="grow" placeholder="Player name" />
              </label>
              <button class="join-item btn btn-primary text-white" @click="handleAddPlayer">Add Player!</button>
            </p>
            <div v-if="players.length > 0" class="py-6">
              <div class="carousel rounded-box">
                <div v-for="game in availableGames" :key="game" class="carousel-item rounded-box max-w-md space-x-4 p-4 overflow-hidden">
                  <GameCard :game="game" @game-selected="handleGameSelected" />
                </div>
              </div>
              <button v-if="gameType" class="btn btn-primary" @click="handleStartGame">Start Game</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <StandardController
          :availableScores="game.availableScores"
          :players="game.currentPlayer"
          @insert-score="handleScore"
          @leave-game="handleLeaveGame"
          @undo="handleUndo"
      />
    </div>
  </div>
</template>
