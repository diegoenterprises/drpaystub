import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  FaFileAlt, FaPalette, FaShieldAlt, FaLock,
  FaArrowRight, FaCheck, FaStar, FaDownload,
  FaPrint, FaEnvelope, FaEye,
} from "react-icons/fa";
import SEO from "../../SEO";

// ─── Inject keyframes ────────────────────────────────────────────────────────
let _injected = false;
function injectShowcaseStyles() {
  if (_injected) return;
  _injected = true;
  const css = `
    @keyframes ts-fadeUp { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes ts-scaleIn { 0%{opacity:0;transform:scale(0.9)} 100%{opacity:1;transform:scale(1)} }
    @keyframes ts-float { 0%{transform:translateY(0)} 50%{transform:translateY(-8px)} 100%{transform:translateY(0)} }
    @keyframes ts-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes ts-gradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes ts-orb-drift { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-25px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.95)} 100%{transform:translate(0,0) scale(1)} }
    @keyframes ts-pulse-ring { 0%{transform:scale(0.95);opacity:1} 100%{transform:scale(1.15);opacity:0} }
    @keyframes ts-check-in { 0%{transform:scale(0) rotate(-45deg)} 50%{transform:scale(1.2) rotate(0deg)} 100%{transform:scale(1) rotate(0deg)} }
  `;
  const el = document.createElement("style");
  el.textContent = css;
  document.head.appendChild(el);
}

