# lift-emulator

Exercise in a format of a little web application where lift system is emulated.

### Features:

- When lift is called, the nearest available lift to the floor is selected
- If call happens, call button display that call is in progress
- All calls go through the lift call queue and are executed in their order
- Lift is moving at a speed equal to one floor per second
- Lift displays current direction and target floor while moving
- After page refreshing lift system resumes its operation
- Building can be configured - you can select number of floors and number of lift shafts in `src/buildingConfig.js`


### Demo

https://dpetrouk.github.io/lift-emulator/

### Install and run

1. `npm install`
2. `npm run start`

### Details:

- Works on Node v14.17.0 (other versions are not checked)
- Vue 3.2.40
- Webpack 5.74.0