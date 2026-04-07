import { useState } from 'react'
import { useDashboardData } from '../hooks/useDashboardData'
import { useTheme, themeColors } from '../ThemeContext'
import KPICard from './KPICard'
import DateRangePicker from './DateRangePicker'
import SpendLeadsChart from './charts/SpendLeadsChart'
import ImpressionsClicksChart from './charts/ImpressionsClicksChart'
import CPLChart from './charts/CPLChart'

export default function Dashboard() {
  const [rangeDays, setRangeDays] = useState(30)
  const { data, loading, error } = useDashboardData(rangeDays)
  const { dark, toggle } = useTheme()
  const c = themeColors(dark)

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: c.bg }}>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 max-w-md text-center">
          <p className="text-red-400 font-medium mb-2">Failed to load dashboard data</p>
          <p className="text-sm" style={{ color: c.textSecondary }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ backgroundColor: c.bg, color: c.text }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-xl font-semibold" style={{ color: c.text }}>Marketing Performance</h1>
        <div className="flex items-center gap-3">
          <DateRangePicker value={rangeDays} onChange={setRangeDays} colors={c} />
          <button
            onClick={toggle}
            className="p-2 rounded-lg border transition-colors cursor-pointer"
            style={{ backgroundColor: c.card, borderColor: c.border, color: c.textSecondary }}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3" style={{ color: c.textSecondary }}>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading data...
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="flex flex-wrap gap-4 mb-8">
            <KPICard label="Total Spend" value={data.kpis.totalSpend} format="currency" colors={c} />
            <KPICard label="Avg Daily Spend" value={data.kpis.avgDailySpend} format="currency" colors={c} />
            <KPICard label="Total Leads" value={data.kpis.totalLeads} colors={c} />
            <KPICard label="Cost Per Lead" value={data.kpis.cpl} format="currency" colors={c} />
            <KPICard label="Cost Per Booked Call" value={data.kpis.cpbc} format="currency" colors={c} />
            <KPICard label="TOF > MOF %" value={data.kpis.tofToMof} format="percent" colors={c} />
            <KPICard label="MOF > BOF %" value={data.kpis.mofToBof} format="percent" colors={c} />
            <KPICard label="7-Day Avg Booked Calls" value={data.kpis.rolling7} format="decimal" colors={c} />
            <KPICard label="30-Day Avg Booked Calls" value={data.kpis.rolling30} format="decimal" colors={c} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Daily Spend and Leads" colors={c}>
              <SpendLeadsChart data={data.daily} colors={c} />
            </ChartCard>
            <ChartCard title="Impressions and Link Clicks" colors={c}>
              <ImpressionsClicksChart data={data.daily} colors={c} />
            </ChartCard>
            <ChartCard title="Cost Per Lead Trend" className="lg:col-span-2" colors={c}>
              <CPLChart data={data.daily} colors={c} />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  )
}

function ChartCard({ title, children, className = '', colors: c }) {
  return (
    <div
      className={`rounded-xl border p-5 ${className}`}
      style={{ backgroundColor: c.card, borderColor: c.border }}
    >
      <h2 className="text-sm font-medium mb-4" style={{ color: c.textSecondary }}>{title}</h2>
      {children}
    </div>
  )
}
