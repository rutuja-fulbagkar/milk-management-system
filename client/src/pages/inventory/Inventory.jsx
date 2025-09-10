import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Dialog, DialogTitle, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { saveAs } from 'file-saver';
import moment from 'moment';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from 'react-router-dom';
import * as XLSX from "xlsx";
import ExcelToJsonConverterCM from "../../components/extra/ExcelToJsonConverterCM";
import Iconify from '../../components/iconify';
import { getComparator } from '../../components/table/AscenDesc';
import CustumTableHead from '../../components/table/CustumTableHead';
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";
import TableNoData from '../../components/table/TableNoData';
import TablePaginationCustom from '../../components/table/TablePaginationCustom';
import { createInventorybyImportExl, findInventory } from '../../redux/slices/inventory/inventoryApi';
import { setCurrentPage, setLimit, setSkip } from '../../redux/slices/inventory/inventorySlice';
import { useDispatch, useSelector } from '../../redux/store';
import InventoryFilter from "./Filter/InventoryFilter";
import Index from './TableRow.jsx/Index';

const TABLE_HEAD = [
  { id: 'itemId', label: 'Item ID', numeric: false, disablePadding: true },
  { id: 'itemName', label: 'Item Name', numeric: false, disablePadding: true },
  { id: 'unitType', label: 'UOM', numeric: false, disablePadding: true },
  { id: 'openingStock', label: 'Opening Stock', numeric: false, disablePadding: true },
  { id: 'inWardQty', label: 'Inward Qty', numeric: false, disablePadding: true },
  { id: 'inWardQtyDate', label: 'Inward Qty Date', numeric: false, disablePadding: true },
  { id: 'outWardQty', label: 'Outward Qty', numeric: false, disablePadding: true },
  { id: 'outWardQtyDate', label: 'Outward Qty Date', numeric: false, disablePadding: true },
  { id: 'closingStock', label: 'Closing Stock', numeric: false, disablePadding: true },
  { id: 'warehouseId.name', label: 'Storage Location', numeric: false, disablePadding: true },
  { id: 'status', label: 'Status', numeric: false, disablePadding: true },
  { id: 'createdAt', label: 'Created At', numeric: false, disablePadding: true },
  { id: 'updatedAt', label: 'Updated At', numeric: false, disablePadding: true },
  { id: 'action', label: 'Action', numeric: false, disablePadding: true },
];

