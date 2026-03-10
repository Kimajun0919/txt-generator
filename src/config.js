const today = new Date().toISOString().slice(0, 10);

export const defaultFormValues = {
  siteUrl: "https://example.com",
  version: "1.0.0",
  lastUpdated: today,
  maintainerEmail: "policy@example.com",
  companyName: "Example Company",
  crawlDelay: "5",
  extraSitemaps: "/sitemap-blog.xml",
};

export const publicPathOptions = [
  {
    id: "blog",
    label: "/blog/",
    description: "블로그, 인사이트, 아티클",
  },
  {
    id: "docs",
    label: "/docs/",
    description: "공개 문서와 가이드",
  },
  {
    id: "help",
    label: "/help/",
    description: "도움말, FAQ, 지원 센터",
  },
  {
    id: "news",
    label: "/news/",
    description: "보도자료와 공지",
  },
];

export const disallowGroupOptions = [
  {
    id: "members",
    label: "회원 전용 경로 차단",
    description: "로그인 사용자 전용 화면",
    paths: ["/members/", "/mypage/"],
  },
  {
    id: "commerce",
    label: "결제/주문 경로 차단",
    description: "장바구니, 결제, 청구",
    paths: ["/billing/", "/checkout/", "/cart/"],
  },
  {
    id: "admin",
    label: "관리자/내부 경로 차단",
    description: "운영 콘솔과 사내용 도구",
    paths: ["/admin/", "/internal/"],
  },
  {
    id: "privateData",
    label: "개인정보 경로 차단",
    description: "사용자 데이터와 민감 정보",
    paths: ["/user-data/"],
  },
  {
    id: "privateApi",
    label: "비공개 API 차단",
    description: "내부 API 및 비공개 엔드포인트",
    paths: ["/api/private/"],
  },
  {
    id: "draft",
    label: "초안/스테이징 차단",
    description: "배포 전 검수용 콘텐츠",
    paths: ["/draft/", "/staging/"],
  },
  {
    id: "structuredFiles",
    label: "구조화 파일 차단",
    description: "민감 JSON/XML 파일",
    paths: ["/*.json$", "/*.xml$"],
  },
];

export const agentOptions = [
  {
    id: "gptbot",
    label: "OpenAI / ChatGPT",
    userAgent: "GPTBot",
    mode: "curated",
    allowPathIds: ["blog", "docs", "help"],
  },
  {
    id: "claudebot",
    label: "Anthropic / Claude",
    userAgent: "ClaudeBot",
    mode: "curated",
    allowPathIds: ["blog", "docs", "help"],
  },
  {
    id: "googleExtended",
    label: "Google / Gemini",
    userAgent: "Google-Extended",
    mode: "curated",
    allowPathIds: ["blog", "docs"],
  },
  {
    id: "facebookBot",
    label: "Meta AI",
    userAgent: "FacebookBot",
    mode: "block",
    allowPathIds: [],
  },
  {
    id: "ccbot",
    label: "Common Crawl",
    userAgent: "CCBot",
    mode: "block",
    allowPathIds: [],
  },
  {
    id: "omgili",
    label: "Omgili",
    userAgent: "omgili",
    mode: "block",
    allowPathIds: [],
  },
  {
    id: "omgilibot",
    label: "Omgilibot",
    userAgent: "omgilibot",
    mode: "block",
    allowPathIds: [],
  },
];

export const permittedUseOptions = [
  {
    id: "indexing",
    label: "검색과 Q&A를 위한 인덱싱/검색",
    line: "Indexing and retrieval for search and Q&A",
  },
  {
    id: "summaries",
    label: "공개 문서와 블로그 요약",
    line: "Summarization of public documentation and blog content",
  },
  {
    id: "research",
    label: "비상업적 연구 및 평가",
    line: "Non-commercial research and evaluation",
  },
  {
    id: "attribution",
    label: "출처를 포함한 발췌 표시",
    line: "Displaying excerpts with attribution to {{COMPANY_NAME}}",
  },
];

export const prohibitedUseOptions = [
  {
    id: "training",
    label: "모델 학습 또는 파인튜닝 금지",
    line: "Model training or fine-tuning on any content from this site",
  },
  {
    id: "redistribution",
    label: "무단 복제 및 재배포 금지",
    line: "Reproduction or redistribution without permission",
  },
  {
    id: "bulkScraping",
    label: "대량 스크래핑 금지",
    line: "Automated bulk scraping beyond Crawl-Delay",
  },
  {
    id: "sensitiveContent",
    label: "PII 및 세션 데이터 처리 금지",
    line: "Processing of any user-generated content, PII, or session data",
  },
  {
    id: "disallowedPaths",
    label: "차단 경로의 콘텐츠 사용 금지",
    line: "Any use of content from disallowed paths",
  },
];

