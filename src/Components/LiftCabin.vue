<script setup>
import { computed } from 'vue';

const props = defineProps(['liftState', 'movingDirection', 'targetFloor']);

const isDisplayBoardVisible = computed(() => props.liftState.value !== 'available');

const getDirectionArrow = (value) => (value > 0 ? '🡡' : '🡣');
const movingDirection = computed(() => getDirectionArrow(props.movingDirection.value));
</script>

<template>
  <div
    class="lift-cabin"
  >
    <div
      class="lift-display-board"
      v-show="isDisplayBoardVisible"
    >
      {{ `${movingDirection} ${targetFloor.value}` }}
    </div>
  </div>
</template>

<style>
.lift-cabin {
  border-radius: 4%;

  background-color: rgb(164, 173, 164);
}

.lift-display-board {
  position: absolute;

  margin: 2% auto 0 auto;
  padding: 1% 2% 1% 2%;
  left: 0;
  right: 0;

  width: fit-content;
  height: fit-content;

  border-radius: 18%;

  font: inherit;
  color: white;

  background-color: rgb(0, 0, 0, 0.4);

  user-select: none;
}
</style>
