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

interface CompletionTrendChartProps {
  data: Array<{
    date: string;
    completions: number;
  }>;
}

// ⭐ Custom tooltip with proper typing
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      date: string;
      completions: number;
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
        className="px-3 py-2 rounded-lg shadow-lg border"
        style={{
          backgroundColor: tooltipBg,
          borderColor: tooltipBorder,
        }}
      >
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {payload[0].payload.date}
        </p>
        <p className="text-sm text-primary-500 font-bold">
          {payload[0].value} completions
        </p>
      </div>
    );
  }
  return null;
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  const { theme } = useTheme();

  // Dark mode colors
  const isDark = theme === "dark";
  const textColor = isDark ? "#9ca3af" : "#6b7280";
  const gridColor = isDark ? "#374151" : "#e5e7eb";

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="date"
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={30}
        />
        <YAxis
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="completions"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: "#10b981", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
