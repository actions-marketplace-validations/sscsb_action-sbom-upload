const fs = require('fs');
const http = require('http');
const https = require('https');
const core = require('@actions/core');

try {
  const serverHostname = core.getInput('serverhostname');
  const port = core.getInput('port');
  const protocol = core.getInput('protocol');
  const apiKey = core.getInput('apikey');
  const project = core.getInput('project');
  const projectName = core.getInput('projectname');
  const projectVersion = core.getInput('projectversion');
  const autoCreate = core.getInput('autocreate') != 'false';
  const bomFilename = core.getInput('bomfilename');


  if (protocol != "http" && protocol != "https") {
    throw 'protocol "' + protocol + '" not supported, must be one of: https, http'
  }
  const client = (protocol == "http") ? http : https

  if (project == "" && (projectName == "" || projectVersion == "")) {
    throw 'project or projectName + projectVersion must be set'
  }

  console.log(`Reading BOM: ${bomFilename}...`);
  const bomContents = fs.readFileSync(bomFilename);
  let encodedBomContents = Buffer.from(bomContents).toString('base64');
  if (encodedBomContents.startsWith('77u/')) {
    encodedBomContents = encodedBomContents.substring(4);
  }

  const bomPayload = {
    project: project,
    projectName: projectName,
    projectVersion: projectVersion,
    autoCreate: autoCreate,
    bom: encodedBomContents
  }

  const postData = JSON.stringify(bomPayload);

  const requestOptions = {
    hostname: serverHostname,
    port: port,
    protocol: protocol + ':',
    path: '/api/v1/bom',
    method: 'PUT',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  console.log(`Uploading to SSCSB server ${serverHostname}...`);

  const req = client.request(requestOptions, (res) => {
    console.log('Response status code:', res.statusCode);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('Finished uploading BOM to SSCSB server.')
    } else {
      core.setFailed('Failed response status code:' + res.statusCode);
    }
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    core.setFailed(e.message);
  });

  req.write(postData);
  req.end();

} catch (error) {
  core.setFailed(error.message);
}
