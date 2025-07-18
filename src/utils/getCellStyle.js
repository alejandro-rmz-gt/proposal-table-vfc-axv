export const getCellStyle = (valor) => {
  if (valor === "RETARDO")
    return { backgroundColor: "#FFC00040", color: "#f57c00" };
  if (valor === "FALTA")
    return { backgroundColor: "#C55A1140", color: "#d32f2f" };
  if (valor === "PERMISO")
    return { backgroundColor: "#FF99CC40", color: "#e91e63" };
  if (valor === "VACACIONES")
    return { backgroundColor: "#FFFF0040", color: "#f57c00" };
  if (valor === "--") return { backgroundColor: "transparent", color: "#999" };
  return { backgroundColor: "transparent", color: "#333" };
};
