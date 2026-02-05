import { useTheme } from "@/contexts/ThemeContext";
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
        className="px-3 py-2 rounded-lg shadow-lg border"
        style={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }}
      >
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {payload[0].payload.name}
        </p>
        <p
          className="text-sm font-bold"
          style={{ color: payload[0].payload.color }}
        >
          {payload[0].value}% completion rate
        </p>
      </div>
    );
  }
  return null;
}

export function HabitPerformanceChart({ data }: HabitPerformanceChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textColor = isDark ? "#9ca3af" : "#6b7280";
  const gridColor = isDark ? "#374151" : "#e5e7eb";

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -2, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="name"
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{
            value: "%",
            angle: -90,
            position: "insideLeft",
            style: { fill: textColor, fontSize: 12 },
          }}
        />
        <Tooltip content={<CustomTooltip />} cursor={false}/>
        <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
