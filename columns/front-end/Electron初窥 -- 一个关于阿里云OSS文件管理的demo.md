---

title: "Electron初窥 -- 一个关于阿里云OSS文件管理的demo"

date: "2021-01-03"

---

> 起因：大概在一两周之前，正好完成了一个记录纪念日的微信小程序，其中默认用到了两张图，在七牛云中上传后分别引入。将图床迁到阿里云之后，恰巧之前略有了解Electron，于是产生了想要写一个阿里云OSS对bucket中对象进行管理的桌面端程序，于是便有了这次Electron的首次实践。

写完之后大概是下面这个样子：

<img src="https://bobbengo.oss-cn-hangzhou.aliyuncs.com/imgs/electron-demo.png" style="zoom:33%;" />



## 简单认识Electron

在简单写了一个Hello World的Electron程序之后，从官网的描述中可以得知：Electron运行`package.json` 的 `main` 脚本的进程被称为**主进程**。 一个 Electron 应用总是有且只有一个主进程。 在主进程中运行的脚本通过创建web页面来展示用户界面。

Electron使用chromium来展示web页面，每个web页面运行在Electron叫做渲染进程的进程中。在Electron中，web页面也可以在Node.js API和操作系统做一些底层交互。虽然如此，在页面中操作原生GUI资源是非常危险的，而且容易造成内存泄漏。因此，我们需要在渲染进程和主进程间进行通讯。

对此，Electron主要提供了一下方法：

1. 使用`picMain` 和`ipcRenderer` 模块发送消息
2. 使用remote进行RPC方式通信

## 关于项目

web页面主要使用react Hooks + redux + elementUI

