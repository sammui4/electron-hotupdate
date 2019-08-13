<!--
 * @Author: w
 * @Date: 2019-08-05 16:11:20
 * @LastEditors: w
 * @LastEditTime: 2019-08-13 17:37:29
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
import { debuglog } from 'util';
// const packages = require('../package.json');      //获取当前用户信息
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
       
        ],
        title:''
      }
    };
  },
  mounted() {
    // this.returnMsg();
    // this.download();
    // this.update();
    // this.fetchUpdate()
    this.getUpdateInfo();
  },
  methods: {
    // downloadProgress() {
    //   ipcRendereron.on("downloadProgress", (event, data) => {
    //     this.percent = data.percent.toFixed(2);
    //     if (data.percent >= 100) {
    //       this.show = false;
    //     }
    //   });
    // },
    // returnMsg() {
    //   ipcRenderer.on("message", (event, data) => {
    //     switch(data.status){
    //       case -1:
    //         this.$message.error(`${data.msg}`);
    //       break;
    //       case 0:
    //         this.$message.info(`${data.msg}`);
    //       break;
    //       case 1:
    //         this.msg.loading = true;
    //         this.$message.success(`${data.msg}`);
    //       break;
    //       default:
    //         this.msg.loading = false;
    //         this.$message.success(`${data.msg}`);
    //       break;
    //     }
    //   });
    // },
    // download() {
    //   ipcRenderer.on("downloadProgress", (event, progressObj) => {
    //     this.msg.percent = progressObj.percent || 0;
    //   });
    // },
    // update() {
    //   ipcRenderer.on("isUpdateNow", () => {
    //     ipcRenderer.send("isUpdateNow");
    //   });
    // },
    // updateApp() {
    //   ipcRenderer.send("checkForUpdate");
    // },
    closeUpdate() {
      this.msg.close = false;
      this.msg.percent = 0;
      this.msg.install = false;
    },
    getUpdateInfo(){
      ipcRenderer.on("message", (event, data) => {
        switch(data){
          case 0:
            this.msg.show = false;
            this.$message.info(`${data.msg}`);
          break;
          case 1:
            this.msg.show = true;
            this.msg.loading = true;
            this.$message.success(`${data.msg}`);
          break;
          case 2:
            this.msg.show = true;
            this.msg.loading = false;
            this.$message.success(`${data.msg}`);
          break;
        }
      });
    },
    // fetchUpdate(){
 
    //   this.$http({
    //     method:'get',
    //     url:'/update'
    //   }).then(({data})=>{
    //     if(data.code==200){
          
    //       var final = this.compareVersion(packages.version,data.version);
    //       console.log(final);
    //       switch(final){
    //         case 0:
    //           this.$message.success('暂无新版本!');
    //         break;
    //         case 1:
    //           this.msg.show = true;
    //           this.$message.success('正在自动下载新版本，请稍候。。。');
    //         break;
    //         case 2:
    //           this.msg.show = true;
    //           this.$message.success('正在自动下载新版本，请稍候。。。');
    //         break;
    //       }
    //     }
    //   })
    // },
    // 0 一样（或者说不允许替代） 1非核心版本修改 2核心版本修改
    // v1本地版本 v2远程版本
    // compareVersion(v1,v2){
    //   if(v1==v2){
    //     return 0
    //   }
    //   var v1Arr = v1.toString().split('.');
    //   var v2Arr = v2.toString().split('.');
    //   if(v1Arr[1] > v2Arr[1]){
    //     return 0
    //   }
    //   if(v1Arr[1] < v2Arr[1] && v1Arr[2] > v2Arr[2]){
    //     return 0
    //   }
    //   if(v1Arr[1] === v2Arr[1]){
    //     return 1
    //   }
    //   return 2
    // }
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
