import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../LegalPages.css';

export default function TermsAndCondition() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <span className="legal-hero-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    Legal Agreement
                </span>
                <h1>Terms of Service</h1>
                <p className="legal-hero-sub">
                    Please read these terms carefully before using Saurellius. By accessing or using our platform, you agree to be bound by these terms.
                </p>
            </div>

            <div className="legal-container">
                <div className="legal-toc">
                    <h3>Table of Contents</h3>
                    <ol>
                        <li><a href="#tos-acceptance">Acceptance of Terms</a></li>
                        <li><a href="#tos-description">Description of Service</a></li>
                        <li><a href="#tos-content">Content &amp; Intellectual Property</a></li>
                        <li><a href="#tos-use">Acceptable Use</a></li>
                        <li><a href="#tos-purchases">Purchases &amp; Payments</a></li>
                        <li><a href="#tos-accounts">Accounts &amp; Security</a></li>
                        <li><a href="#tos-privacy">Privacy</a></li>
                        <li><a href="#tos-third-party">Third-Party Links</a></li>
                        <li><a href="#tos-disclaimers">Disclaimers</a></li>
                        <li><a href="#tos-liability">Limitation of Liability</a></li>
                        <li><a href="#tos-indemnity">Indemnification</a></li>
                        <li><a href="#tos-governing">Governing Law &amp; Disputes</a></li>
                        <li><a href="#tos-misc">Miscellaneous</a></li>
                        <li><a href="#tos-contact">Contact Us</a></li>
                    </ol>
                </div>

                <div className="legal-highlight">
                    <p><strong>Effective Date:</strong> January 1, 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> March 2, 2026</p>
                </div>

                {/* 1 */}
                <section className="legal-section" id="tos-acceptance">
                    <div className="legal-section-header">
                        <span className="legal-section-num">1</span>
                        <h2>Acceptance of Terms</h2>
                    </div>
                    <p>These Terms of Service ("Terms") apply to the Saurellius website located at <strong>www.drpaystub.net</strong> and all associated services, features, and content (collectively, the "Service"). The Service is the property of Saurellius and its licensors.</p>
                    <p><strong>By using the Service, you agree to these Terms. If you do not agree, do not use the Service.</strong></p>
                    <p>Saurellius reserves the right to modify these Terms at any time. Changes become effective immediately upon posting. Your continued use of the Service after changes constitutes acceptance of those changes. We recommend reviewing these Terms periodically.</p>
                </section>

                {/* 2 */}
                <section className="legal-section" id="tos-description">
                    <div className="legal-section-header">
                        <span className="legal-section-num">2</span>
                        <h2>Description of Service</h2>
                    </div>
                    <p>Saurellius provides a digital platform for generating professional payroll check stubs. Our Service includes:</p>
                    <ul>
                        <li>A multi-step form for entering company and employee payroll information</li>
                        <li>Automated calculation of taxes, deductions, and net pay</li>
                        <li>Generation of secure, professionally formatted PDF paystub documents</li>
                        <li>Multiple premium template designs</li>
                        <li>Document delivery via email and direct download</li>
                    </ul>
                    <div className="legal-highlight">
                        <p><strong>Disclaimer:</strong> Saurellius is a document formatting tool. The accuracy of the information entered is your sole responsibility. We do not provide tax, legal, or financial advice.</p>
                    </div>
                </section>

                {/* 3 */}
                <section className="legal-section" id="tos-content">
                    <div className="legal-section-header">
                        <span className="legal-section-num">3</span>
                        <h2>Content &amp; Intellectual Property</h2>
                    </div>
                    <p>All text, graphics, user interfaces, visual interfaces, photographs, trademarks, logos, artwork, and computer code (collectively, "Content") contained on the Service is owned, controlled, or licensed by Saurellius and is protected by copyright, patent, trademark, and other intellectual property laws.</p>
                    <p>Without express prior written consent from Saurellius, no part of the Service or its Content may be:</p>
                    <ul>
                        <li>Copied, reproduced, or republished</li>
                        <li>Uploaded, posted, or publicly displayed</li>
                        <li>Encoded, translated, or transmitted</li>
                        <li>Distributed or "mirrored" to any other medium</li>
                        <li>Used for any commercial enterprise</li>
                    </ul>
                </section>

                {/* 4 */}
                <section className="legal-section" id="tos-use">
                    <div className="legal-section-header">
                        <span className="legal-section-num">4</span>
                        <h2>Acceptable Use</h2>
                    </div>
                    <p>You agree <strong>not</strong> to:</p>
                    <ul>
                        <li>Use automated tools (bots, scrapers, spiders) to access or monitor the Service</li>
                        <li>Impose an unreasonable load on our infrastructure or networks</li>
                        <li>Interfere with the proper functioning of the Service or any transaction</li>
                        <li>Forge headers or manipulate identifiers to disguise the origin of any communication</li>
                        <li>Impersonate another person or entity</li>
                        <li>Use the Service for any unlawful purpose or to solicit illegal activity</li>
                        <li>Attempt to gain unauthorized access to any part of the Service</li>
                    </ul>
                    <p>Saurellius reserves the right to terminate access for any user who violates these provisions.</p>
                </section>

                {/* 5 */}
                <section className="legal-section" id="tos-purchases">
                    <div className="legal-section-header">
                        <span className="legal-section-num">5</span>
                        <h2>Purchases &amp; Payments</h2>
                    </div>
                    <p>All purchases are processed securely through <strong>Stripe</strong>, a PCI DSS Level 1 certified payment processor. We do not store credit card information on our servers.</p>
                    <ul>
                        <li>Prices are displayed before checkout and may change without notice</li>
                        <li>All sales are final once the document has been generated and delivered</li>
                        <li>You must be of legal age in your jurisdiction to make a purchase</li>
                        <li>Additional terms may apply to specific promotions or features</li>
                    </ul>
                </section>

                {/* 6 */}
                <section className="legal-section" id="tos-accounts">
                    <div className="legal-section-header">
                        <span className="legal-section-num">6</span>
                        <h2>Accounts &amp; Security</h2>
                    </div>
                    <p>Certain features require you to create an account. You are responsible for:</p>
                    <ul>
                        <li>Maintaining the confidentiality of your account credentials</li>
                        <li>All activity that occurs under your account</li>
                        <li>Notifying us immediately of any unauthorized use or security breach</li>
                    </ul>
                    <p>You may not use another person's account without their permission. Saurellius is not liable for losses arising from your failure to secure your account.</p>
                </section>

                {/* 7 */}
                <section className="legal-section" id="tos-privacy">
                    <div className="legal-section-header">
                        <span className="legal-section-num">7</span>
                        <h2>Privacy</h2>
                    </div>
                    <p>Your use of the Service is also governed by our <Link to="/privacyPolicy" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Privacy Policy</Link>, which is incorporated into these Terms by reference.</p>
                    <p>By using the Service, you acknowledge that internet transmissions are never completely private or secure. Any information you send may potentially be read or intercepted by others, even when encrypted.</p>
                </section>

                {/* 8 */}
                <section className="legal-section" id="tos-third-party">
                    <div className="legal-section-header">
                        <span className="legal-section-num">8</span>
                        <h2>Third-Party Links</h2>
                    </div>
                    <p>The Service may contain links to third-party websites ("Linked Sites"). These are provided for convenience only. Saurellius does not control, endorse, or assume responsibility for the content, privacy policies, or practices of any Linked Sites.</p>
                    <p>Your interaction with Linked Sites is at your own risk and subject to those sites' own terms and policies.</p>
                </section>

                {/* 9 */}
                <section className="legal-section" id="tos-disclaimers">
                    <div className="legal-section-header">
                        <span className="legal-section-num">9</span>
                        <h2>Disclaimers</h2>
                    </div>
                    <div className="legal-highlight">
                        <p><strong>THE SERVICE IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS.</strong> Saurellius makes no warranties, express or implied, regarding the accuracy, reliability, or availability of the Service. We do not guarantee that the Service will be error-free, uninterrupted, or free of viruses or harmful components.</p>
                    </div>
                    <p>Saurellius reserves the right to:</p>
                    <ul>
                        <li>Modify, suspend, or terminate the Service at any time without notice</li>
                        <li>Change applicable policies and terms</li>
                        <li>Interrupt the Service for maintenance or error correction</li>
                    </ul>
                </section>

                {/* 10 */}
                <section className="legal-section" id="tos-liability">
                    <div className="legal-section-header">
                        <span className="legal-section-num">10</span>
                        <h2>Limitation of Liability</h2>
                    </div>
                    <p>To the maximum extent permitted by law, Saurellius shall not be liable for any indirect, consequential, exemplary, incidental, or punitive damages, including lost profits, arising from your use of the Service.</p>
                    <p>If Saurellius is found liable, our total liability shall not exceed the greater of: (1) the total fees paid by you in the six months prior to the claim, or (2) US$100.00.</p>
                    <p>Some jurisdictions do not allow limitations of liability, so the foregoing may not apply to you.</p>
                </section>

                {/* 11 */}
                <section className="legal-section" id="tos-indemnity">
                    <div className="legal-section-header">
                        <span className="legal-section-num">11</span>
                        <h2>Indemnification</h2>
                    </div>
                    <p>You agree to indemnify and hold harmless Saurellius, its officers, directors, employees, agents, and affiliates from any demands, losses, liabilities, claims, or expenses (including attorneys' fees) arising from your use of the Service or violation of these Terms.</p>
                </section>

                {/* 12 */}
                <section className="legal-section" id="tos-governing">
                    <div className="legal-section-header">
                        <span className="legal-section-num">12</span>
                        <h2>Governing Law &amp; Dispute Resolution</h2>
                    </div>
                    <p>These Terms are governed by the laws of the <strong>State of California, United States</strong>, without regard to conflicts of laws provisions.</p>
                    <ul>
                        <li>You consent to the jurisdiction of state and federal courts in Los Angeles County, California</li>
                        <li>EU consumers may bring claims in their country of residence</li>
                        <li>Claims must be brought within <strong>one (1) year</strong> after the cause of action arises</li>
                        <li>Disputes shall first be attempted to be resolved in good faith within 30 days, then through mediation if necessary</li>
                    </ul>
                </section>

                {/* 13 */}
                <section className="legal-section" id="tos-misc">
                    <div className="legal-section-header">
                        <span className="legal-section-num">13</span>
                        <h2>Miscellaneous</h2>
                    </div>
                    <ul>
                        <li><strong>Severability</strong> — if any provision is found unenforceable, the remaining provisions remain in full effect</li>
                        <li><strong>Entire Agreement</strong> — these Terms constitute the complete agreement between you and Saurellius regarding use of the Service</li>
                        <li><strong>No Waiver</strong> — failure to enforce any provision does not constitute a waiver of that right</li>
                        <li><strong>Export Compliance</strong> — you may not use or export any Content in violation of applicable laws, including U.S. export regulations</li>
                        <li><strong>Feedback</strong> — any feedback you provide is deemed non-confidential and may be used by Saurellius on an unrestricted basis</li>
                    </ul>
                </section>

                {/* 14 */}
                <section className="legal-section" id="tos-contact">
                    <div className="legal-section-header">
                        <span className="legal-section-num">14</span>
                        <h2>Contact Us</h2>
                    </div>
                    <p>If you have any questions regarding these Terms, you may contact us at:</p>
                    <ul>
                        <li><strong>Website:</strong> <a href="https://www.drpaystub.net/contact" style={{ color: 'var(--color-accent)' }}>www.drpaystub.net/contact</a></li>
                        <li><strong>Email:</strong> support@drpaystub.net</li>
                    </ul>
                </section>

                <div className="legal-footer">
                    <p>&copy; 2026 Saurellius. All rights reserved.</p>
                    <Link to="/paystubs" className="legal-cta">
                        Create Your Paystub Now
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
