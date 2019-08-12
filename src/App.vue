<!--
 * @Author: w
 * @Date: 2019-08-05 16:11:20
 * @LastEditors: w
 * @LastEditTime: 2019-08-10 18:29:17
 -->
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>

    </div>
    <button @click="msg.show = true">更新</button>
    <router-view />
    <update @close="closeUpdate" :msg="msg"></update>
  </div>
</template>

<script>
import update from "@/components/update.vue";
import { ipcRenderer } from "electron";
export default {
  name: "app",
  components: {
    update
  },
  data() {
    return {
      msg: {
        show: false,
        percent: 0,
        install: false,
        updateList:[
          {
            "text":"暂时屏蔽未完善的立即同步功能。"
          },{
            "text":"暂时屏蔽未完善的立即同步功能。"
          }
        ],
        title:'0.3.1版本说明'
      }
    };
  },
  mounted() {
    // ipcRenderer.send("checkForUpdate");
    // this.updateApp();
    this.returnMsg();
    this.download();
    this.update();
  },
  methods: {
    downloadProgress() {
      ipcRendereron.on("downloadProgress", (event, data) => {
        this.percent = data.percent.toFixed(2);
        if (data.percent >= 100) {
          this.show = false;
        }
      });
    },
    returnMsg() {
      ipcRenderer.on("message", (event, data) => {
        switch(data.status){
          case -1:
            this.$message.error(`${data.msg}`);
          break;
          case 0:
            this.$message.info(`${data.msg}`);
          break;
          case 1:
            this.msg.loading = true;
            this.$message.success(`${data.msg}`);
          break;
          default:
            this.msg.loading = false;
            this.$message.success(`${data.msg}`);
          break;
        }
      });
    },
    download() {
      ipcRenderer.on("downloadProgress", (event, progressObj) => {
        this.msg.percent = progressObj.percent || 0;
      });
    },
    update() {
      ipcRenderer.on("isUpdateNow", () => {
        ipcRenderer.send("isUpdateNow");
      });
    },
    updateApp() {
      ipcRenderer.send("checkForUpdate");
    },
    closeUpdate() {
      this.msg.close = false;
      this.msg.percent = 0;
      this.msg.install = false;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
*{
  margin: 0;
  padding: 0;
}
ul,li{
  list-style: none;
}
</style>
