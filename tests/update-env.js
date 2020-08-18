var fs = require('fs');
var envInstallPath = '/usr/local/lib/node_modules/@elucidatainc/pollycli/src/env.json';
var pollyEnv = JSON.parse(fs.readFileSync(envInstallPath));
if (process.argv[2] == 'dev') {
  pollyEnv.baseApi = 'https://api.devpolly.elucidata.io';
  pollyEnv.baseV2Api = 'https://v2.api.devpolly.elucidata.io';
  pollyEnv.dockerDomain =  'docker.devpolly.elucidata.io';
} else if (process.argv[2] == 'test') {
  pollyEnv.baseApi = 'https://api.testpolly.elucidata.io';
  pollyEnv.baseV2Api = 'https://v2.api.testpolly.elucidata.io';
  pollyEnv.dockerDomain =  'docker.testpolly.elucidata.io';
}
var newData = JSON.stringify(pollyEnv, null, 2);
fs.writeFileSync(envInstallPath, newData);
