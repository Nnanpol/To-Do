export const PRI = { low: 'ต่ำ', med: 'กลาง', high: 'สูง' }
export const NEXT_PRI = { low: 'med', med: 'high', high: 'low' }
export const FILTERS = [
  ['all', 'ทั้งหมด'],
  ['active', 'ยังไม่เสร็จ'],
  ['done', 'เสร็จแล้ว'],
]
export const CATEGORIES = {
  work: { label: 'งาน', color: '#6366f1' },
  personal: { label: 'ส่วนตัว', color: '#ec4899' },
  shopping: { label: 'ช้อปปิ้ง', color: '#f59e0b' },
  health: { label: 'สุขภาพ', color: '#10b981' },
}

const pad = (n) => String(n).padStart(2, '0')
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayISO = () => toISO(new Date())
export const offsetISO = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return toISO(d)
}
export const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })

// 'overdue' | 'today' | 'upcoming' | null
export const dueStatus = (todo) => {
  if (!todo.due || todo.done) return null
  const t = todayISO()
  return todo.due < t ? 'overdue' : todo.due === t ? 'today' : 'upcoming'
}
