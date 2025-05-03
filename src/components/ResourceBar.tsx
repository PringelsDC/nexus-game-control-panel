
import React from "react";

interface ResourceBarProps {
  used: number;
  total: number;
  label: string;
  unit?: string;
}

const ResourceBar = ({ used, total, label, unit = "" }: ResourceBarProps) => {
  const percentage = Math.min(100, Math.max(0, Math.round((used / total) * 100)));
  const getColorClass = () => {
    if (percentage > 90) return "bg-red-500";
    if (percentage > 70) return "bg-yellow-500";
    return "bg-game-primary";
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>
          {used}
          {unit} / {total}
          {unit}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getColorClass()} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ResourceBar;
