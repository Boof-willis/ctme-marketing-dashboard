import { differenceInDays } from 'date-fns'

const API_KEY = import.meta.env.VITE_WINDSOR_API_KEY
const BASE_URL = import.meta.env.DEV
  ? '/api/windsor/all'
  : 'https://connectors.windsor.ai/all'

export async function fetchWindsorData(startDate, endDate) {
  const days = differenceInDays(endDate, startDate) + 1
  const params = new URLSearchParams({
    api_key: API_KEY,
    date_preset: `last_${days}dT`,
    fields: 'source,campaign,date,spend,impressions,link_clicks',
    _renderer: 'json',
  })

  const res = await fetch(`${BASE_URL}?${params}`)
  if (!res.ok) throw new Error(`Windsor API error: ${res.status}`)
  const json = await res.json()

  // Windsor returns either a flat array or { data: [...] }
  const rows = Array.isArray(json) ? json : (json.data || [])
  return normalizeWindsorData(rows)
}

function normalizeWindsorData(rows) {
  const byDate = {}

  for (const row of rows) {
    const date = row.date
    if (!date) continue
    if (!byDate[date]) {
      byDate[date] = { date, spend: 0, impressions: 0, linkClicks: 0 }
    }
    byDate[date].spend += Number(row.spend) || 0
    byDate[date].impressions += Number(row.impressions) || 0
    byDate[date].linkClicks += Number(row.link_clicks) || 0
  }

  return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date))
}
