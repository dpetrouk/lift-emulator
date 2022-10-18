<script setup>
import { computed } from 'vue';
import { liftShaftsCount } from '../buildingConfig.js';

const props = defineProps(['floorIndex', 'floorState']);

const buttonBorderColor = computed(() => (props.floorState.isLiftCalled.value ? 'rgb(126, 126, 126)' : 'rgb(255, 255, 255)'));
const buttonChar = computed(() => (props.floorState.isLiftCalled.value ? '⦿' : '⦾'));
</script>

<template>
  <div class="floor">
    <div class="lift-control-panel">
      <div class="floor-index">{{ floorIndex }}</div>
      <button
        @click="() => $emit('callLift', floorIndex)"
      >
        {{ buttonChar }}
      </button>
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
  padding: 3%;
  margin: 5px;
  width: fit-content;
  height: fit-content;

  border-radius: 9%;

  grid-column: v-bind(liftShaftsCount + 1) / v-bind(liftShaftsCount + 1 + 1);
  grid-row: 1 / 2;

  background-color: rgb(228, 228, 228, 0.7);
}

.floor-index {
  margin: 5px;
  font-size: 80%;
  font-weight: bold;
  font-family: sans-serif;
}

button {
  /* width: 10%;
  height: 40%; */
  padding: 3px;
  line-height: 90%;
  /* margin: 0; */
  border: 1px solid;
  border-color: v-bind(buttonBorderColor);
  border-radius: 13%;
  font-size: 14px;
  color: rgb(83, 83, 83);
  opacity: 1;
  cursor: pointer;
}

button:hover {
  opacity: 0.6;
}
</style>
