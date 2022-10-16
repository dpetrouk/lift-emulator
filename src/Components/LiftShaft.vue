<script setup>
import { ref } from 'vue';
import { floorsCount } from '../buildingConfig.js';
import LiftCabin from './LiftCabin.vue';

const { abs } = Math;

defineProps(['liftShaftIndex']);

const currentFloor = ref(1);
const floorsDifference = ref(0);

const changeCurrentFloor = (floor) => {
  floorsDifference.value = floor - currentFloor.value;

  setTimeout(() => {
    floorsDifference.value = 0;
    currentFloor.value = floor;
  }, abs(floorsDifference.value) * 1000);
};

const generateRandomFloorNumber = () => {
  const result = Math.ceil(Math.random() * 5);
  if (result === currentFloor.value) {
    return generateRandomFloorNumber();
  }
  return result;
};

const moveLift = () => changeCurrentFloor(generateRandomFloorNumber());
</script>

<template>
  <div class="lift-shaft">
    <LiftCabin
      class="lift-cabin-position"
      :style="{ transform: `translateY(${floorsDifference * (-100) + '%'})` }"
      :onclick="moveLift"
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
</style>
