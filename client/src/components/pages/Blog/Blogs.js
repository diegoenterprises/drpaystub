import React, { useState, useEffect, useMemo } from "react";
import { ARTICLES, CATEGORIES } from "../../../data/blogArticles";
import STATE_TAX_DATA from "../../../data/stateTaxData";
import parse from "html-react-parser";
import SEO from "../../SEO";

/* ─── Icons (inline SVG to avoid dependency) ─────────────────────────────── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
);

const IconGrid = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IconMap = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
const IconBook = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IconZap = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconShield = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconCalc = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="12" y1="18" x2="12" y2="18"/><line x1="16" y1="18" x2="16" y2="18"/><line x1="8" y1="10" x2="16" y2="10"/></svg>;
const IconHelp = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IconTrophy = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V8a4 4 0 0 1 8 0v14"/><path d="M6 22V8a4 4 0 0 1 8 0"/></svg>;

const CATEGORY_ICONS = {
  grid: <IconGrid />, map: <IconMap />, book: <IconBook />, zap: <IconZap />, shield: <IconShield />, calculator: <IconCalc />, help: <IconHelp />,
};

const NO_TAX_STATES = ["AK","FL","NV","NH","SD","TN","TX","WA","WY"];

/* ─── State Tax Detail Modal ─────────────────────────────────────────────── */
const StateTaxDetail = ({ st, onClose }) => {
  if (!st) return null;
  const noTax = NO_TAX_STATES.includes(st.abbr);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
      <div className="dash-section-card" style={{ position: "relative", maxWidth: 640, width: "100%", maxHeight: "85vh", overflow: "auto", padding: "32px 28px", zIndex: 1 }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--color-text-tertiary)" }}>×</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: noTax ? "rgba(34,197,94,0.1)" : "var(--gradient-brand-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: noTax ? "#22c55e" : "var(--color-accent)" }}>
            {st.abbr}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{st.state}</h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-tertiary)" }}>Payroll Tax Guide 2026</p>
          </div>
        </div>

        {noTax && (
          <div style={{ padding: "10px 16px", borderRadius: 8, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
            No state income tax
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ padding: 16, borderRadius: 10, background: "var(--color-surface-elevated)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-tertiary)", marginBottom: 4 }}>Income Tax Rate</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{st.rate}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 10, background: "var(--color-surface-elevated)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-tertiary)", marginBottom: 4 }}>SUTA Rate</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{st.suta}</div>
          </div>
          <div style={{ padding: 16, borderRadius: 10, background: "var(--color-surface-elevated)", gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-tertiary)", marginBottom: 4 }}>Local Taxes</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{st.local}</div>
          </div>
        </div>

        <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Key Facts</h4>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {st.facts.map((f, i) => (
            <li key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)", marginBottom: 6 }}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ─── Article Reader ─────────────────────────────────────────────────────── */
const ArticleReader = ({ article, onBack }) => (
  <div style={{ maxWidth: 760, margin: "0 auto" }}>
    <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--color-accent)", fontSize: 14, fontWeight: 500, marginBottom: 16, padding: 0 }}>
      <ArrowLeft /> Back to articles
    </button>
    <div className="dash-section-card" style={{ padding: "36px 32px" }}>
      <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, background: "var(--gradient-brand-subtle)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-accent)", marginBottom: 12 }}>
        {CATEGORIES.find(c => c.id === article.category)?.label || article.category}
      </span>
      <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>{article.title}</h1>
      <p style={{ fontSize: 14, color: "var(--color-text-tertiary)", marginBottom: 28 }}>{article.readTime} read</p>
      <div className="kb-article-content" style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
        {parse(article.content)}
      </div>
    </div>
  </div>
);

