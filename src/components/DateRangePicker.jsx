const options = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 14 Days', value: 14 },
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
]

export default function DateRangePicker({ value, onChange, colors: c }) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border"
          style={
            value === opt.value
              ? { backgroundColor: '#3b82f6', color: '#ffffff', borderColor: '#3b82f6' }
              : { backgroundColor: c.card, color: c.textSecondary, borderColor: c.border }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
