const Controller = require('egg').Controller;
const operatePy = require('../middleware/operate');
const operateInstance = new operatePy();

const PY_COMMAND = {
    READ_LIST: "readlist",
    EXEC_COMMAND: "execcommand",
    ADD_DIR: "adddir",
    ADD_FILE: "addfile"
};

class OperateFileController extends Controller {
    parseAction () {
        const { ctx } = this;
        const message = ctx.args[0];
        let action = message.action;

        switch (action) {
            case PY_COMMAND.READ_LIST:
                this.readList();
                break;
            case PY_COMMAND.EXECCOMMAND:
                this.execCommand();
                break;
            case PY_COMMAND.ADD_DIR:
                this.addDirFun();break;
            case PY_COMMAND.ADD_FILE:
                this.addFileFun();break;
            default:
                break;
        }

    }

    async readList () {
        const { ctx, app } = this;
        // console.log('ctx222==', ctx.args);
        const client = ctx.socket.id;
        const message = ctx.args[0] || {};
        const { target, content } = message;
        // console.log(message, content);
        let dir = await operateInstance.readList(content);
        let msg = ctx.helper.parseMsg(message.action, dir, {client, target});
        // console.log(dir);
        // await ctx.socket.emit('message', new Buffer(JSON.stringify(dir)) );
        await ctx.socket.emit(client, new Buffer(JSON.stringify(msg)));
    }

    getContentWithPath (_path) {

    }


    async execCommand () {
        const { ctx, app } = this;
        const client = ctx.socket.id;
        const message = ctx.args[0] || {};
        const { target, content } = message;
        console.log('exec====', content);
        // let result = await operateInstance.executeCommand('python '+content);
        operateInstance.executeCommand('python '+content, ctx, message);
        // let msg = ctx.helper.parseMsg(message.action, result, {client, target});
        // console.log(result);
        // await ctx.socket.emit('message', new Buffer(JSON.stringify(dir)) );
        // await ctx.socket.emit(client, new Buffer(JSON.stringify(msg)));
    }

    async addDirFun () {
        const { ctx, app } = this;
        // console.log('ctx222==', ctx.args);
        const client = ctx.socket.id;
        const message = ctx.args[0] || {};
        const { target, content, params } = message;
        console.log('adddir==', message, content);
        let { url, name } = params;
        let dir = await operateInstance.createDir(url, name);
        let msg = ctx.helper.parseMsg(message.action, dir, {client, target});
        // console.log(dir);
        // await ctx.socket.emit('message', new Buffer(JSON.stringify(dir)) );
        await ctx.socket.emit(client, new Buffer(JSON.stringify(msg)));

        //创建目录后发送刷新指令
        let dir_2 = await operateInstance.readList(url);
        let msg_2 = ctx.helper.parseMsg(PY_COMMAND.READ_LIST, dir_2, {client, target});
        await ctx.socket.emit(client, new Buffer(JSON.stringify(msg_2)));
    }


    async addFileFun () {
        const { ctx, app } = this;
        // console.log('ctx222==', ctx.args);
        const client = ctx.socket.id;
        const message = ctx.args[0] || {};
        const { target, content, params } = message;
        console.log('adddir==', message, content);
        let { url, name } = params;
        let dir = await operateInstance.createFile(url, name);
        let msg = ctx.helper.parseMsg(message.action, dir, {client, target});
        // console.log(dir);
        // await ctx.socket.emit('message', new Buffer(JSON.stringify(dir)) );
        await ctx.socket.emit(client, new Buffer(JSON.stringify(msg)));

        //创建文件后发送刷新指令
        let dir_2 = await operateInstance.readList(url);
        let msg_2 = ctx.helper.parseMsg(PY_COMMAND.READ_LIST, dir_2, {client, target});
        await ctx.socket.emit(client, new Buffer(JSON.stringify(msg_2)));
    }
}

module.exports = OperateFileController;

exports.ping = async function() {
    const message = this.args[0];
    await this.socket.emit('res', `Hi! i've got your message:${message}`);
}