/* ─── Main Blogs / Knowledge Base ────────────────────────────────────────── */
export default function Blogs() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [activeArticle, setActiveArticle] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [stateSearch, setStateSearch] = useState("");
  const [showAllStates, setShowAllStates] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { if (activeArticle) window.scrollTo(0, 0); }, [activeArticle]);

  const filtered = useMemo(() => {
    let items = ARTICLES;
    if (category !== "all") items = items.filter(a => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
    }
    return items;
  }, [search, category]);

  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return STATE_TAX_DATA;
    const q = stateSearch.toLowerCase();
    return STATE_TAX_DATA.filter(s => s.state.toLowerCase().includes(q) || s.abbr.toLowerCase().includes(q));
  }, [stateSearch]);

  const displayStates = showAllStates ? filteredStates : filteredStates.slice(0, 12);

  if (activeArticle) {
    return (
      <div style={{ minHeight: "80vh", padding: "100px 0 60px" }}>
        <div className="container">
          <ArticleReader article={activeArticle} onBack={() => setActiveArticle(null)} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "80vh", padding: "100px 0 60px" }}>
      <SEO
        title="Payroll Blog & Tax Guides"
        description="Expert payroll guides, tax tips for all 50 states, W2 information, and compliance resources. Your complete knowledge base for payroll and pay stubs."
        path="/blogs"
        keywords="payroll blog, tax guide by state, payroll tips, W2 guide, paystub FAQ, state tax rates, federal tax brackets, payroll compliance"
      />
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 40, padding: "0 20px" }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 8 }}>
          KNOWLEDGE BASE
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
          Payroll Encyclopedia.
        </h1>
        <p style={{ fontSize: 16, color: "var(--color-text-secondary)", maxWidth: 560, margin: "0 auto 28px" }}>
          Tax guides for all 50 states, payroll tips, compliance info, and everything you need to understand your pay.
        </p>

        {/* Search */}
        <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }}>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search articles, states, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: 42, height: 48, borderRadius: 12, fontSize: 15 }}
          />
        </div>
      </div>

      <div className="container">
        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 40 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                padding: "8px 16px", borderRadius: 980, border: "1.5px solid",
                borderColor: category === cat.id ? "var(--color-accent)" : "var(--color-border)",
                background: category === cat.id ? "var(--gradient-brand-subtle)" : "transparent",
                color: category === cat.id ? "var(--color-accent)" : "var(--color-text-secondary)",
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center" }}>{CATEGORY_ICONS[cat.icon] || null}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* ── State Tax Guides Section ─────────────────────────── */}
        {(category === "all" || category === "state-taxes") && !search.trim() && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  <IconMap /> State Tax Guides
                </h2>
                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
                  All 50 states + D.C. — income tax rates, SUTA, local taxes, and key facts
                </p>
              </div>
              <input
                type="text"
                placeholder="Search states..."
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                className="form-control"
                style={{ maxWidth: 220, height: 38, borderRadius: 10, fontSize: 13 }}
              />
            </div>

            <div className="row" style={{ gap: "16px 0" }}>
              {displayStates.map((st) => {
                const noTax = NO_TAX_STATES.includes(st.abbr);
                return (
                  <div className="col-6 col-md-4 col-lg-3" key={st.abbr}>
                    <div
                      className="dash-section-card"
                      onClick={() => setSelectedState(st)}
                      style={{ padding: "20px 16px", cursor: "pointer", height: "100%", transition: "all 0.2s ease", borderLeft: `3px solid ${noTax ? "#22c55e" : "var(--color-accent)"}` }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{st.abbr}</span>
                        {noTax && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>NO TAX</span>}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 4 }}>{st.state}</div>
                      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{st.rate === "None" ? "No income tax" : st.rate}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredStates.length > 12 && !showAllStates && (
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <button
                  onClick={() => setShowAllStates(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "1.5px solid var(--color-border)", borderRadius: 980, padding: "10px 24px", fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", cursor: "pointer" }}
                >
                  Show all {filteredStates.length} states <ChevronDown />
                </button>
              </div>
            )}
            {showAllStates && filteredStates.length > 12 && (
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <button
                  onClick={() => setShowAllStates(false)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "1.5px solid var(--color-border)", borderRadius: 980, padding: "10px 24px", fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", cursor: "pointer" }}
                >
                  Show less
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Articles Grid ────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>
            {category === "all" ? "All Articles" : CATEGORIES.find(c => c.id === category)?.label || "Articles"} ({filtered.length})
          </h2>

          {filtered.length === 0 ? (
            <div className="dash-section-card" style={{ padding: 48, textAlign: "center" }}>
              <p style={{ fontSize: 16, color: "var(--color-text-tertiary)" }}>No articles found for "{search}"</p>
              <button onClick={() => { setSearch(""); setCategory("all"); }} className="btn btn-secondary" style={{ marginTop: 12 }}>
                Clear search
              </button>
            </div>
          ) : (
            <div className="row" style={{ gap: "20px 0" }}>
              {filtered.map((article) => {
                const cat = CATEGORIES.find(c => c.id === article.category);
                return (
                  <div className="col-md-6 col-lg-4" key={article.id}>
                    <div
                      className="dash-section-card"
                      style={{ padding: "24px 20px", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", transition: "all 0.2s ease" }}
                      onClick={() => setActiveArticle(article)}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 6, background: "var(--gradient-brand-subtle)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-accent)", marginBottom: 12, alignSelf: "flex-start" }}>
                        {cat?.label || article.category}
                      </span>
                      <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 8, lineHeight: 1.35 }}>
                        {article.title}
                      </h3>
                      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6, flex: 1, margin: "0 0 12px" }}>
                        {article.summary}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{article.readTime} read</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-accent)" }}>Read →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Quick Reference: No-Income-Tax States ──────────── */}
        {(category === "all" || category === "state-taxes") && !search.trim() && (
          <div className="dash-section-card" style={{ padding: 32, marginBottom: 48 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><IconTrophy /> States With No Income Tax</h3>
            <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 20 }}>
              These 9 states do not levy any state income tax on wages and salaries.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {STATE_TAX_DATA.filter(s => NO_TAX_STATES.includes(s.abbr)).map((st) => (
                <button
                  key={st.abbr}
                  onClick={() => setSelectedState(st)}
                  style={{
                    padding: "10px 18px", borderRadius: 10, border: "1.5px solid rgba(34,197,94,0.2)",
                    background: "rgba(34,197,94,0.05)", cursor: "pointer", display: "flex",
                    alignItems: "center", gap: 8, transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.05)"; }}
                >
                  <span style={{ fontWeight: 700, color: "#22c55e" }}>{st.abbr}</span>
                  <span style={{ fontSize: 14, color: "var(--color-text-primary)" }}>{st.state}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Quick Stats ────────────────────────────────────── */}
        {category === "all" && !search.trim() && (
          <div className="row" style={{ gap: "16px 0", marginBottom: 48 }}>
            {[
              { label: "State Guides", value: "51", sub: "All 50 states + D.C." },
              { label: "Articles", value: String(ARTICLES.length), sub: "Tips, guides & more" },
              { label: "Categories", value: String(CATEGORIES.length - 1), sub: "Organized topics" },
              { label: "No-Tax States", value: "9", sub: "Zero income tax" },
            ].map((stat, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="dash-section-card" style={{ padding: 24, textAlign: "center" }}>
                  <div className="gradient-text" style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em" }}>{stat.value}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{stat.label}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* State Detail Modal */}
      {selectedState && <StateTaxDetail st={selectedState} onClose={() => setSelectedState(null)} />}

      {/* Article content styles */}
      <style>{`
        .kb-article-content h2 { font-size: 22px; font-weight: 700; margin: 28px 0 12px; color: var(--color-text-primary); letter-spacing: -0.02em; }
        .kb-article-content h3 { font-size: 18px; font-weight: 600; margin: 24px 0 10px; color: var(--color-text-primary); }
        .kb-article-content h4 { font-size: 16px; font-weight: 600; margin: 20px 0 8px; color: var(--color-text-primary); }
        .kb-article-content p { margin: 0 0 14px; }
        .kb-article-content ul, .kb-article-content ol { padding-left: 24px; margin: 0 0 16px; }
        .kb-article-content li { margin-bottom: 6px; }
        .kb-article-content strong { color: var(--color-text-primary); }
        .kb-article-content table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
        .kb-article-content th { background: var(--color-surface-elevated); padding: 10px 12px; text-align: left; font-weight: 600; border-bottom: 2px solid var(--color-border); color: var(--color-text-primary); }
        .kb-article-content td { padding: 8px 12px; border-bottom: 1px solid var(--color-border); }
        .kb-article-content em { color: var(--color-text-tertiary); }
      `}</style>
    </div>
  );
}
