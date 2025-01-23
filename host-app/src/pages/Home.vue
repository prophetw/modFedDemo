<template>
  <div>
    <h1>Home Page</h1>
    <p>这是主应用的主页。</p>
    <p>
      <router-link to="/pageA">前往 PageA</router-link> |
      <router-link to="/viewer">前往 远程应用 viewer </router-link> |
      <!-- <router-link to="/proj-B">访问远程应用</router-link> -->
    </p>
    <ul>
      <li v-for="(app, index) in remoteApps" :key="index">
        <button @click="loadRemote(app)">{{ app.name }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      remoteApps: window.remoteApp || []
    }
  },
  methods: {
    loadRemote(app) {
      // dynamically import remote module here
    }
  }
}
</script>
