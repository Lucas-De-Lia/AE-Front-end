import React, { useState } from "react";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import { buttonTopStyle } from "../../theme";

function MenuButton({ page, onClick }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "hover-popper" : undefined;

  return (
    <div>
      <div
        style={{ display: "inline-block" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Button
          key={page.label}
          sx={buttonTopStyle}
          disabled={page.disabled}
          aria-label={page.disabled ? "Fuera de fecha" : ""}
          
          onClick={onClick}
        >
          {page.label}
        </Button>
      </div>

      {page.disabled && (
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <div
            style={{
              padding: 10,
              backgroundColor: "white",
              border: "1px solid",
            }}
          >
           {page.Popper}
          </div>
        </Popper>
      )}
    </div>
  );
}

export default MenuButton;
