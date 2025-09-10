import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import React from 'react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const MyExportButton = ({ HeadDataArray, RowDataArray, fileName, setExport }) => {
  const combineData = [[HeadDataArray], RowDataArray].flat();

  const downloadExcel = () => {
    if (setExport) {
      setExport(true);
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(combineData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      setExport(false);
    } else {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(combineData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    }
  };

  const renderCellContent = (cell) => {
    if (cell === true) {
      return 'Closed';
    }
    if (cell === false) {
      return 'Open';
    }
    return cell || '-';
  };

  return (
    <>
      <table style={{ display: 'none' }}>
        <thead>
          <tr>
            {HeadDataArray?.length &&
              HeadDataArray?.map((item, index) => <th key={index}>{item}</th>)}
          </tr>
        </thead>
        <tbody>
          {RowDataArray?.length &&
            RowDataArray.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row?.map((cell, cellIndex) => (
                  <td key={cellIndex}>{renderCellContent(cell)}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <Button
        variant="outlined"
        className="!h-[35px]"
        startIcon={<ExitToAppIcon />}
        onClick={downloadExcel}
      >
        Export
      </Button>
    </>
  );
};

MyExportButton.propTypes = {
  HeadDataArray: PropTypes.array,
  RowDataArray: PropTypes.array,
  fileName: PropTypes.string,
  setExport: PropTypes.func,
};

export default MyExportButton;
