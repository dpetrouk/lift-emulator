<script setup>
import { floorsCount, liftShaftsCount } from '../buildingConfig.js';
import Floor from './Floor.vue';
import LiftShaft from './LiftShaft.vue';

</script>

<template>
  <div class="building">
    <div class="lift-shafts">
      <LiftShaft
        v-for="liftShaft in liftShaftsCount"
        :key="liftShaft"
        :liftShaftIndex="liftShaft"
      />
    </div>
    <div class="floors">
      <Floor
        v-for="floorIndex in floorsCount"
        :key="floorIndex"
        :floorIndex="floorIndex"
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
