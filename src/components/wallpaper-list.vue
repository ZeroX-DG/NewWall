<template>
  <div id="wallpaper-list">
    <div class="image-container" @click="setBackground(image)" v-for="image in images" :key="image.id">
      <v-lazy-image :src="image.urls.custom" class="image" />
    </div>
  </div>
</template>
<style lang="sass" scoped>
#wallpaper-list
  display: flex
  flex-wrap: wrap
  height: calc(100% - 50px)
  overflow-y: auto
  position: relative
  &:hover .image-container
    opacity: 0.25
  &::-webkit-scrollbar
    width: 12px
    background: transparent
    &-thumb
      background: rgba(0, 0, 0, 0.5)
.image-container
  flex: 1 1 25%
  cursor: pointer
  transition: opacity .3s ease-in-out
  &:hover
    opacity: 1!important
  .image
    width: 100%
    display: block
.v-lazy-image
  opacity: 0
  transition: opacity 2s

.v-lazy-image-loaded
  opacity: 1
</style>

<script>
import Unsplash from 'unsplash-js';
import wallpaper from '@zerox-dg/wallpaper';
import download from 'image-downloader';
import { remote } from 'electron';
import path from 'path';
import rimraf from 'rimraf';
import fs from 'fs';
import VLazyImage from "v-lazy-image";
import unsplashConfig from "../../config"

const Store = require("electron-store");
const store = new Store();
const unsplash = new Unsplash(unsplashConfig);

export default {
  props: ['search', 'numOfImages'],
  components: {
    VLazyImage
  },
  data(){
    return {
      width: window.screen.width,
      height: window.screen.height,
      images: []
    }
  },
  watch: {
    search () {
      this.fetchImages()
    },
    numOfImages () {
      this.fetchImages()
    }
  },
  mounted () {
    this.fetchImages()
  },
  methods: {
    fetchImages () {
      unsplash.photos.getRandomPhoto({ width: this.width, height: this.height, query: this.search, count: this.numOfImages })
        .then(res => res.json())
        .then(images => {
          this.images = images
        });
    },
    setBackground (image) {
      let backgroundModifier = store.get('backgroundModifier') || ''
      const dest = path.join(remote.app.getPath('userData'), 'images', `${image.id}.jpg`)
      const options = {
        url: image.urls.custom,
        dest: dest
      }
      if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest))
      }
      if (backgroundModifier) {
        if (backgroundModifier === 'gsettings_cinnamon') {
          backgroundModifier = ['gsettings', 'cinnamon']
        } else if (backgroundModifier === 'gsettings_mate') {
          backgroundModifier = ['gsettings', 'mate']
        } else {
          backgroundModifier = [backgroundModifier]
        }
      }
      if (!fs.existsSync(dest)) {
        rimraf(`${path.dirname(dest)}/*`, () => {
          download.image(options)
            .then(({filename}) => {
              wallpaper.set(filename, backgroundModifier).then(() => {
                console.log('done');
              });
            })
            .catch((err) => {
              console.error(err)
            })
        });
      } else {
        wallpaper.set(dest, backgroundModifier).then(() => {
          console.log('done');
        });
      }
    }
  }
}
</script>

