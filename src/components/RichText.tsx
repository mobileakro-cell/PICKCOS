'use client'

import { useRef, useEffect } from 'react'

// 가벼운 리치 텍스트 에디터 — 볼드·글자크기·정렬. 글자수 제한 없음. HTML 문자열로 저장.
// (운영자 작성 콘텐츠라 HTML 신뢰 가능. 공개 페이지는 dangerouslySetInnerHTML로 렌더)
export default function RichText({
  value, onChange, placeholder, minHeight = 140,
}: { value: string; onChange: (html: string) => void; placeholder?: string; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  // 외부 값 반영 — 포커스 중이 아닐 때만 (커서 튐 방지)
  useEffect(() => {
    const el = ref.current
    if (el && document.activeElement !== el && el.innerHTML !== (value || '')) {
      el.innerHTML = value || ''
    }
  }, [value])

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus()
    document.execCommand(cmd, false, arg)
    if (ref.current) onChange(ref.current.innerHTML)
  }

  const Btn = ({ cmd, arg, children, title }: { cmd: string; arg?: string; children: React.ReactNode; title: string }) => (
    <button
      type="button" title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => exec(cmd, arg)}
      className="rounded px-2 py-1 text-gray-700 hover:bg-gray-200"
    >{children}</button>
  )

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-gray-50 px-2 py-1.5">
        <Btn cmd="bold" title="굵게"><span className="font-bold">B</span></Btn>
        <select
          title="글자 크기"
          defaultValue=""
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => { exec('fontSize', e.target.value); e.currentTarget.selectedIndex = 0 }}
          className="rounded border px-1 py-1 text-xs text-gray-700"
        >
          <option value="" disabled>글자크기</option>
          <option value="2">작게</option>
          <option value="4">보통</option>
          <option value="5">크게</option>
          <option value="6">아주 크게</option>
        </select>
        <span className="mx-1 text-gray-300">|</span>
        <Btn cmd="justifyLeft" title="왼쪽 정렬">⬅</Btn>
        <Btn cmd="justifyCenter" title="가운데 정렬">↔</Btn>
        <Btn cmd="justifyRight" title="오른쪽 정렬">➡</Btn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML || '')}
        data-ph={placeholder || ''}
        style={{ minHeight }}
        className="prose-sm max-w-none px-3 py-2 text-sm leading-relaxed focus:outline-none empty:before:text-gray-400 empty:before:content-[attr(data-ph)]"
      />
    </div>
  )
}
