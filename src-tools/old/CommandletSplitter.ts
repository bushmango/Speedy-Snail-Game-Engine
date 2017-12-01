declare function require(name:string);
declare var process:any;

const chalk:any = require('chalk');
const chokidar = require('chokidar');
const Jimp = require("jimp");

let onConverted = (loc, type) => {}

export function runnit(options) {

  let {file} = options

  onConverted = options.onConverted

  console.log(chalk.bold.cyan('+ Split sprites', file))
  extract(file, "f_", 8, 32)
}

function extract(filename, prefix, size, numBoxes) {
  console.log('extract', filename, prefix, size, numBoxes)
  Jimp.read(filename.replace('.ase', '.png'), function (err, img) {
    if (err) throw err;

    var createImage = new Jimp(size + 2, size + 2, 0x00000000, function (err, imgNew) {
      if (err) throw err;

      for(let fy = 0; fy < numBoxes; fy++) {
        for(let fx = 0; fx < numBoxes; fx++) {
          //imgNew.setPixelColor(img.getPixelColor(i, j), i, j);

          let ok = false
          for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
              let color = img.getPixelColor(i + fx*size, j + fy*size)
              // Check for our invalid color
              if(color !== 3646383103) {
                ok = true
              }
              imgNew.setPixelColor(color, i + 1, j + 1);
            }
          }
          if(ok && ((fx !== 0 && fy !== 0) || (fx === 0 && fy === 0)))
          {
            let filename = `./temp/${prefix}${fy}_${fx}.png`
            //console.log(filename)
          imgNew
            //.scale(4, Jimp.RESIZE_NEAREST_NEIGHBOR)
            .quality(100)
            //.greyscale()
            .write(filename);
          }

        }
      }

    });

  });
}
