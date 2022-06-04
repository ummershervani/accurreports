import { sortAsync, reduceAsync, forEachAsync } from "js-coroutines"
import { Data } from "./dummy-data"
import { ChartData } from "./App"

export function* count(
    data: Data[],
    column: (row: Data) => string,
    forceLabelSort?: boolean
): Generator<any, Array<ChartData>, any> {
    const results = yield reduceAsync(
        data,
        (accumulator: any, d: Data) => {
            const value = column(d)
            accumulator[value] = (accumulator[value] || 0) + 1
            return accumulator
        },
        {}
    )
    let output: Array<ChartData> = []
    yield forEachAsync(results, (value: number, key: string) => {
        if (key) {
            output.push({ name: key, value })
        }
    })
    if (output.length > 20 && !forceLabelSort) {
        yield sortAsync(output, (v: ChartData) => -v.value)
    } else {
        yield sortAsync(output, (v: ChartData) => v.name)
    }
    return output
}
