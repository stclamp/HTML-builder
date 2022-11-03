const fs = require('fs');
const path = require('node:path');
const { stdin} = require('process');

const pathText = path.join(__dirname);

const createFile = () => {
    fs.open(`${pathText}/text.txt`, 'w', (err) => {
        if(err) throw err;
    });
}

const writeToFile = (text) => {
    fs.appendFile(`${pathText}/text.txt`, `${text}`, (err) => {
        if(err) throw err;
    });
}

const stdinShow = () => {
    stdin.on('data', data => {
        if(data.toString().trim() === 'exit') process.exit();
        writeToFile(data);
    })
}


fs.access(`${pathText}/text.txt`, error => {
    if (error) {
        createFile();
        stdinShow();
    } else {
        stdinShow();
    }
});
