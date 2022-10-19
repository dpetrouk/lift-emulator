import { ref } from 'vue';
import { liftShaftsCount, floorsCount } from './buildingConfig.js';

const loadFromLocalStorage = (property) => JSON.parse(localStorage.getItem(property));

const saveInLocalStorage = (property, value) => {
  localStorage.setItem(property, JSON.stringify(value));
};
const isBuildingConfigChanged = () => {
  if (liftShaftsCount !== (loadFromLocalStorage('liftShaftsCount') || liftShaftsCount)) {
    return true;
  }
  if (floorsCount !== (loadFromLocalStorage('floorsCount') || floorsCount)) {
    return true;
  }
  return false;
};

const updateLocalStorageIfBuildingConfigChanged = () => {
  if (isBuildingConfigChanged()) {
    localStorage.clear();
  }
  saveInLocalStorage('liftShaftsCount', liftShaftsCount);
  saveInLocalStorage('floorsCount', floorsCount);
};

updateLocalStorageIfBuildingConfigChanged();

const lifts = {
  items: Array(liftShaftsCount)
    .fill()
    .map((_, index) => ({
      id: index + 1,
      state: ref(loadFromLocalStorage(`Lift${index + 1}State`) || 'available'), // other states: 'moving' / 'arrived'
      setState(value) {
        this.state.value = value;
        if (value === 'moving') {
          this.updateMovingDirection();
        }

        saveInLocalStorage(`Lift${index + 1}State`, value);
      },
      currentFloor: ref(loadFromLocalStorage(`Lift${index + 1}CurrentFloor`) || 1),
      setCurrentFloor(value) {
        this.currentFloor.value = value;
        this.updateFloorsDifference();

        saveInLocalStorage(`Lift${index + 1}CurrentFloor`, value);
      },
      targetFloor: ref(loadFromLocalStorage(`Lift${index + 1}CurrentFloor`) || 1),
      setTargetFloor(value) {
        this.targetFloor.value = value;
        this.updateFloorsDifference();

        saveInLocalStorage(`Lift${index + 1}TargetFloor`, value);
      },
      floorsDifference: ref(0),
      updateFloorsDifference() {
        this.floorsDifference.value = this.targetFloor.value - this.currentFloor.value;
        this.updateMovingDuration();
      },
      movingDuration: ref(0),
      updateMovingDuration() {
        this.movingDuration.value = Math.abs(this.floorsDifference.value);
      },
      movingDirection: ref(loadFromLocalStorage(`Lift${index + 1}MovingDirection`) || 0),
      updateMovingDirection() {
        this.movingDirection.value = Math.sign(this.floorsDifference.value);

        saveInLocalStorage(`Lift${index + 1}MovingDirection`, this.movingDirection.value);
      },
    })),
  getAvailableLifts() {
    return this.items.filter((lift) => lift.state.value === 'available');
  },
  isLiftOnTargetFloor(targetFloor) {
    return !!this.items
      .filter((lift) => lift.state.value === 'available' || lift.state.value === 'arrived')
      .find((lift) => lift.currentFloor.value === targetFloor);
  },
  selectProperLift(targetFloor) {
    const availableLifts = this.getAvailableLifts();
    let minDistance = Infinity;
    let closestLift = null;
    availableLifts.forEach((lift) => {
      const currentLiftDistance = Math.abs(lift.currentFloor.value - targetFloor);
      if (currentLiftDistance < minDistance) {
        minDistance = currentLiftDistance;
        closestLift = lift;
      }
    });
    return closestLift;
  },
  selectLift(liftShaftIndex) { return this.items[liftShaftIndex - 1]; },
};

const floors = {
  items: Array(floorsCount)
    .fill()
    .map((_, index) => ({
      id: index + 1,
      isLiftCalled: ref(loadFromLocalStorage(`Floor${index + 1}IsLiftCalled`) || false),
    })),
  selectFloorState(floorIndex) { return this.items[floorIndex - 1]; },
  setIsLiftCalled(floorIndex, value) {
    this.selectFloorState(floorIndex).isLiftCalled.value = value;

    saveInLocalStorage(`Floor${floorIndex}IsLiftCalled`, value);
  },
};

const callQueue = {
  isInProcessing: false,
  setIsInProcessing(value) { this.isInProcessing = value; },
  callsInExecution: loadFromLocalStorage('callsInExecution') || [],
  hasTargetFloorInProcessing(targetFloor) {
    const result = !!this.callsInExecution.find((item) => item.targetFloor === targetFloor);
    return result;
  },
  moveCallToCallsInExecution(liftId, targetFloor) {
    this.callsToProcess = this.callsToProcess.slice(1);
    this.callsInExecution.push({ liftId, targetFloor });

    this.setCallsToProcessInLocalStorage();
    this.setCallsInExecutionInLocalStorage();
  },
  removeCallFromExecution(targetFloor) {
    this.callsInExecution = this.callsInExecution
      .filter((item) => item.targetFloor !== targetFloor);

    floors.setIsLiftCalled(targetFloor, false);

    this.setCallsInExecutionInLocalStorage();
  },
  setCallsInExecutionInLocalStorage() {
    saveInLocalStorage('callsInExecution', this.callsInExecution);
  },
  callsToProcess: loadFromLocalStorage('callsToProcess') || [],
  isCallsToProcessEmpty() {
    return this.callsToProcess.length === 0;
  },
  hasTargetFloorAmongCallsToProcess(targetFloor) {
    return this.callsToProcess.includes(targetFloor);
  },
  getCallToProcess() { return this.callsToProcess[0]; },
  addCallToProcess(targetFloor) {
    this.callsToProcess.push(targetFloor);

    floors.setIsLiftCalled(targetFloor, true);

    this.setCallsToProcessInLocalStorage();
  },
  setCallsToProcessInLocalStorage() {
    saveInLocalStorage('callsToProcess', this.callsToProcess);
  },
};

export {
  lifts,
  floors,
  callQueue,
};
