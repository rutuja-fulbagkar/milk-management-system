import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArchiveIcon from '@mui/icons-material/Archive';
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  InputAdornment,
  OutlinedInput
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

function TableToolbar({ numSelected, searchQuery, onSearchChange, onArchive }) {
  return (
    <Toolbar
      sx={[
        {
          py: 2,
          pl: { sm: 3 },
          pr: { xs: 1, sm: 1 },
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      <Box sx={{ flex: 1, width: "100%" }}>
        <OutlinedInput
          fullWidth
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => onSearchChange("")} edge="end">
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            )
          }
        />

        
      </Box>

      {(numSelected > 0 && !onArchive) && (
        <>
          <Typography
            sx={{ flexShrink: 0 }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          <Tooltip title="Delete">
          <IconButton >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      // ) : (
      //   <Tooltip title="Filter list">
      //     <IconButton>
      //       <FilterListIcon />
      //     </IconButton>
      //   </Tooltip>
      )}
      {(numSelected > 0 && onArchive) && (
        <>
          <Typography
            sx={{ flexShrink: 0 }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          <Tooltip title="Archive">
          <IconButton onClick={onArchive}>
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
        </>
      // ) : (
      //   <Tooltip title="Filter list">
      //     <IconButton>
      //       <FilterListIcon />
      //     </IconButton>
      //   </Tooltip>
      )}
    </Toolbar>
  );
}

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onArchive: PropTypes.func, 
};

export default TableToolbar;
