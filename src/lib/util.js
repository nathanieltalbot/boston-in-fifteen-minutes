/**
 * isDomAvailable
 * @description Checks to see if the DOM is available by checking the existence of the window and document
 * @see https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/ExecutionEnvironment.js#L12
 */

const midpointMatrix = {
            CommuteLess10: 5,
            Commute1030: 20,
            Commute3060: 45,
            Commute6090: 75,
            CommuteOver90: 105
        }

export function isDomAvailable() {
  return typeof window !== 'undefined' && !!window.document && !!window.document.createElement;
}


export function replaceNA(data, replace_val) {
    var reducer = (acc, key) => {
        acc[key] = data[key] === "NA" ? replace_val : data[key]
        return acc
    }
    return Object.keys(data).reduce(reducer, {})
}

export function CommuteTimeMidpoint(census) {
    // Using Midpoint Coding: https://www.displayr.com/how-to-calculate-an-average-value-from-categorical-data/
    census = replaceNA(census)
    if (census.TotalPop > 0) {
        const reducer = (accumulator, key) => accumulator + midpointMatrix[key] * (census[key] * census["TotalPop"]);
        let sum = Object.keys(midpointMatrix).reduce(reducer, null)
        return (sum / parseFloat(census.TotalPop))
    }
    else {
        return null
    }
    

}