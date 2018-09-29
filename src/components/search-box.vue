<template>
  <div id='searchBox'>
    <input type='text' id='search' @keyup="onSearchChange" placeholder="Search...">
    <input type='text' id='numberOfImages' @keydown="preventString" @keyup="onNumberOfImageChange" placeholder="Number of images...">
  </div>
</template>
<script>
let typeTimeout = null
let numberOfImageTypeTimeout = null
export default {
  methods: {
    preventString (e) {
      if (isNaN(e.key) && e.which !== 8) {
        e.preventDefault()
      }
    },
    onSearchChange (e) {
      clearTimeout(typeTimeout)
      typeTimeout = setTimeout(() => {
        this.$emit('searchChange', e.target.value)
      }, 300)
    },
    onNumberOfImageChange (e) {
      clearTimeout(numberOfImageTypeTimeout)
      numberOfImageTypeTimeout = setTimeout(() => {
        this.$emit('numberOfImageChange', e.target.value)
      }, 300)
    }
  }
}
</script>

<style lang="sass" scoped>
#searchBox
  width: calc(100% - 150px)
  height: 50px
  -webkit-app-region: drag
  white-space: nowrap
  position: relative
  display: inline-block
input
  height: calc(100% - 10px)
  position: relative
  top: 10px
  box-sizing: border-box
  border: none
  background: transparent
  padding: 10px
  font-family: 'Lato'
  font-size: 18px
  color: white
  outline: none
  -webkit-app-region: no-drag
#search
  width: 70%
#numberOfImages
  width: 30%
</style>

