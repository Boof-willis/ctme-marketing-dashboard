import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { format, parseISO } from 'date-fns'

export default function ImpressionsClicksChart({ data, colors: c }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(parseISO(d), 'MMM d')}
          stroke={c.axis}
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          yAxisId="impressions"
          orientation="left"
          stroke={c.axis}
          fontSize={12}
          tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
        />
        <YAxis
          yAxisId="clicks"
          orientation="right"
          stroke={c.axis}
          fontSize={12}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: c.tooltipBg,
            border: `1px solid ${c.tooltipBorder}`,
            borderRadius: '8px',
            fontSize: '13px',
            color: c.tooltipText,
          }}
          labelFormatter={(d) => format(parseISO(d), 'MMM d, yyyy')}
          formatter={(value, name) => {
            const label = name === 'impressions' ? 'Impressions' : 'Link Clicks'
            return [Number(value).toLocaleString(), label]
          }}
        />
        <Line
          yAxisId="impressions"
          type="monotone"
          dataKey="impressions"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="clicks"
          type="monotone"
          dataKey="linkClicks"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
