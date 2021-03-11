const fs = require('fs');
let fileData = JSON.parse(fs.readFileSync(`${__dirname}/sampleJob.json`).toString());
fileData['cpu'] = process.argv[2] || "1"
fileData['memory'] = process.argv[3] || "1Gi"
fileData['command'] =  [ '/bin/bash','-c',`TERM=xterm free -h; echo \'\nnumber of vCPU\';nproc;sleep ${process.argv[4] || "30"}` ]
fs.writeFileSync(`${__dirname}/sampleJob.json`, JSON.stringify(fileData, null, '  '))
