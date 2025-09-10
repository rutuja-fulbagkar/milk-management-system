import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import TableNoData from "../../../components/table/TableNoData";
import { fetchPartsHistory } from "../../../redux/slices/company/companyApi";

const ViewPartsHistoryDialog = ({ open, onClose, row }) => {
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const [installationData, setInstallationData] = useState([]);
  const [warrantyData, setWarrantyData] = useState([]);
  const [amcData, setAmcData] = useState([]);
  const [itemDetailsDialogOpen, setItemDetailsDialogOpen] = useState(false);
  const [selectedItemList, setSelectedItemList] = useState([]);

  useEffect(() => {
    if (open) {
      fetchData("Installation");
    }
  }, [open, dispatch, row]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    const status =
      newValue === 0 ? "Installation" : newValue === 1 ? "Warranty" : "AMC";
    fetchData(status);
  };

  const fetchData = (status) => {
    dispatch(fetchPartsHistory({ id: row, status })).then((action) => {
      if (fetchPartsHistory.fulfilled.match(action)) {
        if (status === "Installation") {
          setInstallationData(action.payload);
        } else if (status === "Warranty") {
          setWarrantyData(action.payload);
        } else if (status === "AMC") {
          setAmcData(action.payload);
        }
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleViewClick = (itemList) => {
    setSelectedItemList(itemList);
    setItemDetailsDialogOpen(true);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 6,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: 22,
            color: "#2e3c50",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          View Parts History
          <IconButton onClick={onClose} sx={{ color: "#2e3c50" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            sx={{ mb: 2 }}
          >
            <Tab label="Installation" />
            <Tab label="Warranty" />
            <Tab label="AMC" />
          </Tabs>
          <Fade in={true}>
            <Box>
              {tabIndex === 0 && (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 4,
                    mb: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                        <TableCell>SNo.</TableCell>
                        <TableCell>Item Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Code/SKU</TableCell>
                        <TableCell>UOM</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Outward ID</TableCell>
                        <TableCell>Outward Date</TableCell>
                        <TableCell>Used By</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {installationData.length === 0 ? (
                        <TableNoData isNotFound={!installationData?.length} />
                      ) : (
                        installationData.map((row, index) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                              "&:hover": {
                                backgroundColor: "#f1f8e9",
                              },
                            }}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {row?.itemId?.itemName || "-"}
                            </TableCell>
                            <TableCell>
                              {row?.itemId?.category?.name || "-"}
                            </TableCell>
                            <TableCell>
                              {row?.itemId?.itemCode || "-"}
                            </TableCell>
                            <TableCell>
                              {row?.itemId?.unitType || "-"}
                            </TableCell>
                            <TableCell>{row?.quantity || "-"}</TableCell>
                            <TableCell>{row.outward_id || "-"}</TableCell>
                            <TableCell>{formatDate(row.outwardDate)}</TableCell>
                            <TableCell>
                              {`${row?.used_by?.[0]?.firstName || ""} ${
                                row?.used_by?.[0]?.lastName || ""
                              }`.trim()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {tabIndex === 1 && (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 4,
                    mb: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                        <TableCell>SNo.</TableCell>
                        <TableCell>Service ID</TableCell>
                        <TableCell>Service Date</TableCell>
                        <TableCell>Used By</TableCell>
                        <TableCell>Item List</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {warrantyData?.length === 0 ? (
                        <TableNoData isNotFound={!warrantyData?.length} />
                      ) : (
                        warrantyData?.map((row, index) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                              "&:hover": {
                                backgroundColor: "#f1f8e9",
                              },
                            }}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row?.serviceDetailId}</TableCell>
                            <TableCell>
                              {formatDate(row?.serviceDate)}
                            </TableCell>
                            <TableCell>
                              {row?.used_by
                                ?.map(
                                  (user) => `${user.firstName} ${user.lastName}`
                                )
                                .join(", ")}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color="primary"
                                onClick={() => handleViewClick(row?.items)}
                              >
                                <AiOutlineEye />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {tabIndex === 2 && (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 4,
                    mb: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                        <TableCell>SNo.</TableCell>
                        <TableCell>AMC ID</TableCell>
                        <TableCell>AMC Date</TableCell>
                        <TableCell>Used By</TableCell>
                        <TableCell>Item List</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {amcData.length === 0 ? (
                        <TableNoData isNotFound={!amcData?.length} />
                      ) : (
                        amcData.map((row, index) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                              "&:hover": {
                                backgroundColor: "#f1f8e9",
                              },
                            }}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.amcId}</TableCell>
                            <TableCell>{row.amcDate}</TableCell>
                            <TableCell>{row.usedBy}</TableCell>
                            <TableCell>
                              <IconButton
                                color="primary"
                                onClick={() => handleViewClick(row?.items)}
                              >
                                <AiOutlineEye />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Fade>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, fontWeight: "bold" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={itemDetailsDialogOpen}
        onClose={() => setItemDetailsDialogOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 6,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: 22,
            color: "#2e3c50",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Item Details
          <IconButton onClick={() => setItemDetailsDialogOpen(false)} sx={{ color: "#2e3c50" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell>Item</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Type</TableCell>
                  <TableCell>Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItemList?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No items found
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedItemList?.map((item) => (
                    <TableRow key={item?._id}>
                      <TableCell>{item?.itemId?.itemName}</TableCell>
                      <TableCell>
                        {item?.itemId?.category?.categoryName || "-"}
                      </TableCell>
                      <TableCell>{item?.quantity}</TableCell>
                      <TableCell>{item?.itemId?.unitType}</TableCell>
                      <TableCell>{item?.itemId?.itemCode}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button
            onClick={() => setItemDetailsDialogOpen(false)}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, fontWeight: "bold" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewPartsHistoryDialog;
