---
title: "Bit: 加速你的web应用开发（二）"

date: "2021-05-24"
---
>同React，Vue，Angular等框架一样，Bit使我们应用程序更加组件话，并且通过Bit你可以将组件添加到要构建的任何内容中。Bit拥有强大的分发组件开发的能力，使得每个参与的开发者个人或团队都可以自主开发，公开和集成组件，得益于Bit的远程空间（remote scope）

## 什么是remote scope

​	我们可以将自己的组件导出到Bit的remote scope，从而该组件可以在任何其他web项目中使用。简而言之，remote scope就是用来在Bit.dev或其他自Bit托管的服务器上远程存储可供其他web应用使用的导出组件的地方。

## 创建一个[Bit.dev](https://bit.dev/)账户

1. 使用`bit login`命令连接到bit远程仓库

   ```bash
   bit login
   ```

2. 在 bit.dev 中登陆，显示登录成功信息

   ```bash
   successfully added @bit as a scoped registry at /Users/yingbobin/.npmrc
   success! logged in as hideincarnival
   ```

   ![bit07](https://bobbengo.oss-cn-hangzhou.aliyuncs.com/bit/bit07.png)

## 创建一个 remote scope 

![bit07](https://bobbengo.oss-cn-hangzhou.aliyuncs.com/bit/bit08.png)

## 修改默认Scope

1. 配置*workspace.jsonc*文件

```json
"teambit.workspace/workspace": {
    "name": "bit-workspace",
    "icon": "https://static.bit.dev/bit-logo.svg",
    "defaultDirectory": "{scope}/{name}",
    "defaultScope": "hideincarnival.bit_demo" // username / scopename
  },
```

2. 重启Bit服务器使配置生效

```bash
bit start
```

## 导出组件

1. 使用`bit tag`命令标记组件信息

   给单独的组件标记：

   ```bash
   bit tag button --patch --message "first version" 
   ```

   给导出的所有组件标记：

   ```bash
   bit tag --all --message "first version"
   ```

   标记成功的提示信息：

   ```bash
   new components
   (first version for components)
        > ui/button@0.0.1
   ```

2. 导出组件

   使用`bit export`命令导出我们标记过的组件:

   ```bash
   bit export
   ```

   导出成功：

   ```bash
   exported the following 1 component(s):
   hideincarnival.bit_demo/ui_design/button
   ```

3. 查看 remote scope

   进入 https://bit.dev/usermane/scopename查看新导出到Bit.dev的组件

   ![bit07](https://bobbengo.oss-cn-hangzhou.aliyuncs.com/bit/bit09.png)

## 在其他项目中使用Bit导出的组件

​	上面我们有说到，remote scope的作用就是方便组件的复用，你可以将组件用于其他web 应用中

1. 新建一个react demo

   ```bash
   npx create-react-app my-app
   ```

2. 配置 Scoped Registry

   ```bash
   npm config set '@YourUserName:registry' https://node.bit.dev
   ```

   or

   ```bash
   yarn config set @YourUserName:registry https://node.bit.dev
   ```

   

3. 安装对应组件

   ```bash
   yarn add @hideincarnival/bit_demo.ui_design.button
   ```

4. 在 *App.js* 中引入

   ```js
   import logo from './logo.svg';
   import './App.css';
   import {Button} from '@hideincarnival/bit_demo.ui_design.button'
   
   function App() {
     return (
       <div className="App">
         <header className="App-header">
           <img src={logo} className="App-logo" alt="logo" />
           <p>
             Edit <code>src/App.js</code> and save to reload.
           </p>
           <a
             className="App-link"
             href="https://reactjs.org"
             target="_blank"
             rel="noopener noreferrer"
           >
             Learn React
           </a>
         </header>
         <Button text="click here" />
       </div>
     );
   }
   
   export default App;
   
   ```

5. `yarn start`启动本地开发服务器

   ![bit07](https://bobbengo.oss-cn-hangzhou.aliyuncs.com/bit/bit10.png)

   可以看到我们的在Bit中创建的按钮组件已经应用在另一个web项目中啦！



