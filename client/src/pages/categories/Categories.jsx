import {
  Button
} from "@mui/material";
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import * as React from 'react';
import { useEffect, useCallback, useMemo } from 'react';
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from 'react-router-dom';
import Iconify from '../../components/iconify';
import { getComparator } from '../../components/table/AscenDesc';
import CustumTableHead from '../../components/table/CustumTableHead';
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";
import TableNoData from '../../components/table/TableNoData';
import TablePaginationCustom from "../../components/table/TablePaginationCustom";
import { findcategories } from "../../redux/slices/categories/categoriesApi";
import {
  setCurrentPage,
  setLimit,
  setSkip
} from '../../redux/slices/categories/categoriesSlice';
import { useDispatch, useSelector } from '../../redux/store';
import Index from './TableRow.jsx/Index';
import TableToolbar from "./TableToolbar";

const TABLE_HEAD = [
  { id: 'categoryName', label: 'Category Name', numeric: false, disablePadding: true },
  { id: 'createdAt', label: 'Created At', numeric: false, disablePadding: true },
  { id: 'updatedAt', label: 'Updated At', numeric: false, disablePadding: true },
  { id: 'action', label: 'Action', numeric: false, disablePadding: true },
];

const Categories = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [dense, setDense] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const dispatch = useDispatch();
  const { data: categoriesData, limit, currentPage, totalEntries, isLoading } = useSelector(
    (state) => state.categories
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
    dispatch(
      findcategories({
        limit,
        page: currentPage,
        search: searchQuery,
      })
    );
  }, [dispatch, limit, currentPage, searchQuery]);

  const handleRequestSort = useCallback((event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }, [order, orderBy]);

  const handleSelectAllClick = useCallback((event) => {
    if (event.target.checked) {
      const newSelected = categoriesData.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }, [categoriesData]);

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

  const isNotFound = !categoriesData?.length;

  const visibleRows = useMemo(() => {
    return [...categoriesData].sort(getComparator(order, orderBy));
  }, [categoriesData, order, orderBy]);

  return (
    <>
      <Helmet>
        <title>Categories</title>
      </Helmet>
      <Box className="w-full px-2 sm:px-6 lg:px-8">
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-md md:text-2xl text-gray-700 dark:text-gray-100 font-bold">Categories</h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
              <Button
                component={RouterLink}
                to="/categories/new"
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                className="text-nowrap"
              >
                Add Categories
              </Button>
            </div>
          </Box>
        </ResponsivePaperWrapper>
      </Box>
      <Box className="w-full px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto">
        <Paper sx={{ mb: 2 }}>
          <TableToolbar numSelected={selected.length} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery} />
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
    </>
  );
}

export default React.memo(Categories);
