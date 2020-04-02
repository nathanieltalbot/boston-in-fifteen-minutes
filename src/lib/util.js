/**
 * isDomAvailable
 * @description Checks to see if the DOM is available by checking the existence of the window and document
 * @see https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/ExecutionEnvironment.js#L12
 */

export function isDomAvailable() {
  return typeof window !== 'undefined' && !!window.document && !!window.document.createElement;
}


export function replaceNA(data) {
    var reducer = (acc, key) => {
        console.log(key)
        console.log(acc)
        acc[key] = data[key] === "NA" ? -1 : data[key]
        return acc
    }
    return Object.keys(data).reduce(reducer, {})
}