sdk使用ali-oss 主要实现的功能都在阿里云[Browser.js](https://help.aliyun.com/document_detail/52834.html?spm=a2c4g.11174283.2.24.e1f17da2f8ch4g)的帮助文档中找到

开发阶段通过Electron的`loadUrl`方法响应webpack devServer的本地服务器来实现页面与代码的实时同步。

## 一些问题

这个项目本身只是刚接触Electron的一个demo，于是在功能的编写和Electron的使用过程中，都遇上了一些麻烦，本博客主要探讨的正是这些已解决或未解决的问题。



### 关于文件的下载

使用阿里云通过url下载文件：

```js
const OSS = require('ali-oss');

const client = new OSS({
  region: '<Your region>',
  accessKeyId: '<Your AccessKeyId>',
  accessKeySecret: '<Your AccessKeySecret>',
  bucket: '<Your bucket name>'，
});

// 配置响应头实现通过URL访问时自动下载文件，并设置下载后的文件名。
const filename = 'test.js' // filename为自定义下载后的文件名。
const response = {
  'content-disposition': `attachment; filename=${filename}`
}
// object-key表示从OSS下载文件时需要指定包含文件后缀在内的完整路径，例如abc/efg/123.jpg。
const url = client.signatureUrl('object-key', { response });
console.log(url);
```

**单文件下载**：

得到该url之后只需要设置一个a标签的href属性值为该url即可在点击该标签后进行下载。在使用浏览器时，会默认下载到已经设定好的路径下，而在Electron程序中，会自动弹出路径选择对话框并选择要下载的路径之后对文件进行下载。

**文件批量下载**：

先将要下载的所有单文件url保存在一个数组里，然后通过循环该数组调用locatin.href = url 访问该url来下载文件，但是该方法存在如下问题：

数组循环的过程中页面还未跳转，location.href的值会先被数组中循环的元素覆盖，结果只会执行location.href = 数组最后一个url，也就是始终只下载选中的最后一个文件

然后我尝试将location.href改成window.open，这似乎是可行的：

在浏览器中，由于有默认的下载路径，会将选中文件一一下载到对应的目录中。

但是在Electron程序内，调用window.open 以在网页中创建新窗口时，会自动为rul创建一个新的BrowserWindow实例。于是批量下载几个文件，Electron就会创建几个BrowserWindow实例，就会出现多个空白的程序窗口，并且需要为每一个文件选择存储的位置，这显然不满足我们的需求。

于是我想，能不能也在下载内容之前，先把要存储的路径保存下来，这样在循环数组下载内容的时候就可以避免为每一个文件重复选择存储的位置了。似乎Electron的dialog模块能够解决这个问题，只需要下载之前将下载信息传递给主进程，然后在主进程调用dialog模块选择存储的位置即可。

但是在选好了下载位置之后，怎样才能让electron下载文件呢？

在翻看官方文档的过程中，我发现在Electron程序中，webContents模块负责控制和渲染网页，并且该类存在一个实例方法`downloadURL(url)`,只需要调用该方法便可以进行文件的下载，但是这过程中依然没有用上事先保存好的将要下载的文件路径，我们仍需手动设置每一个文件下载的路径。好在文档咋弄提到了另外一点：Initiates a download of the resource at `url` without navigating. The `will-download` event of `session` will be triggered.（通过该url启动资源下载而不导航。session的will-download事件将会被触发）。

我们知道webContents实际上是一个EventEmitter了在调用contents.downloadURL之后，session模块的will-download事件将会被触发。而session模块用来管理浏览器会话、cookie、缓存、代理设置等。在触发will-download事件后，会执行一个回调函数，官方文档中给出如下示例：

```js
const { session } = require('electron')
session.defaultSession.on('will-download', (event, item, webContents) => {
  event.preventDefault()
  require('request')(item.getURL(), (data) => {
    require('fs').writeFileSync('/somewhere', data)
  })
})
```

示例中的回调函数默认传入三个参数，分别是Event，DownloadItem，webContents。通过event.preventDefault()可以阻止默认的下载事件，然后通过item的获取下载文件的url，通过node的request模块发送请求，将返回的文件数据通过node的fs模块写入/somewhere目录下。

以下则是我的改写

```js
win.webContents.session.on('will-download', (event, item, webContents) => {
        const filename = item.getFilename()
        item.setSavePath(savePath + '/' + filename)

        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                    console.log('Download is interrupted but can be resumed')
                } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    console.log(`Received bytes: ${item.getReceivedBytes()}`)
                    win.webContents.send('downloadingFile', {
                        url: item.getURL(),
                        progress: (item.getReceivedBytes() / item.getTotalBytes()).toFixed(3)
                    })
                }
            }
        })
        item.on('done', (event, state)=> {
            if (state === 'complated') {
                console.log('download successfully');
            }else {
                console.log(state);
            }
        })
    })
```

item对象中有很多实用的方法，通过setSavePath可以将我们的文件下载到之前保存的路径下，调用isPaused方法可以判断下载是否暂停，通过监听**update**事件可以获取文件的下载进度，这里我将下载进度通过webContents的send方法发送到渲染进程，监听**down**事件可以获知是否完成下载。这样我只需要下载之前在渲染进程向主进程发送一个下载请求，利用主进程的dialog模块选择文件夹，在确认下载之后，将需要下载的url数组发送到主进程调用webContents的downloadURL方法就好了。以下是接受渲染进程下载请求的相关代码

```js
let savePath = ''
ipcMain.on('download', async (evt, args) => {
    const resultPath = await dialog.showOpenDialog({
        filters: [
            {
                name: 'All',
                extensions: '*'
            }
        ],
        properties: [
            "openDirectory"
        ]
    })
    savePath = resultPath.filePaths[0]
    if(!resultPath.canceled) {
        if (win) {
            win.webContents.send('downloadConfirm', true) // 告诉渲染进程已经选择好下载路径并确认下载
        }
        args.downloadList.forEach(ele => {
            win.webContents.downloadURL(ele.url)
        })
    }
})
```



### url的批量导出

这里的url批量导出，实际上是导出一个csv文件

、、、

事实上，将json数据转换成csv数据不过是将形如

```json
[
  {'filename': 'bg1.jpg', 'url': 'bg1url'},
  {'filename': 'bg2.jpg', 'url': 'bg2url'}
]
```

的json数据转换成如下格式数据

```json
filename,url
bg1.jpg,bg1url
bg2.jpg,bg2url
```

也就是将相应的数据转换成以`,`以及`/r/n（匹配不同操作系统的回车）`分隔即可

我写了一个简单的方法来转换相应的数据

```js
export function jsonToCsvData (data, title) {
    /*
    * 
    * ## data oroginal data
    * ## title:[], // table header
    */ 
    let tableHeader = '';
    let rowArr = [];
    // set table header
    if(title.length) {
        title.forEach(ele => {
            tableHeader += ele + ','
        })
        rowArr.push(tableHeader.substring(0, tableHeader.length - 1))
    }

    // modify data's format
    if(data.length) {
        data.forEach(ele => {
            let row = ''
            for (const key in ele) {
                if (ele.hasOwnProperty(key)) {
                    const element = ele[key];
                    row += element + ','
                }
            }
            rowArr.push(row.substring(0, row.length - 1))
        })
    }

    const CSV = rowArr.join('\r\n');
    return CSV;
}
```

传入对应数据及表头之后，就得到了我们最后想要的字符串

```js
const csvData = jsonToCsvData(data, ['object', 'url'])
```

首先通过数据生成要下载的csv文件的url

```js
const _utf = '\uFEFF' // 为了使Excel以utf-8的编码模式，解决中文乱码的问题
// 转换成blob格式，防止内容太多生成的href太长
const csvToBlob = new Blob([_utf + csvData], {
  type: 'text/csv'
})
const url = URL.createObjectURL(csvToBlob)
```

然后，只需要将a标签的href属性赋值为该url后点击即可下载，另外，通过设置a标签的download属性可以修改下载的文件名。



> 至于批量上传和删除功能，只需在ali-oss提供的api上作稍许修改即可,我这里使用分片上传并通过内部progress参数获取上传进度上传进度，值得注意的是:分片上传每一个文件最好使用一个新的OSS实例，详情请移步至[官方文档](https://help.aliyun.com/document_detail/64047.html?spm=a2c4g.11186623.6.1369.49b943c4UXVnJk)

### 数据的持久化

由于使用阿里云oss的sdk需要提供accessKeyId以及accessKeySecret以及bucket(在browser.js中无法操作bucket)。因此，将必要的用户信息，首选项设置或者需要的操作记录保存下来是有必要的。

使用window.localStorage，存在以下问题：

- localStorage仅在浏览器(渲染进程)中起作用
- localStorage的容错性不是很高，因此，如果您的应用遇到错误并意外退出，则可能会丢失数据
- localStorage仅支持持久字符串

这里我选择使用electron-store模块

使用非常简单：

安装

```js
 npm install electron-store
```

创建一个store

```js
const Store = require('electron-store');

const schema = {
    userInfo: {
        accessKeyId: '',
        accessKeySecret: '',
        bucket: ''
    }
}
const store = new Store({schema});

module.exports = store
```

操作数据

```js

// Use dot-notation to access nested properties
store.set('userInfo.accessKeyId', accessKeyId);
store.set('userInfo.accessKeySecret', accessKeySecret)
store.set('userInfo.bucket', bucket)

console.log(store.get('userInfo'));
 
store.delete('userInfo.accessKeyId');
console.log(store.get('userInfo.accessKeyId'));
```



## 总结

作为浅尝Electron的一个小demo，让我看到了js的更多可能，你如果能开发一个网站，就可以建立一个桌面应用程序，在开发中，只需要关注应用的核心部分即可，只需要使用web技术，就能构建出兼容Mac， WIndows， Linux三个平台的应用程序。