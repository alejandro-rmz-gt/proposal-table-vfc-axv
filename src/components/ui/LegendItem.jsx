// components/LegendItem.jsx
import React from "react";

export const LegendItem = ({
  icon: Icon,
  label,
  backgroundColor,
  borderColor,
  iconColor,
}) => {
  return (
    <span
      style={{
        backgroundColor,
        padding: "6px 12px",
        borderRadius: "16px",
        fontSize: "12px",
        border: `1px solid ${borderColor}`,
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <Icon sx={{ fontSize: 14, color: iconColor }} />
      {label}
    </span>
  );
};
