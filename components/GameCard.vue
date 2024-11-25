<script setup lang="ts">
defineEmits(['gameSelected'])

const props = defineProps({
  game: {
    type: String,
    required: true
  }
})

// If Game is x then get correct image
const gameImage = computed(() => {
  if (props.game === '301') {
    return 'images/301.webp'
  } else if (props.game === '501') {
    return 'images/501.webp'
  } else if (props.game === 'Cricket') {
    return 'images/cricet.webp'
  } else if (props.game === 'Around the Clock') {
    return 'images/aroundTheWorld.webp'
  } else if (props.game === 'Chugit') {
    return 'images/chugit.webp'
  } else {
    return 'images/501.webp'
  }
})
</script>

<template>
  <div @click="$emit('gameSelected', game)">
    <img
        class="w-80"
        :src="gameImage"
        :alt="game" />
    <p> {{ game }} </p>
  </div>

</template>

<style scoped>

</style>
