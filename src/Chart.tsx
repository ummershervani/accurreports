import * as React from "react"
import { run } from "js-coroutines"
import { Data } from "./dummy-data"
import {
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    Tooltip,
    Bar,
    BarChart,
    YAxis
} from "recharts"
import { Grid, CircularProgress } from "@material-ui/core"
import { process } from "./App"
import { count } from "./count"

export function Chart({
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
        const promise = run(count(data, column))
        process.join(promise).then((result: any) => setData(result))
    }, [data, column])
    return (
        <Grid item xs={cols || 6}>
            {!chartData ? (
                <CircularProgress />
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8">
                            {children ? children(chartData) : null}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Grid>
    )
}
