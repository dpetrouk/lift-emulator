<script setup>
import { onMounted } from 'vue';
import { liftShaftsCount, floorsCount, liftCabinFlickeringDuration } from '../buildingConfig.js';
import { lifts, floors, callQueue } from '../store.js';
import LiftShaft from './LiftShaft.vue';
import Floor from './Floor.vue';

const moveSelectedLift = (lift, targetFloor) => {
  lift.setTargetFloor(targetFloor);
  lift.setState('moving');
  setTimeout(() => {
    lift.setState('arrived');
    lift.setCurrentFloor(targetFloor);
    callQueue.removeCallFromExecution(targetFloor);
    setTimeout(
      () => lift.setState('available'),
      liftCabinFlickeringDuration * 1000,
    );
  }, lift.movingDuration.value * 1000);
};

const processCallQueue = () => {
  if (callQueue.isCallsToProcessEmpty()) {
    callQueue.setIsInProcessing(false);
    return;
  }
  const targetFloor = callQueue.getCallToProcess();
  const selectedLift = lifts.selectProperLift(targetFloor);
  if (selectedLift) {
    callQueue.moveCallToCallsInExecution(selectedLift.id, targetFloor);
    moveSelectedLift(selectedLift, targetFloor);
    processCallQueue();
    return;
  }
  setTimeout(processCallQueue, 500);
};

const isCallToSkip = (targetFloor) => lifts.isLiftOnTargetFloor(targetFloor)
    || callQueue.hasTargetFloorInProcessing(targetFloor)
    || callQueue.hasTargetFloorAmongCallsToProcess(targetFloor);

const processLiftCall = (targetFloor) => {
  if (isCallToSkip(targetFloor)) {
    return;
  }
  callQueue.addCallToProcess(targetFloor);
  if (!callQueue.isInProcessing) {
    callQueue.setIsInProcessing(true);
    processCallQueue();
  }
};

const resumeProcesses = () => {
  callQueue.callsInExecution
    .forEach((call) => {
      const lift = lifts.selectLift(call.liftId);
      moveSelectedLift(lift, call.targetFloor);
    });
  lifts.items
    .filter(({ state }) => state.value === 'arrived')
    .forEach((lift) => setTimeout(() => lift.setState('available'), liftCabinFlickeringDuration * 1000));
  processCallQueue();
};

onMounted(() => {
  setTimeout(resumeProcesses, 30);
});
</script>

<template>
  <div class="building">
    <div class="lift-shafts">
      <LiftShaft
        v-for="liftShaftIndex in liftShaftsCount"
        :key="liftShaftIndex"
        :liftShaftIndex="liftShaftIndex"
        :lift="lifts.selectLift(liftShaftIndex)"
      />
    </div>
    <div class="floors">
      <Floor
        v-for="floorIndex in floorsCount"
        :key="floorIndex"
        :floorState="floors.selectFloorState(floorIndex)"
        @call-lift="processLiftCall"
      />
    </div>
  </div>
</template>

<style>
.building {
  margin: auto;
  padding: 2%;

  width: fit-content;
  height: fit-content;

  display: grid;
  grid-template: repeat(v-bind(floorsCount), 1fr) / repeat(v-bind(liftShaftsCount), 90px) 110px;

  font-family: sans-serif;
  font-size: 80%;

  background-color: #e4e4e44d;
}

.lift-shafts {
  grid-row: 1 / v-bind(floorsCount + 1);
  grid-column: 1 / v-bind(liftShaftsCount + 1);

  display: grid;
}
.floors {
  grid-column: 1 / v-bind(liftShaftsCount + 1 + 1);
  grid-row: 1 / v-bind(floorsCount + 1);

  display: flex;
  flex-direction: column-reverse;
}
</style>
