#!/usr/bin/env node

require = require('esm')(module, {
  force: true
});
const os = require('os');
const path = require('path');
const dataStore = require('data-store');
const fs = require('fs');
const htmlParser = require('node-html-parser');

global.pollystore = new dataStore.Store({
  path: path.join(os.homedir(), '.config/pollycli/credentials.json')
});
const axios = require('axios');
const pollyEnv = require('../../src/env.json');
const pollyHeaders = require("../../src/pollyheaders");
const pollyHelper = require("../../src/polly-helpers");
const finalData = [];
const fileNamePrefix = path.basename(process.argv[3]).split('.log')[0];
(async () => {
  for (const eachLine of process.argv[2].split('\n')) {
    const relevantData = eachLine.trim().split('status')[1].trim();
    const jobId = relevantData.split('--job-id')[1].trim();
    const workspaceId = relevantData.split('--job-id')[0].trim().split('--workspace-id')[1].trim();
    const jobUrl = `${pollyEnv.baseV2Api}/projects/${workspaceId}/jobs/${jobId}`;
    try {
      let postData = await axios.get(jobUrl, await pollyHeaders.getV2Headers());
      const neededData = postData.data.data[0].attributes;
      finalData.push(neededData);
    } catch (error) {
      console.log(`Not able to get the status for job with workspace ID ${workspaceId} and job ID ${jobId}`)
    }
  }  
  const root = htmlParser.parse(
    fs.readFileSync(`${path.resolve(".")}/result-template.html`), 
    {
      lowerCaseTagName: false,
      script: true,
      style: true,
      pre: true,
      comment: false
    });
  root.querySelector('#input-data').set_content(`
const fullData = ${JSON.stringify(finalData, null, '  ')};
  `);
  let folderName = pollyHelper.onlyDayYearFormat(parseInt(fileNamePrefix.split('-')[7]) * 1000);
  folderName = folderName.replace(/\,/g, '').replace(/\ /g, '-');
  if (!fs.existsSync(`${path.resolve('.')}/results/output/${folderName}/`)){
    fs.mkdirSync(`${path.resolve('.')}/results/output/${folderName}/`);
  }
  fs.copyFileSync(`${path.resolve('.')}/index.html`, `${path.resolve('.')}/results/output/${folderName}/index.html`)
  fs.writeFileSync(`${path.resolve('.')}/results/output/${folderName}/result-${fileNamePrefix}.html`, root.toString());
  fs.writeFileSync(`${path.resolve('.')}/outputfile.txt`, `${path.resolve('.')}/results/output/${folderName}/result-${fileNamePrefix}.html`);
  console.log(`${path.resolve('.')}/outputfile.txt`)
})();