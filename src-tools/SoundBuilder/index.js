#!/usr/bin/env ts-node
"use strict";
exports.__esModule = true;
var _ = require("lodash");
var fs = require('fs');
var chokidar = require('chokidar');
var chalk = require('chalk');
var program = require('commander');
console.log(chalk.bold.cyan('-.-'));
console.log(chalk.bold.green("~Stevie Bushman Presents~"));
console.log('Sounds Builder - watch and convert sounds - v0.0.3');
// print args
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});
// let watchPath = `C:/dev/stevieweb/SimpleGameEngine/src-resources/sounds/sprite1/`
// let outPath = `C:/dev/stevieweb/SimpleGameEngine/src-deploy/public/sounds/`
var folder = 'ludumDare40';
var watchPath = "C:\\dev-prarie-snail\\Speedy-Snail-Game-Engine\\src-resources\\" + folder + "\\sounds\\sprite1\\";
var outPath = "C:\\dev-prarie-snail\\Speedy-Snail-Game-Engine\\src-deploy\\public\\" + folder + "\\sounds\\";
var watchPathMusic = "C:\\dev-prarie-snail\\Speedy-Snail-Game-Engine\\src-resources\\" + folder + "\\music\\";
var outPathMusic = "C:\\dev-prarie-snail\\Speedy-Snail-Game-Engine\\src-deploy\\public\\" + folder + "\\music\\";
var verbose = false;
var mode = 'sprite';
var ffmpegPath = 'C:/dev/tools/ffmpeg-3.3.3-win64-static/bin/ffmpeg.exe';
var watchGlob = watchPath + '*.wav';
var watchGlobMusic = watchPathMusic + '*.wav';
function run() {
    // TODO: command line args
    program
        .arguments('<file>')
        .option('-n, --narm <narm>', 'Your name')
        .action(function (file, options) {
    })
        .parse(process.argv);
    // Stuff that is always done
    watch(watchGlob);
    console.log('Watching sounds : ', watchGlob);
    watchMusic(watchGlobMusic);
    console.log('Watching music : ', watchGlobMusic);
}
function watch(glob) {
    // Initialize watcher.
    var watcher = chokidar.watch(glob, {
        persistent: true
    });
    // Something to use when events are received.
    var log = console.log.bind(console);
    // Add event listeners.
    watcher
        .on('add', function (loc) { return onWatchEvent(loc, 'added', false); })
        .on('change', function (loc) { return onWatchEvent(loc, 'changed', false); });
}
function watchMusic(glob) {
    // Initialize watcher.
    var watcher = chokidar.watch(glob, {
        persistent: true
    });
    // Something to use when events are received.
    var log = console.log.bind(console);
    // Add event listeners.
    watcher
        .on('add', function (loc) { return onWatchEvent(loc, 'added', true); })
        .on('change', function (loc) { return onWatchEvent(loc, 'changed', true); });
}
var exec = require('child_process').exec;
var path = require('path');
function onWatchEvent(loc, type, isMusic) {
    console.log(type, loc);
    if (mode === 'convert' || isMusic) {
        var originalFilePath = loc;
        var originalFilePathWithoutExtension = loc.slice(0, -path.extname(loc).length);
        var fileName = path.basename(originalFilePathWithoutExtension);
        var filePath = path.join(isMusic ? outPathMusic : outPath, fileName);
        // let args1 = `-y -i "${originalFilePath}" -acodec libmp3lame "${filePath}.mp3"`
        var args1 = "-y -i \"" + originalFilePath + "\" -c:a aac -b:a 160k \"" + filePath + ".aac\"";
        var args2 = "-y -i \"" + originalFilePath + "\" -acodec libvorbis -aq 4 \"" + filePath + ".ogg\"";
        runCommand(ffmpegPath, args1, 'to aac', filePath);
        runCommand(ffmpegPath, args2, 'to ogg', filePath);
    }
    if (mode === 'sprite' && !isMusic) {
        _throttled_createSprite();
    }
}
function runCommand(pathToProgram, args, prefix, friendlyName) {
    var cmd = pathToProgram + ' ' + args;
    console.log('start', prefix, friendlyName);
    if (verbose) {
        console.log('exe', cmd);
    }
    exec(cmd, function (error, stdout, stderr) {
        // command output is in stdout
        if (error) {
            console.log('error =>', error);
        }
        if (verbose) {
            console.log(prefix + ' => ', stdout, stderr);
        }
        console.log('done ', prefix, friendlyName);
    });
}
function createSprite() {
    // Audiosprite test
    console.log('creating sprite');
    var path = watchPath;
    var files = [];
    fs.readdir(path, function (err, items) {
        for (var i = 0; i < items.length; i++) {
            var file = path + items[i];
            if ((/.wav$/).test(file.toLowerCase())) {
                console.log("+", file);
                files.push(file);
            }
            // fs.stat(file, function (f) {
            //   return function (err, stats) {
            //     console.log(f);
            //     console.log(stats["size"]);
            //   }
            // }(file));
        }
        var opts = {
            output: outPath + 'audioSprite',
            format: 'howler'
        };
        var audiosprite = require('audiosprite');
        audiosprite(files, opts, function (err, obj) {
            if (err) {
                console.error(err);
                return;
            }
            // console.log(JSON.stringify(obj, null, 2))
            obj.urls = [
                "public/" + folder + "/sounds/audioSprite.ogg",
                "public/" + folder + "/sounds/audioSprite.m4a",
                "public/" + folder + "/sounds/audioSprite.mp3",
                "public/" + folder + "/sounds/audioSprite.ac3",
            ];
            if (verbose) {
                console.log(JSON.stringify(obj, null, 2));
            }
            var jsonfile = require('jsonfile');
            var file = outPath + 'audioSprite.json';
            jsonfile.writeFileSync(file, obj, { spaces: 2 });
        });
    });
}
var _throttled_createSprite = _.throttle(createSprite, 500, { leading: false, trailing: true });
run();
