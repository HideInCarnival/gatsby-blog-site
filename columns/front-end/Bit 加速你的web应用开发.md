---
title: "Bit: 加速你的web应用开发（一）"

date: "2021-05-24"
---

> Bit是一个通过各个独立的组件构建应用程序的工具，在Bit中我们构建组件而不是应用程序。在Bit的workspace中我们只有组件，而应用只不过是另一个组件。在Bit中我们思考更多的是组件而不是应用程序，你可以仅使用组件来构建一个微型前端。

## 通过Bit我们可以做到

- 建立组件生态系统
- 围绕组件建立更好的协同工作流程
- 集成不同的组件
- 标准化构建组件的方式
- 轻松管理各组件的依赖性
- etc

## 使用Bit

### 1. 安装

1. 安装bvm(Bit version manager)

```bash
npm i -g @teambit/bvm
```

​	or

```bash
yarn global add @teambit/bvm
```

2. 安装Bit

```bash
bvm install
```

3. 安装完成后需要将bit加入到环境变量

Bash

```bash
echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc && source ~/.bashrc
```

ZSH

```bash
echo 'export PATH=$HOME/bin:$PATH' >> ~/.zshrc && source ~/.zshrc
```

Windows

```bash
setx path "%path%;%LocalAppData%\.bvm"
```

4. 安装成功后可以使用 `bvm version`命令来查看BVM和Bit的版本以及它们的最新版本，并且可以通过` bvm upgrade`命令将Bit升级到最新版本

### 2. 初始化工作区（Workspace）

> 借助Bit的工作区，可以简单优雅地建立和管理多个独立的组件

1. 建立一个Bit工作木落

   ```bash
   bit new react-workspace <my-workspace-name>
   ```

2. 安装相关依赖

   ```bash
   cd <my-workspace-name>
   bit install 
   ```

3. 当前目录结构：

   |---- <my-workspace-name>

   |	|---- .bit // 工作空间中组件发行版本的存储位置

   |	|---- node_modules

   |	|---- .bitmap // 工作空间中被跟踪的组件与其在物理空间上位置的映射

   |	|---- .gitignore

   |	|---- pnpm-lock.yaml

   |	|---- workspace.json // workspace的配置文件

### 3.建立一个组件

