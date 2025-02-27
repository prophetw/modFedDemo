<script lang="ts">
export default {
  props: {
    msg: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      count: 0,
      posX: 100,
      posY: 100,
      startX: 100,
      startY: 100
    }
  },

  methods: {
    setViewPosition() {
      console.log('setViewPosition')
      if(window.viewer && window.currentProject){
        window.viewer.camera?.setViewToProject(window.currentProject)
      }
    },
    onDragStart(e: DragEvent) {
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move'
      }
      this.startX = e.clientX - this.posX
      this.startY = e.clientY - this.posY
    },

    onDragEnd(e: DragEvent) {
      this.posX = e.clientX - this.startX
      this.posY = e.clientY - this.startY
    },

    incrementCount() {
      console.log('qqqqqqq', this.count)
      this.count++
      window.dispatchEvent(new CustomEvent("count-change", {
        detail: {
          count: this.count
        }
      }))
    }
  }
}
</script>

<template>
  <div style="padding: 10px; border: 1px solid;">

    <h1>{{ msg }}</h1>

    <div class="card">
      <button type="button" @click="incrementCount">count is {{ count }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <button draggable="true" @dragstart="onDragStart" @dragend="onDragEnd"
      :style="{ position: 'absolute', left: posX + 'px', top: posY + 'px' }">
      Draggable Button
    </button>

    <button @click="setViewPosition">
      调用图形视角定位
    </button>

    

  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
