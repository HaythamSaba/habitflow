import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { DailyTargetPoint } from "@/lib/analytics";

interface CompletionTrendChartProps {
  data: DailyTargetPoint[];
}

// Custom tooltip with proper typing
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number | null;
    payload: DailyTargetPoint;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tooltipBg = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";

  if (active && payload && payload.length) {
    const point = payload[0].payload;
    return (
      <div
        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg border max-w-45"
        style={{
          backgroundColor: tooltipBg,
          borderColor: tooltipBorder,
        }}
      >
        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
          {point.date}
        </p>
        {point.rate === null ? (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            No habits yet
          </p>
        ) : (
          <>
            <p className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-bold">
              {point.rate}% of daily targets
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {point.done} of {point.expected} check-ins
            </p>
          </>
        )}
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

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  return {
    height: isMobile ? 220 : isTablet ? 260 : 300,
    fontSize: isMobile ? 10 : 12,
    margin: isMobile
      ? { top: 5, right: 5, left: -10, bottom: 5 }
      : { top: 5, right: 10, left: -5, bottom: 5 },
    minTickGap: isMobile ? 50 : 30,
    dotRadius: isMobile ? 2 : 4,
    activeDotRadius: isMobile ? 4 : 6,
    strokeWidth: isMobile ? 1.5 : 2,
    // Wide enough for "100%" labels
    yAxisWidth: isMobile ? 36 : 44,
  };
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  const { theme } = useTheme();
  const chart = useChartDimensions();

  // Dark mode colors
  const isDark = theme === "dark";
  const textColor = isDark ? "#9ca3af" : "#6b7280";
  const gridColor = isDark ? "#374151" : "#e5e7eb";

  return (
    <div className="w-full min-w-0">
      <ResponsiveContainer width="100%" height={chart.height}>
        <LineChart data={data} margin={chart.margin}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            stroke={textColor}
            fontSize={chart.fontSize}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={chart.minTickGap}
          />
          <YAxis
            stroke={textColor}
            fontSize={chart.fontSize}
            tickLine={false}
            axisLine={false}
            width={chart.yAxisWidth}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(value: number) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#10b981"
            strokeWidth={chart.strokeWidth}
            dot={{ fill: "#10b981", r: chart.dotRadius }}
            activeDot={{ r: chart.activeDotRadius }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
