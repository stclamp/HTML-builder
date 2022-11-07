const fs = require('fs');
const path = require('node:path');
const {readdir} = require('fs/promises');

const projectPath = path.join(`${__dirname}/project-dist`);
const stylesPath = path.join(`${__dirname}/styles`);

const createFile = () => {
    fs.open(`${projectPath}/bundle.css`, 'w', err => {
        if(err) throw err;
    });
}

createFile();

const writeToFile = (text, path) => {
    fs.appendFile(`${path}`, `${text}`, (err) => {
        if(err) throw err;
    });
}



const showFiles = async () => {
    const files = await readdir(stylesPath, {withFileTypes: true});

    for(let i = 0; i < files.length; i++) {
        let key = files[i];
        const stream = fs.ReadStream(`${stylesPath}/${key.name}`, 'utf8');;
        if(!key.isDirectory()){
            if(key.name.split('.')[1] === 'css') {
                stream.on('readable', function(){
                    let text = stream.read();
                    text ? writeToFile(text, `${projectPath}/bundle.css`) : null
                });
            }
            
        }
    }    
}

showFiles();