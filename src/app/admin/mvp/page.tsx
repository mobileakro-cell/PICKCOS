'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MVP_VERSION, MVP_ACTORS, MVP_ITEMS, MVP_DEFAULT_STATUS, type MvpState, type MvpStatus } from '@/lib/mvp'

export default function AdminMvpPage() {
  const [states, setStates] = useState<Record<string, MvpState>>({})
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(true)
  const [draft, setDraft] = useState<Record<string, string>>({})    // 수정필요 세부내용 입력 중
  const [openHistory, setOpenHistory] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch('/api/mvp')
    if (res.status === 401) { setAuthed(false); setLoading(false); return }
    const data = await res.json().catch(() => ({ states: {} }))
    setStates(data.states || {})
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const statusOf = (id: string): MvpStatus => states[id]?.status ?? MVP_DEFAULT_STATUS

  const save = async (id: string, status: MvpStatus, detail?: string) => {
    setSaving(id)
    const res = await fetch('/api/mvp', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status, detail }),
    }).catch(() => null)
    if (res && res.ok) {
      const d = await res.json()
      setStates((s) => ({ ...s, [id]: d.state }))
      setDraft((s) => { const n = { ...s }; delete n[id]; return n })
    } else {
      alert('저장에 실패했습니다. 다시 로그인 후 시도해 주세요.')
    }
    setSaving(null)
  }

  const total = MVP_ITEMS.length
  const needFix = MVP_ITEMS.filter((it) => statusOf(it.id) === '수정필요').length

  if (!authed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-gray-600 mb-4">관리자 로그인이 필요합니다.</p>
          <Link href="/admin" className="rounded-lg bg-[var(--color-theme-500)] px-5 py-2.5 text-sm font-semibold text-white">관리자로 이동</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      <div className="no-print sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900">← 관리자로 돌아가기</Link>
          <button onClick={() => window.print()} className="rounded-lg bg-[var(--color-theme-500)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-theme-600)]">PDF 다운로드</button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8 border-b pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-theme-600)] px-3 py-1 text-xs font-bold text-white">MVP · {MVP_VERSION} 버전</div>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">MVP 기능 점검</h1>
          <p className="mt-2 text-gray-500">각 항목을 검토해 <b>완료</b> 또는 <b>수정필요</b>를 선택하세요. 수정필요 시 세부내용을 적고, 수정이 끝나면 다시 완료로 바꿉니다. 변경은 이력에 남습니다.</p>
          {!loading && (
            <div className="mt-4 flex gap-4 text-sm">
              <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">완료 {total - needFix}</span>
              <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700">수정필요 {needFix}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-600">전체 {total}</span>
            </div>
          )}
        </header>

        {loading ? (
          <p className="py-10 text-center text-gray-400">불러오는 중…</p>
        ) : (
          <div className="space-y-10">
            {MVP_ACTORS.map((actor) => (
              <section key={actor.key}>
                <h2 className="mb-4 text-lg font-bold text-gray-900">{actor.label}</h2>
                <div className="space-y-3">
                  {MVP_ITEMS.filter((it) => it.actor === actor.key).map((it) => {
                    const st = states[it.id]
                    const status = statusOf(it.id)
                    const isFix = status === '수정필요'
                    const editing = it.id in draft
                    return (
                      <div key={it.id} className={`rounded-xl border p-4 ${isFix ? 'border-red-200 bg-red-50/50' : 'bg-white'}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{it.title}</h3>
                            <p className="mt-0.5 text-sm text-gray-500">{it.desc}</p>
                          </div>
                          <div className="flex flex-shrink-0 gap-1.5">
                            <button
                              onClick={() => save(it.id, '완료')}
                              disabled={saving === it.id}
                              className={`rounded-md px-3 py-1.5 text-sm font-semibold disabled:opacity-50 ${status === '완료' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            >완료</button>
                            <button
                              onClick={() => setDraft((s) => ({ ...s, [it.id]: st?.detail || '' }))}
                              disabled={saving === it.id}
                              className={`rounded-md px-3 py-1.5 text-sm font-semibold disabled:opacity-50 ${status === '수정필요' ? 'bg-red-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            >수정필요</button>
                          </div>
                        </div>

                        {/* 수정필요 세부내용 (편집 중이거나 이미 수정필요 상태면 표시) */}
                        {editing ? (
                          <div className="mt-3">
                            <label className="mb-1 block text-xs font-medium text-gray-600">무엇을 수정해야 하나요?</label>
                            <textarea
                              rows={2} value={draft[it.id]}
                              onChange={(e) => setDraft((s) => ({ ...s, [it.id]: e.target.value }))}
                              placeholder="예: 매칭 폼 제출 후 안내 문구 보강 필요"
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            />
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => save(it.id, '수정필요', draft[it.id])} disabled={saving === it.id || !draft[it.id].trim()} className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50">수정필요로 저장</button>
                              <button onClick={() => setDraft((s) => { const n = { ...s }; delete n[it.id]; return n })} className="rounded-md border px-3 py-1.5 text-sm">취소</button>
                            </div>
                          </div>
                        ) : isFix && st?.detail ? (
                          <div className="mt-3 rounded-md border border-red-200 bg-white p-3">
                            <p className="text-xs font-semibold text-red-600">수정 필요 내용</p>
                            <p className="mt-1 text-sm text-gray-700">{st.detail}</p>
                          </div>
                        ) : null}

                        {/* 이력 */}
                        {st?.history && st.history.length > 0 && (
                          <div className="mt-3">
                            <button onClick={() => setOpenHistory((s) => ({ ...s, [it.id]: !s[it.id] }))} className="text-xs text-gray-400 hover:text-gray-600">
                              🕘 변경 이력 {st.history.length}건 {openHistory[it.id] ? '▲' : '▼'}
                            </button>
                            {openHistory[it.id] && (
                              <ol className="mt-2 space-y-1.5 border-l-2 border-gray-200 pl-3">
                                {[...st.history].reverse().map((h, i) => (
                                  <li key={i} className="text-xs text-gray-500">
                                    <span className="font-mono">{h.at.slice(0, 16).replace('T', ' ')}</span>
                                    {' · '}<span className={h.status === '수정필요' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>{h.status}</span>
                                    {h.detail ? ` — ${h.detail}` : ''}
                                  </li>
                                ))}
                              </ol>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
        <footer className="mt-12 border-t pt-6 text-center text-xs text-gray-400">MVP {MVP_VERSION} · 변경은 자동 저장·이력 기록됩니다.</footer>
      </div>
    </div>
  )
}
