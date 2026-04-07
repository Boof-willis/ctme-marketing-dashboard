import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { format, parseISO } from 'date-fns'

export default function SpendLeadsChart({ data, colors: c }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(parseISO(d), 'MMM d')}
          stroke={c.axis}
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          yAxisId="spend"
          orientation="left"
          stroke={c.axis}
          fontSize={12}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <YAxis
          yAxisId="leads"
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
            if (name === 'spend') return [`$${Number(value).toFixed(2)}`, 'Spend']
            return [value, 'Leads']
          }}
        />
        <Bar
          yAxisId="leads"
          dataKey="leads"
          fill="#10b981"
          opacity={0.6}
          radius={[3, 3, 0, 0]}
          barSize={12}
        />
        <Line
          yAxisId="spend"
          type="monotone"
          dataKey="spend"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