1. 建立一个组件并把它加入工作空间

   ```bash
   bit create react-component ui_design/button
   ```

   Bit 会生成如下文件

   ![Bit01](https://bobbengo.oss-cn-hangzhou.aliyuncs.com/bit/Bit01.png)

2. 为测试文件安装依赖

   ```bash
   bit install @testing-library/react
   ```

3. 运行

   ```bash
   bit start
   ```

   启动本地开发服务器后进入 localhost://3000 查看：

   ![Bit02](https://bobbengo.oss-cn-hangzhou.aliyuncs.com/bit/bit02.png)

   可以看到我们刚刚创建的Button组件， 点击 `live preview`查看组件详情：

   ![Bit03](https://bobbengo.oss-cn-hangzhou.aliyuncs.com/bit/bit03.png)

   我们可以在该页面上实时修改代码来查看该组件的显示效果，这里我添加一个新的Button组件, 稍后我会演示这一点。

### 4.修改我们的组件

1. 进入button文件夹下的button.tsx文件

   将原文件：

   ```js
   import React from 'react';
   
   export type ButtonProps = {
     /**
      * a text to be rendered in the component.
      */
     text: string
   };
   
   export function Button({ text, importance }: ButtonProps) {
     return (
       <div>
         {text}
       </div>
     );
   }
   ```

   修改为：

   ```js
   import React from 'react';
   
   export type ButtonProps = {
     /**
      * a text to be rendered in the component.
      */
     text: string
     /**
      * sets deferent button styles.
      */
      importance?: 'primary' | 'default' | 'dashed' 
   };
   
   export function Button({ text, importance }: ButtonProps) {
     return (
       <button data-importance={importance || 'primary'}>
          {text}
       </button>
     );
   }
   ```

   这里我们将原模版组件的`div`修改为`button`标签，并且新增一个importance的属性来控制Button组件的样式，创建一个 *button.module.css* 文件

   ```css
   .button {
     margin-right: 8px;
     margin-bottom: 12px;
     border-radius: 2px;
     font-size: 12px;
     height: 40px;
     padding: 6.4px 15px;
     background-image: none;
     background: #fff;
     border: 1px solid #d9d9d9;
     border-radius: 2px;
     box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
     color: rgba(0,0,0,.85);
     cursor: pointer;
     display: inline-block;
     font-size: 14px;
     font-weight: 400;
     height: 32px;
     line-height: 1.5715;
     padding: 4px 15px;
     position: relative;
     text-align: center;
     touch-action: manipulation;
     transition: all .3s cubic-bezier(.645,.045,.355,1);
     -webkit-user-select: none;
     -moz-user-select: none;
     -ms-user-select: none;
     user-select: none;
     white-space: nowrap;
   }
   .button[data-importance='primary'] {
     background: #1890ff;
     border-color: #1890ff;
     box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
     color: #fff;
     text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
   }
   .button[data-importance='primary']:hover {
     background: #40a9ff;
     border-color: #40a9ff;
     color: #fff;
   }
   .button[data-importance='default']:hover {
     background: #fff;
     border-color: #40a9ff;
     color: #40a9ff;
   }
   .button[data-importance='dashed'] {
     background: #fff;
     border-color: #d9d9d9;
     border-style: dashed;
     color: rgba(0,0,0,.85);
   }
   .button[data-importance='dashed']:hover {
     background: #fff;
     border-color: #40a9ff;
     color: #40a9ff;
   }
   ```

   并在*botton.tsx中引入*

   ```js
   import React from 'react';
   import styles from './button.module.css';
   
   export type ButtonProps = {
     /**
      * a text to be rendered in the component.
      */
     text: string
     /**
      * sets deferent button styles.
      */
      importance?: 'primary' | 'default' | 'dashed' 
   };
   
   export function Button({ text, importance }: ButtonProps) {
     return (
       <button className={styles.button} data-importance={importance || 'primary'}>
         {text}
       </button>
     );
   }
   ```

   再来看我们的效果

   ![Bit03](https://bobbengo.oss-cn-hangzhou.aliyuncs.com/bit/bit04.png)

   修改我们的`importance`属性

   ![Bit03](https://bobbengo.oss-cn-hangzhou.aliyuncs.com/bit/bit05.png)

   修改*button.composition.tsx*文件

   ```js
   import React from 'react';
   import { Button } from './button';
   
   export const PrimaryButton = () => (
     <Button text="hello from Button" />
   );
   
   export const DefaultButton = () => (
     <Button text="hello from Button" importance="default" />
   );
   
   export const DashedButton = () => (
     <Button text="hello from Button" importance="dashed" />
   );
   
   ```

   可以看到页面的**Compositons**也对应发生变化

   ![Bit03](https://bobbengo.oss-cn-hangzhou.aliyuncs.com/bit/bit06.png)

   到这里一个简单的Button组件就创建完成了，如果需要在别的组件中引入该Button组件，例如一个导航Menu组件，我们只需要重复上述步骤创建一个Menu组件，按我们的要求做对应的修改，并在`Menu.tsx`中引入该Button组件即可使用：

   ```js
   import React from 'react';
   import { Button } from '@my-scope/ui_design.button'
   // node_modules/@my-scope/ui_design.button
   
   export const Menu = ({ children, ...rest }) => {
     return (
       <div {...rest}>
         <Button>Click here</Button>
       </div>
     )
   }
   ```

   综上，相信我们已经看到了Bit组织各个独立组件的优秀能力，Bit通过组件驱动开发，在Bit的中我们提倡构建更小，可重用的组件，并使用他们来构建更具体的功能，在后续的文章中我们将会看到Bit带来的组件可组合性的提升，使我们的应用程序更加模块化，以及分发组件开发提升团队协作等的能力。