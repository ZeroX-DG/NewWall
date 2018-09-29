<template>
  <div id='wrapper'>
    <SearchBox v-if="!isConfig" @searchChange="handleSearch" @numberOfImageChange="handleNumberOfImage" />
    <WindowControls @onOpenConfig="toggleConfig" :isConfig="isConfig" />
    <WallpaperList v-if="!isConfig" :search='search' :numOfImages="numOfImages" />
    <ConfigList v-if="isConfig" />
  </div>
</template>
<script>
import WallpaperList from './components/wallpaper-list'
import SearchBox from './components/search-box'
import WindowControls from './components/window-controls'
import ConfigList from './components/config-list'
const Store = require("electron-store");
const store = new Store();
export default {
  components: {
    WallpaperList,
    SearchBox,
    WindowControls,
    ConfigList
  },
  data () {
    return {
      search: store.get('initialSearchTerm') || 'nature',
      numOfImages: store.get('initialNOI') || 10,
      isConfig: false
    }
  },
  methods: {
    handleSearch (search) {
      this.search = search
    },
    handleNumberOfImage (num) {
      this.numOfImages = num
    },
    toggleConfig () {
      this.isConfig = !this.isConfig
      if (!this.isConfig) {
        this.search = store.get('initialSearchTerm') || 'nature'
        this.numOfImages = store.get('initialNOI') || 10
      }
    }
  }
}
</script>

<style lang="sass" scoped>
#wrapper
  width: 100%
  height: 100vh
  background: #1e272e
</style>
