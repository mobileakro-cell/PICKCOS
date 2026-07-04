import { Supplier, Article, Exhibition, Ambassador, bl, blArr } from './types'

// --- Mutable data arrays ---
export let mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'BeautySourceKr',
    supplierType: bl('OEM Manufacturer', 'OEM 제조업체'),
    category: 'Materials',
    productCategories: ['Skincare', 'Functional'],
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop',
    location: bl('Seoul, Korea', '서울, 한국'),
    country: 'South Korea',
    featured: true,
    verified: true,
    ambassadorPick: true,
    certifications: ['ISO 22716', 'GMPC', 'K-Beauty Certified'],
    moq: 1000,
    leadTime: 45,
    moqRange: '1,000 - 50,000 units',
    leadTimeRange: '45 - 90 days',
    description: bl(
      'Premium OEM manufacturer specializing in skincare formulations',
      '스킨케어 포뮬레이션 전문 프리미엄 OEM 제조업체'
    ),
    descriptionFull: bl(
      'BeautySourceKr is a leading OEM manufacturer with over 15 years of experience in premium skincare formulations.',
      'BeautySourceKr는 프리미엄 스킨케어 포뮬레이션 분야에서 15년 이상의 경험을 보유한 선도적인 OEM 제조업체입니다.'
    ),
    coreStrengths: blArr(
      ['Advanced anti-aging formulations', 'Customizable multi-step skincare solutions', 'Rapid prototyping and R&D support', 'Sustainable and eco-friendly packaging options'],
      ['첨단 안티에이징 포뮬레이션', '맞춤형 멀티스텝 스킨케어 솔루션', '신속한 프로토타이핑 및 R&D 지원', '지속 가능한 친환경 패키징 옵션']
    ),
    capabilities: blArr(
      ['Serums & Ampoules', 'Creams & Moisturizers', 'Sheet Masks & Hydrogel Masks', 'Cleansers & Toners', 'Eye Care', 'Special Treatments', 'Custom Blending & Formulation'],
      ['세럼 & 앰플', '크림 & 보습제', '시트 마스크 & 하이드로겔 마스크', '클렌저 & 토너', '아이 케어', '스페셜 트리트먼트', '커스텀 블렌딩 & 포뮬레이션']
    ),
    regulatoryNotes: bl('Compliant with FDA, CPNP, and Korean MFDS regulations.', 'FDA, CPNP, 한국 식약처 규정 준수.'),
    exportMarkets: ['United States', 'Canada', 'EU Countries', 'Japan', 'Australia', 'UAE'],
    files: [
      { id: 'f1', name: 'Product Catalog 2024.pdf', type: 'public', size: '5.2 MB' },
      { id: 'f2', name: 'Certifications & Compliance.pdf', type: 'public', size: '2.8 MB' },
      { id: 'f3', name: 'Price List & MOQ Details.xlsx', type: 'member-only', size: '1.1 MB' },
      { id: 'f4', name: 'R&D Capabilities Brochure.pdf', type: 'member-only', size: '3.5 MB' }
    ],
    website: 'https://beautysourcekr.com',
    contact: 'contact@beautysourcekr.com',
    exportExperience: true,
    exhibitionIds: ['1', '2'],
  },
  {
    id: '2',
    name: 'PackagingInnovators',
    supplierType: bl('Packaging Supplier', '패키징 공급업체'),
    category: 'Packaging',
    productCategories: ['Skincare', 'Makeup'],
    image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&h=600&fit=crop',
    location: bl('Busan, Korea', '부산, 한국'),
    country: 'South Korea',
    featured: true,
    verified: true,
    ambassadorPick: false,
    certifications: ['ISO 9001', 'Vegan Certified'],
    moq: 5000,
    leadTime: 30,
    moqRange: '5,000 - 100,000 units',
    leadTimeRange: '30 - 60 days',
    description: bl('Eco-friendly packaging solutions for cosmetics', '화장품을 위한 친환경 패키징 솔루션'),
    descriptionFull: bl(
      'PackagingInnovators specializes in sustainable, innovative packaging solutions for the cosmetics industry.',
      'PackagingInnovators는 화장품 산업을 위한 지속 가능하고 혁신적인 패키징 솔루션을 전문으로 합니다.'
    ),
    coreStrengths: blArr(
      ['Eco-friendly & sustainable materials', 'Custom design & printing services', 'Fast turnaround times', 'Competitive bulk pricing'],
      ['친환경 & 지속 가능한 소재', '맞춤 디자인 & 인쇄 서비스', '빠른 납기', '경쟁력 있는 대량 가격']
    ),
    capabilities: blArr(
      ['Glass Containers & Bottles', 'Plastic Jars & Pumps', 'Biodegradable Packaging', 'Custom Labels & Printing', 'Secondary Packaging & Boxes', 'Sample & Prototype Production'],
      ['유리 용기 & 병', '플라스틱 용기 & 펌프', '생분해성 패키징', '맞춤 라벨 & 인쇄', '2차 패키징 & 박스', '샘플 & 프로토타입 생산']
    ),
    regulatoryNotes: bl('All packaging meets international standards including US FDA compliance.', '모든 패키징은 미국 FDA 규정을 포함한 국제 표준을 준수합니다.'),
    exportMarkets: ['Japan', 'Thailand', 'Vietnam', 'Indonesia', 'Malaysia'],
    files: [
      { id: 'f5', name: 'Material Specifications.pdf', type: 'public', size: '4.1 MB' },
      { id: 'f6', name: 'Design Portfolio.pdf', type: 'public', size: '8.7 MB' },
      { id: 'f7', name: 'Quote Request Template.xlsx', type: 'member-only', size: '0.5 MB' }
    ],
    website: 'https://packaginginnovators.kr',
    contact: 'sales@packaginginnovators.kr',
    exportExperience: true,
    exhibitionIds: ['3'],
  },
  {
    id: '3',
    name: 'IngredientsKorea',
    supplierType: bl('Raw Material & Ingredients', '원료 & 성분'),
    category: 'Ingredients',
    productCategories: ['Skincare', 'Functional'],
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop',
    location: bl('Daegu, Korea', '대구, 한국'),
    country: 'South Korea',
    featured: false,
    verified: true,
    ambassadorPick: false,
    certifications: ['ISO 22716', 'Organic Certified', 'Non-GMO'],
    moq: 100,
    leadTime: 60,
    moqRange: '100 - 10,000 kg',
    leadTimeRange: '60 - 90 days',
    description: bl('Premium natural and organic beauty ingredients sourced from Korea', '한국산 프리미엄 천연 & 유기농 뷰티 원료'),
    descriptionFull: bl(
      'IngredientsKorea supplies premium natural beauty ingredients including fermented extracts, peptides, and plant-derived actives.',
      'IngredientsKorea는 발효 추출물, 펩타이드, 식물 유래 활성 성분 등 프리미엄 천연 뷰티 원료를 공급합니다.'
    ),
    coreStrengths: blArr(
      ['Natural & organic ingredient sourcing', 'Fermentation expertise', 'Customized blending capabilities', 'Quality certifications'],
      ['천연 & 유기농 원료 소싱', '발효 전문 기술', '맞춤 블렌딩 역량', '품질 인증']
    ),
    capabilities: blArr(
      ['Plant Extracts & Botanicals', 'Fermented Ingredients', 'Peptides & Proteins', 'Specialty Powders', 'Essential Oils & Actives'],
      ['식물 추출물 & 보태니컬', '발효 원료', '펩타이드 & 단백질', '특수 파우더', '에센셜 오일 & 활성 성분']
    ),
    regulatoryNotes: bl('All ingredients comply with INCI standards and international cosmetics regulations.', '모든 원료는 INCI 표준 및 국제 화장품 규정을 준수합니다.'),
    exportMarkets: ['United States', 'Canada', 'EU Countries', 'Japan', 'China'],
    files: [
      { id: 'f8', name: 'Ingredient Catalog.pdf', type: 'public', size: '6.3 MB' },
      { id: 'f9', name: 'Technical Specifications.xlsx', type: 'member-only', size: '2.1 MB' }
    ],
    website: 'https://ingredientsk.com',
    contact: 'info@ingredientsk.com',
    exportExperience: true,
    exhibitionIds: ['3', '6'],
  },
  {
    id: '4',
    name: 'KoreanContractMfg',
    supplierType: bl('Contract Manufacturer', '위탁 제조업체'),
    category: 'Materials',
    productCategories: ['Skincare', 'Makeup', 'Body'],
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=600&fit=crop',
    location: bl('Incheon, Korea', '인천, 한국'),
    country: 'South Korea',
    featured: false,
    verified: true,
    ambassadorPick: true,
    certifications: ['ISO 22716', 'GMPC', 'FDA Listed'],
    moq: 2000,
    leadTime: 50,
    moqRange: '2,000 - 100,000 units',
    leadTimeRange: '50 - 120 days',
    description: bl('Full-service contract manufacturer with advanced facilities', '첨단 시설을 갖춘 풀서비스 위탁 제조업체'),
    descriptionFull: bl(
      'KoreanContractMfg provides comprehensive manufacturing services from concept to shelf, with ISO-certified facilities.',
      'KoreanContractMfg는 ISO 인증 시설을 통해 컨셉부터 출시까지 종합적인 제조 서비스를 제공합니다.'
    ),
    coreStrengths: blArr(
      ['Full manufacturing capabilities', 'Concept to market expertise', 'Quality assurance programs', 'Flexible order quantities'],
      ['풀 제조 역량', '컨셉에서 시장까지 전문성', '품질 보증 프로그램', '유연한 주문 수량']
    ),
    capabilities: blArr(
      ['Creams & Lotions', 'Serums & Essences', 'Masks & Treatments', 'Sunscreen & SPF Products', 'Packaging Assembly'],
      ['크림 & 로션', '세럼 & 에센스', '마스크 & 트리트먼트', '선스크린 & SPF 제품', '패키징 조립']
    ),
    regulatoryNotes: bl('Compliant with FDA, CPNP, MFDS, and TGA regulations.', 'FDA, CPNP, 식약처, TGA 규정 준수.'),
    exportMarkets: ['United States', 'Canada', 'EU Countries', 'Australia', 'New Zealand'],
    files: [
      { id: 'f10', name: 'Service Offerings.pdf', type: 'public', size: '3.8 MB' },
      { id: 'f11', name: 'Quality Standards.pdf', type: 'public', size: '2.5 MB' }
    ],
    website: 'https://kcmfg.kr',
    contact: 'business@kcmfg.kr',
    exportExperience: true,
    exhibitionIds: ['1', '5', '8'],
  },
  {
    id: '5',
    name: 'GreenBeauty Solutions',
    supplierType: bl('Clean Beauty Specialist', '클린 뷰티 전문기업'),
    category: 'Materials',
    productCategories: ['Skincare', 'Body'],
    image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=800&h=600&fit=crop',
    location: bl('Seoul, Korea', '서울, 한국'),
    country: 'South Korea',
    featured: false,
    verified: true,
    ambassadorPick: false,
    certifications: ['COSMOS', 'Vegan Certified', 'Cruelty-Free'],
    moq: 500,
    leadTime: 45,
    moqRange: '500 - 50,000 units',
    leadTimeRange: '45 - 90 days',
    description: bl('Specialized in clean, sustainable beauty products', '클린, 지속 가능한 뷰티 제품 전문'),
    descriptionFull: bl(
      'GreenBeauty Solutions specializes in formulating clean beauty products with natural and sustainable ingredients.',
      'GreenBeauty Solutions는 천연 및 지속 가능한 원료로 클린 뷰티 제품을 포뮬레이팅하는 것을 전문으로 합니다.'
    ),
    coreStrengths: blArr(
      ['Clean beauty expertise', 'Sustainable formulations', 'Natural ingredients focus', 'Ethical manufacturing'],
      ['클린 뷰티 전문성', '지속 가능한 포뮬레이션', '천연 원료 중심', '윤리적 제조']
    ),
    capabilities: blArr(
      ['Clean Skincare', 'Natural Cosmetics', 'Eco-Friendly Formulations', 'Refillable Solutions'],
      ['클린 스킨케어', '내추럴 코스메틱', '친환경 포뮬레이션', '리필 솔루션']
    ),
    regulatoryNotes: bl('COSMOS, EWG verified, and meets EU clean beauty standards.', 'COSMOS, EWG 인증, EU 클린 뷰티 기준 충족.'),
    exportMarkets: ['United States', 'Canada', 'EU Countries'],
    files: [
      { id: 'f12', name: 'Clean Beauty Whitepaper.pdf', type: 'public', size: '4.2 MB' }
    ],
    website: 'https://greenbeautykr.com',
    contact: 'hello@greenbeautykr.com',
    exportExperience: true,
    exhibitionIds: ['6'],
  },
  {
    id: '6',
    name: 'AmoreLab Co.',
    supplierType: bl('ODM & Private Label', 'ODM & 자체 브랜드'),
    category: 'Materials',
    productCategories: ['Skincare', 'Functional', 'Makeup'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
    location: bl('Suwon, Korea', '수원, 한국'),
    country: 'South Korea',
    featured: true,
    verified: true,
    ambassadorPick: false,
    certifications: ['ISO 22716', 'GMPC', 'CPNP Registered'],
    moq: 3000,
    leadTime: 60,
    moqRange: '3,000 - 200,000 units',
    leadTimeRange: '60 - 120 days',
    description: bl('Full ODM service with in-house R&D center and 200+ formulation library', '자체 R&D 센터와 200개 이상의 포뮬레이션 라이브러리를 갖춘 풀 ODM 서비스'),
    descriptionFull: bl(
      'AmoreLab Co. is a premier ODM partner with a state-of-the-art R&D center housing over 200 proprietary formulations ready for private labeling.',
      'AmoreLab Co.는 200개 이상의 독자적인 포뮬레이션을 보유한 최첨단 R&D 센터를 갖춘 프리미어 ODM 파트너입니다.'
    ),
    coreStrengths: blArr(
      ['In-house R&D with 200+ ready formulations', 'Private label turnkey solutions', 'Advanced emulsion technology', 'Full regulatory support for global markets'],
      ['200개 이상의 레디 포뮬레이션을 보유한 자체 R&D', '자체 브랜드 턴키 솔루션', '첨단 유화 기술', '글로벌 시장을 위한 풀 규제 지원']
    ),
    capabilities: blArr(
      ['Emulsions & Creams', 'Sunscreen (SPF) Products', 'Ampoules & Serums', 'Lip & Color Cosmetics', 'Hair Care Products', 'Private Label Packaging'],
      ['유화 & 크림', '선스크린(SPF) 제품', '앰플 & 세럼', '립 & 색조 화장품', '헤어 케어 제품', '자체 브랜드 패키징']
    ),
    regulatoryNotes: bl('Full CPNP, FDA 510(k), MFDS registration support provided.', 'CPNP, FDA 510(k), 식약처 등록 지원 제공.'),
    exportMarkets: ['United States', 'EU Countries', 'Japan', 'Australia', 'Southeast Asia'],
    files: [
      { id: 'f13', name: 'ODM Formulation Library.pdf', type: 'public', size: '12.4 MB' },
      { id: 'f14', name: 'Private Label Process Guide.pdf', type: 'public', size: '3.1 MB' }
    ],
    website: 'https://amorelab.kr',
    contact: 'odm@amorelab.kr',
    exportExperience: true,
    exhibitionIds: ['1', '5'],
  },
  {
    id: '7',
    name: 'K-Pack Global',
    supplierType: bl('Luxury Packaging Specialist', '럭셔리 패키징 전문기업'),
    category: 'Packaging',
    productCategories: ['Fragrance', 'Makeup'],
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=600&fit=crop',
    location: bl('Cheonan, Korea', '천안, 한국'),
    country: 'South Korea',
    featured: true,
    verified: true,
    ambassadorPick: true,
    certifications: ['ISO 9001', 'FSC Certified', 'PCR Certified'],
    moq: 10000,
    leadTime: 35,
    moqRange: '10,000 - 500,000 units',
    leadTimeRange: '35 - 75 days',
    description: bl('Premium luxury packaging with sustainable material options and custom tooling', '지속 가능한 소재 옵션과 맞춤 툴링을 갖춘 프리미엄 럭셔리 패키징'),
    descriptionFull: bl(
      'K-Pack Global delivers premium luxury packaging solutions for prestige beauty brands. Specializing in custom molds, metallic finishes, and sustainable alternatives.',
      'K-Pack Global은 프레스티지 뷰티 브랜드를 위한 프리미엄 럭셔리 패키징 솔루션을 제공합니다. 맞춤 몰드, 메탈릭 피니시, 지속 가능한 대안을 전문으로 합니다.'
    ),
    coreStrengths: blArr(
      ['Luxury finish expertise (metallic, matte, gradient)', 'Custom mold and tooling capabilities', 'PCR and FSC certified sustainable options', 'In-house QC lab with color matching'],
      ['럭셔리 피니시 전문성 (메탈릭, 매트, 그라데이션)', '맞춤 몰드 및 툴링 역량', 'PCR 및 FSC 인증 지속 가능한 옵션', '색상 매칭 가능한 자체 QC 연구소']
    ),
    capabilities: blArr(
      ['Custom Glass Bottles & Jars', 'Airless Pump Systems', 'Luxury Compacts & Palettes', 'Dropper Assemblies', 'Metallic & Special Finishes', 'Sustainable Refill Systems'],
      ['맞춤 유리 병 & 용기', '에어리스 펌프 시스템', '럭셔리 컴팩트 & 팔레트', '드로퍼 조립', '메탈릭 & 스페셜 피니시', '지속 가능한 리필 시스템']
    ),
    regulatoryNotes: bl('All materials FDA and EU compliant. FSC and PCR options available.', '모든 소재 FDA 및 EU 규정 준수. FSC 및 PCR 옵션 가능.'),
    exportMarkets: ['United States', 'EU Countries', 'Japan', 'China', 'Middle East'],
    files: [
      { id: 'f15', name: 'Luxury Packaging Portfolio.pdf', type: 'public', size: '15.8 MB' },
      { id: 'f16', name: 'Sustainable Options Guide.pdf', type: 'public', size: '4.5 MB' }
    ],
    website: 'https://kpackglobal.com',
    contact: 'inquiry@kpackglobal.com',
    exportExperience: true,
    exhibitionIds: ['1', '7', '8'],
  },
  {
    id: '8',
    name: 'BioFerment Korea',
    supplierType: bl('Fermentation Specialist', '발효 전문기업'),
    category: 'Ingredients',
    productCategories: ['Skincare', 'Functional'],
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=600&fit=crop',
    location: bl('Jeonju, Korea', '전주, 한국'),
    country: 'South Korea',
    featured: false,
    verified: true,
    ambassadorPick: false,
    certifications: ['ISO 22716', 'COSMOS Natural', 'ECOCERT'],
    moq: 50,
    leadTime: 45,
    moqRange: '50 - 5,000 kg',
    leadTimeRange: '45 - 75 days',
    description: bl('Patented fermentation technology producing high-potency bioactive ingredients', '고농도 생리활성 원료를 생산하는 특허 발효 기술'),
    descriptionFull: bl(
      'BioFerment Korea utilizes proprietary fermentation processes derived from traditional Korean fermentation science to create next-generation bioactive ingredients.',
      'BioFerment Korea는 전통 한국 발효 과학에서 유래한 독자적인 발효 공정을 활용하여 차세대 생리활성 원료를 생산합니다.'
    ),
    coreStrengths: blArr(
      ['Patented double-fermentation technology', 'Traditional Korean fermentation heritage', 'High-potency bioactive compounds', 'Custom fermentation development'],
      ['특허 이중 발효 기술', '전통 한국 발효 유산', '고농도 생리활성 화합물', '맞춤 발효 개발']
    ),
    capabilities: blArr(
      ['Fermented Rice Extracts', 'Galactomyces Filtrates', 'Bifida Ferment Lysates', 'Custom Fermentation Development', 'Botanical Ferments'],
      ['발효 쌀 추출물', '갈락토미세스 여과액', '비피다 발효 용해물', '맞춤 발효 개발', '보태니컬 발효물']
    ),
    regulatoryNotes: bl('COSMOS and ECOCERT certified. INCI compliant with full documentation.', 'COSMOS 및 ECOCERT 인증. 전체 문서와 함께 INCI 준수.'),
    exportMarkets: ['United States', 'EU Countries', 'Japan', 'China', 'Australia'],
    files: [
      { id: 'f17', name: 'Fermentation Technology Paper.pdf', type: 'public', size: '5.7 MB' }
    ],
    website: 'https://biofermentkorea.com',
    contact: 'lab@biofermentkorea.com',
    exportExperience: true,
    exhibitionIds: ['3', '6'],
  },
  {
    id: '9',
    name: 'SkinTech Manufacturing',
    supplierType: bl('Device & Tool Manufacturer', '디바이스 & 도구 제조업체'),
    category: 'Materials',
    productCategories: ['Skincare', 'Hair'],
    image: 'https://images.unsplash.com/photo-1614859324967-bdf413c08755?w=800&h=600&fit=crop',
    location: bl('Ansan, Korea', '안산, 한국'),
    country: 'South Korea',
    featured: false,
    verified: true,
    ambassadorPick: false,
    certifications: ['ISO 13485', 'CE Marked', 'FDA 510(k)'],
    moq: 500,
    leadTime: 90,
    moqRange: '500 - 50,000 units',
    leadTimeRange: '90 - 150 days',
    description: bl('Beauty device and skincare tool manufacturer with patented LED and microcurrent technology', '특허 LED 및 미세전류 기술을 보유한 뷰티 디바이스 및 스킨케어 도구 제조업체'),
    descriptionFull: bl(
      'SkinTech Manufacturing produces cutting-edge beauty devices including LED masks, microcurrent tools, and ultrasonic skin scrubbers for global beauty brands.',
      'SkinTech Manufacturing은 글로벌 뷰티 브랜드를 위해 LED 마스크, 미세전류 도구, 초음파 스킨 스크러버 등 최첨단 뷰티 디바이스를 생산합니다.'
    ),
    coreStrengths: blArr(
      ['Patented LED therapy technology', 'Microcurrent device expertise', 'CE and FDA certified production', 'White-label device programs'],
      ['특허 LED 테라피 기술', '미세전류 디바이스 전문성', 'CE 및 FDA 인증 생산', '화이트 라벨 디바이스 프로그램']
    ),
    capabilities: blArr(
      ['LED Therapy Masks', 'Microcurrent Devices', 'Ultrasonic Skin Scrubbers', 'Facial Massagers', 'At-Home Derma Tools', 'IoT-Connected Devices'],
      ['LED 테라피 마스크', '미세전류 디바이스', '초음파 스킨 스크러버', '페이셜 마사저', '홈 더마 도구', 'IoT 연결 디바이스']
    ),
    regulatoryNotes: bl('ISO 13485 medical device standard. CE marked and FDA 510(k) cleared.', 'ISO 13485 의료기기 표준. CE 마크 및 FDA 510(k) 승인.'),
    exportMarkets: ['United States', 'EU Countries', 'Japan', 'Australia', 'Canada'],
    files: [
      { id: 'f18', name: 'Device Catalog 2026.pdf', type: 'public', size: '9.2 MB' },
      { id: 'f19', name: 'Certification Documents.pdf', type: 'member-only', size: '3.8 MB' }
    ],
    website: 'https://skintechmfg.kr',
    contact: 'sales@skintechmfg.kr',
    exportExperience: true,
    exhibitionIds: ['4', '8'],
  },
]

