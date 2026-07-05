'use client'

import Link from 'next/link'

const steps = [
  {
    n: '01',
    title: '로그인하기',
    body: [
      '주소창에 /admin 을 입력해 관리자 페이지로 들어갑니다.',
      '아이디와 비밀번호를 입력하고 초록색 [로그인] 버튼을 누릅니다.',
      '로그인 정보는 담당자에게 문의하세요. (분실 시 재설정 가능)',
    ],
  },
  {
    n: '02',
    title: '대시보드 한눈에 보기',
    body: [
      '상단 카드에서 총 문의·매칭 요청·공급사 수·발행 기사 수를 바로 확인합니다.',
      '그 아래 탭(문의 / 매칭 / 공급사 / 기사 / 전시 / 설정)으로 항목을 이동합니다.',
      '오른쪽 위 [로그아웃]으로 나가고, [사이트로 돌아가기]로 실제 사이트를 봅니다.',
    ],
  },
  {
    n: '03',
    title: '공급사 등록·수정·삭제',
    body: [
      '[공급사] 탭 → 오른쪽 [+ 공급사 추가] 버튼을 누릅니다.',
      '업체명을 적고, 공급자 유형(패키징/원료/부자재)과 제품군(복수 선택)을 고릅니다.',
      'MOQ·리드타임·범위·국가는 드롭다운에서 값을 선택합니다. (직접 입력 아님)',
      '인증·수출 시장은 원하는 항목의 칩을 눌러 여러 개 선택합니다.',
      '설명은 EN(영문)·KO(국문) 두 칸에 나눠 적습니다.',
      '맨 아래 [등록](신규) 또는 [저장](수정)을 누르면 저장됩니다.',
      '수정은 목록의 [수정], 삭제는 [삭제] 버튼(삭제 시 확인창이 뜹니다).',
    ],
  },
  {
    n: '04',
    title: '이미지 넣기',
    body: [
      '이미지는 필수가 아닙니다. 없으면 비워도 저장됩니다.',
      '이미 웹에 있는 이미지면 [이미지 URL] 칸에 주소(https://...)를 붙여넣습니다.',
      '붙여넣으면 아래에 미리보기가 바로 나타납니다.',
      '(예정) 파일을 직접 여러 장 올리는 일괄 업로드 기능이 추가됩니다.',
    ],
  },
  {
    n: '05',
    title: '기사(뉴스) 등록',
    body: [
      '[기사] 탭 → [+ 기사 추가].',
      '제목(EN/KO), 카테고리, 지역, 발행일, 요약, 본문을 입력합니다.',
      '슬러그(주소)는 비워두면 제목으로 자동 생성됩니다.',
      '[헤드라인으로 설정]을 켜면 홈 상단 대표 기사로 노출됩니다.',
    ],
  },
  {
    n: '06',
    title: '전시 등록',
    body: [
      '[전시] 탭 → [+ 전시 추가].',
      '전시명·기간·장소·지역·상태(예정/종료/준비중)를 입력합니다.',
      '참가 공급사 번호, 관련 기사 번호를 세로줄(|)로 구분해 연결할 수 있습니다.',
      '여러 전시는 [전시] 탭의 CSV 일괄 도구로 한 번에 올릴 수 있습니다. (아래 09번 참고)',
    ],
  },
  {
    n: '07',
    title: '샘플(데모) 데이터 정리',
    body: [
      '처음 들어있는 데이터는 옆에 회색 [샘플] 배지가 붙어 있습니다.',
      '실제 데이터를 입력하기 시작할 때, 오른쪽 위 빨간 [샘플 데이터 삭제]로 한 번에 정리합니다.',
      '삭제 전에 확인창이 뜨니 안심하고 사용하세요. (실제 입력분은 지워지지 않음)',
    ],
  },
  {
    n: '08',
    title: '영문(EN) 자동 번역 — CSV로 한 번에',
    body: [
      '엑셀(CSV)에 한글(KO) 열만 채우고, 영문(EN) 열은 비워 둡니다. (번호·업체명 등 공통값은 그대로)',
      '관리자 상단 [🌐 EN 번역 프롬프트] 버튼을 누르고, [프롬프트 복사]를 누릅니다.',
      'Claude 채팅창에 그 프롬프트를 붙여넣고, 바로 아래에 KO를 채운 CSV를 붙여넣습니다.',
      'Claude가 영문(EN) 열이 채워진 CSV를 돌려줍니다. 그대로 복사해 둡니다.',
      '행이 아주 많으면(수백~수천) 200~500행씩 나눠서 여러 번 요청하면 됩니다.',
      '브랜드명·인증명(ISO 22716 등)·번호는 번역되지 않고 원문이 유지됩니다.',
      '그 완성된 CSV를 [CSV 업로드]로 한 번에 등록합니다. (아래 09번 참고)',
    ],
  },
  {
    n: '09',
    title: '엑셀(.xlsx) 일괄 등록 — 공급사·전시',
    body: [
      '[공급사] 또는 [전시] 탭 상단의 "엑셀 일괄" 상자를 사용합니다.',
      '① [⬇ 엑셀 양식 다운로드] — 드롭다운이 들어간 .xlsx 양식을 받습니다. (상단 [📋 양식 모음]에서도 받을 수 있음)',
      '② 엑셀에서 채웁니다. 유형·MOQ·리드타임·국가·상태 같은 칸은 셀을 누르면 드롭다운이 떠서 목록에서 고릅니다. (직접 타이핑 아님)',
      '제품군은 여러 개일 수 있어 제품군1·2·3 칸으로 나눠 각각 드롭다운에서 고릅니다. (한 개만 있으면 제품군1만 채움)',
      'MOQ·리드타임은 숫자 구간만 고릅니다. 단위(개·일)는 사이트 화면에 자동으로 붙으니 엑셀에는 쓰지 않습니다.',
      '맨 앞 [번호]가 각 항목의 고유 열쇠입니다. 비워두면 신규로 추가됩니다.',
      '③ [⬆ 파일 업로드] — 파일을 고르면 "신규 / 수정 / 오류" 건수를 미리 보여줍니다.',
      '④ 내용을 확인하고 [○건 반영]을 눌러야 실제로 저장됩니다. (누르기 전엔 반영 안 됨)',
      '같은 [번호]로 다시 올리면 새로 생기지 않고 그 항목이 수정됩니다. (중복 걱정 없음)',
      '파일에 없는 기존 항목은 삭제되지 않습니다. 일부만 골라 올려도 안전합니다.',
      '인증·수출시장·참가 공급사처럼 목록에 없는 여러 값은 세로줄(|)로 구분해 적습니다. 예: ISO 22716|CGMP',
      '[↧ 현재 데이터 내보내기]로 지금 등록된 전체를 CSV로 받아, 수정 후 다시 올릴 수 있습니다. (.csv·.xlsx 모두 업로드 가능)',
    ],
  },
  {
    n: '10',
    title: '공급사 평가지표(추천 점수) 매기기',
    body: [
      '왜 하나요? — 업체를 "왜 추천하는지" 근거를 점수와 이유로 보여주기 위해서입니다. (리뷰 대신 신뢰를 만드는 방법)',
      '[공급사] 탭 → 업체 [수정] → 아래로 내리면 "추천·큐레이션 평가지표" 칸이 있습니다.',
      '7개 항목(검증·신뢰 / 품질·규제 / 생산 역량 / 실적 / 대응 / 유연성 / 지속가능)에 각각 0~5점을 넣습니다.',
      '점수를 넣으면 오른쪽 아래에 종합 점수(100점 만점)가 자동으로 계산됩니다. (가중치 자동 반영)',
      '70점 이상이면 "검증", 85점 이상이면 "앰배서더 픽"이 제안됩니다. (배지 최종 확정은 위 체크박스로)',
      '[큐레이터 추천 사유]에 왜 추천하는지 한두 줄 적고, [큐레이터]에 추천한 사람 이름을 적습니다.',
      '유료로 노출하는 업체면 [유료 노출(Sponsored)]에 체크합니다. (공정성 표시)',
      '[저장]을 누르면 그 업체 소개 페이지에 점수·항목별 막대·추천 사유가 바로 나타납니다.',
      '점수·이유는 언제든 다시 수정해 저장하면 사이트에 즉시 반영됩니다.',
    ],
  },
]

