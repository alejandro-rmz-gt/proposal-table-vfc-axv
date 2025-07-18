// components/ui/StatsDashboard.jsx
import React from "react";
import { StatsCard } from "./StatsCard";
import { statsData } from "../../utils/statsData";

export const StatsDashboard = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          color={stat.color}
        />
      ))}
    </div>
  );
};
