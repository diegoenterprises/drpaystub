import React, { useEffect } from "react";
import {
  FaBullseye, FaBolt, FaLock, FaHandshake,
  FaFileAlt, FaCalculator, FaMapMarkedAlt, FaMobileAlt, FaShieldAlt, FaHeadset,
  FaLandmark,
} from "react-icons/fa";
import SEO from "../../SEO";

const FeatureCard = ({ icon, title, desc }) => (
  <div className="col-md-6 col-lg-4">
    <div className="dash-section-card" style={{ padding: "28px 24px", height: "100%", transition: "all 0.2s ease" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--gradient-brand-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)", margin: 0 }}>{desc}</p>
    </div>
  </div>
);

const StatBlock = ({ value, label }) => (
  <div className="col-6 col-md-3">
    <div style={{ textAlign: "center", padding: "20px 12px" }}>
      <div className="gradient-text" style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-tertiary)", marginTop: 4 }}>{label}</div>
    </div>
  </div>
);

export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ minHeight: "80vh", padding: "100px 0 60px" }}>
      <SEO
        title="About Us"
        description="Learn about Saurellius by Dr. Paystub Corp — the trusted cloud payroll management platform with FICA-compliant documents, bank-grade accuracy, and premium templates."
        path="/about"
        keywords="about saurellius, about dr paystub, paystub company, payroll company"
      />
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 56, padding: "0 20px" }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 8 }}>
          ABOUT SAURELLIUS
        </p>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 46px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.15 }}>
          Payroll made simple,<br />accurate, and instant.
        </h1>
        <p style={{ fontSize: 17, color: "var(--color-text-secondary)", maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>
          Saurellius was built to give small business owners, contractors, and self-employed professionals the power to create professional payroll documents in minutes — with IRS-compliant tax calculations you can trust.
        </p>
      </div>

      <div className="container">
        {/* Stats Bar */}
        <div className="dash-section-card" style={{ padding: "24px 16px", marginBottom: 48 }}>
          <div className="row">
            <StatBlock value="50+" label="States Covered" />
            <StatBlock value="IRS" label="Compliant Calculations" />
            <StatBlock value="24/7" label="Instant Access" />
            <StatBlock value="100%" label="Secure & Private" />
          </div>
        </div>

        {/* Our Story */}
        <div className="row" style={{ marginBottom: 56, alignItems: "center", gap: "32px 0" }}>
          <div className="col-lg-6">
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 8 }}>OUR STORY</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Built by entrepreneurs, for entrepreneurs.</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-secondary)", marginBottom: 12 }}>
              Saurellius was founded by American inventor and businessman Mike "Diego" Usoro through Diego Enterprises, Inc. After seeing how difficult and expensive it was for small businesses to produce accurate payroll documentation, Diego set out to build a platform that anyone could use — no accounting degree required.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-secondary)", margin: 0 }}>
              Today, Saurellius serves thousands of users nationwide, from freelancers and independent contractors to small business owners managing their first employees. Our mission is straightforward: make professional payroll documentation accessible, affordable, and accurate for everyone.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="dash-section-card" style={{ padding: 32, background: "var(--color-surface-elevated)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, letterSpacing: "-0.01em" }}>Our Core Values</h3>
              {[
                { icon: <FaBullseye />, title: "Accuracy First", desc: "Every calculation is validated against the Internal Revenue Code (IRC), Title 26 of the U.S. Code, and verified by our professional accountant partners." },
                { icon: <FaBolt />, title: "Speed & Simplicity", desc: "Create complete, professional payroll documents in under 5 minutes. No software to install, no learning curve." },
                { icon: <FaLock />, title: "Privacy & Security", desc: "Your personal and financial information is encrypted and never shared. We take data protection seriously." },
                { icon: <FaHandshake />, title: "Customer Commitment", desc: "Real support from real people. If you ever have a question, our team is here to help." },
              ].map((v, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 3 ? 18 : 0 }}>
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2, color: "var(--color-accent)" }}>{v.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{v.title}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 8 }}>WHAT WE OFFER</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>Everything you need for payroll documentation.</h2>
          <p style={{ fontSize: 15, color: "var(--color-text-secondary)", maxWidth: 540, margin: "0 auto" }}>
            Our Saurellius Tax API handles all the complex tax math so you can focus on running your business.
          </p>
        </div>

        <div className="row" style={{ gap: "20px 0", marginBottom: 56 }}>
          <FeatureCard
            icon={<FaFileAlt />}
            title="Professional Pay Stubs"
            desc="Choose from multiple templates and create polished, detailed payroll documents that are accepted by lenders, landlords, and government agencies."
          />
          <FeatureCard
            icon={<FaCalculator />}
            title="Automatic Tax Calculations"
            desc="Federal income tax, state income tax, Social Security, Medicare, and additional deductions — all calculated automatically based on the latest tax tables."
          />
          <FeatureCard
            icon={<FaMapMarkedAlt />}
            title="All 50 States Supported"
            desc="Whether you're in California with its 13.3% top rate or tax-free Texas, our engine handles every state's unique withholding rules and rates."
          />
          <FeatureCard
            icon={<FaMobileAlt />}
            title="Instant Digital Delivery"
            desc="Your payroll documents are created as secure PDFs and delivered instantly to your email. Download anytime from your personal dashboard."
          />
          <FeatureCard
            icon={<FaShieldAlt />}
            title="Secure & Encrypted"
            desc="All data is transmitted over encrypted connections and stored securely. Your sensitive information is protected with industry-standard security practices."
          />
          <FeatureCard
            icon={<FaHeadset />}
            title="Dedicated Support"
            desc="Have a question about tax withholding or need help with your stub? Our support team and knowledge base are always available to assist you."
          />
        </div>

        {/* Who It's For */}
        <div className="dash-section-card" style={{ padding: "36px 32px", marginBottom: 56 }}>
          <div className="row" style={{ alignItems: "center" }}>
            <div className="col-lg-5">
              <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 8 }}>WHO IT'S FOR</p>
              <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Built for the people who build America.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
                From solo entrepreneurs to growing teams, Saurellius gives you the tools to document your payroll professionally and accurately.
              </p>
            </div>
            <div className="col-lg-7">
              <div className="row" style={{ gap: "12px 0" }}>
                {[
                  { title: "Small Business Owners", desc: "Create payroll documents for your employees without expensive payroll software." },
                  { title: "Freelancers & Contractors", desc: "Create proof of income documentation for loans, leases, and taxes." },
                  { title: "Self-Employed Professionals", desc: "Document your earnings with professional pay stubs accepted everywhere." },
                  { title: "Household Employers", desc: "Pay your nanny, housekeeper, or caregiver with proper payroll records." },
                ].map((item, i) => (
                  <div className="col-sm-6" key={i}>
                    <div style={{ padding: "16px 14px", borderRadius: 10, background: "var(--color-surface-elevated)", height: "100%" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* IRS Compliance */}
        <div style={{ textAlign: "center", marginBottom: 56, padding: "0 20px" }}>
          <div className="dash-section-card" style={{ padding: "36px 32px", maxWidth: 700, margin: "0 auto" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--gradient-brand-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px", color: "var(--color-accent)" }}>
              <FaLandmark />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>IRS-Compliant Calculations</h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-secondary)", maxWidth: 560, margin: "0 auto 8px" }}>
              All Saurellius tax calculations are validated by our professional accountant partners and computed in accordance with the Internal Revenue Code (IRC), enacted by Congress in Title 26 of the United States Code (26 U.S.C.). Federal withholding, FICA, Medicare, and state-specific taxes are calculated using the most current published tax tables and rates.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "48px 20px 20px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>Ready to create your pay stub?</h2>
          <p style={{ fontSize: 15, color: "var(--color-text-secondary)", marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
            It takes less than 5 minutes. Accurate tax calculations, professional templates, instant delivery.
          </p>
          <a href="/paystubs" className="btn btn-secondary" style={{ minWidth: 200, fontSize: 15, padding: "12px 32px" }}>
            Create Your Pay Stub
          </a>
        </div>
      </div>
    </div>
  );
}
