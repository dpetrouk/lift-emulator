<script setup>
import { ref } from 'vue';
import { floorsCount } from '../buildingConfig.js';
import { callQueue } from '../store.js';
import LiftCabin from './LiftCabin.vue';

const { abs } = Math;

const props = defineProps(['liftShaftIndex', 'liftState']);

const currentFloor = ref(props.liftState.currentFloor);
const floorsDifference = ref(0);

const displayedMovingDirection = ref(null);
const getDirectionArrow = (value) => (value > 0 ? '🡡' : '🡣');
const displayedTargetFloor = ref(null);

const isLiftCabinFlickering = ref(false);

const moveLift = (targetFloor) => {
  props.liftState.setIsAvailable(false);
  floorsDifference.value = targetFloor - currentFloor.value;
  displayedMovingDirection.value = getDirectionArrow(floorsDifference.value);
  displayedTargetFloor.value = targetFloor;

  setTimeout(() => {
    floorsDifference.value = 0;
    currentFloor.value = targetFloor;
    isLiftCabinFlickering.value = true;
    setTimeout(() => {
      isLiftCabinFlickering.value = false;
      displayedMovingDirection.value = null;
      displayedTargetFloor.value = null;
      props.liftState.setCurrentFloor(targetFloor);
      props.liftState.setIsAvailable(true);
      callQueue.removeFromItemsInProcessing(targetFloor);
    }, 3000);
  }, abs(floorsDifference.value) * 1000);
};

defineExpose({ moveLift });
</script>

<template>
  <div class="lift-shaft">
    <LiftCabin
      :class="{
        'lift-cabin-position': true,
        'lift-cabin-flickering': isLiftCabinFlickering,
      }"
      :style="{ transform: `translateY(${floorsDifference * 100 * (-1) + '%'})` }"
      :moving-direction="displayedMovingDirection"
      :target-floor="displayedTargetFloor"
    />
  </div>
</template>

<style>
.lift-shaft {
  position: relative;
  box-sizing: border-box;
  z-index: 1;
  padding: 0 3px 0 3px;
  border-style: solid;
  border-color: #cecece;
  border-width: 0 3px 0 3px;

  background-color:rgba(95, 158, 160, 0.315);

  grid-column: v-bind(liftShaftIndex) / v-bind(liftShaftIndex + 1);

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(v-bind(floorsCount), 1fr);
}

.lift-cabin-position {
  grid-row: v-bind(floorsCount + 1 - currentFloor) / v-bind(floorsCount + 1 - currentFloor + 1);
  grid-column: 1 / 2;
  transition: transform v-bind(abs(floorsDifference) + 's');
}

.lift-cabin-flickering {
  animation: 1s linear 3 alternate flickering;
}

@keyframes flickering {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
