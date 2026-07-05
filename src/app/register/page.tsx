'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function RegisterPage() {
  const { t, lang } = useLanguage()
  const [form, setForm] = useState({ company: '', name: '', email: '', role: '', country: '', interest: '' })
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company || !form.name || !form.email || !consent) {
      setError(t('register.required'))
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setDone(true)
      else setError(t('register.required'))
    } catch {
      setError(t('register.required'))
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-[560px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-theme-50)]">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="var(--color-theme-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mb-3 text-[28px] font-semibold text-[var(--foreground)]">{t('register.success_title')}</h1>
        <p className="mb-8 text-[15px] leading-relaxed text-[var(--color-sub-text)]">{t('register.success_desc')}</p>
        <Link href="/" className="btn-primary">{t('register.success_back')}</Link>
      </div>
    )
  }

  const benefits: [string, string][] = [
    ['register.benefit_1_title', 'register.benefit_1_desc'],
    ['register.benefit_2_title', 'register.benefit_2_desc'],
    ['register.benefit_3_title', 'register.benefit_3_desc'],
  ]

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-16 md:px-10 md:py-24">
      <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
        {/* Pitch */}
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-theme-600)]">{t('register.eyebrow')}</p>
          <h1 className="mb-5 whitespace-pre-line text-[34px] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--foreground)] md:text-[40px]">{t('register.title')}</h1>
          <p className="mb-10 max-w-[440px] text-[16px] leading-[1.7] text-[var(--color-sub-text)]">{t('register.subtitle')}</p>

          <ul className="space-y-6">
            {benefits.map(([title, desc]) => (
              <li key={title} className="flex gap-4">
                <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-[var(--color-theme-50)]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="var(--color-theme-600)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-[var(--foreground)]">{t(title)}</p>
                  <p className="mt-1 text-[14px] leading-[1.6] text-[var(--color-sub-text)]">{t(desc)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Form card */}
        <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
          <h2 className="text-[18px] font-semibold text-[var(--foreground)]">{t('register.form_title')}</h2>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">{t('register.company')} *</label>
              <input value={form.company} onChange={update('company')} className="w-full" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">{t('register.name')} *</label>
                <input value={form.name} onChange={update('name')} className="w-full" />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">{t('register.role')}</label>
                <input value={form.role} onChange={update('role')} className="w-full" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">{t('register.email')} *</label>
              <input type="email" value={form.email} onChange={update('email')} className="w-full" />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">{t('register.country')}</label>
              <input value={form.country} onChange={update('country')} className="w-full" />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">{t('register.interest')}</label>
              <input value={form.interest} onChange={update('interest')} placeholder={t('register.interest_placeholder')} className="w-full" />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 pt-1">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[var(--color-theme-500)]" style={{ padding: 0 }} />
              <span className="text-[13px] leading-[1.5] text-[var(--color-sub-text)]">
                {t('register.consent')}{' '}
                <Link href="/privacy" className="underline hover:text-[var(--foreground)]" onClick={(e) => e.stopPropagation()}>
                  {lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
                </Link>
              </span>
            </label>

            {error && <p className="text-[13px] text-red-600">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full disabled:opacity-60">
              {t('register.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
