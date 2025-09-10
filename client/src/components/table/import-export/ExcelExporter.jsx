import MyExportButton from './extra/MyExportButton';

export const ExcelExporter = ({ HeadDataArray, RowDataArray, fileName }) => (
  <MyExportButton
    HeadDataArray={HeadDataArray}
    RowDataArray={RowDataArray}
    fileName={fileName}
  />
);

// src/components/import-export/ExcelImporter.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogTitle, IconButton, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExcelToJsonConverter from './extra/ExcelToJsonConverter';

export const ExcelImporter = ({ 
  open,
  onClose,
  onImport,
  headers,
  sampleFileName 
}) => {
  const [arrayData, setArrayData] = useState([]);
  const [jsonData, setJsonData] = useState(null);

  const handleSubmit = async () => {
    const payload = arrayData[0].slice(1).map((_, i) => 
      arrayData.reduce((acc, row, index) => ({
        ...acc,
        [camelCase(row[0])]: row[i]
      }), {})
    );

    await onImport(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Import Data
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box sx={{ p: 3 }}>
        <ExcelToJsonConverter
          setArrayData={setArrayData}
          setJsonData={setJsonData}
          headers={headers}
          sampleFileName={sampleFileName}
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit Import
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

const camelCase = (str) => str
  .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
    index === 0 ? word.toLowerCase() : word.toUpperCase()
  )
  .replace(/\s+/g, '');
