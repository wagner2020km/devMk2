import React, { useEffect, useState } from 'react';
import XLSX from 'sheetjs-style';
import * as FileSaver from 'file-saver';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
import { FaCloudDownloadAlt } from "react-icons/fa";


export default function ExportToExcel({ excelData, fileName }) {

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  
  const exportExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  return (
    <>
      <Tooltip title="Export excel">
        <Button variant='contained'
          onClick={(e) => exportExcel()} color='primary'
          style={{ cursor: "pointer", fontSize: 14 }}
        >
          Excel
          <FaCloudDownloadAlt size={18} color="#FFF" />
        </Button>
      </Tooltip>
    </>
  );
}