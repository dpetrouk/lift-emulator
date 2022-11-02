<script setup>
import { computed } from 'vue';
import { liftShaftsCount } from '../buildingConfig.js';

const props = defineProps(['floorState']);

const buttonBorderColor = computed(() => (props.floorState.isLiftCalled.value ? 'rgb(126, 126, 126)' : 'rgb(255, 255, 255)'));
const buttonChar = computed(() => (props.floorState.isLiftCalled.value ? '⦿' : '⦾'));
</script>

<template>
  <div class="floor">
    <div class="lift-control-panel">
      <div class="floor-index">{{ props.floorState.id }}</div>
      <button
        @click="() => $emit('callLift', props.floorState.id)"
      >
        {{ buttonChar }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.floor {
  height: 100px;

  display: grid;
  grid-template: 1fr / repeat(v-bind(liftShaftsCount), 90px) 110px;

  border-style: solid;
  border-color: #ebebeb;
  border-width: 0 1px 0 1px;

  background-color: white;
}
.floor:not(first-child) {
  border-bottom-width: thin;
}
.floor:last-child {
  border-top-width: thin;
}
.lift-control-panel {
  grid-row: 1 / 2;
  grid-column: v-bind(liftShaftsCount + 1) / v-bind(liftShaftsCount + 1 + 1);

  margin: 5px;
  margin-left: 10px;
  padding: 3%;
  width: fit-content;
  height: fit-content;

  border-radius: 9%;

  background-color: rgb(228, 228, 228, 0.7);
}

.floor-index {
  margin: 5px;

  font: inherit;
  font-size: 16px;
  font-weight: bold;

  user-select: none;
}

button {
  padding: 3px;
  line-height: 90%;

  border: 1px solid;
  border-color: v-bind(buttonBorderColor);
  border-radius: 13%;

  font-size: 16px;
  color: rgb(83, 83, 83);

  opacity: 1;

  cursor: pointer;
  user-select: none;
}

button:hover {
  opacity: 0.6;
}
</style>
