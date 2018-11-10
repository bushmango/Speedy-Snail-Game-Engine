#!/usr/bin/env ts-node

// See:
// http://stackoverflow.com/questions/12742082/nodejs-require-inside-typescript-file
// https://github.com/TypeStrong/ts-node
// https://developer.atlassian.com/blog/2015/11/scripting-with-node/

import * as _ from "lodash";

declare var process: any;

declare function require(name: string);
const fs: any = require("fs");
const chokidar: any = require("chokidar");
const chalk: any = require("chalk");
const program: any = require("commander");
const exec: any = require("child_process").exec;
const path: any = require("path");

console.log(chalk.bold.cyan("-.-"));
console.log(chalk.bold.green("~Stevie Bushman Presents~"));
console.log(
  "Graphics Builder - watch and convert asesprite files to png - v0.0.3"
);

// print args
process.argv.forEach((val, index, array) => {
  console.log(index + ": " + val);
});

let dir = process.argv[2] || "ludumDareStart";

//let watchPath = `C:/dev/stevieweb/SimpleGameEngine/src-resources/images/`
//let outPath = `C:/dev/stevieweb/SimpleGameEngine/src-deploy/public/images/`
//let inPathPacked = `C:/dev/stevieweb/SimpleGameEngine/src-deploy/public/images/`
//let outPathPacked = `C:/dev/stevieweb/SimpleGameEngine/src-deploy/public/images-packed/`

let basePath = __dirname;
console.log("__dirname", __dirname);
basePath = path.join(basePath, "../../");
console.log("basePath", basePath);
console.log("dir", dir);

let watchPath = path.join(basePath, "src-resources", dir, "images") + "\\";
let outPath = path.join(basePath, "src-deploy", "public", dir, "images") + "\\";
let inPathPacked =
  path.join(basePath, "src-deploy", "public", dir, "images") + "\\";
let outPathPacked =
  path.join(basePath, "src-deploy", "public", dir, "images-packed") + "\\";
// `C:\\dev-prarie-snail\\Speedy-Snail-Game-Engine\\src-deploy\\public\\ludumDare40\\images\\`
// let inPathPacked = `C:\\dev-prarie-snail\\Speedy-Snail-Game-Engine\\src-deploy\\public\\ludumDare40\\images\\`
// let outPathPacked = `C:\\dev-prarie-snail\\Speedy-Snail-Game-Engine\\src-deploy\\public\\ludumDare40\\images-packed\\`

console.log("watchPath", watchPath);
console.log("outPath", outPath);
console.log("inPathPacked", inPathPacked);
console.log("outPathPacked", outPathPacked);

let doPack = true;
let mode = "convert-only";
let verbose = false;
let aseSpritePath = '"C:\\Program Files\\Aseprite\\aseprite.exe"';

let watchGlob = watchPath + "**/*.ase";

let texturePackerPath =
  '"C:\\Program Files\\CodeAndWeb\\TexturePacker\\bin\\TexturePacker.exe"';

function run() {
  // TODO: command line args
  program
    .arguments("<file>")
    .option("-n, --narm <narm>", "Your name")
    .action(function(file, options) {})
    .parse(process.argv);

  // Stuff that is always done
  let glob = watchGlob;
  watch(glob);
  console.log("Watching for: ", glob);
}

function watch(glob: string) {
  // Initialize watcher.
  let watcher = chokidar.watch(glob, {
    persistent: true
  });

  // Something to use when events are received.
  let log = console.log.bind(console);

  // Add event listeners.
  watcher
    .on("add", loc => onWatchEvent(loc, "added"))
    .on("change", loc => onWatchEvent(loc, "changed"));
}

function onWatchEvent(loc: string, type) {
  let originalFilePath = loc;
  let originalFilePathWithoutExtension = loc.slice(
    0,
    -path.extname(loc).length
  );

  let dir = originalFilePath.substring(watchPath.length);
  if (dir.lastIndexOf("\\") != -1) {
    dir = dir.substring(0, dir.lastIndexOf("\\")) + "\\";
  } else {
    dir = "";
  }
  // console.log('dir', dir)

  let fileName = path.basename(originalFilePathWithoutExtension);
  let filePath = path.join(outPath, dir + fileName) + ".png";
  if (dir) {
    fileName = dir + fileName;
    // filePath = dir + '\\' + filePath
  }

  let args = `--batch "${originalFilePath}" --save-as "${filePath}"`;

  let cmd = aseSpritePath + " " + args;
  if (verbose) {
    console.log("exe", cmd);
  } else {
    console.log(" => " + fileName);
  }

  exec(cmd, (error, stdout, stderr) => {
    // command output is in stdout
    if (error) {
      console.log("error", error);
      return;
    }
    if (verbose) {
      console.log("ase => ", stdout, stderr);
    }
    if (doPack) {
      _throttled_runPacker();
    }
  });
}

const _throttled_runPacker = _.throttle(runPacker, 1000, {
  leading: false,
  trailing: true
});

function runPacker() {
  console.log("running texture packer");
  _pack(inPathPacked + "gui/", outPathPacked, "gui.json", "gui.png");
}
function _pack(inPath, outPath, outJson, outPng) {
  let scale = 1;
  let args = `--data ${outPath + outJson} --format json --sheet ${outPath +
    outPng} --force-squared --scale ${scale} --scale-mode fast --width 512 --height 512 --border-padding 2 --shape-padding 2 --padding 2 --trim-mode Trim --trim-sprite-names --disable-rotation ${inPath}`;

  let cmd = texturePackerPath + " " + args;
  console.log("exe", cmd);
  exec(cmd, (error, stdout, stderr) => {
    // command output is in stdout
    if (error) {
      console.log("error", error);
      return;
    }
    console.log("pack => ", stdout, stderr);
  });
}

run();
