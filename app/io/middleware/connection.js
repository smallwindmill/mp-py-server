module.exports = app => {
    return async (ctx, next) => {
        ctx.socket.emit('res', 'connected!');
        await next();
        console.log('disconnection!');
    }
}

const tick = (id, msg) => {
    logger.debug("#tick", id, msg);
    socket.emit(id, msg);
    app.io.of('').adapter.remoteDisconnect(id, true, err => {
        logger.error(err);
    })
}


module.exports = app => {
    return async (ctx, nect) => {
        if(true) {
            ctx.socket.disconnect();
            return;
        }
        await next();
        console.log('disconnection!');
    }
}


module.exports = app => {
    return async (ctx, next) => {
        ctx.socket.emit('res', 'packet recevied!');
        console.log('packet:', ctx.packet);
        await next();
    }
}
