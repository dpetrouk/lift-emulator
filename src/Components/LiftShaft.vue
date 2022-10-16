<script setup>
import { ref } from 'vue';
import { floorsCount } from '../buildingConfig.js';
import LiftCabin from './LiftCabin.vue';

defineProps(['liftShaftIndex']);

const currentFloor = ref(1);

</script>

<template>
  <div class="lift-shaft">
    <LiftCabin
      class="lift-cabin-position"
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
}
</style>
