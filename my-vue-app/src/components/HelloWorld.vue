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
      window.dispatchEvent(new CustomEvent("count-change", { detail: {
        count: this.count
      } }))
    }
  }
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="incrementCount">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <button
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    :style="{ position: 'absolute', left: posX + 'px', top: posY + 'px' }"
  >
    Draggable Button
  </button>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
