import { useEffect, useState } from "react";
import "./styles.css";
import {
  agentOptions,
  checklistCategories,
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

function countChecklistItems() {
  return checklistCategories.reduce(
    (sum, category) => sum + category.items.length,
    0,
  );
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

export default function App() {
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [settings, setSettings] = useState(() => createInitialSettings());
  const [checklistState, setChecklistState] = useState({});
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const totalChecklistItems = countChecklistItems();
  const checkedChecklistItems = Object.values(checklistState).filter(Boolean)
    .length;
  const checklistProgress = Math.round(
    (checkedChecklistItems / totalChecklistItems) * 100,
  );

  const missingFields = Object.entries(requiredFieldLabels)
    .filter(([field]) => !formValues[field].trim())
    .map(([, label]) => label);

  const readyToGenerate =
    missingFields.length === 0 && checkedChecklistItems === totalChecklistItems;

  const generatedText = generateAiTxt(formValues, settings);
  const enabledRuleCount = countEnabledSettings(settings);

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

  function toggleSetting(group, id) {
    setSettings((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [id]: !current[group][id],
      },
    }));
  }

  function toggleChecklistItem(id) {
    setChecklistState((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  function markAllChecklistItems(nextValue) {
    const updatedState = {};

    checklistCategories.forEach((category) => {
      category.items.forEach((item) => {
        updatedState[item.id] = nextValue;
      });
    });

    setChecklistState(updatedState);
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
            `main` 초안의 템플릿 구조를 정리해서, 체크리스트 확인 후 바로
            `ai.txt`를 만들 수 있게 구성했습니다. 입력값과 옵션은 실시간으로
            미리보기에 반영됩니다.
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
            <span className="stat-label">체크리스트</span>
            <strong className="stat-value">
              {checkedChecklistItems}/{totalChecklistItems}
            </strong>
            <span className="stat-hint">
              {checklistProgress === 100
                ? "출시 전 점검 완료"
                : "배포 전 검수 항목 확인 중"}
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
                <p>AI 에이전트에 노출할 공개 섹션을 선택합니다.</p>
              </div>
            </div>

            <div className="option-grid">
              {publicPathOptions.map((option) => {
                const selected = settings.publicPaths[option.id];

                return (
                  <button
                    type="button"
                    key={option.id}
                    className={`option-card ${selected ? "is-active" : ""}`}
                    onClick={() => toggleSetting("publicPaths", option.id)}
                  >
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>차단 경로 프리셋</h2>
                <p>민감한 경로를 한 번에 Disallow 처리합니다.</p>
              </div>
            </div>

            <div className="stack-list">
              {disallowGroupOptions.map((group) => {
                const selected = settings.disallowGroups[group.id];

                return (
                  <button
                    type="button"
                    key={group.id}
                    className={`row-toggle ${selected ? "is-active" : ""}`}
                    onClick={() => toggleSetting("disallowGroups", group.id)}
                  >
                    <div className="row-copy">
                      <strong>{group.label}</strong>
                      <span>{group.description}</span>
                    </div>
                    <div className="path-list">
                      {group.paths.map((path) => (
                        <span key={path} className="path-chip">
                          {path}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>AI 에이전트 오버라이드</h2>
                <p>크롤러별로 공개 범위를 따로 명시할 수 있습니다.</p>
              </div>
            </div>

            <div className="stack-list">
              {agentOptions.map((agent) => {
                const selected = settings.agents[agent.id];
                const allowPaths = publicPathOptions
                  .filter((option) => settings.publicPaths[option.id])
                  .filter((option) => agent.allowPathIds.includes(option.id))
                  .map((option) => option.label);

                return (
                  <button
                    type="button"
                    key={agent.id}
                    className={`row-toggle ${selected ? "is-active" : ""}`}
                    onClick={() => toggleSetting("agents", agent.id)}
                  >
                    <div className="row-copy">
                      <strong>{agent.userAgent}</strong>
                      <span>{agent.label}</span>
                    </div>
                    <div className="agent-summary">
                      {agent.mode === "block" || allowPaths.length === 0
                        ? "Disallow /"
                        : `Allow ${allowPaths.join(", ")} + Disallow /`}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Use Policy</h2>
                <p>허용 용도와 금지 용도를 문장으로 명시합니다.</p>
              </div>
            </div>

            <div className="policy-grid">
              <div>
                <h3>허용 용도</h3>
                <div className="stack-list compact">
                  {permittedUseOptions.map((option) => {
                    const selected = settings.permittedUses[option.id];

                    return (
                      <button
                        type="button"
                        key={option.id}
                        className={`row-toggle ${selected ? "is-active" : ""}`}
                        onClick={() => toggleSetting("permittedUses", option.id)}
                      >
                        <div className="row-copy">
                          <strong>{option.label}</strong>
                          <span>{option.line}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3>금지 용도</h3>
                <div className="stack-list compact">
                  {prohibitedUseOptions.map((option) => {
                    const selected = settings.prohibitedUses[option.id];

                    return (
                      <button
                        type="button"
                        key={option.id}
                        className={`row-toggle ${selected ? "is-active" : ""}`}
                        onClick={() =>
                          toggleSetting("prohibitedUses", option.id)
                        }
                      >
                        <div className="row-copy">
                          <strong>{option.label}</strong>
                          <span>{option.line}</span>
                        </div>
                      </button>
                    );
                  })}
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
                <p>입력값이 바뀌면 `ai.txt` 초안이 바로 갱신됩니다.</p>
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
                  모든 체크리스트를 확인했습니다. 바로 배포용 파일을 생성할 수
                  있습니다.
                </span>
              ) : (
                <span>
                  {missingFields.length > 0
                    ? `${missingFields.join(", ")} 입력 후 체크리스트를 완료하세요.`
                    : "체크리스트를 모두 확인하면 생성 버튼이 활성화됩니다."}
                </span>
              )}
            </div>

            <pre className="preview-block">{generatedText}</pre>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>출시 체크리스트</h2>
                <p>배포 전에 필요한 검수 항목을 클릭해서 확인합니다.</p>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => markAllChecklistItems(true)}
                >
                  전체 선택
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => markAllChecklistItems(false)}
                >
                  초기화
                </button>
              </div>
            </div>

            <div className="progress-panel">
              <div className="progress-copy">
                <strong>{checklistProgress}%</strong>
                <span>
                  {checkedChecklistItems} / {totalChecklistItems} 항목 확인
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
            </div>

            <div className="checklist-groups">
              {checklistCategories.map((category) => {
                const completedCount = category.items.filter(
                  (item) => checklistState[item.id],
                ).length;

                return (
                  <article key={category.category} className="checklist-card">
                    <div className="checklist-header">
                      <strong>{category.category}</strong>
                      <span>
                        {completedCount}/{category.items.length}
                      </span>
                    </div>

                    <div className="checklist-items">
                      {category.items.map((item) => (
                        <label key={item.id} className="check-item">
                          <input
                            type="checkbox"
                            checked={Boolean(checklistState[item.id])}
                            onChange={() => toggleChecklistItem(item.id)}
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
