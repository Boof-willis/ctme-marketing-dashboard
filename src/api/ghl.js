import { format, eachDayOfInterval, parseISO } from 'date-fns'

const API_KEY = import.meta.env.VITE_GHL_API_KEY
const LOCATION_ID = import.meta.env.VITE_GHL_LOCATION_ID
const BASE_URL = import.meta.env.DEV
  ? '/api/ghl'
  : 'https://services.leadconnectorhq.com'

const PIPELINE_ID = '3aFFl64cmFYhhlAemlry'
const COLD_BOOKED = '9e4f376b-928d-458c-9bd4-4cfbc827033c'
const WARM_BOOKED = '826a34f7-9c57-4daf-9836-604155218220'
const NEW_LEAD = '452b9691-14cd-41e0-9511-6c577e022a1d'
const CALL_COMPLETED_QUALIFIED = '8ba098f5-22ce-43f4-a5ff-f413bda1b790'

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
}

export async function fetchPipelineData(startDate, endDate) {
  const opportunities = []
  let hasMore = true
  let startAfterId = ''

  while (hasMore) {
    const params = new URLSearchParams({
      location_id: LOCATION_ID,
      pipeline_id: PIPELINE_ID,
      limit: '100',
    })
    if (startAfterId) params.set('startAfterId', startAfterId)

    const res = await fetch(`${BASE_URL}/opportunities/search?${params}`, { headers })
    if (!res.ok) throw new Error(`GHL Opportunities API error: ${res.status}`)
    const data = await res.json()
    const batch = data.opportunities || []

    opportunities.push(...batch)

    if (batch.length < 100) {
      hasMore = false
    } else {
      startAfterId = batch[batch.length - 1].id
    }
  }

  const booked = opportunities.filter((o) => {
    const stageId = o.pipelineStageId
    const source = o.source || ''
    if (stageId === WARM_BOOKED || stageId === NEW_LEAD) return false
    if (stageId === COLD_BOOKED) return true
    return source === 'Booking App'
  })

  const coldBooked = opportunities.filter((o) => o.pipelineStageId === COLD_BOOKED)

  const qualified = opportunities.filter((o) =>
    o.pipelineStageId === CALL_COMPLETED_QUALIFIED && o.source === 'Booking App'
  )

  return {
    bookedCalls: normalizeByDate(booked, startDate, endDate, 'bookedCalls'),
    coldBooked: normalizeByDate(coldBooked, startDate, endDate, 'coldBooked'),
    qualified: normalizeByDate(qualified, startDate, endDate, 'qualified'),
  }
}

function normalizeByDate(opportunities, startDate, endDate, field) {
  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const byDate = {}
  for (const day of days) {
    byDate[format(day, 'yyyy-MM-dd')] = 0
  }

  for (const opp of opportunities) {
    const raw = opp.createdAt || opp.dateAdded
    if (!raw) continue
    const date = format(parseISO(raw), 'yyyy-MM-dd')
    if (byDate[date] !== undefined) {
      byDate[date]++
    }
  }

  return Object.entries(byDate)
    .map(([date, count]) => ({ date, [field]: count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
