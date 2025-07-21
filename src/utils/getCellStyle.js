export const getCellStyle = (valor) => {
  // Normalizar el valor (puede venir como "RETARDO" o "retardo")
  const normalizedValue =
    typeof valor === "string" ? valor.toLowerCase() : valor;

  switch (normalizedValue) {
    case "retardo":
      return {
        backgroundColor: "#FFC00040",
        color: "#f57c00",
        border: "2px solid #FFC000",
      };
    case "falta":
      return {
        backgroundColor: "#C55A1140",
        color: "#d32f2f",
        border: "2px solid #C55A11",
      };
    case "permiso":
      return {
        backgroundColor: "#FF99CC40",
        color: "#e91e63",
        border: "2px solid #FF99CC",
      };
    case "vacaciones":
      return {
        backgroundColor: "#FFFF0040",
        color: "#f57c00",
        border: "2px solid #FFFF00",
      };
    case "--":
    case "ausente":
      return {
        backgroundColor: "#f5f5f5",
        color: "#999",
        border: "1px solid #e0e0e0",
      };
    case "normal":
    default:
      return {
        backgroundColor: "#4CAF5010",
        color: "#333",
        border: "1px solid #4CAF50",
      };
  }
};
