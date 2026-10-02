import { useRef, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import TodoItem from './components/TodoItem'
import Stats from './components/Stats'
import { CATEGORIES, FILTERS, NEXT_PRI, PRI, dueStatus, offsetISO } from './constants'

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'ซื้อของที่ตลาด', done: false, pri: 'med', cat: 'shopping', due: offsetISO(0) },
    { id: 2, text: 'ส่งรายงานให้หัวหน้า', done: false, pri: 'high', cat: 'work', due: offsetISO(-1) },
    { id: 3, text: 'อ่านหนังสือ 30 นาที', done: true, pri: 'low', cat: 'personal', due: '' },
    { id: 4, text: 'นัดตรวจสุขภาพประจำปี', done: false, pri: 'med', cat: 'health', due: offsetISO(5) },
  ])
  const [text, setText] = useState('')
  const [pri, setPri] = useState('med')
  const [cat, setCat] = useState('personal')
  const [due, setDue] = useState('')
  const [filter, setFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [query, setQuery] = useState('')
  const nextId = useRef(5)

  const add = () => {
    const v = text.trim()
    if (!v) return
    setTodos((l) => [{ id: nextId.current++, text: v, done: false, pri, cat, due }, ...l])
    setText('')
    setDue('')
  }
  const toggle = (id) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const remove = (id) => {
    setTodos((l) => l.map((t) => (t.id === id ? { ...t, out: true } : t)))
    setTimeout(() => setTodos((l) => l.filter((t) => t.id !== id)), 250)
  }
  const save = (id, v) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, text: v } : t)))
  const cyclePriority = (id) =>
    setTodos((l) => l.map((t) => (t.id === id ? { ...t, pri: NEXT_PRI[t.pri] } : t)))
  const clearDone = () => setTodos((l) => l.filter((t) => !t.done))

  const total = todos.length
  const doneCount = todos.filter((t) => t.done).length
  const overdue = todos.filter((t) => dueStatus(t) === 'overdue').length
  const left = total - doneCount
  const q = query.trim().toLowerCase()

  const shown = todos.filter(
    (t) =>
      (filter === 'all' || (filter === 'active' ? !t.done : t.done)) &&
      (catFilter === 'all' || t.cat === catFilter) &&
      (!q || t.text.toLowerCase().includes(q))
  )

  const catItems = [
    ['all', 'ทั้งหมด', total],
    ...Object.entries(CATEGORIES).map(([k, c]) => [k, c.label, todos.filter((t) => t.cat === k).length]),
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-5">📝 รายการสิ่งที่ต้องทำ</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0 space-y-4">
          <nav className="card p-2 flex md:flex-col gap-1 overflow-x-auto">
            <div className="hidden md:block px-3 py-1 text-xs font-semibold" style={{ color: 'var(--mute)' }}>
              หมวดหมู่
            </div>
            {catItems.map(([k, label, n]) => (
              <button key={k} onClick={() => setCatFilter(k)} className={'cat-btn' + (catFilter === k ? ' on' : '')}>
                <span className="flex items-center gap-2">
                  {k !== 'all' && <span className="w-2 h-2 rounded-full" style={{ background: CATEGORIES[k].color }} />}
                  {label}
                </span>
                <span className="cat-count">{n}</span>
              </button>
            ))}
          </nav>
          <div className="hidden md:block">
            <Stats total={total} done={doneCount} active={left - overdue} overdue={overdue} />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mute)' }} />
            <input
              className="inp card w-full pl-9 pr-9 py-2.5"
              placeholder="ค้นหางาน..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="ล้างคำค้น" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--mute)' }}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="card p-3 mb-4">
            <div className="flex gap-2">
              <input
                className="inp flex-1 min-w-0 px-3 py-2.5"
                placeholder="เพิ่มงานใหม่..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && add()}
              />
              <button onClick={add} className="flex items-center gap-1 px-4 rounded-xl text-white font-medium" style={{ background: 'var(--acc)' }}>
                <Plus size={18} />
                <span className="hidden sm:inline">เพิ่ม</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
              <div className="flex items-center gap-2">
                {Object.keys(PRI).map((k) => (
                  <button
                    key={k}
                    onClick={() => setPri(k)}
                    className={'px-3 py-1 rounded-full font-medium ' + k}
                    style={{ opacity: pri === k ? 1 : 0.4, outline: pri === k ? '2px solid currentColor' : 'none', outlineOffset: 1 }}
                  >
                    {PRI[k]}
                  </button>
                ))}
              </div>
              <select className="inp px-2 py-1" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="หมวดหมู่">
                {Object.entries(CATEGORIES).map(([k, c]) => (
                  <option key={k} value={k} style={{ color: '#111' }}>{c.label}</option>
                ))}
              </select>
              <label className="flex items-center gap-2" style={{ color: 'var(--mute)' }}>
                กำหนดส่ง
                <input type="date" className="inp px-2 py-1" style={{ colorScheme: 'light dark' }} value={due} onChange={(e) => setDue(e.target.value)} />
              </label>
            </div>
          </div>

          <div className="flex gap-1 mb-4 overflow-x-auto">
            {FILTERS.map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} className={'tab whitespace-nowrap' + (filter === k ? ' on' : '')}>
                {label}
              </button>
            ))}
          </div>

          <ul>
            {shown.map((t) => (
              <TodoItem key={t.id} todo={t} onToggle={toggle} onDelete={remove} onSave={save} onCyclePriority={cyclePriority} />
            ))}
          </ul>
          {shown.length === 0 && (
            <div className="card text-center py-10" style={{ color: 'var(--mute)' }}>
              {q ? 'ไม่พบรายการที่ค้นหา' : 'ไม่มีรายการ'}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 text-sm" style={{ color: 'var(--mute)' }}>
            <span>เหลืออีก {left} งาน</span>
            <button onClick={clearDone} disabled={doneCount === 0} className="font-medium disabled:opacity-40" style={{ color: 'var(--acc)' }}>
              ล้างที่เสร็จแล้ว ({doneCount})
            </button>
          </div>

          <div className="md:hidden mt-6">
            <Stats total={total} done={doneCount} active={left - overdue} overdue={overdue} />
          </div>
          <p className="text-center text-xs mt-6" style={{ color: 'var(--mute)' }}>
            ดับเบิลคลิกที่ข้อความเพื่อแก้ไข · กดป้ายความสำคัญเพื่อเปลี่ยน
          </p>
        </main>
      </div>
    </div>
  )
}