export const checklistCategories = [
  {
    category: "기본 헤더 & 메타",
    items: [
      { id: "c1", label: "SITE_URL이 실제 도메인으로 교체되었는지 확인" },
      { id: "c2", label: "VERSION에 현재 버전 번호를 적었는지 확인" },
      { id: "c3", label: "LAST_UPDATED가 YYYY-MM-DD 형식인지 확인" },
      { id: "c4", label: "MAINTAINER_EMAIL이 실제 연락처인지 확인" },
      { id: "c5", label: "COMPANY_NAME이 공식 명칭인지 확인" },
    ],
  },
  {
    category: "Allow / Disallow 경로",
    items: [
      { id: "p1", label: "공개 콘텐츠 경로만 Allow에 포함했는지 확인" },
      { id: "p2", label: "회원 전용 경로를 Disallow 처리했는지 확인" },
      { id: "p3", label: "결제/주문 경로를 Disallow 처리했는지 확인" },
      { id: "p4", label: "관리자/내부 경로를 Disallow 처리했는지 확인" },
      { id: "p5", label: "개인정보 관련 경로를 Disallow 처리했는지 확인" },
      { id: "p6", label: "비공개 API 경로를 Disallow 처리했는지 확인" },
      { id: "p7", label: "초안/스테이징 경로를 Disallow 처리했는지 확인" },
      { id: "p8", label: "Crawl-Delay 설정을 검토했는지 확인" },
    ],
  },
  {
    category: "AI 에이전트 설정",
    items: [
      { id: "a1", label: "GPTBot 규칙을 명시했는지 확인" },
      { id: "a2", label: "ClaudeBot 규칙을 명시했는지 확인" },
      { id: "a3", label: "Google-Extended 규칙을 명시했는지 확인" },
      { id: "a4", label: "CCBot 정책을 결정했는지 확인" },
      { id: "a5", label: "FacebookBot 정책을 결정했는지 확인" },
      { id: "a6", label: "와일드카드 기본 규칙이 최종 방어선인지 확인" },
    ],
  },
  {
    category: "Sitemap",
    items: [
      { id: "s1", label: "Sitemap URL이 실제 접근 가능한지 확인" },
      { id: "s2", label: "robots.txt의 Sitemap과 충돌 없는지 확인" },
      { id: "s3", label: "섹션별 sitemap이 있다면 추가했는지 확인" },
    ],
  },
  {
    category: "Use Policy 문장",
    items: [
      { id: "u1", label: "허용 용도를 충분히 명시했는지 확인" },
      { id: "u2", label: "금지 용도를 명확히 적었는지 확인" },
      { id: "u3", label: "출처 표기 요청 여부를 반영했는지 확인" },
      { id: "u4", label: "라이선스 문의 연락처를 포함했는지 확인" },
    ],
  },
  {
    category: "최종 검증",
    items: [
      { id: "v1", label: "배포 후 `/ai.txt`에 직접 접속해 출력 확인" },
      { id: "v2", label: "robots.txt와 모순이 없는지 교차 검토" },
      { id: "v3", label: "UTF-8 인코딩으로 저장되는지 확인" },
      { id: "v4", label: "치환되지 않은 placeholder가 없는지 검사" },
      { id: "v5", label: "Last-Updated와 변경 이력을 함께 기록" },
    ],
  },
];

export function createInitialSettings() {
  return {
    publicPaths: {
      blog: true,
      docs: true,
      help: true,
      news: false,
    },
    disallowGroups: {
      members: true,
      commerce: true,
      admin: true,
      privateData: true,
      privateApi: true,
      draft: true,
      structuredFiles: true,
    },
    agents: {
      gptbot: true,
      claudebot: true,
      googleExtended: true,
      facebookBot: true,
      ccbot: true,
      omgili: true,
      omgilibot: true,
    },
    permittedUses: {
      indexing: true,
      summaries: true,
      research: true,
      attribution: true,
    },
    prohibitedUses: {
      training: true,
      redistribution: true,
      bulkScraping: true,
      sensitiveContent: true,
      disallowedPaths: true,
    },
  };
}
