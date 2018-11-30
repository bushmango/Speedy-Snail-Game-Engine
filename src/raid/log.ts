export function x(...args) {
  if (window && window.console) {
    window.console.log('-', ...args)
  }
}

export function json(arg) {
  if (window && window.console) {
    window.console.log(JSON.stringify(arg, null, 2))
  }
}
