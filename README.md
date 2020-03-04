# multi-image-preview-and-upload
multi image preview and upload/HTML5多图片预览上传

此demo基于原生JS,主要功能为HTML5本地预览+ajax多图片资源提交,服务端采用nodejs简易搭建.

服务端功能仅为测试上传,未做文件合法校验,大小校验,数量限制等判断,请勿直接拷贝到您的项目代码中.

上传的文件将保存在src\res\upload目录中.

 

测试项目创建
npm install

测试项目运行
node ./src/main.js

测试项目访问
http://127.0.0.1:3456/

预览图
![preview](https://github.com/zhaixiaowai/multi-image-preview-and-upload/blob/master/src/res/preview.png?raw=true)
