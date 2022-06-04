import * as React from "react"
import {
    Grid,
    TextField,
    CircularProgress,
    LinearProgress
} from "@material-ui/core"
import { RecordView } from "./RecordView"
import { Components, process } from "./App"

export function UI(): React.ReactElement {
    const [search, setSearch] = React.useState("")
    const [sortColumn, setSortColumn] = React.useState("")
    const [components, setComponents] = React.useState<Components>({})
    React.useEffect(() => {
        setComponents({ searching: true })
        process(merge, search, sortColumn)
    }, [search, sortColumn])
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    helperText="Search for names, colors, animals or countries.  Separate words with spaces."
                    InputProps={{
                        endAdornment: components.searching ? (
                            <CircularProgress color="primary" size={"1em"} />
                        ) : null
                    }}
                    variant="outlined"
                    value={search}
                    onChange={handleSetSearch}
                    label="Search"
                />
            </Grid>

            <Grid
                item
                xs={12}
                style={{
                    visibility: components.searching ? "visible" : "hidden"
                }}
            >
                <LinearProgress
                    variant={
                        components.sorting ? "indeterminate" : "determinate"
                    }
                    value={components.progress || 0}
                    color="secondary"
                />
            </Grid>

            <Grid item xs={12}>
                <RecordView
                    sortColumn={sortColumn}
                    onSetSortColumn={setSortColumn}
                    records={components.data}
                />
            </Grid>
            {components.charts}
        </Grid>
    )
    function merge(update: Components): void {
        setComponents((prev: Components) => ({ ...prev, ...update }))
    }
    function handleSetSearch(event: React.ChangeEvent<HTMLInputElement>) {
        setSearch(event.currentTarget.value)
    }
}
