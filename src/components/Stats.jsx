const R = 36
const C = 2 * Math.PI * R

export default function Stats({ total, done, active, overdue }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  const segs = [
    { label: 'เสร็จแล้ว', n: done, color: '#10b981' },
    { label: 'ยังไม่เสร็จ', n: active, color: '#6366f1' },
    { label: 'เลยกำหนด', n: overdue, color: '#ef4444' },
  ]
  let offset = 0

  return (
    <div className="card p-4">
      <h2 className="text-sm font-semibold mb-3">สถิติ</h2>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: 88, height: 88 }}>
          <svg viewBox="0 0 100 100" width="88" height="88" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r={R} fill="none" stroke="var(--line)" strokeWidth="14" />
            {total > 0 &&
              segs.map((s) => {
                const len = (s.n / total) * C
                const el = (
                  <circle
                    key={s.label}
                    cx="50" cy="50" r={R} fill="none"
                    stroke={s.color} strokeWidth="14"
                    strokeDasharray={`${len} ${C - len}`}
                    strokeDashoffset={-offset}
                  />
                )
                offset += len
                return el
              })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">{pct}%</div>
        </div>
        <div className="flex-1 text-sm space-y-1">
          <div className="flex justify-between">
            <span style={{ color: 'var(--mute)' }}>ทั้งหมด</span>
            <span className="font-semibold">{total}</span>
          </div>
          {segs.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
              <span>{s.n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
