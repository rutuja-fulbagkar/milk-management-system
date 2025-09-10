import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import * as React from "react";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getComparator } from "../../../components/table/AscenDesc";
import CustumTableHead from "../../../components/table/CustumTableHead";
import TableNoData from "../../../components/table/TableNoData";
import TablePaginationCustom from "../../../components/table/TablePaginationCustom";
import { getInventoryhistorybyId } from "../../../redux/slices/inventory/inventoryApi";
import {
  setCurrentPage,
  setLimit,
  setSkip,
} from "../../../redux/slices/inventory/inventorySlice";
import { useDispatch, useSelector } from "../../../redux/store";
import InOutFilter from "./Filter/InOutFilter";
import Index from "./TableRow/Index";

const TABLE_HEAD = [
  {
    id: "inWardQty",
    label: "Inward Quantity",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "inWardQtyDate",
    label: "Inward Date",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "outWardQty",
    label: "Outward Quantity",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "outWardQtyDate",
    label: "Outward Date",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "closingStock",
    label: "Closing Stock",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "status",
    label: "Status",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "userName",
    label: "User",
    numeric: false,
    disablePadding: true,
  },

];


export default function History() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get('id');
  const id = paramId || queryId;
  const [findHistory, setHistory] = React.useState([]);
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("createdAt");
  const [selected, setSelected] = React.useState([]);
  const [dense, setDense] = React.useState(false);
  const dispatch = useDispatch();
  const {
    data,
    limit,
    currentPage,
    totalRecord,
    isLoading,
  } = useSelector((state) => state.inventory);

  useEffect(() => {
    const fetchgetInventorybyId = async () => {
      try {
        const response = await dispatch(getInventoryhistorybyId({ paramId: id }));
        if (response?.payload?.success) {
          setHistory(response?.payload?.data?.history);
        }
      } catch (error) {
        console.error("Error fetching inventory by id:", error);
      }
    };
    if (id) {
      fetchgetInventorybyId();
    }
  }, [dispatch, id]);

  const handlePageChange = (event, newPage) => {
    dispatch(setCurrentPage({ currentPage: newPage }));
    dispatch(setSkip({ skip: limit * newPage }));
    setSelected([]);
  };


  const handleRowsPerPageChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(setLimit({ limit: newLimit }));
    dispatch(setCurrentPage({ currentPage: 0 }));
    dispatch(setSkip({ skip: 0 }));
    setSelected([]);
  };

  useEffect(() => {
    dispatch(
      getInventoryhistorybyId({
        paramId: id,
        limit,
        page: currentPage,
      })
    );
  }, [dispatch, limit, currentPage]);



  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isNotFound = !findHistory?.length;

  const visibleRows = React.useMemo(() => {
    return [...findHistory].sort(getComparator(order, orderBy));
  }, [findHistory, order, orderBy]);


  //
  const [filter, setFilter] = React.useState({
    search: "",
    startDate: null,
    endDate: null,
  });
  const handleFilterChange = (newFilters) => {
    dispatch(getInventoryhistorybyId({ paramId: id, limit, page: currentPage, filters: newFilters }));
  };
  useEffect(() => {
    dispatch(getInventoryhistorybyId({ paramId: id, limit, page: currentPage, filters: filter }));
  }, [dispatch, limit, currentPage, filter]);
  //

  return (
    <>
      <Box>
        <Paper sx={{ mb: 2 }}>
          <InOutFilter
            filter={filter}
            setFilter={setFilter}
            onFilterChange={handleFilterChange}
            numSelected={selected.length}
          />
          <TableContainer className="overflow-x-auto">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <CustumTableHead
                order={order}
                orderBy={orderBy}
                rowCount={findHistory.length}
                headCells={TABLE_HEAD}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = selected.includes(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <Index
                      isItemSelected={isItemSelected}
                      labelId={labelId}
                      row={row}
                      key={row._id}
                    />
                  );
                })}
                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </TableContainer>
          <TablePaginationCustom
            count={totalRecord}
            page={currentPage}
            rowsPerPage={limit}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            dense={dense}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    </>
  );
}
