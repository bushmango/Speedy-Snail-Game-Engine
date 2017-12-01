declare function require(name:string);
declare var process:any;

let chalk:any = require('chalk');
let chokidar = require('chokidar');

let onConverted = (loc, type) => {}

export function runnit(options) {

  let {glob} = options

  onConverted = options.onConverted

  console.log(chalk.bold.cyan('+ Watch Ase'))
  console.log(glob)

  watch(glob)

}

function watch(glob:string) {
  // Initialize watcher.
  var watcher = chokidar.watch(glob, {
    persistent: true
  });

  // Something to use when events are received.
  var log = console.log.bind(console);
  // Add event listeners.
  watcher
    .on('add', loc => onWatchEvent(loc, 'added'))
    .on('change', loc => onWatchEvent(loc, 'changed'))
}

const exec = require('child_process').exec;
const path = require('path');
function onWatchEvent(loc, type) {
  let pathToAseprite = '"C:\\Program Files (x86)\\Aseprite\\aseprite.exe"'
  let originalFilePath = loc
  let originalFilePathWithoutExtension = loc.slice(0, -path.extname(loc).length)
  let args = `--batch "${originalFilePath}" --save-as "${originalFilePathWithoutExtension}.png"`

  let cmd = pathToAseprite + ' ' + args
  console.log('exe', cmd)
  exec(cmd, function(error, stdout, stderr) {
    // command output is in stdout
    if(error) {
      console.log('error', error)
    }
    console.log('ase => ', stdout, stderr)

    if(onConverted) {
      onConverted(loc, type)
    }
  });

}