const upcoming = [
  '이미지 일괄 업로드 — 파일 여러 장을 한 번에 (번호로 자동 매칭)',
  '자동 백업 & 복원 — 잘못 올려도 이전 버전으로 되돌리기 (경고창 포함)',
]

// 현재는 CBT(비공개 테스트) 단계입니다. 정식(양산) 런칭 전에 아래를 점검하세요.
// [운영자] = 관리자 화면/계정에서 직접 / [개발자] = 코드·인프라 작업 필요
const launch = [
  {
    cat: '1. 인프라 · 요금제 점검',
    who: '개발자 · 운영자',
    items: [
      'Supabase(데이터베이스): 무료 플랜은 7일간 접속이 없으면 DB가 자동 정지되어, 그동안 회원가입·문의 저장이 실패합니다. 상시 운영하려면 유료(Pro, 약 $25/월) 업그레이드를 검토하세요. (자동 백업·동시접속 한도도 함께 늘어남)',
      'Vercel(호스팅): 현재 Hobby(개인·비상업용) 플랜입니다. 실제 상업 서비스로 운영하려면 Pro 플랜이 필요할 수 있습니다. (함수 실행시간 10초·월 대역폭 100GB 제한도 완화됨)',
      '대용량 엑셀 일괄 등록이 잦다면, Hobby의 10초 함수 제한에 걸리지 않는지 확인하세요.',
    ],
  },
  {
    cat: '2. 도메인 · 브랜딩',
    who: '개발자',
    items: [
      '지금은 임시 주소(pickcos-mynewsite.vercel.app)입니다. 자체 도메인(예: pickcos.com)을 구입해 Vercel에 연결하세요. (Vercel → Settings → Domains, DNS 설정)',
      '연결 후 도메인이 대표 주소가 되도록 지정하고, https(보안 자물쇠)가 자동 적용됐는지 확인합니다.',
    ],
  },
  {
    cat: '3. 보안',
    who: '개발자 · 운영자',
    items: [
      '관리자 비밀번호(ADMIN_PW)를 추측하기 어려운 강력한 값으로 변경하세요. /admin 주소는 공개되어 있어 비밀번호만이 방어선입니다.',
      '세션 서명키(SESSION_SECRET)가 길고 무작위한 값인지 확인합니다. (기본값·짧은 값이면 교체)',
      'Supabase 서비스 키(SERVICE_ROLE_KEY)는 절대 외부에 노출하지 마세요. 채팅·화면공유·공개 저장소 금지.',
      '환경변수는 서버에만 저장되어야 합니다. .env 파일을 Git에 올리지 않았는지 확인하세요.',
    ],
  },
  {
    cat: '4. 실데이터 준비',
    who: '운영자',
    items: [
      '관리자 오른쪽 위 [샘플 데이터 삭제]로 데모 데이터를 정리합니다. (실제 입력분은 지워지지 않음)',
      '실제 공급사·기사·전시 데이터를 입력합니다. (엑셀 일괄 등록 활용 — 09번 참고)',
      '한글(KO)·영문(EN) 콘텐츠가 모두 채워졌는지 확인합니다. (EN 자동번역 — 08번 참고)',
      '회원·문의 데이터의 정기 백업 방법을 정해 둡니다. (유료 플랜은 자동 백업 지원)',
    ],
  },
  {
    cat: '5. 기능 · 정책 최종 점검',
    who: '개발자 · 운영자',
    items: [
      '문의·매칭 신청 폼: 현재 "마감" 상태입니다. 정식 오픈 시 다시 받으려면 개발자가 코드에서 마감 해제 후 재배포해야 합니다.',
      '실제 회원가입·문의·관리자 등록/수정/삭제를 한 번씩 테스트해 저장이 되는지 확인합니다.',
      '개인정보처리방침·이용약관 페이지가 필요합니다. 회원가입·문의로 개인정보(이름·이메일 등)를 수집하므로 상용 서비스는 법적으로 필수입니다.',
      '회원가입/문의 폼에 개인정보 수집·이용 동의 체크를 넣습니다. (필요 시 개발자 작업)',
      '사업자 정보·연락처 표기(전자상거래 관련) 필요 여부를 확인합니다.',
    ],
  },
  {
    cat: '6. 배포 · 운영 체계',
    who: '개발자',
    items: [
      'Git 자동 배포 연결을 확인합니다. (코드 수정 후 push하면 자동 반영되도록 — Vercel → Settings → Git)',
      '미리보기(Preview) 환경도 쓸 경우, 환경변수를 Preview에도 추가합니다. (현재는 Production에만 등록됨)',
      '접속 통계·오류 모니터링 도입을 검토합니다. (예: Vercel Analytics, 오류 추적 도구)',
      'SEO 기본 세팅을 점검합니다. (검색엔진 노출용 메타태그·OG 이미지·sitemap 등)',
    ],
  },
]

