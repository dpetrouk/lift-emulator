<script setup>
import { computed } from 'vue';
import { floorsCount, liftCabinFlickeringDuration } from '../buildingConfig.js';
import LiftCabin from './LiftCabin.vue';

const props = defineProps(['lift', 'liftShaftIndex']);

const liftShaftGridColumn = computed(
  () => `${props.liftShaftIndex} / ${props.liftShaftIndex + 1}`,
);
const liftCabinGridRowStart = computed(
  () => floorsCount + 1 - props.lift.currentFloor.value,
);

const liftCabinMovingDuration = computed(() => props.lift.movingDuration.value);
const liftCabinTransformValue = computed(() => `translateY(${props.lift.floorsDifference.value * 100 * (-1)}%)`);

const isLiftCabinFlickering = computed(() => props.lift.state.value === 'arrived');
</script>

<template>
  <div class="lift-shaft">
    <LiftCabin
      :class="{
        'lift-cabin-position': true,
        'lift-cabin-flickering': isLiftCabinFlickering,
      }"
      :style="{ transform: liftCabinTransformValue }"
      :lift-state="lift.state"
      :moving-direction="props.lift.movingDirection"
      :target-floor="lift.targetFloor"
    />
  </div>
</template>

<style>
.lift-shaft {
  z-index: 1;

  grid-column: v-bind(liftShaftGridColumn);

  padding: 0 3px 0 3px;

  border-style: double;
  border-width: 0 3px 0 3px;
  border-color: #cecece;

  display: grid;
  grid-template-rows: repeat(v-bind(floorsCount), 1fr);
  grid-template-columns: 1fr;

  background-color:rgb(209, 219, 219, 0.32);
}

.lift-cabin-position {
  grid-row: v-bind(liftCabinGridRowStart) / v-bind(liftCabinGridRowStart + 1);
  grid-column: 1 / 2;
  transition: transform v-bind(liftCabinMovingDuration + 's');
}

.lift-cabin-flickering {
  animation: 1s linear v-bind(liftCabinFlickeringDuration) alternate flickering;
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
