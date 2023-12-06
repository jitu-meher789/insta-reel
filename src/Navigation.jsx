import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


export default function Navigation() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box
      className="mui-box21"
      sx={{
        display: "flex",
        position: "absolute",
        top: "1rem",
        left: "1rem",
        color: "white",
      }}
    >
      <IconButton
        color="inherit"
        onClick={handleDrawerOpen}
        sx={{ mr: 2,...(open && {display: "none", width: "2rem", height: "2rem" })}}
      >
        <MenuIcon sx={{ fontSize: "2rem" }} />
      </IconButton>

      <Drawer
        sx={{ width: 240,flexShrink: 0, "& .MuiDrawer-paper": {width: 240,boxSizing: "border-box"}}}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>

      </Drawer>
    </Box>
  );
}
