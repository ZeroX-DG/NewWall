<template>
  <div id="wallpaper-list">
    <div class="image-container" @click="setBackground(image)" v-for="image in images" :key="image.id">
      <v-lazy-image :src="image.urls.custom" class="image" />
      <div class='info'>
        <label>Photo by <a :href="image.user.links.html" @click="openLink" v-text="image.user.name"></a> on <a :href="image.links.html" @click="openLink">Unsplash</a></label>
      </div>
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
  position: relative
  overflow: hidden
  &:hover
    opacity: 1!important
    & .info
      opacity: 1
  .image
    width: 100%
    display: block
  .info
    width: 100%
    position: absolute
    z-index: 10
    opacity: 0
    bottom: 0
    left: 0
    padding: 5px
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))
    transition: 0.5s opacity
    label
      color: white
      font-family: "Lato"
      a
        color: white
        font-weight: bold
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
import { remote, shell } from 'electron';
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
    openLink (e) {
      e.preventDefault();
      e.stopPropagation();
      shell.openExternal(e.target.href);
    },
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

