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
    <!-- 如果成功加载了远程组件，就渲染在此处 -->
    <div v-if="remoteComponent">
      <h3>远程组件已经加载：</h3>
      <component :is="remoteComponent"></component>
    </div>

    <!-- 这个空div将是远程组件挂载位置 -->
    <div id="remote-app-container"></div>
  </div>
</template>

<script>
import {createApp} from 'vue';

export default {
  data() {
    return {
      // 假设我们在 index.html 或某个文件里提前定义了 window.remoteApp
      // 你也可以在 created() 或 onMounted() 阶段通过接口获取
      remoteApps: window.remoteAppList || [],
      remoteComponent: null, // 用于存储拿到的远程组件
    }
  },
  methods: {

    async loadScriptOrigin(url){

      return new Promise(async (resolve, reject) => {
        const remoteModule = await import(url);
        const RemoteComponent = remoteModule.default || remoteModule;
        console.log('拿到了远程组件 =>', RemoteComponent)
        resolve(RemoteComponent)
      })
    },

    // 改造后的脚本加载函数：加了 type="module"
    loadScriptAsModule(url) {
      return new Promise((resolve, reject) => {
        // 如果已存在此脚本，就直接resolve
        if (document.querySelector(`script[src="${url}"]`)) {
          return resolve()
        }
        const script = document.createElement('script')
        script.type = 'module'
        script.src = url
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`加载远程脚本失败: ${url}`))
        document.head.appendChild(script)
      })
    },


    async loadRemote(app) {
      try {
        // 1) 加载远程脚本 (ES Module)
        // await this.loadScriptAsModule(app.url)
        const container = await this.loadScriptOrigin(app.url)
        console.log(container);

        // 2) Webpack Federation: 初始化共享作用域
        //   如果远程产物使用了真正的 Webpack Module Federation 语法
        //   仍然需要 init(...) + share scope
        if (typeof __webpack_init_sharing__ === 'function') {
          await __webpack_init_sharing__('default')
        }

        // 3) 拿到远程容器对象
        //    注意：ESM 不会自动挂到 window，需要远程脚本主动挂载
        // const container = globalThis[app.scope]
        // console.log(' globalThis --- ', globalThis);
        if (!container) {
          throw new Error(`未在 globalThis 上找到容器: ${app.scope}`)
        }
        if (typeof container.init === 'function') {
          // console.log(' __webpack_share_scopes__', __webpack_share_scopes__);
          // if(typeof __webpack_share_scopes__ !== undefined){
          //   await container.init(__webpack_share_scopes__.default)
          // }
            // await container.init()

        }

        // 4) 获取暴露的模块
        const moduleFactory = await container.get('./RemoteApp')
        const remoteModule = moduleFactory()
        const RemoteComponent = remoteModule.default || remoteModule

        // TODO: 你要怎么使用这个组件都可以
        // 比如手动创建App挂载、或者动态路由等
        // 这里仅打印一下：
        console.log('拿到了远程组件 =>', RemoteComponent)

        // 4) 直接在指定的DOM节点下挂载这个远程组件
        //    这里用 Vue 的 createApp，但并没有在当前组件的 data 里存任何变量
        const containerEl = document.getElementById("remote-app-container");

        // 如果每次点击都想“清空”再挂载，可以先清空一下内容
        containerEl.innerHTML = "";

        // 挂载远程组件
        const appInstance = createApp(RemoteComponent);
        // 如果你有需要全局依赖(比如使用主应用同一个router/store等)，需要进行额外设置
        // appInstance.use(store).use(router) ...
        appInstance.mount(containerEl);

      } catch (err) {
        console.error('加载远程应用失败', err)
      }
    },
  },

  /**
 * 动态插入 script
 * @param {string} url - 远程 remoteEntry.js 的地址
 */
  loadScript(url) {
    return new Promise((resolve, reject) => {
      // 如果已经加载过，就不再重复加载
      if (document.querySelector(`script[src="${url}"]`)) {
        return resolve();
      }
      const script = document.createElement("script");
      script.src = url;
      script.type = "module";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`加载远程脚本失败: ${url}`));
      document.head.appendChild(script);
    });
  },

  async loadRemoteUMD(app) {
    // umd 的模式 对象时在 window 上的
    try {
      // 1) 加载 remoteEntry.js
      await this.loadScript(app.url);

      // 2) Webpack Federation: 初始化共享作用域
      if (typeof __webpack_init_sharing__ === "function") {
        await __webpack_init_sharing__("default");
      }
      const container = window[app.scope];
      if (!container) {
        throw new Error(`未发现远程容器: window["${app.scope}"]`);
      }
      if (container.init && typeof container.init === "function") {
        await container.init(__webpack_share_scopes__.default);
      }

      // 3) 获取远程组件 (示例暴露名 "./Viewer.vue")
      const moduleFactory = await container.get("./Viewer.vue");
      const remoteModule = moduleFactory();
      const RemoteComponent = remoteModule.default || remoteModule;

      // 4) 直接在指定的DOM节点下挂载这个远程组件
      //    这里用 Vue 的 createApp，但并没有在当前组件的 data 里存任何变量
      const containerEl = document.getElementById("remote-app-container");

      // 如果每次点击都想“清空”再挂载，可以先清空一下内容
      containerEl.innerHTML = "";

      // 挂载远程组件
      const appInstance = Vue.createApp(RemoteComponent);
      // 如果你有需要全局依赖(比如使用主应用同一个router/store等)，需要进行额外设置
      // appInstance.use(store).use(router) ...
      appInstance.mount(containerEl);

    } catch (error) {
      console.error("动态加载远程应用失败：", error);
    }
  },

  /**
   * 点击列表后，动态加载远程应用及其组件
   * @param {Object} app {name, url, scope} 远程应用信息
   */
  async loadRemote1(app) {
    try {
      // 1. 加载 remoteEntry.js
      await this.loadScript(app.url);

      // 2. 如果是 Webpack Module Federation，需要初始化共享作用域：
      if (typeof __webpack_init_sharing__ === "function") {
        await __webpack_init_sharing__("default");
      }

      // 3. 拿到远程容器对象
      const container = window[app.scope];
      if (!container) {
        throw new Error(`未发现远程容器: window["${app.scope}"]`);
      }

      // 如果远程容器有 init 方法，则执行（一般 Webpack Module Federation 下有）
      if (container.init && typeof container.init === "function") {
        await container.init(__webpack_share_scopes__.default);
      }

      // 4. 获取远程暴露的模块
      //    注意：这里 "./Viewer.vue" 要与你远程应用 exposes 中的 key 保持一致
      //    例如：exposes: { "./Viewer.vue": "./src/Viewer.vue" }
      // const moduleFactory = await container.get("./Viewer.vue");

      //    例如：exposes: { "./Viewer.vue": "./src/Viewer.vue" }
      const moduleFactory = await container.get("./RemoteApp");

      // 5. 拿到真正的组件对象
      const remoteModule = moduleFactory();
      this.remoteComponent = remoteModule.default || remoteModule;
    } catch (error) {
      console.error("动态加载远程应用失败：", error);
    }
  },
}
</script>
