export function Badge({ variant, children }: { variant: 'success' | 'warn' | 'info' | 'orange'; children: React.ReactNode }) {
  const styles = {
    success: 'bg-[#eaf3de] text-[#27500a]',
    warn: 'bg-[#faeeda] text-[#633806]',
    info: 'bg-[#e6f1fb] text-[#0c447c]',
    orange: 'bg-[rgba(249,115,22,0.1)] text-[#f97316]',
  }
  const dotColors = { success: '#3b6d11', warn: '#ba7517', info: '#185fa5', orange: '#f97316' }
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${styles[variant]}`}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: dotColors[variant] }} />
      {children}
    </span>
  )
}

export function Avatar({ initials, size = 'sm', style }: { initials: string; size?: 'sm' | 'lg'; style?: React.CSSProperties }) {
  const base = 'rounded-full flex items-center justify-center font-bold shrink-0 font-[Syne]'
  if (size === 'lg') return <div className={`${base} w-10 h-10 text-sm bg-[#f97316] text-white`} style={style}>{initials}</div>
  return <div className={`${base} w-8 h-8 text-[11px] bg-[rgba(249,115,22,0.15)] text-[#f97316]`} style={style}>{initials}</div>
}

export function SectionHead({ title, action, actionLabel }: { title: string; action?: () => void; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-[#111827]">
        <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block" />
        {title}
      </div>
      {action && (
        <button onClick={action} className="text-[12px] text-[#6B7280] hover:text-[#111827] flex items-center gap-1 border-none bg-transparent cursor-pointer">
          {actionLabel} <i className="ti ti-arrow-right text-xs" />
        </button>
      )}
    </div>
  )
}

export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#E5E7EB] rounded-xl p-4 ${className}`}>
      {children}
    </div>
  )
}