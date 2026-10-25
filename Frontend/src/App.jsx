import React from "react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleDot,
  ExternalLink,
  FileText,
  Globe2,
  Loader2,
  Menu,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  Zap
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const agents = [
  { key: "search", label: "Search Agent", icon: Search, desc: "Finds relevant sources", color: "violet" },
  { key: "reader", label: "Reader Agent", icon: Globe2, desc: "Reads the best sources", color: "blue" },
  { key: "writer", label: "Writer", icon: FileText, desc: "Synthesizes the report", color: "cyan" },
  { key: "critic", label: "Critic", icon: ShieldCheck, desc: "Checks quality & gaps", color: "pink" }
];

const demoResult = {
  report: `# Introduction

ResearchIQ is a multi-agent research system designed to turn an open-ended research question into a structured, readable report.

# Key Findings

- **Multi-agent workflow:** Separate agents handle discovery, reading, writing, and quality review.
- **Source-driven research:** The workflow begins with web search and carries source URLs into the final report.
- **Quality control:** A dedicated critic evaluates accuracy, clarity, completeness, organization, source quality, and depth.

# Conclusion

ResearchIQ demonstrates how specialized AI agents can divide a complex research task into focused stages while keeping the final output structured and reviewable.

# Sources

The live system will populate source links from the research results.`,
  feedback: `Score: 8.7/10

Strengths:
- Clear multi-agent separation of responsibilities
- Professional and readable report structure
- Strong focus on source-backed research

Areas to Improve:
- Add more primary sources for important claims
- Include stronger source-to-claim citations
- Add deeper comparison between competing viewpoints

Verdict:
A strong research workflow with a clear foundation for production improvements.`,
  search_results: ""
};

function parseCritic(text = "") {
  const scoreMatch = text.match(/Score:\s*([0-9]+(?:\.[0-9]+)?)\s*\/?\s*10/i);
  const score = scoreMatch ? Number(scoreMatch[1]) : 0;

  const strengthsMatch = text.match(/Strengths:\s*([\s\S]*?)(?=\n\s*Areas to Improve:|\n\s*Verdict:|$)/i);
  const improveMatch = text.match(/Areas to Improve:\s*([\s\S]*?)(?=\n\s*Verdict:|$)/i);
  const verdictMatch = text.match(/Verdict:\s*([\s\S]*)$/i);

  const bullets = (section) =>
    (section || "")
      .split("\n")
      .map((x) => x.replace(/^\s*[-•]\s*/, "").trim())
      .filter(Boolean);

  return {
    score,
    strengths: bullets(strengthsMatch?.[1]),
    improvements: bullets(improveMatch?.[1]),
    verdict: verdictMatch?.[1]?.trim() || ""
  };
}

function extractSources(text = "") {
  const blocks = text.split("----");
  return blocks
    .map((block) => {
      const title = block.match(/Title:\s*(.+)/i)?.[1]?.trim();
      const url = block.match(/URL:\s*(https?:\/\/\S+)/i)?.[1]?.trim();
      if (!url) return null;
      return { title: title || url, url };
    })
    .filter(Boolean);
}

