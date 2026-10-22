import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

export function Sparkline({
  data,
  color = "var(--primary)",
  label,
  height = 36,
}: {
  data: { label: string; value: number }[];
  color?: string;
  label: string;
  height?: number;
}) {
  return (
    <div role="img" aria-label={label} style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
          <Tooltip
            cursor={false}
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11, padding: "4px 8px" }}
            formatter={(v: number) => [`${Math.round(v)}%`, ""]}
            labelFormatter={(_, p) => p?.[0]?.payload?.label ?? ""}
            separator=""
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
