const fs = require('fs/promises');
const path = require('node:path');

let pathText = path.join(`${__dirname}/secret-folder`);

const filesArr = [];
const extArr = [];

const showFiles = async () => {
    const files = await fs.readdir(pathText, {withFileTypes: true});

    for(let i = 0; i < files.length; i++) {
        let key = files[i];
        let stat = await fs.stat(`${pathText}/${key.name}`);
        if(!key.isDirectory()){
            console.log(`${key.name.split('.')[0]} - ${key.name.split('.')[1]} - ${stat.size / 1000}kB`)
        }
    }    
}

showFiles();


