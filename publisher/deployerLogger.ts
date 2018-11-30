export function log(...args) {
  // tslint:disable-next-line
  console.log(...args)
}
export function logJson(arg) {
  // tslint:disable-next-line
  console.log(JSON.stringify(arg, null, 2))
}
