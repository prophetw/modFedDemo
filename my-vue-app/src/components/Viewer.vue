<script lang="ts">

// 这里是给子应用 提供图形引擎的初始化和项目打开的方法

const BimEngine = window.BimEngine
BimEngine.setBaseUrl('../engine-sdk')
const serverUrl = 'http://139.224.111.10:8765'
const appId = '14e2cd19eb044a18a1a1db06856c97a2'
const secret = '4421a93408b54638a3f71a6d111e0b85'
const projectId = '72c9dc7e59724333b47d7ea8bbe3baae'
function InitViewer() {
    const viewer = new BimEngine.Viewer({
        container: 'BimEngineContainer',
        baseUrl: serverUrl,
        appId: appId,
        secret: secret,
    })
    return viewer
}
const openProj = async (projId: string) => {
    window.viewer = window.viewer || InitViewer();
    await window.viewer.Init()
    const currentProject = await window.viewer.queryProject(projId)
    if (!currentProject) {
        return
    }
    window.currentProject = currentProject
    await currentProject.open()
    if (currentProject.viewPosition) {
        window.viewer.camera?.setViewToViewPosition(currentProject.viewPosition)
    } else {
        window.viewer.camera?.setViewToProject(currentProject)
    }
    return currentProject;
}
export default {
    data(): {
        viewer: BimEngine.Viewer | undefined
    } {
        return {
            viewer: undefined
        }
    },
    async mounted() {
        await openProj(projectId)
    },
    methods: {
    }

}
</script>

<template>
    <div id="BimEngineContainer" style="width: 200px; height: 200px; position: absolute; top: 0; left: 0; right: 0; bottom: 0;"></div>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
