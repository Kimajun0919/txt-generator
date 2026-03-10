import { useState } from "react";
import "./styles.css";
import AiTxtGenerator from "./AiTxtGenerator";
import LlmsTxtGenerator from "./LlmsTxtGenerator";

const tools = [
  {
    id: "ai",
    title: "ai.txt 생성기",
    description: "AI 크롤러 접근 정책 파일 생성",
  },
  {
    id: "llms",
    title: "llms.txt 생성기",
    description: "LLM 탐색용 요약 파일 생성",
  },
];

export default function App() {
  const [activeTool, setActiveTool] = useState("ai");

  const activeToolMeta =
    tools.find((tool) => tool.id === activeTool) ?? tools[0];

  return (
    <div className="page-shell">
      <nav className="panel app-nav">
        <div className="app-nav-copy">
          <p className="eyebrow">Generator Suite</p>
          <h1>텍스트 정책 생성기</h1>
          <p className="hero-description">
            메뉴바에서 생성기를 전환해 `ai.txt`와 `llms.txt`를 각각 만들 수
            있습니다. 현재 선택된 도구는 {activeToolMeta.title}입니다.
          </p>
        </div>

        <div className="tool-tab-row" role="tablist" aria-label="생성기 메뉴">
          {tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              role="tab"
              aria-selected={activeTool === tool.id}
              className={`tool-tab ${activeTool === tool.id ? "is-active" : ""}`}
              onClick={() => setActiveTool(tool.id)}
            >
              <strong>{tool.title}</strong>
              <span>{tool.description}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="tool-view">
        {activeTool === "ai" ? <AiTxtGenerator /> : <LlmsTxtGenerator />}
      </div>
    </div>
  );
}