// ─── Template data ───────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 1,
    name: "Steel Blue",
    subtitle: "Classic Professional",
    border: "#abbae1",
    tableBg: "#dee1f0",
    totalBg: "#d0d2d4",
    checkBar: "#c4cbe5",
    accent: "#4a6fa5",
    desc: "Clean corporate style with a traditional blue palette. Ideal for professional settings and corporate environments.",
  },
  {
    id: 2,
    name: "Rose",
    subtitle: "Warm Elegance",
    border: "#f3b3b3",
    tableBg: "#f9d7d7",
    totalBg: "#f3b3b3",
    checkBar: "#f3b3b3",
    accent: "#d4686b",
    desc: "Soft rose tones convey warmth and approachability. Perfect for creative industries and small businesses.",
  },
  {
    id: 3,
    name: "Orchid",
    subtitle: "Modern Sophistication",
    border: "#e7c1dd",
    tableBg: "#f1d9eb",
    totalBg: "#e7c1dd",
    checkBar: "#e7c1dd",
    accent: "#b06aa8",
    desc: "Sophisticated orchid palette that balances professionalism with modern design sensibility.",
  },
  {
    id: 4,
    name: "Mint",
    subtitle: "Fresh & Clean",
    border: "#c0e5d9",
    tableBg: "#dff1eb",
    totalBg: "#c0e5d9",
    checkBar: "#c0e5d9",
    accent: "#4ca88e",
    desc: "Fresh mint green that feels clean and contemporary. Great for health, wellness, and modern startups.",
  },
  {
    id: 5,
    name: "Gold",
    subtitle: "Premium Distinction",
    border: "#efd997",
    tableBg: "#f5e4b1",
    totalBg: "#efd997",
    checkBar: "#efd997",
    accent: "#c4a23a",
    desc: "Luxurious gold tones that communicate premium quality. Ideal for executive-level and financial roles.",
  },
  {
    id: 6,
    name: "Teal",
    subtitle: "Vibrant Energy",
    border: "#88ddd5",
    tableBg: "#b3f5ef",
    totalBg: "#88ddd5",
    checkBar: "#88ddd5",
    accent: "#2db5a5",
    desc: "Energetic teal that feels vibrant and fresh. Perfect for tech companies and forward-thinking businesses.",
  },
  {
    id: 7,
    name: "Slate",
    subtitle: "Executive Authority",
    border: "#8e99a9",
    tableBg: "#c5cbdb",
    totalBg: "#b0b6c6",
    checkBar: "#b0b6c6",
    accent: "#5a6578",
    desc: "Commanding slate grey conveys authority and reliability. A top choice for executives and law firms.",
  },
  {
    id: 8,
    name: "Coral",
    subtitle: "Warm Vitality",
    border: "#f4a896",
    tableBg: "#fcd5cc",
    totalBg: "#f4a896",
    checkBar: "#f4a896",
    accent: "#e07a64",
    desc: "Lively coral radiates warmth and energy. Ideal for hospitality, retail, and service industries.",
  },
  {
    id: 9,
    name: "Lavender",
    subtitle: "Creative Spirit",
    border: "#c3b1e1",
    tableBg: "#ddd3f0",
    totalBg: "#c3b1e1",
    checkBar: "#c3b1e1",
    accent: "#8b6fbf",
    desc: "Dreamy lavender tones inspire creativity. Perfect for design studios, agencies, and arts organizations.",
  },
  {
    id: 10,
    name: "Forest",
    subtitle: "Natural Strength",
    border: "#7dab8e",
    tableBg: "#b5d4c1",
    totalBg: "#7dab8e",
    checkBar: "#7dab8e",
    accent: "#4d8a62",
    desc: "Deep forest green evokes growth and stability. Great for agriculture, environmental, and outdoor industries.",
  },
  {
    id: 11,
    name: "Copper",
    subtitle: "Artisan Craft",
    border: "#d4a574",
    tableBg: "#e8cdb0",
    totalBg: "#d4a574",
    checkBar: "#d4a574",
    accent: "#b07d45",
    desc: "Rich copper tones suggest craftsmanship and heritage. Excellent for construction and manufacturing.",
  },
  {
    id: 12,
    name: "Sky",
    subtitle: "Open Horizons",
    border: "#8ec8e8",
    tableBg: "#c4e2f4",
    totalBg: "#8ec8e8",
    checkBar: "#8ec8e8",
    accent: "#4a9fd4",
    desc: "Bright sky blue feels open and trustworthy. A natural fit for aviation, logistics, and travel.",
  },
  {
    id: 13,
    name: "Burgundy",
    subtitle: "Refined Heritage",
    border: "#c9838a",
    tableBg: "#e4b8bc",
    totalBg: "#c9838a",
    checkBar: "#c9838a",
    accent: "#a45560",
    desc: "Sophisticated burgundy communicates prestige. Ideal for wine, dining, and luxury retail sectors.",
  },
  {
    id: 14,
    name: "Sage",
    subtitle: "Calm Balance",
    border: "#a8c0a0",
    tableBg: "#cddcc8",
    totalBg: "#a8c0a0",
    checkBar: "#a8c0a0",
    accent: "#6d946a",
    desc: "Soothing sage green promotes calm and balance. A favorite for wellness, yoga, and holistic businesses.",
  },
  {
    id: 15,
    name: "Peach",
    subtitle: "Gentle Warmth",
    border: "#f0c4a8",
    tableBg: "#f7ddd0",
    totalBg: "#f0c4a8",
    checkBar: "#f0c4a8",
    accent: "#d49670",
    desc: "Soft peach radiates gentle warmth and approachability. Perfect for beauty, childcare, and lifestyle brands.",
  },
  {
    id: 16,
    name: "Navy",
    subtitle: "Deep Trust",
    border: "#7a8fba",
    tableBg: "#b0bdd8",
    totalBg: "#7a8fba",
    checkBar: "#7a8fba",
    accent: "#3d5a8a",
    desc: "Classic navy inspires deep trust and professionalism. The go-to for banking, insurance, and government.",
  },
  {
    id: 17,
    name: "Mauve",
    subtitle: "Soft Elegance",
    border: "#c9a0b8",
    tableBg: "#e0c8d8",
    totalBg: "#c9a0b8",
    checkBar: "#c9a0b8",
    accent: "#a06c90",
    desc: "Delicate mauve blends elegance with modernity. Suited for fashion, cosmetics, and interior design.",
  },
  {
    id: 18,
    name: "Emerald",
    subtitle: "Prosperous Growth",
    border: "#6dbfa0",
    tableBg: "#a8dbc8",
    totalBg: "#6dbfa0",
    checkBar: "#6dbfa0",
    accent: "#3a9a78",
    desc: "Vivid emerald symbolizes prosperity and ambition. A strong choice for finance and investment firms.",
  },
  {
    id: 19,
    name: "Amber",
    subtitle: "Bold Confidence",
    border: "#e0b860",
    tableBg: "#f0d898",
    totalBg: "#e0b860",
    checkBar: "#e0b860",
    accent: "#c49528",
    desc: "Striking amber conveys boldness and confidence. Ideal for energy, automotive, and engineering sectors.",
  },
  {
    id: 20,
    name: "Arctic",
    subtitle: "Crystal Clarity",
    border: "#94c5d8",
    tableBg: "#c0dde8",
    totalBg: "#94c5d8",
    checkBar: "#94c5d8",
    accent: "#4a98b4",
    desc: "Cool arctic tones feel crisp and precise. Perfect for healthcare, science, and pharmaceutical firms.",
  },
  {
    id: 21,
    name: "Charcoal",
    subtitle: "Modern Edge",
    border: "#9ea5ad",
    tableBg: "#c8cdd4",
    totalBg: "#9ea5ad",
    checkBar: "#9ea5ad",
    accent: "#5c636e",
    desc: "Sharp charcoal delivers a modern, edgy aesthetic. Great for tech startups, media, and entertainment.",
  },
];

