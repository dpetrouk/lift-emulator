<script setup>
import { onMounted } from 'vue';
import { liftShaftsCount, floorsCount, liftCabinFlickeringDuration } from '../buildingConfig.js';
import { lifts, floors, callQueue } from '../store.js';
import LiftShaft from './LiftShaft.vue';
import Floor from './Floor.vue';

const moveSelectedLift = (lift, targetFloor) => {
  // console.log('3 - moveSelectedLift');
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
  // console.log('2 - processCallQueue');
  if (callQueue.isCallsToProcessEmpty()) {
    callQueue.setIsInProcessing(false);
    // console.log('2 - call queue is empty, stopping call queue processing');
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
  // console.log('-----------------------');
  // console.log('1 - processLiftCall');
  if (isCallToSkip(targetFloor)) {
    // console.log('1 - skipping call');
    return;
  }
  callQueue.addCallToProcess(targetFloor);
  if (!callQueue.isInProcessing) {
    callQueue.setIsInProcessing(true);
    // console.log('1 - call queue is NOT in processing');
    processCallQueue();
  }
};

const resumeProcesses = () => {
  callQueue.callsInExecution
    .forEach((call) => {
      const lift = lifts.selectLift(call.liftId);
      // console.log({ lift });
      moveSelectedLift(lift, call.targetFloor);
    });
  lifts.items
    .filter(({ state }) => state.value === 'arrived')
    .forEach((lift) => setTimeout(() => lift.setState('available'), liftCabinFlickeringDuration * 1000));
  processCallQueue();
};

onMounted(() => {
  // localStorage.clear();
  // console.log('0 - callsInExecution: ', callQueue.callsInExecution);
  setTimeout(resumeProcesses, 30);
});
</script>

<template>
  <div class="building">
    <div class="lift-shafts">
      <LiftShaft
        v-for="liftShaftIndex in liftShaftsCount"
        :key="liftShaftIndex"
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
  box-sizing: border-box;

  padding: 2%;

  display: grid;
  grid-template: repeat(v-bind(floorsCount), 1fr) / repeat(v-bind(liftShaftsCount + 1), 1fr);

  background-color: rgb(228, 228, 228, 0.3);
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
