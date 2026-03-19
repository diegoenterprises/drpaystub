import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock,
  FaPaperPlane, FaCheckCircle, FaTimesCircle, FaTimes,
  FaChevronDown, FaShieldAlt, FaHeadset, FaBolt,
} from "react-icons/fa";
import { axios } from "../../../HelperFunctions/axios";
import SEO from "../../SEO";
import "./Contact.scss";

// ─── Inject keyframes once ───────────────────────────────────────────────────
let _injected = false;
function injectContactStyles() {
  if (_injected) return;
  _injected = true;
  const css = `
    @keyframes ct-fadeUp { 0%{opacity:0;transform:translateY(24px)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes ct-fadeIn { 0%{opacity:0} 100%{opacity:1} }
    @keyframes ct-scaleIn { 0%{opacity:0;transform:scale(0.85)} 100%{opacity:1;transform:scale(1)} }
    @keyframes ct-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes ct-float { 0%{transform:translateY(0)} 50%{transform:translateY(-6px)} 100%{transform:translateY(0)} }
    @keyframes ct-pulse { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.3)} 70%{box-shadow:0 0 0 12px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
    @keyframes ct-gradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes ct-check-bounce { 0%{transform:scale(0)} 50%{transform:scale(1.2)} 100%{transform:scale(1)} }
    @keyframes ct-orb-drift { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.1)} 66%{transform:translate(-15px,15px) scale(0.95)} 100%{transform:translate(0,0) scale(1)} }
  `;
  const el = document.createElement("style");
  el.textContent = css;
  document.head.appendChild(el);
}

// ─── FAQ data ────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: "How quickly will I receive a response?", a: "We typically respond within 2-4 business hours during our operating hours. For urgent matters, please call us directly." },
  { q: "Can I request a custom pay stub format?", a: "Yes. Reach out with your specific requirements and our team will work with you to accommodate your needs." },
  { q: "Is my personal information secure?", a: "Absolutely. All data is encrypted in transit and at rest. We never share your information with third parties." },
  { q: "Do you offer refunds?", a: "All sales are final. We do not offer refunds. Please review your information carefully before completing your purchase." },
];

// ─── Contact Info Cards ──────────────────────────────────────────────────────
const CONTACT_CHANNELS = [
  {
    icon: <FaEnvelope />,
    label: "Email Us",
    value: "diego@drpaystub.net",
    href: "mailto:diego@drpaystub.net",
    accent: "#6366f1",
  },
  {
    icon: <FaPhone />,
    label: "Call Us",
    value: "(530) 456-6135",
    href: "tel:+15304566135",
    accent: "#10b981",
  },
  {
    icon: <FaMapMarkerAlt />,
    label: "Visit Us",
    value: "221 N Broadstreet, Suite 3A",
    sub: "Middletown, DE 19709",
    href: "https://maps.google.com/?q=221+N+Broadstreet+Suite+3A+Middletown+DE+19709",
    accent: "#f59e0b",
  },
  {
    icon: <FaClock />,
    label: "Business Hours",
    value: "Mon - Fri: 9AM - 6PM EST",
    sub: "Sat: 10AM - 2PM EST",
    accent: "#8b5cf6",
  },
];