const faq = [
  ['이미지는 꼭 넣어야 하나요?', '아니요. 비워도 저장됩니다. 있으면 URL을 붙여넣으세요.'],
  ['잘못 저장했어요.', '목록에서 [수정]으로 고치거나 [삭제]로 지우면 됩니다. (곧 백업/복원 기능도 추가됩니다)'],
  ['입력한 게 진짜 저장되나요?', '네. 저장하면 데이터베이스(Supabase)에 바로 반영되어 사이트에 나타납니다.'],
  ['한글/영문 둘 다 꼭 써야 하나요?', '가능하면 둘 다 권장하지만, 한쪽만 있어도 저장됩니다.'],
]

export default function AdminManualPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <style>{`@media print { .no-print { display: none !important; } body { background: #fff; } .manual-page { padding: 0 !important; } }`}</style>

      {/* Toolbar (hidden when printing) */}
      <div className="no-print sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900">← 관리자로 돌아가기</Link>
          <button onClick={() => window.print()} className="rounded-lg bg-[var(--color-theme-500)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-theme-600)]">
            PDF 다운로드
          </button>
        </div>
      </div>

      <div className="manual-page mx-auto max-w-3xl px-6 py-10">
        <header className="mb-10 border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-900">PICKCOS 관리자 사용 설명서</h1>
          <p className="mt-2 text-gray-500">처음 쓰는 분도 따라 하기 쉽게 정리했습니다. 위 [PDF 다운로드]로 저장/인쇄할 수 있습니다.</p>
        </header>

        <div className="space-y-8">
          {steps.map((s) => (
            <section key={s.n} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-theme-50)] text-sm font-bold text-[var(--color-theme-700)]">{s.n}</div>
              </div>
              <div>
                <h2 className="mb-2 text-lg font-bold text-gray-900">{s.title}</h2>
                <ol className="list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-gray-700 marker:text-gray-400">
                  {s.body.map((line, i) => <li key={i}>{line}</li>)}
                </ol>
              </div>
            </section>
          ))}
        </div>

        {/* 정식(양산) 런칭 준비 체크리스트 */}
        <section className="mt-12 rounded-xl border-2 border-[var(--color-theme-200)] bg-[var(--color-theme-50)] p-6">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-[var(--color-theme-600)] px-3 py-1 text-xs font-bold text-white">CBT → 정식 런칭</div>
          <h2 className="mt-2 text-xl font-bold text-gray-900">정식(양산) 런칭 준비 체크리스트</h2>
          <p className="mt-1 text-[14px] text-gray-600">
            현재는 <b>CBT(비공개 테스트)</b> 단계입니다. 정식 오픈 전에 아래 항목을 점검하세요.
            <span className="ml-1 rounded bg-white px-1.5 py-0.5 text-[12px] text-gray-500">운영자 = 관리자 화면에서 직접</span>
            <span className="ml-1 rounded bg-white px-1.5 py-0.5 text-[12px] text-gray-500">개발자 = 코드·인프라 작업 필요</span>
          </p>
          <div className="mt-5 space-y-5">
            {launch.map((g) => (
              <div key={g.cat} className="rounded-lg border border-[var(--color-theme-100)] bg-white p-4">
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-gray-900">{g.cat}</h3>
                  <span className="flex-shrink-0 rounded-full bg-[var(--color-theme-50)] px-2 py-0.5 text-[12px] font-semibold text-[var(--color-theme-700)]">{g.who}</span>
                </div>
                <ul className="space-y-1.5 text-[14px] leading-relaxed text-gray-700">
                  {g.items.map((it, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-0.5 flex-shrink-0 text-[var(--color-theme-400)]">☐</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-gray-500">※ 개발자 작업(코드·요금제·도메인·보안)은 담당 개발자에게 이 체크리스트를 전달하세요.</p>
        </section>

        {/* Upcoming */}
        <section className="mt-10 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5">
          <h2 className="mb-2 text-base font-bold text-gray-800">곧 추가될 기능</h2>
          <ul className="list-disc space-y-1 pl-5 text-[14px] text-gray-600 marker:text-gray-400">
            {upcoming.map((u, i) => <li key={i}>{u}</li>)}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-gray-900">자주 묻는 질문</h2>
          <div className="space-y-3">
            {faq.map(([q, a], i) => (
              <div key={i} className="rounded-lg border p-4">
                <p className="text-[15px] font-semibold text-gray-900">Q. {q}</p>
                <p className="mt-1 text-[14px] text-gray-600">A. {a}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t pt-6 text-center text-xs text-gray-400">
          PICKCOS 관리자 · 도움이 필요하면 담당자에게 문의하세요.
        </footer>
      </div>
    </div>
  )
}
