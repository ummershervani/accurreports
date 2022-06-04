import * as React from "react"
import { Data } from "./dummy-data"
import {
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TablePagination,
    TableContainer,
    TableFooter,
    TableBody
} from "@material-ui/core"
import { useStyles } from "./App"

const ROWS_PER_PAGE = 4

export function RecordView({
    records,
    sortColumn,
    onSetSortColumn
}: {
    records: Array<Data> | undefined
    sortColumn?: string
    onSetSortColumn?: (column: string) => void
}): React.ReactElement | null {
    const [page, setPage] = React.useState(0)

    function handleChangePage(event: any, page: number) {
        setPage(page)
    }

    const classes = useStyles()
    records = records || []
    React.useEffect(() => {
        if (records && records.length / ROWS_PER_PAGE <= page) setPage(0)
    }, [page, records])
    return (
        <Box width={1}>
            <TableContainer className={classes.table}>
                <Table size="small" className={classes.table}>
                    <TableHead>
                        <TableRow className={classes.header}>
                            <TableCell
                                className={classes.column}
                                onClick={() => onSetSortColumn?.("name")}
                            >
                                Name{" "}
                                {sortColumn === "name" ? <span>*</span> : ""}
                            </TableCell>
                            <TableCell
                                className={classes.column}
                                onClick={() => onSetSortColumn?.("age")}
                            >
                                Age {sortColumn === "age" ? <span>*</span> : ""}
                            </TableCell>
                            <TableCell
                                className={classes.column}
                                onClick={() => onSetSortColumn?.("value")}
                            >
                                Value{" "}
                                {sortColumn === "value" ? <span>*</span> : ""}
                            </TableCell>
                            <TableCell
                                className={classes.column}
                                onClick={() => onSetSortColumn?.("country")}
                            >
                                Country{" "}
                                {sortColumn === "country" ? <span>*</span> : ""}
                            </TableCell>
                            <TableCell
                                className={classes.column}
                                onClick={() => onSetSortColumn?.("color")}
                            >
                                Color{" "}
                                {sortColumn === "color" ? <span>*</span> : ""}
                            </TableCell>
                            <TableCell
                                className={classes.column}
                                onClick={() => onSetSortColumn?.("animal")}
                            >
                                Animal{" "}
                                {sortColumn === "animal" ? <span>*</span> : ""}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records
                            .slice(
                                page * ROWS_PER_PAGE,
                                (page + 1) * ROWS_PER_PAGE
                            )
                            .map((record: Data, index: number) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className={classes.data}>
                                            {record.name}
                                        </TableCell>
                                        <TableCell className={classes.data}>
                                            {record.age}
                                        </TableCell>
                                        <TableCell className={classes.data}>
                                            {record.value}
                                        </TableCell>
                                        <TableCell className={classes.data}>
                                            {record.country}
                                        </TableCell>
                                        <TableCell className={classes.data}>
                                            {record.color}
                                        </TableCell>
                                        <TableCell className={classes.data}>
                                            {record.animal}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[ROWS_PER_PAGE]}
                                rowsPerPage={ROWS_PER_PAGE}
                                count={records.length}
                                page={page}
                                onChangePage={handleChangePage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    )
}
