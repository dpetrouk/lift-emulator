<script setup>
defineProps(['movingDirection', 'targetFloor']);

</script>

<template>
  <div
    class="lift-cabin"
  >
    <div
      class="lift-display-board"
      v-show="movingDirection"
    >
      {{ `${movingDirection} ${targetFloor}` }}
    </div>
  </div>
</template>

<style>
.lift-cabin {
  box-sizing: border-box;

  border-radius: 4%;

  background-color: rgb(121, 218, 121);
}

.lift-display-board {
  position: absolute;
  padding: 1% 2% 1% 2%;
  display: inline-block;
  margin: 2% auto 0 auto;
  left: 0;
  right: 0;
  text-align: center;
  width: fit-content;
  height: fit-content;

  border-radius: 18%;

  font-size: 80%;
  color: white;
  background-color: rgb(0, 0, 0, 0.4);
}
</style>