const Inventory = () => {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [openImportModale, setOpenImportModale] = useState(false);
  const [arrayData, setArrayData] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const dispatch = useDispatch();

  const { data: inventoryData, limit, currentPage, totalEntries, isLoading, outOfStockCount, inStockCount, allItemsCount, lowStockCount } = useSelector(
    (state) => state.inventory
  );

  const handlePageChange = useCallback((event, newPage) => {
    dispatch(setCurrentPage({ currentPage: newPage }));
    dispatch(setSkip({ skip: limit * newPage }));
    setSelected([]);
  }, [dispatch, limit]);

  const handleRowsPerPageChange = useCallback((event) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(setLimit({ limit: newLimit }));
    dispatch(setCurrentPage({ currentPage: 0 }));
    dispatch(setSkip({ skip: 0 }));
    setSelected([]);
  }, [dispatch]);

  useEffect(() => {
    dispatch(findInventory({ limit, page: currentPage }));
  }, [dispatch, limit, currentPage]);

  const handleRequestSort = useCallback((event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleSelectAllClick = useCallback((event) => {
    if (event.target.checked) {
      const newSelected = inventoryData.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }, [inventoryData]);

  const handleClick = useCallback((event, id) => {
    setSelected((prevSelected) => {
      const selectedIndex = prevSelected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(prevSelected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(prevSelected.slice(1));
      } else if (selectedIndex === prevSelected.length - 1) {
        newSelected = newSelected.concat(prevSelected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          prevSelected.slice(0, selectedIndex),
          prevSelected.slice(selectedIndex + 1),
        );
      }
      return newSelected;
    });
  }, []);

  const handleChangeDense = useCallback((event) => {
    setDense(event.target.checked);
  }, []);

  const isNotFound = !inventoryData?.length;

  const visibleRows = useMemo(() => {
    return Array.isArray(inventoryData)
      ? [...inventoryData].sort(getComparator(order, orderBy))
      : [];
  }, [inventoryData, order, orderBy]);

  const handleExport = useCallback(() => {
    const exportData = inventoryData.map((item) => ({
      "Item ID": item.itemId || '-',
      "Item Name": item.itemName || '-',
      "Unit Type": item.unitType || '-',
      "Opening Stock": item.openingStock ?? 0,
      "Inward Qty": item.inWardQty ?? 0,
      "Inward Qty Date": moment(item.inWardQtyDate).isValid() ? moment(item.inWardQtyDate).format('DD/MM/YY hh:mm A') : '-',
      "Outward Qty": item.outWardQty ?? 0,
      "Outward Qty Date": moment(item.outWardQtyDate).isValid() ? moment(item.outWardQtyDate).format('DD/MM/YY hh:mm A') : '-',
      "Closing Stock": item.closingStock ?? 0,
      "Location": `${item?.warehouseId?.name || '-'} (${item?.warehouseId?.location || '-'})`,
      "Status": item.status || '-',
      "Created At": moment(item.createdAt).isValid() ? moment(item.createdAt).format('DD/MM/YY hh:mm A') : '-',
      "Updated At": moment(item.updatedAt).isValid() ? moment(item.updatedAt).format('DD/MM/YY hh:mm A') : '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Inventory.xlsx");
  }, [inventoryData]);

  const IMPORT_HEAD_DATA = useMemo(() =>
    TABLE_HEAD.filter((item) => item.label !== "Action").map((item) => item.label), []
  );

  const camelCase = (str) =>
    str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, "");

  const handleSubmit = useCallback(async () => {
    const payload = [];
    for (let i = 1; i < arrayData[0].length; i += 1) {
      const obj = {};
      arrayData.forEach((row) => {
        const key = camelCase(row[0]);
        if (key === 'itemId' || key === 'status' || key === 'createdAt' || key === 'updatedAt') return;

        if (row[i]) {
          obj[key] = row[i];
        }
      });

      if (Object.keys(obj).length > 0) {
        payload.push(obj);
      }
    }


    const response = await dispatch(createInventorybyImportExl(payload));
    if (response?.payload?.success) {
      handleCloseImportModal();
      await dispatch(findInventory({ limit, page: currentPage }));
    }
  }, [arrayData, dispatch, currentPage, limit]);

  const handleCloseImportModal = useCallback(() => {
    setOpenImportModale(false);
  }, []);

  const [filter, setFilter] = useState({
    stockStatus: 'all',
    timeFrame: 'monthly',
    searchTerm: '',
  });

  const handleFilterChange = useCallback((newFilters) => {
    dispatch(findInventory({ limit, page: currentPage, filters: newFilters }));
  }, [dispatch, limit, currentPage]);

  useEffect(() => {
    dispatch(findInventory({ limit, page: currentPage, filters: filter }));
  }, [dispatch, limit, currentPage, filter]);

  return (
    <>
      <Helmet>
        <title> Inventory Management</title>
      </Helmet>
      <Box className="w-full px-2 sm:px-6 lg:px-8">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-md md:text-2xl text-gray-700 dark:text-gray-100 font-bold">Inventory</h1>

            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
              <Button
                variant="outlined"
                onClick={handleExport}
                startIcon={<Iconify icon="ic:baseline-download" />}
                className="text-nowrap"
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={() => setOpenImportModale(true)}
              >
                Import
              </Button>
              <Button
                component={RouterLink}
                to="/inventory/new"
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                className="text-nowrap"
              >
                Add Inventory
              </Button>
            </div>
          </Box>
        </ResponsivePaperWrapper>

        <Box>
          <Paper sx={{ mb: 2 }}>
            <InventoryFilter
              filter={filter}
              setFilter={setFilter}
              onFilterChange={handleFilterChange}
              numSelected={selected.length}
              outOfStockCount={outOfStockCount}
              allItemsCount={allItemsCount}
              inStockCount={inStockCount}
              lowStockCount={lowStockCount}
            />
            <TableContainer className="overflow-x-auto">
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <CustumTableHead
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={totalEntries}
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
                        handleClick={handleClick}
                        isLoading={isLoading}
                      />
                    );
                  })}
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>

            <TablePaginationCustom
              count={totalEntries}
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
      </Box>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openImportModale}
        onClose={handleCloseImportModal}
      >
        <DialogTitle>
          Import Inventory
          <IconButton
            aria-label="close"
            onClick={handleCloseImportModal}
            style={{ position: "absolute", right: "10px", top: "15px" }}
          >
            <CloseIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </DialogTitle>

        <ExcelToJsonConverterCM
          headingData={IMPORT_HEAD_DATA}
          handleSubmit={handleSubmit}
          arrayData={arrayData}
          setArrayData={setArrayData}
          jsonData={jsonData}
          setJsonData={setJsonData}
        />
      </Dialog>
    </>
  );
};

export default React.memo(Inventory);