export let mockArticles: Article[] = [
  {
    id: '1',
    slug: 'k-beauty-trends-2026',
    title: bl('K-Beauty Trends 2026: What Global Buyers Need to Know', 'K-뷰티 트렌드 2026: 글로벌 바이어가 알아야 할 것'),
    summary: bl(
      'Discover the latest innovations in Korean beauty sourcing, from clean ingredients to sustainable packaging solutions.',
      '클린 원료부터 지속 가능한 패키징 솔루션까지, 한국 뷰티 소싱의 최신 혁신을 알아보세요.'
    ),
    content: bl('Full article content here...', '전체 기사 내용...'),
    category: 'MARKET',
    region: 'US',
    isHeadline: true,
    tags: blArr(['Trends', 'K-Beauty', 'Sourcing'], ['트렌드', 'K-뷰티', '소싱']),
    publishedAt: '2026-01-25',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
    author: 'Sarah Kim',
    contentBlocks: [
      {
        type: 'why_matters',
        title: bl('Why This Matters for Buyers', '바이어에게 중요한 이유'),
        content: bl(
          'Understanding 2026 K-Beauty trends is critical for buyers looking to stay competitive. Clean beauty formulations and sustainable packaging are no longer optional.',
          '2026 K-뷰티 트렌드를 이해하는 것은 경쟁력을 유지하려는 바이어에게 매우 중요합니다. 클린 뷰티 포뮬레이션과 지속 가능한 패키징은 더 이상 선택이 아닙니다.'
        ),
      },
      {
        type: 'sourcing_checklist',
        title: bl('Sourcing Checklist', '소싱 체크리스트'),
        items: blArr(
          ['Verify supplier has clean beauty certifications (EWG, COSMOS)', 'Request ingredient transparency documentation', 'Confirm sustainable packaging options and materials', 'Check MOQ flexibility for test market launches', 'Validate export compliance for your target markets'],
          ['공급업체의 클린 뷰티 인증(EWG, COSMOS) 확인', '원료 투명성 문서 요청', '지속 가능한 패키징 옵션 및 소재 확인', '테스트 마켓 출시를 위한 MOQ 유연성 확인', '대상 시장의 수출 규정 준수 검증']
        ),
      }
    ],
    relatedSuppliers: ['1', '2']
  },
  {
    id: '2',
    slug: 'eu-cosmetics-regulation-updates',
    title: bl('EU Cosmetics Regulation Updates for 2026', '2026년 EU 화장품 규제 업데이트'),
    summary: bl('Key changes in European cosmetics regulations affecting importers and manufacturers.', '수입업체와 제조업체에 영향을 미치는 유럽 화장품 규제의 주요 변경사항.'),
    content: bl('Full article content here...', '전체 기사 내용...'),
    category: 'MARKET',
    region: 'EU',
    isHeadline: false,
    tags: blArr(['Regulation', 'Compliance', 'EU'], ['규제', '규정 준수', 'EU']),
    publishedAt: '2026-01-10',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop',
    author: 'Michael Chen',
    contentBlocks: [
      {
        type: 'why_matters',
        title: bl('Why This Matters for Buyers', '바이어에게 중요한 이유'),
        content: bl(
          'New EU regulations require enhanced safety assessments and ingredient restrictions. Buyers must ensure suppliers have updated CPNP registrations.',
          '새로운 EU 규제는 강화된 안전성 평가와 성분 제한을 요구합니다. 바이어는 공급업체가 업데이트된 CPNP 등록을 보유하고 있는지 확인해야 합니다.'
        ),
      }
    ],
    relatedSuppliers: ['1']
  },
  {
    id: '3',
    slug: 'sustainable-packaging-future',
    title: bl('The Future of Sustainable Packaging in K-Beauty', 'K-뷰티의 지속 가능한 패키징의 미래'),
    summary: bl('Exploring eco-friendly packaging trends and supplier solutions for environmentally conscious brands.', '환경을 생각하는 브랜드를 위한 친환경 패키징 트렌드와 공급업체 솔루션을 탐색합니다.'),
    content: bl('Full article content here...', '전체 기사 내용...'),
    category: 'INSIGHT',
    region: 'Global',
    isHeadline: false,
    tags: blArr(['Sustainability', 'Packaging', 'Innovation'], ['지속가능성', '패키징', '혁신']),
    publishedAt: '2026-01-15',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop',
    author: 'Marie Dubois',
    contentBlocks: [
      {
        type: 'why_matters',
        title: bl('Why Sustainable Packaging Matters', '지속 가능한 패키징이 중요한 이유'),
        content: bl(
          'Consumers demand eco-friendly options. Brands using sustainable packaging see 40% better market reception and higher price premiums.',
          '소비자는 친환경 옵션을 요구합니다. 지속 가능한 패키징을 사용하는 브랜드는 40% 더 나은 시장 반응과 더 높은 프리미엄 가격을 경험합니다.'
        ),
      },
      {
        type: 'sourcing_checklist',
        title: bl('Sustainable Sourcing Checklist', '지속 가능한 소싱 체크리스트'),
        items: blArr(
          ['Request supplier\'s sustainability certifications', 'Ask for recyclable/compostable material options', 'Verify carbon footprint reduction initiatives', 'Check packaging weight optimization', 'Review supply chain transparency'],
          ['공급업체의 지속가능성 인증 요청', '재활용/퇴비화 가능한 소재 옵션 요청', '탄소 발자국 감소 이니셔티브 확인', '패키징 무게 최적화 확인', '공급망 투명성 검토']
        ),
      }
    ],
    relatedSuppliers: ['2', '4']
  },
  {
    id: '4',
    slug: 'moq-negotiation-strategies',
    title: bl('Negotiating MOQ: Strategies for New Brands', 'MOQ 협상: 신규 브랜드를 위한 전략'),
    summary: bl('Expert tips on managing minimum order quantities when sourcing from Korean manufacturers.', '한국 제조업체에서 소싱할 때 최소 주문 수량을 관리하는 전문가 팁.'),
    content: bl('Full article content here...', '전체 기사 내용...'),
    category: 'INSIGHT',
    region: 'Global',
    isHeadline: false,
    tags: blArr(['MOQ', 'Negotiation', 'Strategy'], ['MOQ', '협상', '전략']),
    publishedAt: '2026-01-08',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
    author: 'Ahmed Al-Rashid',
    contentBlocks: [
      {
        type: 'key_insight',
        title: bl('Key Insight', '핵심 인사이트'),
        content: bl(
          'Korean manufacturers are increasingly flexible with MOQ for new brands. Average flexibility: 30-50% reduction for first orders with committed volume.',
          '한국 제조업체는 신규 브랜드에 대한 MOQ를 점점 더 유연하게 적용하고 있습니다. 평균 유연성: 약정 물량이 있는 첫 주문에 대해 30-50% 감소.'
        ),
      },
      {
        type: 'sourcing_checklist',
        title: bl('MOQ Negotiation Steps', 'MOQ 협상 단계'),
        items: blArr(
          ['Start with market research on competitor MOQs', 'Prepare volume commitments for future orders', 'Offer longer lead times in exchange for lower MOQ', 'Consider co-manufacturing opportunities', 'Negotiate sample/prototype quantities first'],
          ['경쟁사 MOQ에 대한 시장 조사부터 시작', '향후 주문에 대한 물량 약정 준비', '낮은 MOQ를 위해 더 긴 납기 제안', '공동 제조 기회 고려', '먼저 샘플/프로토타입 수량 협상']
        ),
      }
    ],
    relatedSuppliers: ['1', '3', '4']
  },
  {
    id: '5',
    slug: 'quality-assurance-korean-manufacturers',
    title: bl('Quality Assurance Standards at Korean Manufacturers', '한국 제조업체의 품질 보증 기준'),
    summary: bl('Understanding certifications, compliance, and quality control processes that protect your brand.', '브랜드를 보호하는 인증, 규정 준수 및 품질 관리 프로세스 이해.'),
    content: bl('Full article content here...', '전체 기사 내용...'),
    category: 'COMPANY',
    region: 'Global',
    isHeadline: false,
    tags: blArr(['Quality', 'Certification', 'Compliance'], ['품질', '인증', '규정 준수']),
    publishedAt: '2026-01-02',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop',
    author: 'Sarah Kim',
    contentBlocks: [
      {
        type: 'why_matters',
        title: bl('Why Quality Standards Matter', '품질 기준이 중요한 이유'),
        content: bl(
          'Quality issues cost brands millions in recalls and reputation damage. Proper vetting saves time and money in the long run.',
          '품질 문제는 리콜과 평판 손상으로 브랜드에 수백만 달러의 비용을 초래합니다. 적절한 검증은 장기적으로 시간과 비용을 절약합니다.'
        ),
      }
    ],
    relatedSuppliers: ['1', '4', '5']
  },
  {
    id: '6',
    slug: 'fermentation-skincare-revolution',
    title: bl('The Fermentation Revolution in Korean Skincare', '한국 스킨케어의 발효 혁명'),
    summary: bl('How traditional Korean fermentation techniques are creating next-generation skincare ingredients with proven clinical results.', '전통 한국 발효 기술이 입증된 임상 결과를 가진 차세대 스킨케어 원료를 만드는 방법.'),
    content: bl('Full article content here...', '전체 기사 내용...'),
    category: 'INSIGHT',
    region: 'Global',
    isHeadline: false,
    tags: blArr(['Fermentation', 'Innovation', 'Ingredients'], ['발효', '혁신', '원료']),
    publishedAt: '2026-02-05',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=800&h=600&fit=crop',
    author: 'Yuki Tanaka',
    contentBlocks: [
      {
        type: 'why_matters',
        title: bl('Why Fermentation Matters', '발효가 중요한 이유'),
        content: bl(
          'Fermented ingredients offer 2-3x higher bioavailability than traditional extracts. Korean fermentation heritage gives suppliers a unique competitive advantage.',
          '발효 원료는 기존 추출물보다 2-3배 높은 생체이용률을 제공합니다. 한국의 발효 유산은 공급업체에 독보적인 경쟁 우위를 부여합니다.'
        ),
      },
      {
        type: 'sourcing_checklist',
        title: bl('Fermented Ingredient Sourcing Guide', '발효 원료 소싱 가이드'),
        items: blArr(
          ['Verify fermentation strain documentation and safety data', 'Request clinical efficacy data for key bioactives', 'Check scalability of fermentation processes', 'Confirm stability testing across formulation types', 'Review IP and patent landscape for specific strains'],
          ['발효균주 문서 및 안전 데이터 확인', '핵심 생리활성 물질에 대한 임상 효능 데이터 요청', '발효 공정의 확장성 확인', '포뮬레이션 유형별 안정성 테스트 확인', '특정 균주에 대한 IP 및 특허 환경 검토']
        ),
      }
    ],
    relatedSuppliers: ['3', '8']
  },
  {
    id: '7',
    slug: 'beauty-device-market-growth',
    title: bl('At-Home Beauty Devices: The Fastest Growing K-Beauty Category', '홈 뷰티 디바이스: 가장 빠르게 성장하는 K-뷰티 카테고리'),
    summary: bl('The global at-home beauty device market is projected to reach $150B by 2028. Korean manufacturers lead in innovation.', '글로벌 홈 뷰티 디바이스 시장은 2028년까지 1,500억 달러에 도달할 것으로 전망됩니다. 한국 제조업체가 혁신을 주도합니다.'),
    content: bl('Full article content here...', '전체 기사 내용...'),
    category: 'MARKET',
    region: 'Global',
    isHeadline: false,
    tags: blArr(['Devices', 'Technology', 'Growth'], ['디바이스', '기술', '성장']),
    publishedAt: '2026-02-10',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=600&fit=crop',
    author: 'Michael Chen',
    contentBlocks: [
      {
        type: 'key_insight',
        title: bl('Market Projection', '시장 전망'),
        content: bl(
          'LED therapy devices alone grew 340% in 2025. Korean manufacturers hold 60% of global beauty device patents filed in the last 3 years.',
          'LED 테라피 디바이스만 2025년에 340% 성장했습니다. 한국 제조업체는 최근 3년간 출원된 글로벌 뷰티 디바이스 특허의 60%를 보유하고 있습니다.'
        ),
      }
    ],
    relatedSuppliers: ['9']
  },
  {
    id: '8',
    slug: 'private-label-guide-2026',
    title: bl('Complete Guide to Private Label K-Beauty in 2026', '2026 자체 브랜드 K-뷰티 완벽 가이드'),
    summary: bl('Step-by-step guide to launching your own K-Beauty brand through private label partnerships with Korean ODM manufacturers.', '한국 ODM 제조업체와의 자체 브랜드 파트너십을 통해 K-뷰티 브랜드를 론칭하는 단계별 가이드.'),
    content: bl('Full article content here...', '전체 기사 내용...'),
    category: 'INSIGHT',
    region: 'US',
    isHeadline: false,
    tags: blArr(['Private Label', 'ODM', 'Brand Launch'], ['자체 브랜드', 'ODM', '브랜드 론칭']),
    publishedAt: '2026-01-30',
    image: 'https://images.unsplash.com/photo-1614859324967-bdf413c08755?w=800&h=600&fit=crop',
    author: 'Sarah Kim',
    contentBlocks: [
      {
        type: 'sourcing_checklist',
        title: bl('Private Label Launch Checklist', '자체 브랜드 론칭 체크리스트'),
        items: blArr(
          ['Define your brand concept and target demographic', 'Select 3-5 hero SKUs from ODM formulation library', 'Negotiate MOQ and pricing for initial run', 'Design packaging and review compliance requirements', 'Plan regulatory submissions for target markets', 'Set up quality inspection protocols'],
          ['브랜드 컨셉 및 대상 고객 정의', 'ODM 포뮬레이션 라이브러리에서 3-5개 히어로 SKU 선정', '초기 생산에 대한 MOQ 및 가격 협상', '패키징 디자인 및 규정 준수 요건 검토', '대상 시장의 규제 제출 계획', '품질 검사 프로토콜 설정']
        ),
      }
    ],
    relatedSuppliers: ['1', '4', '6']
  },
  {
    id: '9',
    slug: 'luxury-packaging-trends-asia',
    title: bl('Luxury Packaging Trends Reshaping the Asian Beauty Market', '아시아 뷰티 시장을 재편하는 럭셔리 패키징 트렌드'),
    summary: bl('From refillable compacts to AI-powered dispensers, luxury packaging innovation is redefining the premium beauty experience.', '리필형 컴팩트부터 AI 기반 디스펜서까지, 럭셔리 패키징 혁신이 프리미엄 뷰티 경험을 재정의하고 있습니다.'),
    content: bl('Full article content here...', '전체 기사 내용...'),
    category: 'COMPANY',
    region: 'Asia',
    isHeadline: false,
    tags: blArr(['Packaging', 'Luxury', 'Asia'], ['패키징', '럭셔리', '아시아']),
    publishedAt: '2026-02-14',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=600&fit=crop',
    author: 'Marie Dubois',
    contentBlocks: [
      {
        type: 'why_matters',
        title: bl('Why Premium Packaging Drives Sales', '프리미엄 패키징이 매출을 이끄는 이유'),
        content: bl(
          'Research shows 72% of Asian consumers say packaging quality directly influences their purchase decision for skincare. Sustainable luxury is the new standard.',
          '조사에 따르면 아시아 소비자의 72%가 패키징 품질이 스킨케어 구매 결정에 직접적으로 영향을 미친다고 답했습니다. 지속 가능한 럭셔리가 새로운 표준입니다.'
        ),
      }
    ],
    relatedSuppliers: ['2', '7']
  },
  {
    id: '10',
    slug: 'halal-cosmetics-middle-east',
    title: bl('Halal Cosmetics: Unlocking the $80B Middle East Beauty Market', '할랄 화장품: 800억 달러 규모의 중동 뷰티 시장 공략'),
    summary: bl('Navigating halal certification requirements and consumer expectations for the rapidly growing GCC beauty market.', '빠르게 성장하는 GCC 뷰티 시장의 할랄 인증 요건과 소비자 기대를 탐색합니다.'),
    content: bl('Full article content here...', '전체 기사 내용...'),
    category: 'PEOPLE',
    region: 'Global',
    isHeadline: false,
    tags: blArr(['Halal', 'Middle East', 'Certification'], ['할랄', '중동', '인증']),
    publishedAt: '2026-02-01',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=600&fit=crop',
    author: 'Ahmed Al-Rashid',
    contentBlocks: [
      {
        type: 'key_insight',
        title: bl('Market Opportunity', '시장 기회'),
        content: bl(
          'The halal cosmetics market is growing at 12% CAGR. Korean manufacturers with halal certification are seeing 3x more inquiries from GCC buyers.',
          '할랄 화장품 시장은 연평균 12% 성장하고 있습니다. 할랄 인증을 보유한 한국 제조업체는 GCC 바이어로부터 3배 더 많은 문의를 받고 있습니다.'
        ),
      },
      {
        type: 'sourcing_checklist',
        title: bl('Halal Certification Checklist', '할랄 인증 체크리스트'),
        items: blArr(
          ['Verify supplier holds recognized halal certification (JAKIM, MUI, ESMA)', 'Review ingredient sourcing for halal compliance', 'Check manufacturing facility separation protocols', 'Confirm product registration requirements for target GCC country', 'Review packaging and labeling halal mark requirements'],
          ['공급업체의 공인 할랄 인증(JAKIM, MUI, ESMA) 보유 확인', '할랄 규정 준수를 위한 원료 소싱 검토', '제조 시설 분리 프로토콜 확인', '대상 GCC 국가의 제품 등록 요건 확인', '패키징 및 라벨링 할랄 마크 요건 검토']
        ),
      }
    ],
    relatedSuppliers: ['1', '5', '6']
  },
]

