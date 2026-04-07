import { useState, useEffect, useCallback } from 'react'
import { subDays, eachDayOfInterval, format } from 'date-fns'
import { fetchWindsorData } from '../api/windsor'
import { fetchPipelineData } from '../api/ghl'


export function useDashboardData(rangeDays = 30) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const endDate = new Date()
    const startDate = subDays(endDate, rangeDays - 1)

    try {
      const [windsorData, pipelineData] = await Promise.all([
        fetchWindsorData(startDate, endDate),
        fetchPipelineData(startDate, endDate),
      ])

      // Seed every date in the range so there are no gaps
      const dateMap = {}
      for (const day of eachDayOfInterval({ start: startDate, end: endDate })) {
        dateMap[format(day, 'yyyy-MM-dd')] = { date: format(day, 'yyyy-MM-dd') }
      }
      for (const row of windsorData) {
        dateMap[row.date] = { ...dateMap[row.date], ...row }
      }
      for (const row of pipelineData.leads) {
        dateMap[row.date] = { ...dateMap[row.date], ...row }
      }
      for (const row of pipelineData.bookedCalls) {
        dateMap[row.date] = { ...dateMap[row.date], ...row }
      }
      for (const row of pipelineData.coldBooked) {
        dateMap[row.date] = { ...dateMap[row.date], ...row }
      }
      for (const row of pipelineData.qualified) {
        dateMap[row.date] = { ...dateMap[row.date], ...row }
      }

      const daily = Object.values(dateMap)
        .map((d) => ({
          date: d.date,
          spend: d.spend || 0,
          impressions: d.impressions || 0,
          linkClicks: d.linkClicks || 0,
          leads: d.leads || 0,
          coldBooked: d.coldBooked || 0,
          qualified: d.qualified || 0,
          bookedCalls: d.bookedCalls || 0,
          cpl: d.leads > 0 ? (d.spend || 0) / d.leads : 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      const totalSpend = daily.reduce((s, d) => s + d.spend, 0)
      const daysWithSpend = daily.filter((d) => d.spend > 0).length
      const avgDailySpend = daysWithSpend > 0 ? totalSpend / daysWithSpend : 0
      const totalLeads = daily.reduce((s, d) => s + d.leads, 0)
      const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0
      const totalBookedCalls = daily.reduce((s, d) => s + d.bookedCalls, 0)
      const totalColdBooked = daily.reduce((s, d) => s + d.coldBooked, 0)
      const cpbc = totalBookedCalls > 0 ? totalSpend / totalBookedCalls : 0
      const tofToMof = totalLeads > 0
        ? (totalColdBooked / totalLeads) * 100
        : 0
      const totalQualified = daily.reduce((s, d) => s + d.qualified, 0)
      const mofToBof = totalColdBooked > 0
        ? (totalQualified / totalColdBooked) * 100
        : 0
      const avgDailyBookedCalls = daysWithSpend > 0 ? totalBookedCalls / daysWithSpend : 0

      setData({
        daily,
        kpis: { totalSpend, avgDailySpend, totalLeads, totalBookedCalls, cpl, cpbc, tofToMof, mofToBof, avgDailyBookedCalls },
      })
    } catch (err) {
      console.error('Dashboard data error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [rangeDays])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { data, loading, error, refetch: loadData }
}