const FEATURES = [
  { icon: <FaShieldAlt />, title: "Password Protected", desc: "Every stub is secured with a unique password derived from your employee data", color: "#6366f1" },
  { icon: <FaLock />, title: "Bank-Grade Security", desc: "Encrypted PDFs with digital signatures and tamper-proof metadata", color: "#10b981" },
  { icon: <FaDownload />, title: "Instant Download", desc: "Download as a ZIP package or receive directly to your email inbox", color: "#f59e0b" },
  { icon: <FaPrint />, title: "Print Ready", desc: "High-resolution output optimized for both digital viewing and professional printing", color: "#8b5cf6" },
];

// ─── Shared styles ───────────────────────────────────────────────────────────
const glassCard = {
  background: "var(--color-bg-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 20,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

// ─── Mini Paystub Preview (CSS-rendered) ─────────────────────────────────────
function MiniPaystub({ t, hovered }) {
  const scale = hovered ? 1.03 : 1;
  return (
    <div style={{
      width: "100%", aspectRatio: "8.5/11", background: "#fff",
      borderRadius: 8, overflow: "hidden", position: "relative",
      boxShadow: hovered
        ? `0 20px 60px ${t.accent}30, 0 0 0 2px ${t.accent}40`
        : "0 4px 20px rgba(0,0,0,0.08)",
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      transform: `scale(${scale})`,
    }}>
      {/* Check bar at top */}
      <div style={{
        height: "6%", background: t.checkBar, display: "flex",
        alignItems: "center", justifyContent: "space-between",
        padding: "0 6%",
      }}>
        <div style={{ width: "20%", height: 4, background: "#0052a1", borderRadius: 2, opacity: 0.7 }} />
        <div style={{
          fontSize: 5, fontWeight: 700, color: "#0052a1",
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>EARNING STATEMENT</div>
        <div style={{ width: "15%", height: 4, background: "#0052a1", borderRadius: 2, opacity: 0.7 }} />
      </div>

      {/* Company + Employee header */}
      <div style={{ padding: "3% 5% 2%", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ width: 16, height: 16, borderRadius: 3, background: t.tableBg, marginBottom: 3 }} />
            <div style={{ width: "60px", height: 3, background: "#333", borderRadius: 1, marginBottom: 2 }} />
            <div style={{ width: "45px", height: 2, background: "#999", borderRadius: 1 }} />
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ width: "50px", height: 3, background: "#333", borderRadius: 1, marginBottom: 2, marginLeft: "auto" }} />
            <div style={{ width: "35px", height: 2, background: "#999", borderRadius: 1, marginLeft: "auto" }} />
          </div>
        </div>
      </div>

      {/* Employee info table */}
      <div style={{ padding: "2% 5%", background: t.tableBg }}>
        <div style={{ display: "flex", gap: "4%" }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ width: "100%", height: 2, background: t.accent + "60", borderRadius: 1, marginBottom: 2 }} />
              <div style={{ width: "80%", height: 2, background: "#666", borderRadius: 1 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Earnings / Deductions table */}
      <div style={{ padding: "2% 5%" }}>
        <div style={{ display: "flex", gap: "3%", marginBottom: "2%" }}>
          <div style={{ flex: 1, background: t.tableBg, height: 3, borderRadius: 1 }} />
          <div style={{ flex: 1, background: t.tableBg, height: 3, borderRadius: 1 }} />
          <div style={{ flex: 1, background: t.tableBg, height: 3, borderRadius: 1 }} />
          <div style={{ flex: 1, background: t.tableBg, height: 3, borderRadius: 1 }} />
        </div>
        {[1,2,3,4].map(row => (
          <div key={row} style={{ display: "flex", gap: "3%", marginBottom: "1.5%" }}>
            <div style={{ flex: 1, height: 2, background: "#ddd", borderRadius: 1 }} />
            <div style={{ flex: 1, height: 2, background: "#eee", borderRadius: 1 }} />
            <div style={{ flex: 1, height: 2, background: "#ddd", borderRadius: 1 }} />
            <div style={{ flex: 1, height: 2, background: "#eee", borderRadius: 1 }} />
          </div>
        ))}
      </div>

      {/* Totals row */}
      <div style={{ padding: "1.5% 5%", background: t.totalBg }}>
        <div style={{ display: "flex", gap: "3%" }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ width: "100%", height: 2, background: t.accent + "50", borderRadius: 1, marginBottom: 1.5 }} />
              <div style={{ width: "70%", height: 2, background: "#555", borderRadius: 1 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Amount in words bar */}
      <div style={{
        margin: "2% 5%", padding: "1.5% 3%",
        background: t.tableBg, borderRadius: 3,
      }}>
        <div style={{ width: "85%", height: 2, background: "#999", borderRadius: 1 }} />
      </div>

      {/* Net pay box */}
      <div style={{ padding: "0 5%", display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          padding: "2% 4%", background: t.accent + "15",
          border: `1px solid ${t.accent}40`, borderRadius: 4,
        }}>
          <div style={{ width: 30, height: 2, background: t.accent + "80", borderRadius: 1, marginBottom: 2 }} />
          <div style={{ width: 40, height: 3, background: t.accent, borderRadius: 1, fontWeight: 700 }} />
        </div>
      </div>

      {/* Signature line */}
      <div style={{
        position: "absolute", bottom: "10%", left: "5%", right: "5%",
        borderTop: `1px solid ${t.border}`, paddingTop: "1.5%",
        display: "flex", justifyContent: "space-between",
      }}>
        <div style={{ width: "30%", height: 2, background: "#ccc", borderRadius: 1 }} />
        <div style={{ width: "25%", height: 2, background: "#ccc", borderRadius: 1 }} />
      </div>

      {/* MICR line at bottom */}
      <div style={{
        position: "absolute", bottom: "3%", left: "5%", right: "5%",
        textAlign: "center",
      }}>
        <div style={{
          height: 3, background: `linear-gradient(90deg, transparent 0%, #888 10%, #888 90%, transparent 100%)`,
          borderRadius: 1, opacity: 0.3,
        }} />
      </div>

      {/* Hover overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(135deg, ${t.accent}08, transparent)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export class TemplateShowcase extends Component {
  state = {
    hoveredTemplate: null,
    selectedTemplate: null,
    viewMode: "grid",
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    injectShowcaseStyles();
  }

  render() {
    const { hoveredTemplate, selectedTemplate } = this.state;
    const isLoggedIn = !!localStorage.getItem("tokens");

    return (
      <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
        <SEO
          title="Payroll Templates — 6 Premium Designs"
          description="Browse 6 professionally designed payroll document templates. Classic, modern, executive, and more. Each template includes full tax breakdowns, digital signatures, and bank-grade PDF security."
          path="/templates"
          keywords="payroll template, payroll document design, professional payroll layout, payroll PDF template, payroll compliance template"
        />

        {/* ── Hero ── */}
        <div style={{
          position: "relative", overflow: "hidden",
          padding: "100px 24px 64px", textAlign: "center",
        }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{
              position: "absolute", width: 350, height: 350, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
              top: "5%", left: "0%", filter: "blur(50px)",
              animation: "ts-orb-drift 18s ease-in-out infinite",
            }} />
            <div style={{
              position: "absolute", width: 280, height: 280, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
              top: "30%", right: "5%", filter: "blur(50px)",
              animation: "ts-orb-drift 22s 4s ease-in-out infinite",
            }} />
            <div style={{
              position: "absolute", width: 220, height: 220, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
              bottom: "0%", left: "35%", filter: "blur(50px)",
              animation: "ts-orb-drift 15s 8s ease-in-out infinite",
            }} />
          </div>

          <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
            <div style={{
              width: 68, height: 68, borderRadius: 20, margin: "0 auto 24px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, color: "#fff",
              animation: "ts-scaleIn 0.6s ease-out, ts-float 4s 1s ease-in-out infinite",
              boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
            }}>
              <FaPalette />
            </div>
            <h1 style={{
              fontSize: 44, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1,
              color: "var(--color-text-primary)", marginBottom: 16,
              animation: "ts-fadeUp 0.7s ease-out",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
            }}>
              Paystub Templates
            </h1>
            <p style={{
              fontSize: 18, lineHeight: 1.6, color: "var(--color-text-secondary)",
              maxWidth: 520, margin: "0 auto 8px",
              animation: "ts-fadeUp 0.7s 0.1s ease-out both",
            }}>
              Six handcrafted colorways. One professional standard.
            </p>
            <p style={{
              fontSize: 14, lineHeight: 1.5, color: "var(--color-text-tertiary)",
              maxWidth: 480, margin: "0 auto",
              animation: "ts-fadeUp 0.7s 0.15s ease-out both",
            }}>
              Choose the palette that matches your brand. Every template includes
              the same secure, bank-grade formatting with password-protected PDFs.
            </p>
          </div>
        </div>

        {/* ── Color Swatches Quick Bar ── */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap",
          padding: "0 24px", marginBottom: 48,
          animation: "ts-fadeUp 0.7s 0.2s ease-out both",
        }}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                this.setState({ selectedTemplate: t.id });
                const el = document.getElementById(`template-${t.id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: 980, border: "1px solid var(--color-border)",
                background: selectedTemplate === t.id ? t.accent + "15" : "var(--color-bg-card)",
                cursor: "pointer", transition: "all 0.2s ease",
                borderColor: selectedTemplate === t.id ? t.accent : "var(--color-border)",
              }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: "50%",
                background: `linear-gradient(135deg, ${t.border}, ${t.accent})`,
                boxShadow: `0 2px 8px ${t.accent}40`,
              }} />
              <span style={{
                fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)",
                letterSpacing: "0.01em",
              }}>{t.name}</span>
            </button>
          ))}
        </div>

        {/* ── Template Grid ── */}
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32,
        }} className="ts-grid">
          {TEMPLATES.map((t, i) => {
            const isHovered = hoveredTemplate === t.id;
            const isSelected = selectedTemplate === t.id;
            return (
              <div
                key={t.id}
                id={`template-${t.id}`}
                style={{
                  animation: `ts-fadeUp 0.7s ${0.25 + i * 0.08}s ease-out both`,
                }}
                onMouseEnter={() => this.setState({ hoveredTemplate: t.id })}
                onMouseLeave={() => this.setState({ hoveredTemplate: null })}
              >
                <div style={{
                  ...glassCard,
                  padding: 0, overflow: "hidden", cursor: "pointer",
                  borderColor: isSelected ? t.accent : isHovered ? t.accent + "60" : "var(--color-border)",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: isHovered
                    ? `0 16px 48px ${t.accent}20`
                    : "0 2px 12px rgba(0,0,0,0.04)",
                }}
                onClick={() => this.setState({ selectedTemplate: isSelected ? null : t.id })}
                >
                  {/* Preview area */}
                  <div style={{
                    padding: "24px 28px 16px",
                    background: isHovered
                      ? `linear-gradient(135deg, ${t.accent}06, ${t.accent}02)`
                      : "transparent",
                    transition: "background 0.3s ease",
                  }}>
                    <MiniPaystub t={t} hovered={isHovered} />
                  </div>

                  {/* Info area */}
                  <div style={{ padding: "16px 28px 24px" }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      marginBottom: 8,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: `linear-gradient(135deg, ${t.border}, ${t.accent})`,
                          boxShadow: `0 4px 12px ${t.accent}30`,
                        }} />
                        <div>
                          <h3 style={{
                            fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)",
                            letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2,
                          }}>{t.name}</h3>
                          <span style={{
                            fontSize: 11, fontWeight: 500, color: t.accent,
                            letterSpacing: "0.02em",
                          }}>{t.subtitle}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          background: t.accent, display: "flex",
                          alignItems: "center", justifyContent: "center",
                          animation: "ts-check-in 0.3s ease-out",
                        }}>
                          <FaCheck style={{ fontSize: 10, color: "#fff" }} />
                        </div>
                      )}
                    </div>
                    <p style={{
                      fontSize: 12, lineHeight: 1.5, color: "var(--color-text-tertiary)",
                      margin: 0,
                    }}>{t.desc}</p>

                    {/* CTA on hover/select */}
                    <div style={{
                      maxHeight: isHovered || isSelected ? 48 : 0,
                      overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.25s ease, margin 0.3s ease",
                      opacity: isHovered || isSelected ? 1 : 0,
                      marginTop: isHovered || isSelected ? 12 : 0,
                    }}>
                      <Link
                        to={isLoggedIn ? "/paystubs" : "/login"}
                        onClick={() => {
                          localStorage.setItem("preselectedTemplate", t.id);
                          if (!isLoggedIn) localStorage.setItem("clickStartAstrosync", true);
                        }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          gap: 8, padding: "10px 0", borderRadius: 10,
                          fontSize: 13, fontWeight: 600, color: "#fff",
                          background: `linear-gradient(135deg, ${t.accent}, ${t.accent}cc)`,
                          textDecoration: "none",
                          transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${t.accent}40`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        Use This Template <FaArrowRight style={{ fontSize: 11 }} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Features Section ── */}
        <div style={{
          maxWidth: 1000, margin: "72px auto 0", padding: "0 24px",
          animation: "ts-fadeUp 0.7s 0.7s ease-out both",
        }}>
          <h2 style={{
            fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em",
            color: "var(--color-text-primary)", textAlign: "center", marginBottom: 8,
          }}>
            Every Template Includes
          </h2>
          <p style={{
            fontSize: 14, color: "var(--color-text-tertiary)", textAlign: "center",
            marginBottom: 36, maxWidth: 450, marginLeft: "auto", marginRight: "auto",
          }}>
            Professional-grade features built into every single colorway
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20,
          }} className="ts-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                ...glassCard, padding: "24px 20px", textAlign: "center",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 14, margin: "0 auto 14px",
                  background: f.color + "12", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: f.color,
                }}>
                  {f.icon}
                </div>
                <h4 style={{
                  fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)",
                  marginBottom: 6, letterSpacing: "-0.01em",
                }}>{f.title}</h4>
                <p style={{
                  fontSize: 12, lineHeight: 1.5, color: "var(--color-text-tertiary)",
                  margin: 0,
                }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{
          maxWidth: 600, margin: "64px auto 0", padding: "0 24px", textAlign: "center",
          animation: "ts-fadeUp 0.7s 0.8s ease-out both",
        }}>
          <div style={{
            ...glassCard, padding: "40px 36px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))",
            border: "1px solid rgba(99,102,241,0.15)",
          }}>
            <FaStar style={{ fontSize: 24, color: "#f59e0b", marginBottom: 12 }} />
            <h3 style={{
              fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)",
              marginBottom: 8, letterSpacing: "-0.02em",
            }}>
              Ready to Create Your Payroll Document?
            </h3>
            <p style={{
              fontSize: 14, color: "var(--color-text-secondary)",
              marginBottom: 24, maxWidth: 380, marginLeft: "auto", marginRight: "auto",
            }}>
              Pick any template and create a professional, secure payroll document in minutes.
              $20 per pay date.
            </p>
            <Link
              to={isLoggedIn ? "/paystubs" : "/login"}
              onClick={() => {
                if (!isLoggedIn) localStorage.setItem("clickStartAstrosync", true);
              }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 36px", borderRadius: 14, fontSize: 16, fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
                textDecoration: "none", letterSpacing: "0.01em",
                backgroundSize: "200% 200%",
                animation: "ts-gradient 4s ease infinite",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,0.35)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Start Creating <FaArrowRight style={{ fontSize: 14 }} />
            </Link>
          </div>
        </div>

        {/* ── Responsive ── */}
        <style>{`
          @media (max-width: 900px) {
            .ts-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .ts-features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 600px) {
            .ts-grid { grid-template-columns: 1fr !important; }
            .ts-features-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    );
  }
}

export default TemplateShowcase;
