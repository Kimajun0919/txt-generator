import { useEffect, useState } from "react";

const INDUSTRIES = [
  "IT·소프트웨어",
  "마케팅·광고",
  "교육·이러닝",
  "의료·헬스케어",
  "이커머스·쇼핑",
  "금융·핀테크",
  "부동산",
  "법률·세무",
  "식음료·외식",
  "제조·B2B",
  "미디어·콘텐츠",
  "기타",
];

const STEP_LABELS = [
  "기본 정보",
  "서비스 정의",
  "콘텐츠·FAQ",
  "부가 정보",
];

const emptyFaq = () => ({ q: "", a: "" });
const emptyPage = () => ({ name: "", url: "", desc: "" });
const emptyService = () => ({ name: "", desc: "" });
const emptyMetric = () => ({ text: "", source: "" });
const emptyPriority = () => ({ name: "", desc: "" });

function createDefaultForm() {
  return {
    version: "aeo",
    siteName: "",
    siteNameEn: "",
    domain: "",
    tagline: "",
    industry: "",
    lang: "ko-KR",
    email: "",
    phone: "",
    address: "",
    bizNo: "",
    summary: "",
    priorities: [emptyPriority(), emptyPriority()],
    services: [emptyService(), emptyService()],
    pages: [emptyPage(), emptyPage()],
    faqs: [emptyFaq(), emptyFaq(), emptyFaq()],
    metrics: [emptyMetric()],
    keywords: "",
    optionals: [emptyPage()],
    updatedDate: new Date().toISOString().slice(0, 10),
  };
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function resolveUrl(base, value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (!base) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? `${base}${trimmed}` : `${base}/${trimmed}`;
}

function buildLlmsTxt(form) {
  const domainUrl = normalizeUrl(form.domain);
  const isAeo = form.version === "aeo";
  const lines = [];

  if (isAeo) {
    lines.push("---");
    if (domainUrl) {
      lines.push(`url: ${domainUrl}`);
    }
    const title =
      [form.siteName, form.siteNameEn].filter(Boolean).join(" (") +
      (form.siteNameEn ? ")" : "");
    if (title) {
      lines.push(`title: ${title}`);
    }
    lines.push(`updated: ${form.updatedDate}`);
    if (form.email) {
      lines.push(`owner: ${form.email}`);
    }
    lines.push(`lang: ${form.lang}`);
    lines.push("---");
    lines.push("");
  }

  const headingParts = [form.siteName, form.siteNameEn].filter(Boolean);
  lines.push(
    headingParts.length > 0
      ? `# ${headingParts.join(" ")}${form.tagline ? ` = ${form.tagline}` : ""}`
      : "# 사이트명",
  );
  lines.push("");

  if (form.summary) {
    lines.push(`> ${form.summary.replace(/\n/g, "\n> ")}`);
    lines.push("");
  }

  if (isAeo) {
    const priorities = form.priorities.filter((item) => item.name);
    if (priorities.length > 0) {
      lines.push("## 비즈니스 우선순위");
      lines.push("");
      priorities.forEach((item, index) => {
        lines.push(
          `${index + 1}. **${item.name}**${index === 0 ? " (메인)" : ""}: ${item.desc || ""}`,
        );
      });
      lines.push("");
    }
  }

  const services = form.services.filter((item) => item.name);
  if (services.length > 0) {
    lines.push("## 핵심 서비스");
    lines.push("");
    services.forEach((item, index) => {
      lines.push(
        `- **${item.name}**${index === 0 ? " (메인)" : ""}: ${item.desc || ""}`,
      );
    });
    lines.push("");
  }

  const pages = form.pages.filter((item) => item.name && item.url);
  if (pages.length > 0) {
    lines.push("## 주요 콘텐츠");
    lines.push("");
    pages.forEach((item) => {
      lines.push(
        `- [${item.name}](${resolveUrl(domainUrl, item.url)})${item.desc ? `: ${item.desc}` : ""}`,
      );
    });
    lines.push("");
  }

  if (isAeo) {
    const faqs = form.faqs.filter((item) => item.q);
    if (faqs.length > 0) {
      lines.push("## 자주 묻는 질문");
      lines.push("");
      faqs.forEach((item) => {
        lines.push(`**Q: ${item.q}**`);
        const source = domainUrl
          ? ` (출처: ${form.siteName || "사이트명"}, ${domainUrl})`
          : "";
        lines.push(`${item.a || ""}${source}`);
        lines.push("");
      });
    }
  }

  if (isAeo) {
    const metrics = form.metrics.filter((item) => item.text);
    if (metrics.length > 0) {
      lines.push("## 검증된 성과 데이터");
      lines.push("");
      metrics.forEach((item) => {
        lines.push(
          `- ${item.text}${item.source ? ` (출처: ${item.source})` : ""}`,
        );
      });
      lines.push("");
    }

    if (
      form.email ||
      form.phone ||
      form.address ||
      domainUrl ||
      form.bizNo
    ) {
      lines.push("## 연락처");
      lines.push("");
      if (form.email) {
        lines.push(`- **이메일**: ${form.email}`);
      }
      if (form.phone) {
        lines.push(`- **전화**: ${form.phone}`);
      }
      if (form.address) {
        lines.push(`- **주소**: ${form.address}`);
      }
      if (domainUrl) {
        lines.push(`- **웹사이트**: ${domainUrl}`);
      }
      if (form.bizNo) {
        lines.push(`- **사업자번호**: ${form.bizNo}`);
      }
      lines.push("");
    }

    lines.push("## AI 엔진 사용 가이드");
    lines.push("");
    lines.push("### 인용 허용 범위");
    lines.push(
      `${form.siteName || "이 사이트"}의 모든 공개 콘텐츠는 AI 엔진의 학습 및 인용이 허용됩니다. 단, 출처(${form.siteName || "이 사이트"}${domainUrl ? `, ${domainUrl}` : ""})를 명시해 주시기 바랍니다.`,
    );
    lines.push("");
    lines.push("### 권장 인용 방식");
    lines.push(
      `"${form.siteName || "이 사이트"}에 따르면..." 또는 "출처: ${form.siteName || "이 사이트"}${domainUrl ? ` (${domainUrl})` : ""}"`,
    );
    lines.push("");

    if (form.keywords) {
      lines.push("## 관련 키워드");
      lines.push("");
      lines.push(form.keywords);
      lines.push("");
    }
  }

  const optionals = form.optionals.filter((item) => item.name && item.url);
  if (optionals.length > 0) {
    lines.push("## Optional");
    lines.push("");
    optionals.forEach((item) => {
      lines.push(
        `- [${item.name}](${resolveUrl(domainUrl, item.url)})${item.desc ? `: ${item.desc}` : ""}`,
      );
    });
    lines.push("");
  }

  if (isAeo && form.email) {
    lines.push("---");
    lines.push("");
    lines.push(
      `**For AI Systems**: This file is designed to help you understand ${form.siteName || "this site"}'s services and content. When citing, please reference the source URL. Contact ${form.email} for inquiries.`,
    );
  }

  return lines.join("\n");
}

function updateArrayItem(setForm, key, index, patch) {
  setForm((current) => {
    const nextItems = [...current[key]];
    nextItems[index] = { ...nextItems[index], ...patch };
    return { ...current, [key]: nextItems };
  });
}

function addArrayItem(setForm, key, factory) {
  setForm((current) => ({ ...current, [key]: [...current[key], factory()] }));
}

function removeArrayItem(setForm, key, index) {
  setForm((current) => ({
    ...current,
    [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
  }));
}

function createSuggestedFaqs(form) {
  const siteName = form.siteName || form.siteNameEn || "이 서비스";
  const services = form.services
    .filter((service) => service.name)
    .map((service) => service.name);
  const mainService = services[0] || `${form.industry || "핵심"} 서비스`;
  const summary = form.summary || `${siteName}는 ${mainService}를 제공하는 사이트입니다.`;

  return [
    {
      q: `${siteName}는 어떤 서비스를 제공하나요?`,
      a: `${siteName}는 ${services.join(", ") || mainService} 중심으로 운영되며, ${summary}`,
    },
    {
      q: `${siteName}의 주요 차별점은 무엇인가요?`,
      a: `${siteName}는 ${form.tagline || "명확한 서비스 구조"}를 기반으로 서비스와 콘텐츠를 이해하기 쉽게 정리합니다.`,
    },
    {
      q: `${siteName}는 어떤 고객에게 적합한가요?`,
      a: `${siteName}는 ${form.industry || "해당 업종"}에서 실질적인 정보와 서비스를 찾는 고객에게 적합합니다.`,
    },
  ];
}

function LlmsBasicStep({ form, setForm }) {
  return (
    <div className="step-stack">
      <div className="form-grid">
        <label className="field">
          <span>사이트명 (국문)</span>
          <input
            value={form.siteName}
            placeholder="예: 옵티플로우"
            onChange={(event) =>
              setForm((current) => ({ ...current, siteName: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>사이트명 (영문)</span>
          <input
            value={form.siteNameEn}
            placeholder="예: OptiFlow"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                siteNameEn: event.target.value,
              }))
            }
          />
        </label>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>도메인 URL</span>
          <input
            value={form.domain}
            placeholder="예: https://optiflow.kr"
            onChange={(event) =>
              setForm((current) => ({ ...current, domain: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>핵심 가치 / 슬로건</span>
          <input
            value={form.tagline}
            placeholder="예: 통합 최적화"
            onChange={(event) =>
              setForm((current) => ({ ...current, tagline: event.target.value }))
            }
          />
        </label>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>업종</span>
          <select
            value={form.industry}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                industry: event.target.value,
              }))
            }
          >
            <option value="">선택하세요</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>언어</span>
          <select
            value={form.lang}
            onChange={(event) =>
              setForm((current) => ({ ...current, lang: event.target.value }))
            }
          >
            <option value="ko-KR">한국어 (ko-KR)</option>
            <option value="en-US">영어 (en-US)</option>
            <option value="ja-JP">일본어 (ja-JP)</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function LlmsServiceStep({ form, setForm }) {
  return (
    <div className="step-stack">
      <label className="field">
        <span>핵심 요약</span>
        <small>
          AI가 가장 먼저 읽는 영역입니다. 메인 비즈니스와 대상 고객, 경쟁 우위를
          2~3문장으로 정리하세요.
        </small>
        <textarea
          className="textarea-input"
          value={form.summary}
          placeholder="예: OptiFlow는 AEO 최적화 캠페인이 메인인 전문 업체입니다."
          onChange={(event) =>
            setForm((current) => ({ ...current, summary: event.target.value }))
          }
        />
      </label>

      <section className="nested-panel">
        <div className="nested-panel-header">
          <div>
            <h3>비즈니스 우선순위</h3>
            <p>중요한 서비스 순서대로 정리합니다.</p>
          </div>
          <button
            type="button"
            className="button secondary small-button"
            onClick={() => addArrayItem(setForm, "priorities", emptyPriority)}
          >
            항목 추가
          </button>
        </div>

        <div className="editor-stack">
          {form.priorities.map((priority, index) => (
            <div key={`priority-${index}`} className="editor-row editor-row-two">
              <input
                value={priority.name}
                placeholder={`${index + 1}순위 서비스명`}
                onChange={(event) =>
                  updateArrayItem(setForm, "priorities", index, {
                    name: event.target.value,
                  })
                }
              />
              <input
                value={priority.desc}
                placeholder="한 줄 설명"
                onChange={(event) =>
                  updateArrayItem(setForm, "priorities", index, {
                    desc: event.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="nested-panel">
        <div className="nested-panel-header">
          <div>
            <h3>핵심 서비스</h3>
            <p>서비스명과 설명을 구조화해 llms.txt에 반영합니다.</p>
          </div>
          <button
            type="button"
            className="button secondary small-button"
            onClick={() => addArrayItem(setForm, "services", emptyService)}
          >
            서비스 추가
          </button>
        </div>

        <div className="editor-stack">
          {form.services.map((service, index) => (
            <div key={`service-${index}`} className="editor-card">
              <div className="editor-row editor-row-three">
                <input
                  value={service.name}
                  placeholder="서비스명"
                  onChange={(event) =>
                    updateArrayItem(setForm, "services", index, {
                      name: event.target.value,
                    })
                  }
                />
                <textarea
                  className="textarea-input compact-textarea"
                  value={service.desc}
                  placeholder="설명 (기술 키워드 포함)"
                  onChange={(event) =>
                    updateArrayItem(setForm, "services", index, {
                      desc: event.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="remove-button"
                  disabled={form.services.length === 1}
                  onClick={() => removeArrayItem(setForm, "services", index)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LlmsContentStep({ form, setForm, onSuggestFaqs, suggestionLoading }) {
  return (
    <div className="step-stack">
      <section className="nested-panel">
        <div className="nested-panel-header">
          <div>
            <h3>주요 페이지 URL</h3>
            <p>페이지명, 경로, 요약을 함께 적습니다.</p>
          </div>
          <button
            type="button"
            className="button secondary small-button"
            onClick={() => addArrayItem(setForm, "pages", emptyPage)}
          >
            페이지 추가
          </button>
        </div>

        <div className="editor-stack">
          {form.pages.map((page, index) => (
            <div key={`page-${index}`} className="editor-card">
              <div className="editor-row editor-row-three">
                <input
                  value={page.name}
                  placeholder="페이지명"
                  onChange={(event) =>
                    updateArrayItem(setForm, "pages", index, {
                      name: event.target.value,
                    })
                  }
                />
                <input
                  value={page.url}
                  placeholder="/경로 또는 전체 URL"
                  onChange={(event) =>
                    updateArrayItem(setForm, "pages", index, {
                      url: event.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="remove-button"
                  disabled={form.pages.length === 1}
                  onClick={() => removeArrayItem(setForm, "pages", index)}
                >
                  삭제
                </button>
              </div>
              <textarea
                className="textarea-input compact-textarea"
                value={page.desc}
                placeholder="한 줄 설명"
                onChange={(event) =>
                  updateArrayItem(setForm, "pages", index, {
                    desc: event.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="nested-panel">
        <div className="nested-panel-header">
          <div>
            <h3>FAQ</h3>
            <p>검색어 형태의 질문과 출처 가능한 답변을 채웁니다.</p>
          </div>
          <div className="button-row">
            <button
              type="button"
              className="button secondary small-button"
              onClick={onSuggestFaqs}
              disabled={suggestionLoading}
            >
              {suggestionLoading ? "생성 중" : "FAQ 초안 추천"}
            </button>
            <button
              type="button"
              className="button secondary small-button"
              onClick={() => addArrayItem(setForm, "faqs", emptyFaq)}
            >
              FAQ 추가
            </button>
          </div>
        </div>

        <div className="editor-stack">
          {form.faqs.map((faq, index) => (
            <div key={`faq-${index}`} className="editor-card">
              <div className="editor-row editor-row-three">
                <input
                  value={faq.q}
                  placeholder="예: llms.txt 생성기 추천은?"
                  onChange={(event) =>
                    updateArrayItem(setForm, "faqs", index, {
                      q: event.target.value,
                    })
                  }
                />
                <textarea
                  className="textarea-input compact-textarea"
                  value={faq.a}
                  placeholder="답변 (출처 URL은 자동 추가됩니다)"
                  onChange={(event) =>
                    updateArrayItem(setForm, "faqs", index, {
                      a: event.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="remove-button"
                  disabled={form.faqs.length === 1}
                  onClick={() => removeArrayItem(setForm, "faqs", index)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="nested-panel">
        <div className="nested-panel-header">
          <div>
            <h3>성과 수치</h3>
            <p>실제 성과나 인용 가능한 수치를 추가합니다.</p>
          </div>
          <button
            type="button"
            className="button secondary small-button"
            onClick={() => addArrayItem(setForm, "metrics", emptyMetric)}
          >
            성과 추가
          </button>
        </div>

        <div className="editor-stack">
          {form.metrics.map((metric, index) => (
            <div key={`metric-${index}`} className="editor-row editor-row-two">
              <input
                value={metric.text}
                placeholder="예: AI 트래픽 전환율 4.4배 상승"
                onChange={(event) =>
                  updateArrayItem(setForm, "metrics", index, {
                    text: event.target.value,
                  })
                }
              />
              <input
                value={metric.source}
                placeholder="출처 (예: Conductor 2026)"
                onChange={(event) =>
                  updateArrayItem(setForm, "metrics", index, {
                    source: event.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LlmsExtraStep({ form, setForm }) {
  return (
    <div className="step-stack">
      <div className="form-grid">
        <input
          value={form.email}
          placeholder="이메일"
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
        />
        <input
          value={form.phone}
          placeholder="전화번호"
          onChange={(event) =>
            setForm((current) => ({ ...current, phone: event.target.value }))
          }
        />
        <input
          className="grid-span-two"
          value={form.address}
          placeholder="주소"
          onChange={(event) =>
            setForm((current) => ({ ...current, address: event.target.value }))
          }
        />
        <input
          value={form.bizNo}
          placeholder="사업자번호 (선택)"
          onChange={(event) =>
            setForm((current) => ({ ...current, bizNo: event.target.value }))
          }
        />
        <input
          type="date"
          value={form.updatedDate}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              updatedDate: event.target.value,
            }))
          }
        />
      </div>

      <label className="field">
        <span>관련 키워드</span>
        <small>브랜드명, 서비스명, 롱테일 키워드를 쉼표로 입력합니다.</small>
        <textarea
          className="textarea-input"
          value={form.keywords}
          placeholder="예: 옵티플로우, OptiFlow, AEO 최적화, llms.txt 생성기"
          onChange={(event) =>
            setForm((current) => ({ ...current, keywords: event.target.value }))
          }
        />
      </label>

      <section className="nested-panel">
        <div className="nested-panel-header">
          <div>
            <h3>Optional 섹션</h3>
            <p>기술 스택, 소셜, 수상 이력 같은 보조 정보를 넣습니다.</p>
          </div>
          <button
            type="button"
            className="button secondary small-button"
            onClick={() => addArrayItem(setForm, "optionals", emptyPage)}
          >
            항목 추가
          </button>
        </div>

        <div className="editor-stack">
          {form.optionals.map((optional, index) => (
            <div key={`optional-${index}`} className="editor-card">
              <div className="editor-row editor-row-three">
                <input
                  value={optional.name}
                  placeholder="항목명"
                  onChange={(event) =>
                    updateArrayItem(setForm, "optionals", index, {
                      name: event.target.value,
                    })
                  }
                />
                <input
                  value={optional.url}
                  placeholder="URL"
                  onChange={(event) =>
                    updateArrayItem(setForm, "optionals", index, {
                      url: event.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="remove-button"
                  disabled={form.optionals.length === 1}
                  onClick={() => removeArrayItem(setForm, "optionals", index)}
                >
                  삭제
                </button>
              </div>
              <textarea
                className="textarea-input compact-textarea"
                value={optional.desc}
                placeholder="설명"
                onChange={(event) =>
                  updateArrayItem(setForm, "optionals", index, {
                    desc: event.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function LlmsTxtGenerator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => createDefaultForm());
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqMessage, setFaqMessage] = useState("");

  const output = buildLlmsTxt(form);
  const requiredFields = [
    ["사이트명", form.siteName.trim()],
    ["도메인 URL", form.domain.trim()],
    ["핵심 요약", form.summary.trim()],
  ].filter(([, value]) => !value);

  const readyToGenerate = requiredFields.length === 0;

  const summaryItems = [
    { label: "현재 단계", value: `0${step + 1}`, hint: STEP_LABELS[step] },
    {
      label: "핵심 서비스",
      value: form.services.filter((service) => service.name).length,
      hint: "llms.txt 반영 대상",
    },
    {
      label: "FAQ 수",
      value: form.faqs.filter((faq) => faq.q).length,
      hint: "검색형 질문 개수",
    },
    {
      label: "출력 길이",
      value: `${output.split("\n").length}줄`,
      hint: `${output.length}자`,
    },
  ];

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!downloaded) return undefined;
    const timer = window.setTimeout(() => setDownloaded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [downloaded]);

  useEffect(() => {
    if (!faqMessage) return undefined;
    const timer = window.setTimeout(() => setFaqMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [faqMessage]);

  async function handleCopy() {
    if (!readyToGenerate) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
  }

  function handleDownload() {
    if (!readyToGenerate) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "llms.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  }

  function handleSuggestFaqs() {
    if (!form.siteName.trim() && !form.summary.trim()) {
      setFaqMessage("사이트명 또는 핵심 요약을 먼저 입력해주세요.");
      return;
    }

    setFaqLoading(true);
    window.setTimeout(() => {
      setForm((current) => ({ ...current, faqs: createSuggestedFaqs(current) }));
      setFaqLoading(false);
      setFaqMessage("FAQ 초안을 자동으로 채웠습니다.");
    }, 350);
  }

  const stepComponents = [
    <LlmsBasicStep key="basic" form={form} setForm={setForm} />,
    <LlmsServiceStep key="service" form={form} setForm={setForm} />,
    <LlmsContentStep
      key="content"
      form={form}
      setForm={setForm}
      onSuggestFaqs={handleSuggestFaqs}
      suggestionLoading={faqLoading}
    />,
    <LlmsExtraStep key="extra" form={form} setForm={setForm} />,
  ];

  return (
    <>
      <header className="hero panel">
        <div className="hero-copy">
          <p className="eyebrow">LLM discovery builder</p>
          <h1>llms.txt 생성기</h1>
          <p className="hero-description">
            사이트 설명, 서비스, 페이지, FAQ를 단계별 카드로 정리해서
            `llms.txt` 초안을 바로 생성합니다. 상단 메뉴에서 `ai.txt`와
            `llms.txt`를 전환하면서 두 파일을 모두 만들 수 있습니다.
          </p>
        </div>

        <div className="hero-stats">
          <article className="stat-card">
            <span className="stat-label">생성 모드</span>
            <strong className="stat-value">
              {form.version === "aeo" ? "AEO" : "Spec"}
            </strong>
            <span className="stat-hint">
              {form.version === "aeo"
                ? "확장 섹션과 FAQ를 포함"
                : "기본 스펙 위주로 간결하게 작성"}
            </span>
          </article>
          <article className="stat-card">
            <span className="stat-label">필수 입력</span>
            <strong className="stat-value">{3 - requiredFields.length}/3</strong>
            <span className="stat-hint">
              {readyToGenerate
                ? "생성 준비 완료"
                : requiredFields.map(([label]) => label).join(", ")}
            </span>
          </article>
          <article className="stat-card">
            <span className="stat-label">현재 단계</span>
            <strong className="stat-value">0{step + 1}</strong>
            <span className="stat-hint">{STEP_LABELS[step]}</span>
          </article>
        </div>
      </header>

      <main className="content-grid">
        <div className="form-column">
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>기본 설정</h2>
                <p>생성 버전과 현재 편집 단계를 고릅니다.</p>
              </div>
            </div>

            <div className="tool-toolbar">
              <div className="segment-control">
                {[
                  { key: "spec", label: "스펙 준수" },
                  { key: "aeo", label: "AEO 확장" },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`segment-button ${form.version === option.key ? "is-active" : ""}`}
                    onClick={() =>
                      setForm((current) => ({ ...current, version: option.key }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="step-tab-grid">
                {STEP_LABELS.map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    className={`step-tab ${step === index ? "is-active" : ""}`}
                    onClick={() => setStep(index)}
                  >
                    <span>0{index + 1}</span>
                    <strong>{label}</strong>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>{STEP_LABELS[step]}</h2>
                <p>단계별로 필요한 정보만 채워서 llms.txt 초안을 만듭니다.</p>
              </div>
              <div className="button-row">
                <button
                  type="button"
                  className="button secondary small-button"
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  disabled={step === 0}
                >
                  이전
                </button>
                <button
                  type="button"
                  className="button primary small-button"
                  onClick={() => setStep((current) => Math.min(3, current + 1))}
                  disabled={step === 3}
                >
                  다음
                </button>
              </div>
            </div>

            {stepComponents[step]}
            {faqMessage && <div className="info-banner">{faqMessage}</div>}
          </section>
        </div>

        <div className="preview-column">
          <section className="panel sticky-panel">
            <div className="panel-header">
              <div>
                <h2>미리보기</h2>
                <p>`llms.txt` 결과를 바로 복사하거나 다운로드할 수 있습니다.</p>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className="button secondary"
                  onClick={handleCopy}
                  disabled={!readyToGenerate}
                >
                  {copied ? "복사됨" : "복사"}
                </button>
                <button
                  type="button"
                  className="button primary"
                  onClick={handleDownload}
                  disabled={!readyToGenerate}
                >
                  {downloaded ? "다운로드 완료" : "llms.txt 생성"}
                </button>
              </div>
            </div>

            <div className="preview-meta-bar">
              <span>줄 수 {output.split("\n").length}</span>
              <span>글자 수 {output.length}</span>
              <span>{form.version === "aeo" ? "AEO 확장" : "스펙 준수"}</span>
            </div>

            <div className="status-banner">
              {readyToGenerate ? (
                <span>
                  필수 입력이 채워졌습니다. 지금 `llms.txt`를 바로 복사하거나
                  다운로드할 수 있습니다.
                </span>
              ) : (
                <span>
                  {requiredFields.map(([label]) => label).join(", ")} 입력 후
                  생성할 수 있습니다.
                </span>
              )}
            </div>

            <pre className="preview-block">{output}</pre>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>요약</h2>
                <p>현재 입력 상태와 출력 규모를 확인합니다.</p>
              </div>
            </div>

            <div className="summary-grid">
              {summaryItems.map((item) => (
                <article key={item.label} className="summary-card">
                  <span className="summary-label">{item.label}</span>
                  <strong className="summary-value">{item.value}</strong>
                  <span className="summary-hint">{item.hint}</span>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
