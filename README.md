# how to write a webpack-plugin

### 官方文档 
    https://webpack.github.io/docs/how-to-write-a-plugin.html

    中文文档： http://www.css88.com/doc/webpack2/development/how-to-write-a-plugin/
     
    插件API： http://www.css88.com/doc/webpack2/api/plugins/

### 简单例子
    https://webpack.github.io/docs/how-to-write-a-plugin.html#a-simple-example

    在compilation的emit事件或之前，将你需要生成的文件放到webpack的compilation.assets里，这样就可以借助webpack的力量帮你生成文件，而不需要自己手动去写fs.writeFileSync。

    ```
    compilation.assets['filelist.md'] = {
        source: function() {
          return filelist;
        },
        size: function() {
          return filelist.length;
        }
    };
    
    ```