export let mockExhibitions: Exhibition[] = [
  {
    id: '1', title: bl('Seoul Beauty Expo 2026', '서울 뷰티 엑스포 2026'), dateRange: 'Mar 15-18, 2026',
    location: bl('COEX Seoul', 'COEX 서울'), region: 'KR', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', status: 'upcoming',
    description: bl("Korea's largest beauty and cosmetics trade show", '한국 최대의 뷰티 및 화장품 무역 박람회'),
    supplierIds: ['1', '2', '3', '4'], articleIds: ['1'],
  },
  {
    id: '2', title: bl('K-Beauty Sourcing Summit', 'K-뷰티 소싱 서밋'), dateRange: 'Apr 10-12, 2026',
    location: bl('Incheon Trade Center', '인천 무역 센터'), region: 'KR', image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop', status: 'upcoming',
    description: bl('International sourcing and supply chain conference', '국제 소싱 및 공급망 컨퍼런스'),
    supplierIds: ['1', '4', '5'], articleIds: ['1', '2'],
  },
  {
    id: '3', title: bl('Beauty Ingredients Forum', '뷰티 원료 포럼'), dateRange: 'May 5-7, 2026',
    location: bl('Daegu International Exhibition Center', '대구 국제 전시 센터'), region: 'KR', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop', status: 'upcoming',
    description: bl('Dedicated forum for beauty ingredient suppliers', '뷰티 원료 공급업체를 위한 전문 포럼'),
    supplierIds: ['2', '3'], articleIds: ['2', '3'],
  },
  {
    id: '4', title: bl('Seoul Beauty Tech Show', '서울 뷰티 테크 쇼'), dateRange: 'Feb 1-3, 2026',
    location: bl('Seoul', '서울'), region: 'KR', image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop', status: 'past',
    description: bl('Technology innovations in beauty manufacturing', '뷰티 제조 기술 혁신'),
    supplierIds: ['1', '4'], articleIds: [],
  },
  {
    id: '5', title: bl('Cosmoprof Asia Hong Kong 2026', '코스모프로프 아시아 홍콩 2026'), dateRange: 'Nov 12-14, 2026',
    location: bl('Hong Kong Convention Center', '홍콩 컨벤션 센터'), region: 'ASIA', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop', status: 'upcoming',
    description: bl("Asia's largest beauty trade show", '아시아 최대 뷰티 무역 박람회'),
    supplierIds: ['1', '2', '4', '5'], articleIds: ['1'],
  },
  {
    id: '6', title: bl('in-cosmetics Global Paris', 'in-cosmetics 글로벌 파리'), dateRange: 'Mar 25-27, 2026',
    location: bl('Paris Expo Porte de Versailles', '파리 엑스포 포르트 드 베르사유'), region: 'EU', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop', status: 'upcoming',
    description: bl('Premier ingredients show in Europe', '유럽 최고의 원료 박람회'),
    supplierIds: ['1', '3', '5'], articleIds: ['2', '4'],
  },
  {
    id: '7', title: bl('Beautyworld Middle East', '뷰티월드 미들이스트'), dateRange: 'Oct 28-30, 2026',
    location: bl('Dubai World Trade Centre', '두바이 월드 트레이드 센터'), region: 'ME', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop', status: 'upcoming',
    description: bl('Largest beauty exhibition in Middle East', '중동 최대 뷰티 전시회'),
    supplierIds: ['1', '2', '3'], articleIds: [],
  },
  {
    id: '8', title: bl('Tokyo Beauty World', '도쿄 뷰티 월드'), dateRange: 'Apr 14-16, 2026',
    location: bl('Tokyo Big Sight', '도쿄 빅 사이트'), region: 'JP', image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&h=600&fit=crop', status: 'upcoming',
    description: bl("Japan's comprehensive beauty trade show", '일본 종합 뷰티 무역 박람회'),
    supplierIds: ['1', '2', '4'], articleIds: ['1', '5'],
  },
  {
    id: '9', title: bl('Busan Beauty Expo 2025', '부산 뷰티 엑스포 2025'), dateRange: 'Dec 5-7, 2025',
    location: bl('BEXCO Busan', 'BEXCO 부산'), region: 'KR', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=600&fit=crop', status: 'past',
    description: bl('Southern Korea regional beauty exhibition', '한국 남부 지역 뷰티 전시회'),
    supplierIds: ['2', '5'], articleIds: [],
  },
]

