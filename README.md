# gallery-react-IMOOC
首先感谢Materliu老师在IMOOC上的三个React相关教程[(地址)](http://www.imooc.com/u/102030/courses?sort=publish)。
虽然现在已经基本使用ES6语法，并且现在Yeoman的generator-react-webpack包也不再使用grunt架构，仅仅使用webpack管理，而且版本与老师视频之中的版本也有一定差距。
在我的实战过程中，还是遇到了很多大大小小的问题，以下是一些问题的总结和解决方法：
> 1. Yeomen的generator-react-webpack包生成的文件结构与老师生成的相差较多；
> 2. webpack的配置文件统一存放在/cfg目录中，修改其中的default.js文件即可；
> 3. 基本使用了简化方法书写函数；
> 4. React在ES6中去掉了getInitialState这个hook函数，并且将state放在constructor中实现，同时如果在方法中要使用this时，需要手动在constructor中绑定实例方法，或是使用更加方便简单的箭头函数；
> 5. findDOMNode在新版本中分割到了react-dom模块，需要单独引入；