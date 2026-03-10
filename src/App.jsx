import { useEffect, useState } from "react";
import "./styles.css";
import {
  agentOptions,
  createInitialSettings,
  defaultFormValues,
  disallowGroupOptions,
  permittedUseOptions,
  prohibitedUseOptions,
  publicPathOptions,
} from "./config";
import { generateAiTxt } from "./generator";

const requiredFieldLabels = {
  siteUrl: "사이트 URL",
  version: "버전",
  lastUpdated: "업데이트 날짜",
  maintainerEmail: "담당자 이메일",
  companyName: "회사명",
};

const includeOptions = [
  { value: "true", label: "포함" },
  { value: "false", label: "제외" },
];

const disallowOptions = [
  { value: "true", label: "차단" },
  { value: "false", label: "사용 안 함" },
];

const agentPolicyOptions = [
  { value: "true", label: "기본 정책 적용" },
  { value: "false", label: "규칙 제외" },
];

function countEnabledValues(group) {
  return Object.values(group).filter(Boolean).length;
}

function countEnabledSettings(settings) {
  return [
    ...Object.values(settings.publicPaths),
    ...Object.values(settings.disallowGroups),
    ...Object.values(settings.agents),
    ...Object.values(settings.permittedUses),
    ...Object.values(settings.prohibitedUses),
  ].filter(Boolean).length;
}

