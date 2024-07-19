import React from "react";
/**
 * @brief Chip que se utiliza en el perfil para mostrar que color representa a que fecha.
 */
const CustomChip = ({ text, color }) => {
  return (
    <div
      style={{
        backgroundColor: color,
        padding: "5px",
        borderRadius: "5px",
        margin: "5px",
        display: "inline-block",
      }}
    >
      <span style={{ fontSize: "12px" }}>{text}</span>
    </div>
  );
};

export default CustomChip;
