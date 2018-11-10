export function x(...args) {
  if (window && window.console) {
    window.console.log("-", ...args);
  }
}
