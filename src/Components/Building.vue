<script setup>
import { ref } from 'vue';
import { liftShaftsCount, floorsCount } from '../buildingConfig.js';
import lifts from '../store.js';
import LiftShaft from './LiftShaft.vue';
import Floor from './Floor.vue';

const liftShaftsRefs = ref([]);
const moveLift = (selectedLiftId, targetFloor) => {
  liftShaftsRefs.value[selectedLiftId - 1].changeCurrentFloor(targetFloor);
};

const processLiftCall = (targetFloor) => {
  if (lifts.isLiftOnTargetFloor(targetFloor)) {
    return;
  }
  const selectedLiftId = lifts.selectProperLift(targetFloor);
  if (!selectedLiftId) {
    return;
  }
  moveLift(selectedLiftId, targetFloor);
};
</script>

<template>
  <div class="building">
    <div class="lift-shafts">
      <LiftShaft
        v-for="liftShaftIndex in liftShaftsCount"
        :key="liftShaftIndex"
        :liftShaftIndex="liftShaftIndex"
        ref="liftShaftsRefs"
      />
    </div>
    <div class="floors">
      <Floor
        v-for="floorIndex in floorsCount"
        :key="floorIndex"
        :floorIndex="floorIndex"
        @call-lift="processLiftCall"
      />
    </div>
  </div>
</template>

<style>
.building {
  box-sizing: border-box;

  padding: 2%;

  display: grid;
  grid-template: repeat(v-bind(floorsCount), 1fr) / repeat(v-bind(liftShaftsCount + 1), 1fr);

  background-color: rgb(235, 255, 245);
}

.lift-shafts {
  box-sizing: border-box;

  display: grid;
  grid-column: 1 / v-bind(liftShaftsCount + 1);
  grid-row: 1 / v-bind(floorsCount + 1);
}
.floors {
  position: relative;

  box-sizing: border-box;

  display: flex;
  flex-direction: column-reverse;

  grid-column: 1 / v-bind(liftShaftsCount + 1 + 1);
  grid-row: 1 / v-bind(floorsCount + 1);
}
</style>
