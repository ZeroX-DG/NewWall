<template>
  <div id='window-controls'>
    <div class='control-button' id='conifg' @click="openConfig">
      <span v-if="isConfig">&#x2714;</span>
      <span v-if="!isConfig">&#x2630;</span>
    </div>
    <div class='control-button' id='minimize' @click="minimize">&#x268A;</div>
    <div class='control-button' id='close' @click="closeApp">&#x2715;</div>
  </div>
</template>
<script>
import {remote} from 'electron';
export default {
  props: ["isConfig"],
  methods: {
    closeApp () {
      remote.app.exit();
    },
    minimize () {
      remote.BrowserWindow.getFocusedWindow().minimize();
    },
    openConfig () {
      this.$emit('onOpenConfig')
    }
  }
}
</script>

<style lang="sass" scoped>
#window-controls
  width: 145px
  height: 40px
  display: inline-flex
  justify-content: flex-end
  box-sizing: border-box
  color: white
  vertical-align: middle
  -webkit-app-region: drag
  position: absolute
  right: 0
  .control-button
    height: 100%
    width: 20px
    display: flex
    align-items: center
    justify-content: center
    cursor: pointer
    margin-left: 10px
    -webkit-app-region: no-drag
    &:last-child
      margin-right: 10px
  #minimize
    margin-top: -5px
</style>

