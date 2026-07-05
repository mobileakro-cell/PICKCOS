// 운영자 알림 메일. 매칭·문의·회원가입 접수 시 운영자에게 내용을 보낸다.
// Resend(https://resend.com) 사용. RESEND_API_KEY가 없으면 조용히 건너뛴다(제출 자체는 정상 동작).
const RESEND_API_KEY = process.env.RESEND_API_KEY
const NOTIFY_TO = process.env.NOTIFY_EMAIL || 'pickco@kakao.com'
const NOTIFY_FROM = process.env.RESEND_FROM || 'PICKCOS <onboarding@resend.dev>'

export async function sendOperatorNotification(subject: string, lines: string[]): Promise<void> {
  if (!RESEND_API_KEY) return
  try {
    const text = lines.filter((l) => l !== undefined && l !== null).join('\n')
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: NOTIFY_FROM, to: NOTIFY_TO, subject: `[PICKCOS] ${subject}`, text }),
    })
    if (!res.ok) console.error('Operator notification non-OK:', res.status, await res.text().catch(() => ''))
  } catch (e) {
    console.error('Operator notification failed:', e)
  }
}
