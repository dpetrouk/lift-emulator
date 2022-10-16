<script setup>
import { liftShaftsCount } from '../buildingConfig.js';

defineProps(['floorIndex']);
</script>

<template>
  <div class="floor">
    <div class="lift-control-panel">
      <div>floor index: {{ floorIndex }}</div>
      <button>button</button>
    </div>
  </div>
</template>

<style scoped>
.floor {
  box-sizing: border-box;

  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(v-bind(liftShaftsCount + 1), 1fr);

  border-style: solid;
  border-color: #ebebeb;
  border-width: 0 1px 0 1px;

  background-color: azure;
}
.floor:not(first-child) {
  border-bottom-width: thin;
}
.floor:last-child {
  border-top-width: thin;
}
.lift-control-panel {
  position: relative;
  padding: 2%;

  grid-column: v-bind(liftShaftsCount + 1) / v-bind(liftShaftsCount + 1 + 1);
  grid-row: 1 / 2;

  background-color: cornflowerblue;
}
</style>
