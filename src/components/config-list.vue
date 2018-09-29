<template>
  <div id='configs'>
    <h1>Settings</h1>
    <div class='config-item'>
      <label>Initial number of images (default 10)</label>
      <input type='text' placeholder="10" @keydown="preventString" v-model="initialNumberOfImages" @keyup="save" />
    </div>
    <div class='config-item'>
      <label>Initial search term (default 'nature')</label>
      <input type='text' placeholder="10" v-model="initialSearchTerm" @keyup="save" />
    </div>
    <div v-if="isLinux">
      <div class='config-item'>
        <label>Background modifier</label>
        <select v-model="backgroundModifier" @change="save">
          <option value=''>default</option>
          <option value="gsettings">gsettings</option>
          <option value="gsettings_cinnamon">gsettings (cinnamon)</option>
          <option value="gsettings_mate">gsettings (mate)</option>
          <option value="setroot">setroot</option>
          <option value="pcmanfm">pcmanfm</option>
          <option value="feh">feh</option>
          <option value="nitrogen">nitrogen</option>
          <option value="qdbus">qdbus</option>
        </select>
      </div>
    </div>
  </div>
</template>
<style lang="sass" scoped>
#configs
  font-family: "Lato"
  padding: 10px
  box-sizing: border-box
  h1
    color: white
  .config-item
    width: 100%
    margin-bottom: 20px
    label
      display: block
      margin-bottom: 10px
      font-size: 18px
      color: rgba(255, 255, 255, 0.5)
    input, select
      margin-bottom: 10px
      border: none
      width: 300px
      height: 35px
      padding: 10px
      box-sizing: border-box
      background: rgba(255, 255, 255, 0.25)
      color: white
      outline: none
      font-size: 15px
      font-family: 'Lato'
    select
      height: 40px
      outline: none
      option
        background-color: rgba(0, 0, 0, 0.8)!important
</style>

<script>
const Store = require("electron-store");
const store = new Store();
export default {
  data () {
    return {
      initialNumberOfImages: store.get('initialNOI') || 10,
      initialSearchTerm: store.get('initialSearchTerm') || 'nature',
      isLinux: process.platform !== "win32" && process.platform !== "darwin",
      backgroundModifier: store.get('backgroundModifier') || ''
    }
  },
  methods: {
    preventString (e) {
      if (isNaN(e.key) && e.which !== 8) {
        e.preventDefault()
      }
    },
    save () {
      store.set('initialNOI', this.initialNumberOfImages)
      store.set('initialSearchTerm', this.initialSearchTerm)
      store.set('backgroundModifier', this.backgroundModifier)
    }
  }
}
</script>