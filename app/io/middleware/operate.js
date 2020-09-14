const fs = require('fs');
const os = require('os');
const path = require('path');
const child_process = require('child_process');
const request = require("request");
const compressing = require('compressing');

class pythonOperate {
    constructor(){
        this.homedir = path.resolve(os.homedir(), "./documents/mindplus-py");
    }

    initHomeDir() {
        child_process.exec(`mkdir ${this.homedir}`, (err,res)=>{
            if(err){
                this.errlog(err);
            }
        })
    }

    transferPath (path) {
        return path.replace(this.homedir, '\\builtInDirectory');
    }

    parsePath (path) {
        return path.replace(/\\builtInDirectory/gi, `${this.homedir}`);
    }


    readList (path_inner) {
        path_inner = path_inner?this.parsePath(path_inner) : this.homedir;
        return new Promise((resolve, reject)=>{
            console.log('path_inner==========', path_inner);
            fs.readdir(path_inner, (err, res)=>{
                console.log('res========', res);
                if(err){
                    resolve({error:err});
                    return;
                }
                let dirs = [];
                let count = 0;
                for(let i in res){
                    let _path = path.join(path_inner, res[i]);
                    fs.stat(_path, (err, status)=>{
                        count++;
                        if(err){
                            this.errlog(_path, err);
                        }else{
                            let item = {
                                name: res[i],
                                path: this.transferPath(_path),
                                isFile: status.isFile(),
                                isDir: status.isDirectory()
                            };
                            dirs.push(item);
                        }

                        if(count == res.length){
                            resolve(dirs);
                        }
                    })
                }
            })
        })
    }

    async readListWithPath(path) {

    }

    async createFile (path, name){

    }

    async writeFile (path, buffer){
        return new Promise((resolve, reject)=>{
            fs.writeFile(path, buffer, (err, res)=>{
                if(err){
                    this.errlog(err);
                    reject(err);
                }else{
                    resolve(res);
                }
            })
        })
    }

    async readFile (path){
        return new Promise((resolve, reject)=>{
            fs.readFile(path, "utf-8", (err, res)=>{
                if(err){
                    this.errlog(err);
                    reject(err);
                }else{
                    resolve(res);
                }
            })
        })
    }

    async renameFile (oldPath, newPath){
        return this.executeCommand(`cp ${oldPath} ${newPath}`);
    }

    async deleteFile (path){
        return this.executeCommand(`rm ${path}`);
    }

    async openDir (path){
        return this.executeCommand(`explorer.exe /select, ${path}`);
    }

    async executeCommand(command, ctx, message) {
        return new Promise((resolve, reject)=>{
            /*child_process.exec(this.parsePath(command), (err,res)=>{
                if(err){
                    // this.errlog(err);
                    resolve({err:err});
                    console.log('res==',res);
                    console.log('err==', err);
                }else{
                    resolve(res);
                    // console.log('dd==', res);
                }
            })*/

            let client = ctx.socket.id;
            let { target, content } = message;
            let spawn_py = child_process.spawn('py', [this.parsePath(command)]);
            spawn_py.stdout.on('data', function (data) {
                console.log('stdout: ' + data);
                let msg = ctx.helper.parseMsg(message.action, data.toString(), {client, target});
                ctx.socket.emit(message.action, new Buffer(JSON.stringify(msg)));
            });

            spawn_py.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
                let msg = ctx.helper.parseMsg(message.action, data.toString(), {client, target});
                ctx.socket.emit(message.action, new Buffer(JSON.stringify(msg)));
            });

            spawn_py.on('close', function (code) {
                console.log('子进程已退出，退出码 '+code);
            });
        })
    }

    async executePy(path) {
        // 根据路径获取文件夹，进入文件夹再执行命令，避免因为相对位置获取静态资源出错
        let dir = path.split('\\');
        let name = dir.pop();
        dir = dir.join('\\');
        if(path.match(/.py$/)){
            return this.executeCommand(`C: && cd ${dir} && py "${name}"`);
        }else{
            return this.executeCommand(`C: && cd ${dir} && "${name}"`);
        }
    }

    errlog (...args){
        console.log('errr==', ...args);
    }

    // 下载文件到本地
    async downloadFile (url){
        let dirPath = this.homedir;
        let fileName = url.split('/').pop();
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
            console.log("文件夹创建成功");
        } else {
            console.log("文件夹已存在");
        }

        //循环多线程下载
        for (let i = 0; i < 1; i++) {
            let stream = fs.createWriteStream(path.join(dirPath, fileName));
            request(url).pipe(stream).on("close", (err) => {
                console.log(fileName + "下载完毕");
                this.unzip(path.join(dirPath, fileName));
            });
        }
    }

    // 解压文件
    unzip (path, name){
        console.log(path, this.homedir);
        compressing.zip.uncompress(path, path.replace(/.zip/gi, ''))
         .then(() => {
            console.log('success');
            this.executeCommand(`rm ${path}`)
         })
         .catch(err => {
            console.error(err);
         });
    }
}


// exports.default = pythonOperate;
module.exports = pythonOperate;

