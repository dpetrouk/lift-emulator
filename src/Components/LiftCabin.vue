<script setup>
import { computed } from 'vue';

const props = defineProps(['liftState', 'movingDirection', 'targetFloor']);

const isDisplayBoardVisible = computed(() => props.liftState.value !== 'available');

const isLiftCabinMovingUp = computed(() => props.movingDirection.value === 1);
</script>

<template>
  <div
    class="lift-cabin"
  >
    <div
      class="lift-display-board"
      v-show="isDisplayBoardVisible"
    >
      <span v-if="isLiftCabinMovingUp">
        <svg xmlns="http://www.w3.org/2000/svg" class="moving-direction" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="18" y1="11" x2="12" y2="5"></line>
          <line x1="6" y1="11" x2="12" y2="5"></line>
        </svg>
      </span>
      <span v-else>
        <svg xmlns="http://www.w3.org/2000/svg" class="moving-direction" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="18" y1="13" x2="12" y2="19"></line>
          <line x1="6" y1="13" x2="12" y2="19"></line>
        </svg>
      </span>
      <span class="target-floor">{{ targetFloor.value }}</span>
    </div>
  </div>
</template>

<style>
.lift-cabin {
  border-style: double;
  border-radius: 4%;
  border-color: #7c7c7ca8;

  background-color: #a4ada4;
}

.lift-display-board {
  position: absolute;

  margin: 4% auto 0 auto;
  padding: 1% 2% 3% 2%;
  left: 0;
  right: 0;

  width: fit-content;
  height: fit-content;

  border-radius: 18%;

  font: inherit;
  color: #ffffff;

  background-color: #00000066;

  user-select: none;
}

.moving-direction {
  transform: translateY(3px);
}

.target-floor {
  margin-right: 4px;
}
</style>
