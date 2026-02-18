import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HabitPerformanceChartProps {
  data: Array<{
    name: string;
    rate: number;
    color: string;
  }>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      name: string;
      rate: number;
      color: string;
    };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tooltipBg = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";

  if (active && payload && payload.length) {
    return (
      <div
        // RESPONSIVE: max-w so tooltip doesn't overflow on tiny screens
        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg border max-w-50"
        style={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }}
      >
        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {payload[0].payload.name}
        </p>
        <p
          className="text-xs sm:text-sm font-bold"
          style={{ color: payload[0].payload.color }}
        >
          {payload[0].value}% completion
        </p>
      </div>
    );
  }
  return null;
}
function useChartDimensions() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // RESPONSIVE: Return different values based on screen width
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  return {
    // RESPONSIVE: Chart height scales — 280px mobile, 380px tablet, 500px desktop
    height: isMobile ? 280 : isTablet ? 380 : 500,
    // RESPONSIVE: Smaller font on mobile
    fontSize: isMobile ? 10 : 12,
    // RESPONSIVE: Steeper angle on mobile to fit more labels, less on desktop
    xAxisAngle: isMobile ? -60 : -45,
    // RESPONSIVE: More height for angled labels on mobile
    xAxisHeight: isMobile ? 70 : 80,
    // RESPONSIVE: Tighter margins on mobile
    margin: isMobile
      ? { top: 5, right: 5, left: -15, bottom: 5 }
      : { top: 5, right: 10, left: -2, bottom: 5 },
    // RESPONSIVE: Truncate long habit names on mobile
    tickFormatter: (value: string) =>
      isMobile && value.length > 8 ? `${value.slice(0, 7)}…` : value,
    // RESPONSIVE: Thinner bars on mobile
    barRadius: isMobile
      ? ([4, 4, 0, 0] as [number, number, number, number])
      : ([8, 8, 0, 0] as [number, number, number, number]),
  };
}

export function HabitPerformanceChart({ data }: HabitPerformanceChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textColor = isDark ? "#9ca3af" : "#6b7280";
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const chart = useChartDimensions();

  return (
    // RESPONSIVE: min-w-0 prevents chart from overflowing flex/grid parent
    <div className="w-full min-w-0">
      <ResponsiveContainer width="100%" height={chart.height}>
        <BarChart data={data} margin={chart.margin}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="name"
            stroke={textColor}
            fontSize={chart.fontSize}
            tickLine={false}
            angle={chart.xAxisAngle}
            textAnchor="end"
            height={chart.xAxisHeight}
            // RESPONSIVE: Truncate long names on mobile
            tickFormatter={chart.tickFormatter}
          />
          <YAxis
            stroke={textColor}
            fontSize={chart.fontSize}
            tickLine={false}
            axisLine={false}
            // RESPONSIVE: Narrower Y-axis on mobile
            width={30}
            label={{
              value: "%",
              angle: -90,
              position: "insideLeft",
              style: { fill: textColor, fontSize: chart.fontSize },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="rate" radius={chart.barRadius}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
