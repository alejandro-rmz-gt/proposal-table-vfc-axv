import React, { useState, useEffect, useRef } from "react";

export const TimeEditor = ({ initialTime, onSave, onCancel, isVisible }) => {
  const [time, setTime] = useState(initialTime || "");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isVisible]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleSave = () => {
    // Validar formato de hora (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (time === "" || time === "--" || timeRegex.test(time)) {
      onSave(time || "--");
    } else {
      // Si el formato es inválido, mantener el valor original
      onCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder="HH:MM"
      style={styleInput}
    />
  );
};

const styleInput = {
  width: "45px",
  height: "20px",
  fontSize: "10px",
  textAlign: "center",
  border: "1px solid #1976d2",
  borderRadius: "3px",
  outline: "none",
  backgroundColor: "white",
  fontWeight: "bold",
};