function SelectCard({
  title,
  description,
  controlLabel,
  value,
  options,
  onChange,
  chips = [],
}) {
  return (
    <article className={`setting-card ${value === "true" ? "is-active" : ""}`}>
      <div className="setting-card-copy">
        <strong>{title}</strong>
        <span>{description}</span>
        {chips.length > 0 && (
          <div className="chip-list">
            {chips.map((chip) => (
              <span key={chip} className="path-chip">
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      <label className="select-control">
        <span>{controlLabel}</span>
        <select
          className="select-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </article>
  );
}

export default function App() {
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [settings, setSettings] = useState(() => createInitialSettings());
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const missingFields = Object.entries(requiredFieldLabels)
    .filter(([field]) => !formValues[field].trim())
    .map(([, label]) => label);

  const readyToGenerate = missingFields.length === 0;
  const generatedText = generateAiTxt(formValues, settings);
  const enabledRuleCount = countEnabledSettings(settings);

  const summaryItems = [
    {
      label: "공개 경로",
      value: `${countEnabledValues(settings.publicPaths)}/${publicPathOptions.length}`,
      hint: "Allow 대상 섹션",
    },
    {
      label: "차단 프리셋",
      value: `${countEnabledValues(settings.disallowGroups)}/${disallowGroupOptions.length}`,
      hint: "기본 Disallow 묶음",
    },
    {
      label: "봇 오버라이드",
      value: `${countEnabledValues(settings.agents)}/${agentOptions.length}`,
      hint: "개별 크롤러 규칙",
    },
    {
      label: "Use Policy",
      value: `${countEnabledValues(settings.permittedUses) + countEnabledValues(settings.prohibitedUses)}`,
      hint: "문장 포함 수",
    },
  ];

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!downloaded) {
      return undefined;
    }

    const timer = window.setTimeout(() => setDownloaded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [downloaded]);

  function updateField(field, value) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateBooleanSetting(group, id, value) {
    setSettings((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [id]: value === "true",
      },
    }));
  }

  async function handleCopy() {
    if (!readyToGenerate) {
      return;
    }

    await navigator.clipboard.writeText(generatedText);
    setCopied(true);
  }

  function handleDownload() {
    if (!readyToGenerate) {
      return;
    }

    const blob = new Blob([generatedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ai.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  }

  return (
    <div className="page-shell">
      <header className="hero panel">
        <div className="hero-copy">
          <p className="eyebrow">AI policy builder</p>
          <h1>ai.txt 생성기</h1>
          <p className="hero-description">
            체크리스트를 따로 누르지 않고, 필요한 정책을 선택 박스로 바로
            고르면 `ai.txt` 초안이 즉시 갱신됩니다. 설정 한 번으로 복사와
            다운로드까지 끝낼 수 있게 정리했습니다.
          </p>
        </div>

        <div className="hero-stats">
          <article className="stat-card">
            <span className="stat-label">필수 입력</span>
            <strong className="stat-value">
              {Object.keys(requiredFieldLabels).length - missingFields.length}/
              {Object.keys(requiredFieldLabels).length}
            </strong>
            <span className="stat-hint">
              {missingFields.length === 0
                ? "기본 정보 입력 완료"
                : `${missingFields.join(", ")} 입력 필요`}
            </span>
          </article>

          <article className="stat-card">
            <span className="stat-label">생성 상태</span>
            <strong className="stat-value">
              {readyToGenerate ? "Ready" : "Pending"}
            </strong>
            <span className="stat-hint">
              {readyToGenerate
                ? "지금 바로 복사하거나 다운로드 가능"
                : "필수 필드를 채우면 즉시 생성 가능"}
            </span>
          </article>

          <article className="stat-card">
            <span className="stat-label">활성 규칙</span>
            <strong className="stat-value">{enabledRuleCount}</strong>
            <span className="stat-hint">
              공개 경로, 차단 경로, 에이전트 정책 포함
            </span>
          </article>
        </div>
      </header>

      <main className="content-grid">
        <div className="form-column">
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>기본 정보</h2>
                <p>필수 메타값과 sitemap 경로를 입력합니다.</p>
              </div>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>사이트 URL</span>
                <input
                  value={formValues.siteUrl}
                  onChange={(event) => updateField("siteUrl", event.target.value)}
                  placeholder="https://yourdomain.com"
                />
              </label>

              <label className="field">
                <span>버전</span>
                <input
                  value={formValues.version}
                  onChange={(event) => updateField("version", event.target.value)}
                  placeholder="1.0.0"
                />
              </label>

              <label className="field">
                <span>마지막 업데이트</span>
                <input
                  type="date"
                  value={formValues.lastUpdated}
                  onChange={(event) =>
                    updateField("lastUpdated", event.target.value)
                  }
                />
              </label>

              <label className="field">
                <span>담당자 이메일</span>
                <input
                  value={formValues.maintainerEmail}
                  onChange={(event) =>
                    updateField("maintainerEmail", event.target.value)
                  }
                  placeholder="policy@company.com"
                />
              </label>

              <label className="field">
                <span>회사명</span>
                <input
                  value={formValues.companyName}
                  onChange={(event) =>
                    updateField("companyName", event.target.value)
                  }
                  placeholder="Your Company"
                />
              </label>

              <label className="field">
                <span>Crawl-Delay</span>
                <input
                  value={formValues.crawlDelay}
                  onChange={(event) =>
                    updateField("crawlDelay", event.target.value)
                  }
                  placeholder="5"
                />
              </label>
            </div>

            <label className="field field-full">
              <span>추가 sitemap 경로</span>
              <input
                value={formValues.extraSitemaps}
                onChange={(event) =>
                  updateField("extraSitemaps", event.target.value)
                }
                placeholder="/sitemap-blog.xml, /sitemap-news.xml"
              />
              <small>쉼표 또는 줄바꿈으로 여러 경로를 입력할 수 있습니다.</small>
            </label>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>공개 경로</h2>
                <p>AI 에이전트에 보여줄 공개 섹션만 골라서 포함합니다.</p>
              </div>
            </div>

            <div className="card-grid">
              {publicPathOptions.map((option) => (
                <SelectCard
                  key={option.id}
                  title={option.label}
                  description={option.description}
                  controlLabel="공개 여부"
                  value={String(settings.publicPaths[option.id])}
                  options={includeOptions}
                  onChange={(value) =>
                    updateBooleanSetting("publicPaths", option.id, value)
                  }
                />
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>차단 경로 프리셋</h2>
                <p>민감한 경로를 기본 Disallow 규칙에 포함합니다.</p>
              </div>
            </div>

            <div className="card-grid">
              {disallowGroupOptions.map((group) => (
                <SelectCard
                  key={group.id}
                  title={group.label}
                  description={group.description}
                  chips={group.paths}
                  controlLabel="차단 여부"
                  value={String(settings.disallowGroups[group.id])}
                  options={disallowOptions}
                  onChange={(value) =>
                    updateBooleanSetting("disallowGroups", group.id, value)
                  }
                />
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>AI 에이전트 오버라이드</h2>
                <p>봇마다 기본 정책을 적용할지 바로 선택합니다.</p>
              </div>
            </div>

            <div className="card-grid">
              {agentOptions.map((agent) => {
                const allowedPublicPaths = publicPathOptions
                  .filter((option) => settings.publicPaths[option.id])
                  .filter((option) => agent.allowPathIds.includes(option.id))
                  .map((option) => option.label);

                const description =
                  agent.mode === "block"
                    ? "기본값은 전체 차단입니다."
                    : allowedPublicPaths.length > 0
                      ? `현재 선택된 공개 경로만 허용합니다: ${allowedPublicPaths.join(", ")}`
                      : "허용 경로가 없으면 전체 차단으로 기록됩니다.";

                return (
                  <SelectCard
                    key={agent.id}
                    title={agent.userAgent}
                    description={`${agent.label} · ${description}`}
                    controlLabel="정책 적용"
                    value={String(settings.agents[agent.id])}
                    options={agentPolicyOptions}
                    onChange={(value) =>
                      updateBooleanSetting("agents", agent.id, value)
                    }
                  />
                );
              })}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Use Policy</h2>
                <p>허용 문장과 금지 문장을 각각 포함 여부로 결정합니다.</p>
              </div>
            </div>

            <div className="policy-grid">
              <div>
                <h3>허용 용도</h3>
                <div className="card-grid compact-grid">
                  {permittedUseOptions.map((option) => (
                    <SelectCard
                      key={option.id}
                      title={option.label}
                      description={option.line}
                      controlLabel="문장 포함"
                      value={String(settings.permittedUses[option.id])}
                      options={includeOptions}
                      onChange={(value) =>
                        updateBooleanSetting("permittedUses", option.id, value)
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3>금지 용도</h3>
                <div className="card-grid compact-grid">
                  {prohibitedUseOptions.map((option) => (
                    <SelectCard
                      key={option.id}
                      title={option.label}
                      description={option.line}
                      controlLabel="문장 포함"
                      value={String(settings.prohibitedUses[option.id])}
                      options={includeOptions}
                      onChange={(value) =>
                        updateBooleanSetting("prohibitedUses", option.id, value)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="preview-column">
          <section className="panel sticky-panel">
            <div className="panel-header">
              <div>
                <h2>미리보기</h2>
                <p>입력값과 선택값이 바뀌면 `ai.txt` 초안이 즉시 갱신됩니다.</p>
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
                  {downloaded ? "다운로드 완료" : "ai.txt 생성"}
                </button>
              </div>
            </div>

            <div className="status-banner">
              {readyToGenerate ? (
                <span>
                  필수 입력이 모두 채워졌습니다. 지금 바로 `ai.txt`를 복사하거나
                  다운로드할 수 있습니다.
                </span>
              ) : (
                <span>{`${missingFields.join(", ")} 입력 후 생성할 수 있습니다.`}</span>
              )}
            </div>

            <pre className="preview-block">{generatedText}</pre>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>설정 요약</h2>
                <p>현재 선택된 항목 수를 빠르게 확인합니다.</p>
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
    </div>
  );
}
