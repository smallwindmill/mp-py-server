var operatePy = require('./operate');
var operate = new operatePy();

// operate.initHomeDir();
(async ()=>{
    // let path = (await operate.readList((await operate.readList())[1].path))[2].path;
    // console.log('path==', path);
    // console.log('ddd===', await operate.executePy(path));
    // operate.downloadFile("https://dist-res-cn.oss-cn-shenzhen.aliyuncs.com/mcode-examples/DataScience/DataAnalysis/TheThreeKingdoms.zip");
    // (await operate.writeFile(path, new Buffer('print("Hello World!")')));
    // console.log((await operate.readFile(path)).toString());
})();
// operate.readList().then(res=>console.log(res))
// operate.executeCommand(`mkdir homedir\\myFirstProgrammer\\`)
// operate.executeCommand(`cd.> homedir\\myFirstProgrammer\\one.py`)
// operate.executePy(` homedir\\myFirstProgrammer\\one.py`)
// operate.executeCommand(`explorer.exe /select, homedir\\myFirstProgrammer\\one.py`)
// operate.executeCommand(`cp homedir\\myFirstProgrammer\\one.py homedir\\myFirstProgrammer\\one.txt`)
// operate.executeCommand(` homedir\\myFirstProgrammer\\one.txt`)