export let mockAmbassadors: Ambassador[] = [
  {
    id: '1', name: 'Sarah Chen',
    title: bl('Head of Product Development', '제품 개발 총괄'), region: 'North America',
    bio: bl('20+ years in beauty sourcing. Specializes in OEM formulation and clean beauty compliance.', '뷰티 소싱 분야 20년 이상 경력. OEM 포뮬레이션 및 클린 뷰티 규정 준수 전문.'),
    expertise: blArr(['OEM', 'Clean Beauty', 'Regulatory Compliance', 'R&D'], ['OEM', '클린 뷰티', '규정 준수', 'R&D']),
    image: '/images/ambassador1.svg',
  },
  {
    id: '2', name: 'Yuki Tanaka',
    title: bl('Asia-Pacific Regional Manager', '아시아태평양 지역 매니저'), region: 'Asia Pacific',
    bio: bl('Experienced in cross-border beauty sourcing across SEA and Japan. Built supply chains for 50+ brands.', '동남아시아 및 일본 전역의 크로스보더 뷰티 소싱 경험. 50개 이상 브랜드의 공급망 구축.'),
    expertise: blArr(['Packaging', 'Supply Chain', 'Cross-Border Trade', 'Compliance'], ['패키징', '공급망', '크로스보더 무역', '규정 준수']),
    image: '/images/ambassador2.svg',
  },
  {
    id: '3', name: 'Marie Dubois',
    title: bl('European Market Specialist', '유럽 시장 전문가'), region: 'Europe',
    bio: bl('Expert in EU cosmetics regulations and sustainable sourcing. Passion for clean and eco-friendly innovation.', 'EU 화장품 규제 및 지속 가능한 소싱 전문가. 클린하고 친환경적인 혁신에 대한 열정.'),
    expertise: blArr(['EU Regulations', 'Sustainability', 'Ingredient Innovation', 'Quality Assurance'], ['EU 규제', '지속가능성', '원료 혁신', '품질 보증']),
    image: '/images/ambassador3.svg',
  },
  {
    id: '4', name: 'Ahmed Al-Rashid',
    title: bl('Middle East Sourcing Expert', '중동 소싱 전문가'), region: 'Middle East',
    bio: bl('Specialist in halal certification and GCC market requirements. Deep network of vetted suppliers.', '할랄 인증 및 GCC 시장 요건 전문가. 검증된 공급업체의 깊은 네트워크 보유.'),
    expertise: blArr(['Halal Certification', 'GCC Regulations', 'Market Entry', 'Supplier Vetting'], ['할랄 인증', 'GCC 규제', '시장 진출', '공급업체 검증']),
    image: '/images/ambassador4.svg',
  },
]

