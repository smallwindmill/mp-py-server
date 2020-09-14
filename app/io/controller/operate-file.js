const Controller = require('egg').Controller;
const operatePy = require('../middleware/operate');
const operateInstance = new operatePy();

class OperateFileController extends Controller {
    parseAction () {
        const { ctx, app } = this;
        const message = ctx.args[0];
        let action = message.action;

        switch (action) {
            case "readlist":
                this.readList();
                break;
            case "execcommand":
                this.execCommand();
                break;
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
        await ctx.socket.emit(message.action, new Buffer(JSON.stringify(msg)));
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
        // await ctx.socket.emit(message.action, new Buffer(JSON.stringify(msg)));
    }
}

module.exports = OperateFileController;

exports.ping = async function() {
    const message = this.args[0];
    await this.socket.emit('res', `Hi! i've got your message:${message}`);
}