function cleanReport(text = "") {
  return text
    .replace(/^```(?:markdown|md|text)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .replace(/```(?:markdown|md|text)?/gi, "")
    .replace(/```/g, "")
    .trim();
}

function App() {
  const [topic, setTopic] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [activeAgent, setActiveAgent] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [error, setError] = useState("");

  const critic = useMemo(
    () => parseCritic(result?.feedback || ""),
    [result]
  );

  const sources = useMemo(
    () => extractSources(result?.search_results || ""),
    [result]
  );

  async function startResearch() {
    const value = topic.trim();
    if (!value || running) return;

    setRunning(true);
    setError("");
    setResult(null);

    try {
      setActiveAgent("search");
      await new Promise((r) => setTimeout(r, 350));
      setActiveAgent("reader");

      const response = await fetch(`${API_URL}/api/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: value })
      });

      if (!response.ok) {
        throw new Error(`Research API returned ${response.status}`);
      }

      setActiveAgent("writer");
      const data = await response.json();
      setActiveAgent("critic");
      await new Promise((r) => setTimeout(r, 250));
      setResult(data);
      setActiveAgent("");
    } catch (err) {
      setError(
        "Could not connect to the research backend. Check that FastAPI is running and VITE_API_URL is correct."
      );
      setActiveAgent("");
    } finally {
      setRunning(false);
    }
  }

  function loadDemo() {
    setTopic("The future of AI agents");
    setResult(demoResult);
    setError("");
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark"><Sparkles size={17} /></span>
          <span>Research<span>IQ</span></span>
        </a>

        <nav className={mobileOpen ? "nav-links mobile-open" : "nav-links"}>
          <a href="#research" onClick={() => setMobileOpen(false)}>Research</a>
          <a href="#workflow" onClick={() => setMobileOpen(false)}>How it works</a>
          <a href="#report" onClick={() => setMobileOpen(false)}>Results</a>
          <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        </nav>

        <div className="top-actions">
          <button className="ghost-btn" onClick={loadDemo}>View demo</button>
          <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" id="research">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="eyebrow">
              <span className="pulse-dot" />
              AI research team · live web intelligence
            </div>

            <h1>
              Research anything.
              <br />
              <span>Let AI do the work.</span>
            </h1>

            <p className="hero-copy">
              ResearchIQ coordinates specialized AI agents to search the web,
              read sources, write a report, and critique the result.
            </p>

            <div className="search-box">
              <Search size={21} />
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startResearch()}
                placeholder="What do you want to research?"
                disabled={running}
              />
              <button onClick={startResearch} disabled={!topic.trim() || running}>
                {running ? (
                  <>
                    <Loader2 className="spin" size={17} />
                    Researching
                  </>
                ) : (
                  <>
                    Start research
                    <ArrowUpRight size={17} />
                  </>
                )}
              </button>
            </div>

            <div className="hero-meta">
              <span><Zap size={15} /> Web search</span>
              <span><Network size={15} /> Multi-agent</span>
              <span><ShieldCheck size={15} /> Quality checked</span>
            </div>
          </motion.div>
        </section>

        <section className="workflow-section" id="workflow">
          <div className="section-heading">
            <div>
              <span className="section-kicker">THE RESEARCH TEAM</span>
              <h2>Four agents. One answer.</h2>
            </div>
            <span className="live-pill"><CircleDot size={12} /> {running ? "Working" : "Ready"}</span>
          </div>

          <div className="agent-grid">
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              const active = activeAgent === agent.key;
              const done =
                result && !running
                  ? true
                  : activeAgent &&
                    agents.findIndex((a) => a.key === activeAgent) > index;

              return (
                <motion.div
                  className={`agent-card ${active ? "active" : ""}`}
                  key={agent.key}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className={`agent-icon ${agent.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="agent-copy">
                    <div className="agent-title">
                      <h3>{agent.label}</h3>
                      {done && <span className="done"><Check size={12} /></span>}
                      {active && <Loader2 className="spin active-loader" size={14} />}
                    </div>
                    <p>{agent.desc}</p>
                  </div>
                  <span className="agent-number">0{index + 1}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="results-section" id="report">
          {!result && !running && (
            <div className="empty-state">
              <div className="empty-icon"><Search size={24} /></div>
              <h2>Your research workspace</h2>
              <p>Enter a topic above to generate a source-backed research report.</p>
              <button className="secondary-btn" onClick={loadDemo}>Load demo result <ArrowUpRight size={16} /></button>
            </div>
          )}

          {running && (
            <div className="loading-panel">
              <div className="loading-orb"><Sparkles size={27} /></div>
              <h2>Your AI research team is working</h2>
              <p>
                {activeAgent === "search" && "Searching the web for relevant sources…"}
                {activeAgent === "reader" && "Reading the most relevant sources…"}
                {activeAgent === "writer" && "Synthesizing the research into a report…"}
                {activeAgent === "critic" && "Critiquing the report for quality and gaps…"}
                {!activeAgent && "Preparing your research…"}
              </p>
            </div>
          )}

          {error && (
            <div className="error-banner">
              <X size={17} />
              {error}
            </div>
          )}

          <AnimatePresence>
            {result && !running && (
              <motion.div
                className="result-layout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <article className="report-panel">
                  <div className="panel-top">
                    <div>
                      <span className="panel-kicker">FINAL REPORT</span>
                      <h2>{topic || "Research Report"}</h2>
                    </div>
                    <button
                      className="icon-btn"
                      title="Open report"
                      onClick={() => document.getElementById("report-content")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      <ArrowUpRight size={17} />
                    </button>
                  </div>

                  <div className="report-content" id="report-content">
                    {cleanReport(result.report)
                      .split("\n")
                      .map((line, i) => {
                        if (line.startsWith("# ")) return <h1 key={i}>{line.slice(2)}</h1>;
                        if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
                        if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
                        if (line.startsWith("- ")) return <li key={i}>{line.slice(2)}</li>;
                        if (!line.trim()) return <div className="report-space" key={i} />;
                        return <p key={i}>{line}</p>;
                      })}
                  </div>

                  {sources.length > 0 && (
                    <div className="sources">
                      <div className="source-heading">
                        <span>RESEARCH SOURCES</span>
                        <span>{sources.length} sources</span>
                      </div>
                      <div className="source-list">
                        {sources.map((source, i) => (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="source-card"
                            key={i}
                          >
                            <Globe2 size={16} />
                            <span>{source.title}</span>
                            <ExternalLink size={14} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </article>

                <aside className="critic-panel">
                  <div className="panel-top">
                    <div>
                      <span className="panel-kicker">AI CRITIC</span>
                      <h2>Quality review</h2>
                    </div>
                    <ShieldCheck size={20} className="critic-icon" />
                  </div>

                  <div className="score-wrap">
                    <div className="score-ring" style={{ "--score": `${critic.score * 10}%` }}>
                      <div className="score-inner">
                        <strong>{critic.score || "—"}</strong>
                        <span>/ 10</span>
                      </div>
                    </div>
                    <div>
                      <span className="score-label">Overall score</span>
                      <p>{critic.score >= 8 ? "Strong research quality" : "Room for improvement"}</p>
                    </div>
                  </div>

                  <div className="critic-block">
                    <h3><Star size={15} /> Strengths</h3>
                    {critic.strengths.length ? critic.strengths.map((x, i) => (
                      <div className="critic-item" key={i}><Check size={14} />{x}</div>
                    )) : <div className="critic-item muted">No strengths parsed.</div>}
                  </div>

                  <div className="critic-block">
                    <h3><ChevronDown size={15} /> Areas for improvement</h3>
                    {critic.improvements.length ? critic.improvements.map((x, i) => (
                      <div className="critic-item" key={i}><CircleDot size={12} />{x}</div>
                    )) : <div className="critic-item muted">No improvements parsed.</div>}
                  </div>

                  {critic.verdict && (
                    <div className="verdict">
                      <span>VERDICT</span>
                      <p>{critic.verdict}</p>
                    </div>
                  )}
                </aside>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="about-section" id="about">
          <div>
            <span className="section-kicker">BUILT FOR RESEARCH</span>
            <h2>From question to<br />decision-ready insight.</h2>
          </div>
          <div className="about-grid">
            <div><strong>01</strong><h3>Discover</h3><p>Find relevant information across the live web.</p></div>
            <div><strong>02</strong><h3>Understand</h3><p>Read and extract useful context from sources.</p></div>
            <div><strong>03</strong><h3>Synthesize</h3><p>Turn research into a structured report.</p></div>
            <div><strong>04</strong><h3>Validate</h3><p>Critique the result before it reaches you.</p></div>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand"><span className="brand-mark"><Sparkles size={15} /></span><span>Research<span>IQ</span></span></div>
        <span>AI-powered research, built as a multi-agent system.</span>
      </footer>
    </div>
  );
}

export default App;