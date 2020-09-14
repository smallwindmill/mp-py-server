module.exports = {
    parseMsg(action, content, metadata = {}){
        const meta = Object.assign({}, {
            timestamp: Date.now(),
        }, metadata);

        return {
            meta,
            data: {
                action,
                content
            }
        }
    }
}
