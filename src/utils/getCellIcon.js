export const getCellIcon = (valor) => {
  if (valor === "RETARDO")
    return <Warning sx={{ fontSize: 12, color: "#f57c00" }} />;
  if (valor === "FALTA")
    return <Error sx={{ fontSize: 12, color: "#d32f2f" }} />;
  if (valor === "PERMISO")
    return <Assignment sx={{ fontSize: 12, color: "#e91e63" }} />;
  if (valor === "VACACIONES")
    return <Event sx={{ fontSize: 12, color: "#f57c00" }} />;
  return null;
};
