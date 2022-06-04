import * as React from "react"
import { run } from "js-coroutines"
import { Data } from "./dummy-data"
import {
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    Tooltip,
    YAxis,
    Line,
    LineChart
} from "recharts"
import { Grid, CircularProgress } from "@material-ui/core"
import { process } from "./App"
import { count } from "./count"

export function Graph({
    data,
    column,
    children,
    cols
}: {
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    data: Array<Data>
    column: (row: any) => string
    children?: any
}) {
    const [chartData, setData] = React.useState()
    React.useEffect(() => {
        const promise = run(count(data, column, true))
        process.join(promise).then((result: any) => setData(result))
    }, [data, column])
    return (
        <Grid item xs={cols || 6}>
            {!chartData ? (
                <CircularProgress />
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line dataKey="value" stroke="#82ca9d">
                            {children ? children(chartData) : null}
                        </Line>
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Grid>
    )
}
