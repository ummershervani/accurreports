import * as React from "react"
import "./styles.css"
import { singleton, sortAsync } from "js-coroutines"
import { data, Data } from "./dummy-data"
import { Cell } from "recharts"
import {
    AppBar,
    Container,
    Toolbar,
    Box,
    CssBaseline,
    createMuiTheme,
    Typography,
    makeStyles
} from "@material-ui/core"
import { ThemeProvider } from "@material-ui/styles"
import primary from "@material-ui/core/colors/deepOrange"
import colorNames from "./colornames.json"
import { Graph } from "./Graph"
import { Chart } from "./Chart"
import { UI } from "./UI"

function pad(v: number): string {
    let o = `${v}`.split("")
    while (o.length < 6) o.unshift(" ")
    return o.join("")
}

function band(n: number, low: number, high: number, range: number): string {
    for (let k = low; k < high; k += range) {
        if (k <= n && k + range > n) {
            return `${pad(k)} to ${pad(k + range - 1)}`
        }
    }
    return ""
}
export interface ChartData {
    name: string
    value: number
}

const colors = [
    "salmon",
    "tomato",
    "red",
    "darkred",
    "lightgreen",
    "green",
    "darkgreen",
    "lightblue",
    "blue",
    "darkblue"
]

const theme = createMuiTheme({
    palette: {
        primary
    }
})

export const process = singleton(function* (
    resolve: Function,
    search: string,
    sortColumn: string
) {
    let yieldCounter = 0

    function* check(fn?: Function) {
        yieldCounter++
        if ((yieldCounter & 127) === 0) {
            if (fn) fn()
            yield
        }
    }
    function addCharts(output: Data[]) {
        resolve({
            charts: [
                <Chart key="ch1" data={output} column={(v) => v.color}>
                    {(data: Array<ChartData>) =>
                        data.map((entry: ChartData) => {
                            return (
                                <Cell
                                    key={entry.name}
                                    fill={
                                        colorNames.find(
                                            (c: any) =>
                                                c.name.toLowerCase() ===
                                                entry.name
                                        )?.hex
                                    }
                                />
                            )
                        })
                    }
                </Chart>,
                <Chart
                    key="ch2"
                    data={output}
                    column={(v) => band(v.age, 18, 78, 10)}
                >
                    {(data: Array<ChartData>) =>
                        data.map((entry: ChartData, index) => {
                            return (
                                <Cell key={entry.name} fill={colors[index]} />
                            )
                        })
                    }
                </Chart>,
                <Graph
                    cols={12}
                    key="ch3"
                    data={output}
                    column={(v) => band(v.value, 0, 50000, 1000)}
                ></Graph>
            ]
        })
    }
    if (!search.trim() && !sortColumn?.trim()) {
        resolve({ data, searching: false })
        addCharts(data)
        return
    }
    resolve({ searching: true, data: [] })
    let parts = search.toLowerCase().split(" ")
    let i = 0
    let progress = 0
    yield
    let output: Data[] = []
    for (let record of data) {
        if (
            parts.every((p) =>
                record.description
                    .split(" ")
                    .some((v) => v.toLowerCase().startsWith(p))
            )
        ) {
            output.push(record)
            if (output.length === 250) {
                resolve({ data: output })
                yield sortAsync(output, (v: Data) => v[sortColumn])
            }
        }
        let nextProgress = ((i++ / data.length) * 100) | 0
        if (nextProgress !== progress) resolve({ progress: nextProgress })
        progress = nextProgress
        yield* check()
    }
    resolve({ sorting: true })
    yield sortAsync(output, (v: Data) => v[sortColumn])
    resolve({ sorting: false })
    resolve({ searching: false, data: output })
    addCharts(output)
},
{})

export default function App(): React.ReactElement {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <Box mt={2}>
                    <Container>
                        <UI />
                    </Container>
                </Box>
            </main>
        </ThemeProvider>
    )
}

export interface Components {
    data?: Array<Data>
    searching?: boolean
    progress?: number
    sorting?: boolean
    charts?: []
}

export const useStyles = makeStyles(() => {
    return {
        "@global": {
            body: {
                userSelect: "none"
            }
        },
        data: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
        },
        column: {
            width: "20%"
        },
        table: {
            width: "100%"
        },
        header: {
            background: "#eee",
            fontWeight: "bold"
        }
    }
})