// ─── Shared styles ───────────────────────────────────────────────────────────
const glassCard = {
  background: "var(--color-bg-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 20,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

const inputBase = {
  width: "100%", padding: "14px 16px", fontSize: 14,
  fontFamily: "inherit", fontWeight: 400,
  background: "var(--color-bg)", color: "var(--color-text-primary)",
  border: "1px solid var(--color-border)", borderRadius: 12,
  outline: "none", transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

// ─── Main Component ──────────────────────────────────────────────────────────
export class Contact extends Component {
  state = {
    name: "",
    email: "",
    subject: "",
    message: "",
    sending: false,
    sent: false,
    error: false,
    focusedField: null,
    expandedFaq: null,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    injectContactStyles();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ sending: true, error: false });
    axios.post("/api/sendmails/contact", {
      name: this.state.name,
      email: this.state.email,
      subject: this.state.subject,
      message: this.state.message,
    }).then((res) => {
      if (res.data.mailSent === true) {
        this.setState({ sent: true, sending: false });
      } else {
        this.setState({ error: true, sending: false });
      }
    }).catch(() => {
      this.setState({ error: true, sending: false });
    });
  };

  render() {
    const { name, email, subject, message, sending, sent, error, focusedField, expandedFaq } = this.state;

    return (
      <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
        <SEO
          title="Contact Us"
          description="Get in touch with the Saurellius team. Have questions about payroll documents, tax calculations, or your account? We're here to help with fast, friendly support."
          path="/contact"
          keywords="contact saurellius, payroll support, payroll help, dr paystub contact"
        />

        {/* ── Hero Section ── */}
        <div style={{
          position: "relative", overflow: "hidden",
          padding: "100px 24px 60px", textAlign: "center",
        }}>
          {/* Animated orbs */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{
              position: "absolute", width: 300, height: 300, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
              top: "10%", left: "5%", filter: "blur(40px)",
              animation: "ct-orb-drift 15s ease-in-out infinite",
            }} />
            <div style={{
              position: "absolute", width: 250, height: 250, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
              top: "20%", right: "10%", filter: "blur(40px)",
              animation: "ct-orb-drift 18s 3s ease-in-out infinite",
            }} />
            <div style={{
              position: "absolute", width: 200, height: 200, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
              bottom: "10%", left: "40%", filter: "blur(40px)",
              animation: "ct-orb-drift 12s 6s ease-in-out infinite",
            }} />
          </div>

          <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18, margin: "0 auto 20px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, color: "#fff",
              animation: "ct-scaleIn 0.6s ease-out, ct-float 4s 1s ease-in-out infinite",
              boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
            }}>
              <FaHeadset />
            </div>
            <h1 style={{
              fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15,
              color: "var(--color-text-primary)", marginBottom: 12,
              animation: "ct-fadeUp 0.7s ease-out",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
            }}>
              Get in Touch
            </h1>
            <p style={{
              fontSize: 17, lineHeight: 1.6, color: "var(--color-text-secondary)",
              maxWidth: 440, margin: "0 auto",
              animation: "ct-fadeUp 0.7s 0.1s ease-out both",
            }}>
              Have a question about your payroll documents or need help with your account?
              We're here to help.
            </p>
          </div>
        </div>

        {/* ── Trust Badges ── */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap",
          padding: "0 24px", marginBottom: 48,
          animation: "ct-fadeUp 0.7s 0.2s ease-out both",
        }}>
          {[
            { icon: <FaBolt />, text: "Fast Response", color: "#f59e0b" },
            { icon: <FaShieldAlt />, text: "Secure & Private", color: "#10b981" },
            { icon: <FaHeadset />, text: "Expert Support", color: "#6366f1" },
          ].map((b, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)",
              letterSpacing: "0.02em",
            }}>
              <span style={{ color: b.color, fontSize: 14 }}>{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>

        {/* ── Main Content Grid ── */}
        <div className="contact-grid-override" style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 24px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32,
        }}>

          {/* ── Left: Contact Form ── */}
          <div style={{
            ...glassCard, padding: "40px 36px",
            animation: "ct-fadeUp 0.7s 0.25s ease-out both",
          }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px",
                  background: "rgba(16,185,129,0.1)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  animation: "ct-check-bounce 0.5s ease-out",
                }}>
                  <FaCheckCircle style={{ fontSize: 32, color: "#10b981" }} />
                </div>
                <h3 style={{
                  fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)",
                  marginBottom: 8, letterSpacing: "-0.02em",
                }}>Message Sent</h3>
                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
                  Thank you for reaching out. We'll get back to you within 2-4 business hours.
                </p>
                <Link to="/" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
                  textDecoration: "none", transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  Back to Home
                </Link>
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px",
                  background: "rgba(239,68,68,0.1)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  animation: "ct-check-bounce 0.5s ease-out",
                }}>
                  <FaTimesCircle style={{ fontSize: 32, color: "#ef4444" }} />
                </div>
                <h3 style={{
                  fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)",
                  marginBottom: 8, letterSpacing: "-0.02em",
                }}>Something Went Wrong</h3>
                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
                  We couldn't deliver your message. Please try again or contact us directly.
                </p>
                <button onClick={() => this.setState({ error: false })} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
                  border: "none", cursor: "pointer",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <h2 style={{
                  fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)",
                  marginBottom: 4, letterSpacing: "-0.02em",
                }}>
                  Send Us a Message
                </h2>
                <p style={{
                  fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: 28,
                }}>
                  Fill out the form below and we'll respond promptly.
                </p>
                <form onSubmit={this.handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{
                        display: "block", fontSize: 12, fontWeight: 600,
                        color: "var(--color-text-secondary)", marginBottom: 6,
                        letterSpacing: "0.03em", textTransform: "uppercase",
                      }}>Name</label>
                      <input
                        type="text" required value={name}
                        onChange={(e) => this.setState({ name: e.target.value })}
                        onFocus={() => this.setState({ focusedField: "name" })}
                        onBlur={() => this.setState({ focusedField: null })}
                        placeholder="John Doe"
                        style={{
                          ...inputBase,
                          borderColor: focusedField === "name" ? "#6366f1" : "var(--color-border)",
                          boxShadow: focusedField === "name" ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: "block", fontSize: 12, fontWeight: 600,
                        color: "var(--color-text-secondary)", marginBottom: 6,
                        letterSpacing: "0.03em", textTransform: "uppercase",
                      }}>Email</label>
                      <input
                        type="email" required value={email}
                        onChange={(e) => this.setState({ email: e.target.value })}
                        onFocus={() => this.setState({ focusedField: "email" })}
                        onBlur={() => this.setState({ focusedField: null })}
                        placeholder="john@example.com"
                        style={{
                          ...inputBase,
                          borderColor: focusedField === "email" ? "#6366f1" : "var(--color-border)",
                          boxShadow: focusedField === "email" ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{
                      display: "block", fontSize: 12, fontWeight: 600,
                      color: "var(--color-text-secondary)", marginBottom: 6,
                      letterSpacing: "0.03em", textTransform: "uppercase",
                    }}>Subject</label>
                    <input
                      type="text" required value={subject}
                      onChange={(e) => this.setState({ subject: e.target.value })}
                      onFocus={() => this.setState({ focusedField: "subject" })}
                      onBlur={() => this.setState({ focusedField: null })}
                      placeholder="How can we help?"
                      style={{
                        ...inputBase,
                        borderColor: focusedField === "subject" ? "#6366f1" : "var(--color-border)",
                        boxShadow: focusedField === "subject" ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{
                      display: "block", fontSize: 12, fontWeight: 600,
                      color: "var(--color-text-secondary)", marginBottom: 6,
                      letterSpacing: "0.03em", textTransform: "uppercase",
                    }}>Message</label>
                    <textarea
                      required rows="5" value={message}
                      onChange={(e) => this.setState({ message: e.target.value })}
                      onFocus={() => this.setState({ focusedField: "message" })}
                      onBlur={() => this.setState({ focusedField: null })}
                      placeholder="Tell us what you need help with..."
                      style={{
                        ...inputBase, resize: "vertical", minHeight: 120,
                        borderColor: focusedField === "message" ? "#6366f1" : "var(--color-border)",
                        boxShadow: focusedField === "message" ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
                      }}
                    />
                  </div>

                  <button type="submit" disabled={sending} style={{
                    width: "100%", padding: "14px 24px", border: "none", borderRadius: 12,
                    fontSize: 15, fontWeight: 600, cursor: sending ? "not-allowed" : "pointer",
                    color: "#fff", letterSpacing: "0.01em",
                    background: sending
                      ? "var(--color-text-tertiary)"
                      : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    backgroundSize: "200% 200%",
                    animation: !sending ? "ct-gradient 4s ease infinite" : "none",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.2s ease",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    opacity: sending ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => { if (!sending) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.3)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {sending ? (
                      <>
                        <div style={{
                          width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff", borderRadius: "50%",
                          animation: "ct-gradient 0.8s linear infinite",
                        }} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane style={{ fontSize: 13 }} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* ── Right: Contact Info + FAQ ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Contact channels */}
            <div style={{
              ...glassCard, padding: "32px 28px",
              animation: "ct-fadeUp 0.7s 0.35s ease-out both",
            }}>
              <h3 style={{
                fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)",
                marginBottom: 20, letterSpacing: "-0.02em",
              }}>
                Contact Information
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {CONTACT_CHANNELS.map((ch, i) => (
                  <a
                    key={i}
                    href={ch.href || "#"}
                    target={ch.href?.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "14px 16px", borderRadius: 14,
                      background: "var(--color-bg)", border: "1px solid var(--color-border)",
                      textDecoration: "none", transition: "all 0.2s ease",
                      cursor: ch.href ? "pointer" : "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = ch.accent;
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 4px 16px ${ch.accent}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: `${ch.accent}12`, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 16, color: ch.accent,
                    }}>
                      {ch.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                        letterSpacing: "0.06em", color: "var(--color-text-tertiary)",
                        marginBottom: 3,
                      }}>{ch.label}</div>
                      <div style={{
                        fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)",
                      }}>{ch.value}</div>
                      {ch.sub && (
                        <div style={{
                          fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 2,
                        }}>{ch.sub}</div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div style={{
              ...glassCard, padding: "32px 28px",
              animation: "ct-fadeUp 0.7s 0.45s ease-out both",
            }}>
              <h3 style={{
                fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)",
                marginBottom: 16, letterSpacing: "-0.02em",
              }}>
                Frequently Asked Questions
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {FAQ_ITEMS.map((faq, i) => {
                  const isOpen = expandedFaq === i;
                  return (
                    <div key={i} style={{
                      borderBottom: i < FAQ_ITEMS.length - 1 ? "1px solid var(--color-border)" : "none",
                    }}>
                      <button
                        onClick={() => this.setState({ expandedFaq: isOpen ? null : i })}
                        style={{
                          width: "100%", padding: "14px 0", border: "none",
                          background: "transparent", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          gap: 12, textAlign: "left",
                        }}
                      >
                        <span style={{
                          fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)",
                          lineHeight: 1.4,
                        }}>{faq.q}</span>
                        <FaChevronDown style={{
                          fontSize: 11, color: "var(--color-text-tertiary)", flexShrink: 0,
                          transition: "transform 0.25s ease",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }} />
                      </button>
                      <div style={{
                        maxHeight: isOpen ? 120 : 0, overflow: "hidden",
                        transition: "max-height 0.3s ease, opacity 0.25s ease, padding 0.3s ease",
                        opacity: isOpen ? 1 : 0,
                        paddingBottom: isOpen ? 14 : 0,
                      }}>
                        <p style={{
                          fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)",
                          margin: 0,
                        }}>{faq.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{
          maxWidth: 700, margin: "56px auto 0", padding: "0 24px", textAlign: "center",
          animation: "ct-fadeUp 0.7s 0.55s ease-out both",
        }}>
          <div style={{
            ...glassCard, padding: "32px 36px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))",
            border: "1px solid rgba(99,102,241,0.15)",
          }}>
            <p style={{
              fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)",
              marginBottom: 4,
            }}>
              Need immediate assistance?
            </p>
            <p style={{
              fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16,
            }}>
              Call us directly at <a href="tel:+15304566135" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>(530) 456-6135</a> during business hours or email us anytime.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <a href="mailto:diego@drpaystub.net" style={{
                padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <FaEnvelope style={{ fontSize: 12 }} /> Email Us
              </a>
              <a href="tel:+15304566135" style={{
                padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "transparent", color: "var(--color-text-primary)",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                border: "1px solid var(--color-border)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <FaPhone style={{ fontSize: 11 }} /> Call Us
              </a>
            </div>
          </div>
        </div>

        {/* ── Responsive override ── */}
        <style>{`
          @media (max-width: 768px) {
            .contact-grid-override { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    );
  }
}

export default Contact;
