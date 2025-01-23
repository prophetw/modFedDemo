<template>
  <div>
    <h1>Viewer Page</h1>
    <div id="cesiumContainer" ref="viewerContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const viewerContainer = ref(null);

onMounted(async () => {
  try {
    // 动态导入模块
    const BimEngine = await import('BimEngine/BimEngine'); // Destructure init
    console.log('init function:', BimEngine);
    if(viewerContainer.value) {
      const viewer = new BimEngine.Viewer({

      })
      console.log(viewer);
    }

  } catch (error) {
    console.error('Failed to load BimEngine:', error);
  }
});
</script>

<style scoped>
#viewer-container {
  width: 100%;
  height: 600px;
}
</style>
