// npx cjs-to-esm cjs.js
// npx cjs-to-esm cjs.js --out-file esm.js
// npx cjs-to-esm ./cjs ---out-dir ./esm

const { Command } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const program = new Command();
const transform = require('../lib/index.js').default;

function trans(file, newFile) {
  console.log(`🖨️   transforming: ${file}`);
  const code = fs.readFileSync(file, 'utf-8');
  const content = transform(code);
  fs.outputFile(newFile, content.code); 
  console.log(`👉  complete: ${newFile}`);
}

program
  .argument("<file>", "input js file or dir")
  .option('--out-file <string>', "output file")
  .option('--out-dir <string>', "output dir")
  .action((target, options, command) => {
    const { outFile, outDir } = options;
    const ext = path.extname(target);
    if (ext === '.js') {
      const file = path.resolve(__dirname, target);
      let newFile;
      if (outFile && outDir) {
        newFile = path.resolve(__dirname, outDir, outFile);
      } else if (outDir) {
        newFile = path.resolve(__dirname, outDir, path.basename(target));
      } else if (outFile) {
        newFile = path.resolve(__dirname, outFile);
      } else {
        newFile = path.resolve(__dirname, target.slice(0, -3) + '-esm.js');
      }
      trans(file, newFile);
    } else if (ext === '') {
      let str = path.resolve(__dirname, target);
      if (!target.endsWith('/') && !target.endsWith('*')) {
        str += '/**/*.js';
      } else if (target.endsWith('/')) {
        str += '**/*.js';
      }
      glob(str, {}, function (er, files) {
        let newF = path.resolve(__dirname, target.replace(path.basename(target), 'cjs-to-esm'));
        if (outDir) {
          newF = path.resolve(__dirname, outDir);
        }
        console.log(newF);
        const replacePath = path.resolve(__dirname, target);
        files.forEach(f => {
          trans(f, f.replace(replacePath, newF));
        });
      })
    }
  });



program.parse();
