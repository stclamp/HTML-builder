const fs = require('fs');
const path = require('node:path');
const {stdin, stdout} = require('process');

const pathText = path.join(__dirname);

const createFile = () => {
    fs.open(`${pathText}/text.txt`, 'w', err => {
        if(err) throw err;
    });
}

const writeToFile = (text) => {
    fs.appendFile(`${pathText}/text.txt`, `${text}`, (err) => {
        if(err) throw err;
    });
}

const runStdin= () => {
    stdout.write("Enter text here: \n")
    stdin.on('data', data => {
        if(data.toString().trim() === 'exit') {
            stdout._write("Bye")
            process.exit()
        };

        
        writeToFile(data);
    })

    process.on('SIGINT', function() {
        console.log("\nBye");
        process.exit();
    });
}


fs.access(`${pathText}/text.txt`, error => {
    if (error) {
        createFile();
        runStdin();
    } else {
        runStdin();
    }
});
