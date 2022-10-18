<script setup>
import { ref, computed } from 'vue';
import { floorsCount } from '../buildingConfig.js';
import { callQueue } from '../store.js';
import LiftCabin from './LiftCabin.vue';

const liftFlickeringDuration = 3000;
const getDirectionArrow = (value) => (value > 0 ? '🡡' : '🡣');

const props = defineProps(['liftShaftIndex', 'liftState']);

const liftCabinGridRowStart = computed(
  () => floorsCount + 1 - props.liftState.currentFloor.value,
);

const floorsDifference = ref(0);
const liftCabinTransitionDuration = computed(() => Math.abs(floorsDifference.value));
const liftCabinTransformValue = computed(() => `translateY(${floorsDifference.value * 100 * (-1)}%)`);

const displayedMovingDirection = ref(null);
const displayedTargetFloor = ref(null);

const isLiftCabinFlickering = computed(() => props.liftState.state.value === 'arrived');

const moveLift = (targetFloor) => {
  props.liftState.setState('moving');
  floorsDifference.value = targetFloor - props.liftState.currentFloor.value;
  displayedMovingDirection.value = getDirectionArrow(floorsDifference.value);
  displayedTargetFloor.value = targetFloor;

  setTimeout(() => {
    props.liftState.setState('arrived');
    props.liftState.setCurrentFloor(targetFloor);
    callQueue.removeFromItemsInProcessing(targetFloor);
    floorsDifference.value = 0;
    setTimeout(() => {
      displayedMovingDirection.value = null;
      displayedTargetFloor.value = null;
      props.liftState.setState('available');
    }, liftFlickeringDuration);
  }, liftCabinTransitionDuration.value * 1000);
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
      :style="{ transform: liftCabinTransformValue }"
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
  grid-row: v-bind(liftCabinGridRowStart) / v-bind(liftCabinGridRowStart + 1);
  grid-column: 1 / 2;
  transition: transform v-bind(liftCabinTransitionDuration + 's');
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
