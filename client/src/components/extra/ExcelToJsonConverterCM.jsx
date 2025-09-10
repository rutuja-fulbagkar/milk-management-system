import { LoadingButton } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import Iconify from '../iconify';
import UploadBox from '../upload/UploadBox';

const ExcelToJsonConverterCM = ({
  headingData,
  fetchData,
  onClose,
  handleSubmit,
  arrayData,
  setArrayData,
  jsonData,
  setJsonData,
}) => {
  const [openImportModale, setOpenImportModale] = useState(false);
  const [columnName, setColumnName] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileChange = (files) => {
    const file = files[0];
    const reader = new FileReader();

    const validExtensions = ['xls', 'xlsx', 'csv'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      toast.error('Invalid file type. Please upload an xls, xlsx, or csv file.');
      return;
    }

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setJsonData(excelData);
    };

    reader.readAsArrayBuffer(file);
    setFileUploaded(true);
  };

  const handleCloseImportModal = () => {
    setOpenImportModale(false);
  };

  useEffect(() => {
    if (jsonData) {
      const transformedArray = Array.from({ length: jsonData[0].length }, (_, columnIndex) =>
        jsonData.map((row) => row[columnIndex])
      );
      setArrayData([...transformedArray]);
      setColumnName([...jsonData[0]]);
    }
  }, [jsonData, setArrayData, setColumnName]);

  const handleChangeColumnName = (e, index) => {
    columnName[index] = e.target.value;
    jsonData[0] = columnName;
    setJsonData([...jsonData]);
    setColumnName([...columnName]);
  };

  return (
    <>
      <Box className="px-[25px]">
        <Box className="text-[13px] font-[500] mb-[5px]">
          Upload File (file must be a file of type: xls, xlsx, csv)
        </Box>
        <Stack direction="row" spacing={2}>
          <UploadBox
            onDrop={handleFileChange}
            placeholder={
              <Stack spacing={0.5} alignItems="center">
                {fileUploaded ? (
                  <Iconify icon="eva:checkmark-circle-fill" width={40} /> // Change icon after upload
                ) : (
                  <Iconify icon="eva:cloud-upload-fill" width={40} />
                )}
                <Typography variant="body2" style={{ color: fileUploaded ? 'green' : 'inherit' }}>
                  {fileUploaded ? 'File uploaded successfully' : 'Upload file'}
                </Typography>{' '}
                {/* Change text based on upload status and apply color style */}
              </Stack>
            }
            sx={{ flexGrow: 1, height: 'auto', py: 2.5, mb: 3 }}
          />
        </Stack>
        <Stack alignItems="flex-end" sx={{ my: 2 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={!jsonData ? JSON.parse('true') : JSON.parse('false')}
            onClick={() => setOpenImportModale(true)}
          >
            Upload and Move to Next Step
          </LoadingButton>
        </Stack>
      </Box>

      <Dialog fullWidth maxWidth="md" open={openImportModale} onClose={handleCloseImportModal}>
        <DialogTitle>Import</DialogTitle>

        <Box className="px-[25px]">
          <Box className="text-[13px] font-[400]">
            Please sort the data you have uploaded by matching the columns in the CSV to the fields
            in the associated fields.
          </Box>
          <Box className="flex w-full gap-[5px] overflow-x-auto">
            {jsonData &&
              arrayData?.map((item, index) => (
                <Box className="border-[1px] border-solid border-[#dee2e6] min-w-[200px] p-[10px]">
                  <Box className="mb-[15px] employees_selecter employess_table">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label" className="!text-[13px]">
                        Column Name
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Column Name"
                        className="!text-[13px]"
                        value={columnName?.[index] || ''}
                        onChange={(e) => handleChangeColumnName(e, index)}
                      >
                        {headingData &&
                          headingData.map((headItem) => (
                            <MenuItem value={headItem}>{headItem}</MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {item?.map((x) => (
                    <Box className="text-[13px] w-full overflow-hidden pl-[5px]">{x}</Box>
                  ))}
                </Box>
              ))}
          </Box>
        </Box>
        <Stack alignItems="flex-end" sx={{ m: 2 }}>
          <LoadingButton type="submit" variant="contained" onClick={() => handleSubmit()}>
            Submit
          </LoadingButton>
        </Stack>
      </Dialog>
    </>
  );
};

ExcelToJsonConverterCM.propTypes = {
  headingData: PropTypes.array,
  fetchData: PropTypes.func,
  onClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  arrayData: PropTypes.array,
  setArrayData: PropTypes.func,
  jsonData: PropTypes.any,
  setJsonData: PropTypes.func,
};

export default ExcelToJsonConverterCM;
