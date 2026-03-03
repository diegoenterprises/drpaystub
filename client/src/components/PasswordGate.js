import React, { useState, useEffect } from "react";
import SaurelliusLogo from "./SaurelliusLogo";
import ThemeToggle from "./ThemeToggle";

const PASSWORD = "ESANG2026";
const STORAGE_KEY = "drpaystub_auth";

const PasswordGate = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setAuthenticated(true);
    }
    // Initialize theme from localStorage
    const theme = localStorage.getItem("drpaystub_theme");
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY, "true");
      setError("");
    } else {
      setError("Incorrect password.");
      setPassword("");
    }
  };

  if (authenticated) {
    return children;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--color-bg)",
        fontFamily: "var(--font-stack)",
        WebkitFontSmoothing: "antialiased",
        transition: "background 0.25s ease",
        position: "relative",
      }}
    >
      {/* Theme toggle in top-right */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <ThemeToggle />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        {/* Saurellius Logo */}
        <div style={{ margin: "0 auto 28px", display: "inline-block" }}>
          <SaurelliusLogo size={72} />
        </div>

        <h1
          className="gradient-text"
          style={{
            fontSize: "28px",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            marginBottom: "6px",
            lineHeight: 1.2,
          }}
        >
          Saurellius
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--color-text-secondary)",
            marginBottom: "36px",
            fontWeight: 400,
          }}
        >
          Enter your password to continue
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="Password"
            autoFocus
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "12px",
              border: error
                ? "1.5px solid var(--color-error)"
                : focused
                ? "1.5px solid var(--color-accent)"
                : "1.5px solid var(--color-border-strong)",
              background: "var(--color-bg-elevated)",
              color: "var(--color-text-primary)",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.25s ease",
              boxShadow: focused
                ? "0 0 0 3px rgba(20, 115, 255, 0.15)"
                : error
                ? "0 0 0 3px rgba(255, 59, 48, 0.1)"
                : "none",
              fontFamily: "inherit",
              letterSpacing: "0.02em",
            }}
          />
          {error && (
            <p
              style={{
                color: "var(--color-error)",
                fontSize: "13px",
                marginTop: "10px",
                marginBottom: "0",
                fontWeight: 500,
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "16px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #1473FF 0%, #BE01FF 100%)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease",
              fontFamily: "inherit",
              letterSpacing: "-0.01em",
            }}
            onMouseOver={(e) => {
              e.target.style.filter = "brightness(1.1)";
              e.target.style.boxShadow = "0 4px 20px rgba(20, 115, 255, 0.35)";
            }}
            onMouseOut={(e) => {
              e.target.style.filter = "brightness(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            Continue
          </button>
        </form>

        <p
          style={{
            fontSize: "12px",
            color: "var(--color-text-tertiary)",
            marginTop: "32px",
            fontWeight: 400,
          }}
        >
          Saurellius by Dr. Paystub Corp
        </p>
      </div>
    </div>
  );
};

export default PasswordGate;
