const fs = require('fs');
const path = require('node:path');
const { mkdir, readdir, copyFile } = require('node:fs/promises');

let assets;

//ASSETS

async function makeDirectory() {
    const dirProject = await mkdir(`${__dirname}/project-dist`, { recursive: true });
    const dirAssets = await mkdir(`${__dirname}/project-dist/assets`, {recursive: true})

    for(key of assets) {
        await mkdir(`${__dirname}/project-dist/assets/${key}`, {recursive: true})
    }

    return dirAssets;
  }

  makeDirectory();

//Copy assets and index.html
  async function copyFiles() {
    let pathText = path.join(`${__dirname}`);
    let copyPath = path.join(`${__dirname}/project-dist`);
    assets = await readdir(pathText + '/assets');

    const html = await copyFile(`${pathText}/template.html`, `${copyPath}/index.html`);

    for(let i = 0; i< assets.length; i++) {
        let asset = await readdir(`${pathText}/assets/${assets[i]}`);
        
        for(let j = 0; j < asset.length; j++) {
            await copyFile(`${pathText}/assets/${assets[i]}/${asset[j]}`, `${copyPath}/assets/${assets[i]}/${asset[j]}`);
        }
    }

  }

  copyFiles();

//STYLES

const projectPath = path.join(`${__dirname}/project-dist`);
const stylesPath = path.join(`${__dirname}/styles`);

//Create style.css
const createFile = () => {
    fs.open(`${projectPath}/style.css`, 'w', err => {
        if(err) throw err;
    });
}

createFile();

const writeToFile = (text, path) => {
    fs.appendFile(`${path}`, `${text}`, (err) => {
        if(err) throw err;
    });
}

//read from all styles file and write to one style.css
const showFiles = async () => {
    const files = await readdir(stylesPath, {withFileTypes: true});

    for(let i = 0; i < files.length; i++) {
        let key = files[i];
        const stream = fs.ReadStream(`${stylesPath}/${key.name}`, 'utf8');
        if(!key.isDirectory()){
            if(key.name.split('.')[1] === 'css') {
                
                stream.on('readable', function(){
                    let text = stream.read();
                    text ? writeToFile(text, `${projectPath}/style.css`) : null
                });
            }
            
        }
    }    
}

showFiles();

//change tags in template.html for tags in components files

const templatePath = path.join(__dirname, '/template.html');

fs.readFile(templatePath, 'utf8', function(error, fileContent){
    if(error) throw error;
    let content = fileContent;
    let tags = []
    let indexes = getListIdx(content, '{{')
    let lastIndexes = getListIdx(content, '}}')

    indexes.forEach((item, i) => {
        tags.push(content.slice(item + 2, lastIndexes[i]))
    })
    tags.forEach(tag => {
        const regExp = new RegExp('{{' + tag + '}}', 'g')
        const stream = fs.ReadStream(`${__dirname}/components/${tag}.html`, 'utf8');
        stream.on('readable', function(){
            let text = stream.read();
            text !== null ? content = content.replace(regExp, text) : null;
            fs.writeFile(`${__dirname}/project-dist/index.html`, content, function (err) {
                if (err) throw err;
              });
        });
    })
})

function getListIdx(str, substr) {
    let listIdx = []
    let lastIndex = -1
    while ((lastIndex = str.indexOf(substr, lastIndex + 1)) !== -1) {
      listIdx.push(lastIndex)
    }
    return listIdx
}