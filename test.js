/**
  * webpack插件开发采用'动态原型模式'
  * 插件开发，最重要的两个对象：compiler、compilation
  *  compiler 对象代表了完整的 webpack 环境配置           ---- 编译器实体
  *  compilation 对象代表了一次单一的版本构建和生成资源     ---- 编译过程 （生命周期： 模块被加载，封闭，优化，分块，哈希和重建等）
  （当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息、回调）
  * @param options
  * @constructor
*/

 function MyPlugin (options) {
   // 根据options配置你的插件
 }

 // 我们可以在原型上添加一些方法
 // MyPlugin.prototype.someFunc = function() {/*something*/}

/** apply方法是必须要有的，因为当我们使用一个插件时（new somePlugins({})），
  * webpack会去寻找插件的apply方法并执行 (在这里注入compiler对象)
  * 然后要安装这个插件，只需要在你的 webpack 配置的 plugin 数组中加入一个实例：
  */

 MyPlugin.prototype.apply = function (compiler) {
    // compiler是编译器, compiler.plugin('***')就相当于给compiler设置了事件监听
   compiler.plugin('compile', function (params) {
     // compile（'编译器'对'开始编译'这个事件的监听）
     console.log('The compiler is starting to compile...')
   })
   // compilation（'编译器'对'编译ing'这个事件的监听，
  /* * 生命周期： 模块被加载normal-module-loader，封闭seal，优化编译optimize，
     * 树的异步优化optimize-tree(chunks, modules)，模块的优化optimize-modules(modules: Module[])，
     * 块的优化optimize-chunks(chunks: Chunk[]),可能运行很长时间
     * 一个模块构建开始前 build-module(module)
     * 一个模块中的一个生成资源被加到编译中。module-asset(module, filename)
     * 一个块中的一个生成资源被加到编译中。chunk-asset(chunk, filename)
     * 分块，哈希和重建）
     * */
   compiler.plugin('compilation', function (compilation) {
     console.log('The compiler is starting a new compilation...')
    // 在compilation事件监听中，我们可以访问compilation引用，它是一个代表编译过程的对象引用
    // 我们一定要区分compiler和compilation，一个代表编译器实体，另一个代表编译过程
     compilation.plugin('optimize', function () {
      // optimize('编译过程'对'优化文件'这个事件的监听)
       console.log('The compilation is starting to optimize files...')
     })
   })

   // emit（'编译器'对'生成最终资源'这个事件的监听）
   compiler.plugin('emit', function (compilation, callback) {
     console.log('The compilation is going to emit files...')
     // compilation.chunks是块的集合（构建后将要输出的文件，即编译之后得到的结果）
     compilation.chunks.forEach(function (chunk) {
        // chunk.modules是模块的集合（构建时webpack梳理出的依赖，即import、require的module）
        // 形象一点说：chunk.modules是原材料，下面的chunk.files才是最终的成品
       chunk.modules.forEach(function (module) {
            // module.fileDependencies就是具体的文件，最真实的资源【举例，在css中@import("reset.css")，这里的reset.css就是fileDependencie】
         module.fileDependencies.forEach(function (filepath) {
            // 到这一步，就可以操作源文件了
         })
       })

       chunk.files.forEach(function (filename) {
          // source()可以得到每个文件的源码 compilation.assets[filename] = {source: function(){}, size: function(){}}
         var source = compilation.assets[filename].source()
       })
     })
    // callback必须在最后调用， 也可以设置setTimeout做异步处理
    //  setTimeout(function() {
    //   console.log("Done with async work...");
    //   callback();
    // }, 1000);
     callback()
   })
 }

 module.exports = MyPlugin

 // 例子

 ```
 function FileListPlugin (options) {}

 FileListPlugin.prototype.apply = function (compiler) {
   compiler.plugin('emit', function (compilation, callback) {
      // 创建一个头部字符串：
     var filelist = 'In this build:\n\n'

      // 检查所有编译好的资源文件：
      // 为每个文件名新增一行
     for (var filename in compilation.assets) {
       filelist += ('- ' + filename + '\n')
     }

      // 把它作为一个新的文件资源插入到 webpack 构建中：
     compilation.assets['filelist.md'] = {
       source: function () {
         return filelist
       },
       size: function () {
         return filelist.length
       }
     }

     callback()
   })
 }

 module.exports = FileListPlugin;

 ```

// 插件引入

 ```
    var HelloWorldPlugin = require('hello-world');
    var webpackConfig = {
        // ... 这里是其他配置 ...
      plugins: [
          new HelloWorldPlugin({options: true})
        ]
      };
    ```
