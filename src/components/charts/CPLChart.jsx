import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { format, parseISO } from 'date-fns'

export default function CPLChart({ data, colors: c }) {
  const filtered = data.map((d) => ({
    ...d,
    cpl: d.leads > 0 ? d.spend / d.leads : null,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={filtered}>
        <defs>
          <linearGradient id="cplGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => format(parseISO(d), 'MMM d')}
          stroke={c.axis}
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          stroke={c.axis}
          fontSize={12}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
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
          formatter={(value) => {
            if (value === null) return ['No leads', 'CPL']
            return [`$${Number(value).toFixed(2)}`, 'Cost Per Lead']
          }}
        />
        <Area
          type="monotone"
          dataKey="cpl"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#cplGradient)"
          connectNulls
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