// --- ID generators ---
let nextSupplierId = mockSuppliers.length + 1
let nextArticleId = mockArticles.length + 1
let nextExhibitionId = mockExhibitions.length + 1

// --- Supplier CRUD ---
export function addSupplier(data: Omit<Supplier, 'id'>): Supplier {
  const supplier = { ...data, id: String(nextSupplierId++) }
  mockSuppliers = [...mockSuppliers, supplier]
  return supplier
}

export function updateSupplier(id: string, data: Partial<Supplier>): Supplier | null {
  const idx = mockSuppliers.findIndex(s => s.id === id)
  if (idx === -1) return null
  mockSuppliers[idx] = { ...mockSuppliers[idx], ...data, id }
  mockSuppliers = [...mockSuppliers]
  return mockSuppliers[idx]
}

export function deleteSupplier(id: string): boolean {
  const len = mockSuppliers.length
  mockSuppliers = mockSuppliers.filter(s => s.id !== id)
  return mockSuppliers.length < len
}

// --- Article CRUD ---
export function addArticle(data: Omit<Article, 'id'>): Article {
  const article = { ...data, id: String(nextArticleId++) }
  mockArticles = [...mockArticles, article]
  return article
}

export function updateArticle(id: string, data: Partial<Article>): Article | null {
  const idx = mockArticles.findIndex(a => a.id === id)
  if (idx === -1) return null
  mockArticles[idx] = { ...mockArticles[idx], ...data, id }
  mockArticles = [...mockArticles]
  return mockArticles[idx]
}

export function deleteArticle(id: string): boolean {
  const len = mockArticles.length
  mockArticles = mockArticles.filter(a => a.id !== id)
  return mockArticles.length < len
}

// --- Exhibition CRUD ---
export function addExhibition(data: Omit<Exhibition, 'id'>): Exhibition {
  const exhibition = { ...data, id: String(nextExhibitionId++) }
  mockExhibitions = [...mockExhibitions, exhibition]
  return exhibition
}

export function updateExhibition(id: string, data: Partial<Exhibition>): Exhibition | null {
  const idx = mockExhibitions.findIndex(e => e.id === id)
  if (idx === -1) return null
  mockExhibitions[idx] = { ...mockExhibitions[idx], ...data, id }
  mockExhibitions = [...mockExhibitions]
  return mockExhibitions[idx]
}

export function deleteExhibition(id: string): boolean {
  const len = mockExhibitions.length
  mockExhibitions = mockExhibitions.filter(e => e.id !== id)
  return mockExhibitions.length < len
}
