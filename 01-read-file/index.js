const fs = require('fs');
const path = require('node:path');

const pathText = path.join(__dirname, '/text.txt')

const stream = fs.ReadStream(pathText, 'utf8');

stream.on('readable', function(){
    let text = stream.read();
    text ? console.log(text) : null
});