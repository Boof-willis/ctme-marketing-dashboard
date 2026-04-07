export default function KPICard({ label, value, format = 'number', colors: c }) {
  let display = value

  if (format === 'currency') {
    display = `$${Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  } else if (format === 'percent') {
    display = `${Number(value).toFixed(1)}%`
  } else if (format === 'decimal') {
    display = Number(value).toFixed(1)
  } else {
    display = Number(value).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })
  }

  return (
    <div
      className="rounded-xl border p-5 flex-1 min-w-[150px]"
      style={{ backgroundColor: c.card, borderColor: c.border }}
    >
      <p className="text-sm mb-1" style={{ color: c.textSecondary }}>{label}</p>
      <p className="text-2xl font-semibold" style={{ color: c.text }}>{display}</p>
    </div>
  )
}
