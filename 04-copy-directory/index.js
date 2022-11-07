const { mkdir, readdir, copyFile } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
    const projectFolder = join(__dirname, 'files');
    const dirCreation = await mkdir(`${projectFolder}/../files-copy`, { recursive: true });
    
    return dirCreation;
  }

  makeDirectory();

  


  async function copyFiles() {
    let pathText = join(`${__dirname}/files`);
    let copyPath = join(`${__dirname}/files-copy`);
    const files = await readdir(pathText);


    for(key of files) {
        const copied = await copyFile(`${pathText}/${key}`, `${copyPath}/${key}`);
    }

    console.log('Copied sucssessful');
  }

  copyFiles()
