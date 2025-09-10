import { TableCell, TableRow } from "@mui/material";
import React from "react";

const LoadingContent = () => {
  return (
    <TableRow className="!w-full">
      <TableCell
        colSpan={10}
        className="!w-full flex items-center justify-center"
      >
        <div className="h-[400px] flex items-center justify-center">
          <img src="/image/loder_animation.gif" className="max-w-[200px]" />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LoadingContent;
