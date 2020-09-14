module.exports = app => {
    const { router, controller,io } = app;
    // console.log("io.controller==", controller);
    // console.log("io.controller22222222==", io);
    // io.of('/python').route('python', io.controller.operateFile.readlist)
    io.of('/').route('file-operate', io.controller.operateFile.parseAction);
}
