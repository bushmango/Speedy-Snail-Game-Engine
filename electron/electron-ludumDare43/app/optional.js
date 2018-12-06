
const electron = require('electron')
const path = require('path')

function intercept() {
  electron.protocol.interceptFileProtocol(PROTOCOL, (request, callback) => {
    let url = ''
    try {
      //console.log('intercept', PROTOCOL)

      // // Strip protocol
      //console.log('url', request.url)
      url = request.url.substr(PROTOCOL.length + 1)
      url = url.replace('C:/', '')
      //console.log('1', url)

      // Build complete path for node require function
      url = path.join(__dirname, WEB_FOLDER, url)

      //console.log('2', url)

      // Replace backslashes by forward slashes (windows)
      if (isWin) {
        url = url.replace(/\\/g, '/')
      }
      //console.log('3', url)
      url = path.normalize(url)

      //console.log('4', url)

      // Remove cachebuster, etc.
      if (url.indexOf('?') !== -1) {
        url = url.substring(0, url.indexOf('?'))
      }

      // console.log('5', url)

      console.log('Redirect', request.url, ' -> ', url)

      //console.log(url)
    } catch (err) {
      console.error('err', err)
    }
    callback({ path: url })
  })
}
