const http = require('http');
const fs = require("fs");
const url = require("url");
var formdata = require('formidable');
const server = http.createServer();
const HTTP_PORT = 3456; 
/**
 * 
 * @param {http.IncomingMessage} req request 
 * @param {http.ServerResponse} res response
 * @param {string} url_path url路径部分
 * @param {string} url_ext url扩展名 
 */
const onGet= function(req,res,url_path,url_ext){  
    let contentType;
    switch(url_ext){
        case "html":{
            contentType = "text/html";
            break;
        }
        case "js":{
            contentType = "text/javascript";
            break;
        }
        case "css":{
            contentType = "text/css";
            break;
        }
        case "png":case "jpg":case "jpeg":case "gif":case "icon":{
            contentType = `image/${url_ext}`;
            break;
        }
        default:{
            return false;
        }
    } 
    const filepath=`${__dirname}\\res${url_path}`;
    fs.exists(filepath,exists=>{
        if(exists){
            var file = fs.createReadStream(filepath);
            res.writeHead(200, {'Content-Type' : contentType});
            file.pipe(res); 
        }else{
            output404(req,res,contentType);
        }
    }); 
    return true;
}
/**
 * 
 * @param {http.IncomingMessage} req request 
 * @param {http.ServerResponse} res response
 * @param {string} url_path url路径部分
 * @param {string} url_ext url扩展名 
 */
const onPost= function(req,res,url_path,url_ext){
    switch(url_path){
        case "/upload":{ 
            //简易提交,此处没有校验文件合法性及大小,仅作上传测试
            const reqData = {
                data:{},
                files:[]
            };
            let foldpath = `/upload/`;
            let form = new formdata.IncomingForm();
            form.uploadDir = `${__dirname}/res${foldpath}`;
            form.keepExtensions=true;
            //创建目录
            if(!fs.existsSync(form.uploadDir)){
                fs.mkdirSync(form.uploadDir);
            }
            //捕获键值数据
            form.on("field",(name,value)=>{
                reqData.data[name]=value;
            })
            .on("file",(name,file)=>{
                let filepath = file.path; 
                let m =filepath.match(/[\\\/]([^\\\/]+)$/);
                if(m===null){ //异常信息
                    return;
                }else{                   
                    filepath = m[1];
                }
                filepath = foldpath + filepath;
                reqData.files.push({
                    //文件大小
                    size:file.size,
                    //客户端提交的文件名
                    fileOriginName:file.name,
                    //客户端提交的键值对的键
                    name:name,
                    //文件存储路径
                    filePath:filepath
                });
            }).on("end",()=>{     
                //输出到接口           
                res.write(JSON.stringify(reqData));
                res.end();
            });
            form.parse(req);
            return true;
        }
    }     
}
/**
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
const output404 = (req,res,contentType)=>{
    if(!contentType){
        contentType = "text/plain";
    }
    res.setHeader("content-type",contentType);
    res.statusCode = 404; 
    res.write('404,url=');
    res.write(req.url);
    res.end();
};

server.on('request',
(req,res)=>{
    let url_path = url.parse(req.url).pathname; 
    if(url_path[url_path.length-1]==="/"){
        url_path += "index.html";
    } 
    let extindex = url_path.lastIndexOf(".");
    let ext;
    if(extindex===-1){
        ext = "";
    }else{
        ext = url_path.substr(extindex+1).toLowerCase();
    }
    switch(req.method){
        case "GET":{
            if(onGet(req,res,url_path,ext))return;
        }
        case "POST":{
            if(onPost(req,res,url_path,ext))return;
        }
    }
    output404(req,res);
});

server.listen(HTTP_PORT,()=>{
    console.log(`服务端已开启,访问地址 http://127.0.0.1:${HTTP_PORT}/ `);
});