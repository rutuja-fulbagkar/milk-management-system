import React from "react";
import { Paper, Box } from "@mui/material";

const ResponsivePaperWrapper = ({ children, sx = {}, boxClassName = "" }) => {
  return (
    // <Box className={`w-full px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto ${boxClassName}`}>
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        mb: 2,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        ...sx,
      }}

      
    >
      {children}
    </Paper>
    // </Box>
  );
};

export default ResponsivePaperWrapper;
