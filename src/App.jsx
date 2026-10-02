import { useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import TodoItem from './components/TodoItem'
import { FILTERS, NEXT_PRI, PRI } from './constants'

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'ซื้อของที่ตลาด', done: false, pri: 'med' },
    { id: 2, text: 'ส่งรายงานให้หัวหน้า', done: false, pri: 'high' },
    { id: 3, text: 'อ่านหนังสือ 30 นาที', done: true, pri: 'low' },
  ])
  const [text, setText] = useState('')
  const [pri, setPri] = useState('med')
  const [filter, setFilter] = useState('all')
  const nextId = useRef(4)

  const add = () => {
    const v = text.trim()
    if (!v) return
    setTodos((l) => [{ id: nextId.current++, text: v, done: false, pri }, ...l])
    setText('')
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

  const left = todos.filter((t) => !t.done).length
  const doneCount = todos.length - left
  const shown = todos.filter((t) => filter === 'all' || (filter === 'active' ? !t.done : t.done))

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-5">📝 รายการสิ่งที่ต้องทำ</h1>

      <div className="card p-3 mb-4">
        <div className="flex gap-2">
          <input
            className="inp flex-1 min-w-0 px-3 py-2.5"
            placeholder="เพิ่มงานใหม่..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <button
            onClick={add}
            className="flex items-center gap-1 px-4 rounded-xl text-white font-medium"
            style={{ background: 'var(--acc)' }}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">เพิ่ม</span>
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm">
          <span style={{ color: 'var(--mute)' }}>ความสำคัญ:</span>
          {Object.keys(PRI).map((k) => (
            <button
              key={k}
              onClick={() => setPri(k)}
              className={'px-3 py-1 rounded-full font-medium ' + k}
              style={{
                opacity: pri === k ? 1 : 0.4,
                outline: pri === k ? '2px solid currentColor' : 'none',
                outlineOffset: 1,
              }}
            >
              {PRI[k]}
            </button>
          ))}
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
          <TodoItem
            key={t.id}
            todo={t}
            onToggle={toggle}
            onDelete={remove}
            onSave={save}
            onCyclePriority={cyclePriority}
          />
        ))}
      </ul>
      {shown.length === 0 && (
        <div className="card text-center py-10" style={{ color: 'var(--mute)' }}>
          ไม่มีรายการ
        </div>
      )}

      <div className="flex items-center justify-between mt-4 text-sm" style={{ color: 'var(--mute)' }}>
        <span>เหลืออีก {left} งาน</span>
        <button
          onClick={clearDone}
          disabled={doneCount === 0}
          className="font-medium disabled:opacity-40"
          style={{ color: 'var(--acc)' }}
        >
          ล้างที่เสร็จแล้ว ({doneCount})
        </button>
      </div>
      <p className="text-center text-xs mt-6" style={{ color: 'var(--mute)' }}>
        ดับเบิลคลิกที่ข้อความเพื่อแก้ไข · กดป้ายความสำคัญเพื่อเปลี่ยน
      </p>
    </div>
  )
}
