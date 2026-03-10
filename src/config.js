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
