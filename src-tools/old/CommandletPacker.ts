declare function require(name:string);
declare var process:any;

const chalk:any = require('chalk');
const chokidar = require('chokidar');
const Jimp = require("jimp");
const exec = require('child_process').exec;
const path = require('path');

let onConverted = (loc, type) => {}

export function runnit(options) {

  //let {file} = options

  onConverted = options.onConverted

  console.log(chalk.bold.cyan('+ Pack sprites'))

  let outPath = './../snakeVsLawn/assets/sprites/'

  pack('.\\temp', outPath, "main2.json", "main2.png")
}

function pack(inPath, outPath, outJson, outPng) {
  let pathToCmd = '"C:\\Program Files\\CodeAndWeb\\TexturePacker\\bin\\TexturePacker.exe"'
  let args = `--data ${outPath + outJson} --format json --sheet ${outPath + outPng} --force-squared --scale 4 --scale-mode fast --width 512 --height 512 --border-padding 2 --shape-padding 2 --inner-padding 2 --trim-sprite-names --disable-rotation ${inPath}`

  let cmd = pathToCmd + ' ' + args
  console.log('exe', cmd)
  exec(cmd, function(error, stdout, stderr) {
    // command output is in stdout
    if(error) {
      console.log('error', error)
    }
    console.log('pack => ', stdout, stderr)

  });
}
