import { useEffect, useRef, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { PRI } from '../constants'

export default function TodoItem({ todo, onToggle, onDelete, onSave, onCyclePriority }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const save = () => {
    const v = value.trim()
    if (v) onSave(todo.id, v)
    else setValue(todo.text)
    setEditing(false)
  }

  return (
    <li className={'row card flex items-center gap-3 px-3 py-3 mb-2' + (todo.out ? ' out' : '')}>
      <button
        onClick={() => onToggle(todo.id)}
        aria-label="เสร็จแล้ว"
        className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-white"
        style={{
          border: '2px solid ' + (todo.done ? 'var(--acc)' : 'var(--line)'),
          background: todo.done ? 'var(--acc)' : 'transparent',
        }}
      >
        {todo.done && <Check size={14} strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            className="inp w-full px-2 py-1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') {
                setValue(todo.text)
                setEditing(false)
              }
            }}
          />
        ) : (
          <span
            onDoubleClick={() => {
              setValue(todo.text)
              setEditing(true)
            }}
            title="ดับเบิลคลิกเพื่อแก้ไข"
            className="block break-words cursor-text select-none"
            style={{
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? 'var(--mute)' : 'var(--fg)',
            }}
          >
            {todo.text}
          </span>
        )}
      </div>

      <button
        onClick={() => onCyclePriority(todo.id)}
        title="เปลี่ยนความสำคัญ"
        className={'shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ' + todo.pri}
      >
        {PRI[todo.pri]}
      </button>

      <button
        onClick={() => onDelete(todo.id)}
        aria-label="ลบ"
        className="shrink-0 p-1.5 rounded-lg hover:text-red-500"
        style={{ color: 'var(--mute)' }}
      >
        <Trash2 size={18} />
      </button>
    </li>
  )
}
