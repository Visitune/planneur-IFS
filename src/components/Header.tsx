'use client';

export default function Header() {
  return (
    <header className="w-full border-b" style={{ borderColor: 'var(--accent-soft)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#b6452c" />
          <path d="M12 20l5 5 11-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--ink)' }}>Audit Planner Ecocert</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Génération de plans d&apos;audit IFS/BRC v2.0</p>
        </div>
      </div>
    </header>
  );
}
