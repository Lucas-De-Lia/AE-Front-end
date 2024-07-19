import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import React from "react";
import { useComponentAEProfileString } from "../../contexts/TextProvider.jsx";
import { badgeUserAnchorStyle, boxUserbadgeStyle } from "../../theme.jsx";
import { stringAvatar } from "../../utiles";

/**
 * @brief Bandage que indica el estado del usario si esta excluido o sin exclusion
 */
function IconUserBadge({ username, isActive }) {
  const statusColor =
    isActive !== null ? (isActive ? "success" : "error") : "secondary";
  const badgeString = useComponentAEProfileString().badge;
  const statusText = isActive ? badgeString.status[0] : badgeString.status[1];

  return (
    <Box sx={boxUserbadgeStyle}>
      <Badge
        anchorOrigin={badgeUserAnchorStyle}
        badgeContent={statusText}
        color={statusColor}
      >
        <Avatar {...stringAvatar(username)} variant="rounded"></Avatar>
      </Badge>
    </Box>
  );
}

export default IconUserBadge;
