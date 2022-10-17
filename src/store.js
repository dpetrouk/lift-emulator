import { liftShaftsCount } from './buildingConfig.js';

const lifts = {
  items: Array(liftShaftsCount)
    .fill({
      isAvailable: true,
      setIsAvailable(value) { this.isAvailable = value; },
      currentFloor: 1,
      setCurrentFloor(value) { this.currentFloor = value; },
    })
    .map((lift, index) => ({ ...lift, id: index + 1 })),
  getAvailableLifts() {
    return this.items.filter((lift) => lift.isAvailable);
  },
  isLiftOnTargetFloor(targetFloor) {
    return !!this.items.find((lift) => lift.currentFloor === targetFloor);
  },
  selectProperLift(targetFloor) {
    const availableLifts = this.getAvailableLifts();
    let minDistance = Infinity;
    let closestLiftId = null;
    availableLifts.forEach((lift) => {
      const currentLiftDistance = Math.abs(lift.currentFloor - targetFloor);
      if (currentLiftDistance < minDistance) {
        minDistance = currentLiftDistance;
        closestLiftId = lift.id;
      }
    });
    return closestLiftId;
  },
  selectLiftState(liftShaftIndex) { return this.items[liftShaftIndex - 1]; },
};

export default lifts;
