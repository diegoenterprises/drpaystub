import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../LegalPages.css';

export default function PrivacyPolicy() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <span className="legal-hero-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Your Privacy Matters
                </span>
                <h1>Privacy Policy</h1>
                <p className="legal-hero-sub">
                    At Saurellius, we are committed to protecting your personal information and being transparent about how we collect, use, and safeguard your data.
                </p>
            </div>

            <div className="legal-container">
                <div className="legal-toc">
                    <h3>Table of Contents</h3>
                    <ol>
                        <li><a href="#pp-info-collect">Information We Collect</a></li>
                        <li><a href="#pp-when-collect">When We Collect Information</a></li>
                        <li><a href="#pp-how-use">How We Use Your Information</a></li>
                        <li><a href="#pp-protection">How We Protect Your Information</a></li>
                        <li><a href="#pp-cookies">Cookies &amp; Tracking</a></li>
                        <li><a href="#pp-third-party">Third-Party Disclosure</a></li>
                        <li><a href="#pp-caloppa">California Privacy Rights (CalOPPA)</a></li>
                        <li><a href="#pp-coppa">Children's Privacy (COPPA)</a></li>
                        <li><a href="#pp-data-breach">Data Breach Response</a></li>
                        <li><a href="#pp-canspam">CAN-SPAM Compliance</a></li>
                        <li><a href="#pp-contact">Contact Us</a></li>
                    </ol>
                </div>

                <div className="legal-highlight">
                    <p><strong>Effective Date:</strong> January 1, 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> March 2, 2026</p>
                </div>

                {/* 1 */}
                <section className="legal-section" id="pp-info-collect">
                    <div className="legal-section-header">
                        <span className="legal-section-num">1</span>
                        <h2>Information We Collect</h2>
                    </div>
                    <p>When ordering or registering on our site, you may be asked to provide certain Personally Identifiable Information (PII) to help you with your experience. This may include:</p>
                    <ul>
                        <li>Full name and email address</li>
                        <li>Mailing address and phone number</li>
                        <li>Credit or debit card information (processed securely via Stripe)</li>
                        <li>Employment details such as company name, EIN, and salary information entered for paystub generation</li>
                        <li>Social Security Number (partial or full, as entered by you for paystub formatting)</li>
                    </ul>
                    <div className="legal-highlight">
                        <p><strong>Important:</strong> We do not store your full Social Security Number or credit card details on our servers. Payment processing is handled entirely by Stripe, a PCI DSS Level 1 certified payment processor.</p>
                    </div>
                </section>

                {/* 2 */}
                <section className="legal-section" id="pp-when-collect">
                    <div className="legal-section-header">
                        <span className="legal-section-num">2</span>
                        <h2>When We Collect Information</h2>
                    </div>
                    <p>We collect information from you when you:</p>
                    <ul>
                        <li>Register an account on our platform</li>
                        <li>Place an order or fill out the paystub generation form</li>
                        <li>Subscribe to our newsletter or marketing communications</li>
                        <li>Contact us through our support channels</li>
                        <li>Browse our website (anonymized analytics data only)</li>
                    </ul>
                </section>

                {/* 3 */}
                <section className="legal-section" id="pp-how-use">
                    <div className="legal-section-header">
                        <span className="legal-section-num">3</span>
                        <h2>How We Use Your Information</h2>
                    </div>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li><strong>Generate your documents</strong> — to create accurate, professional payroll check stubs based on the data you provide</li>
                        <li><strong>Process transactions</strong> — to quickly and securely process your payments</li>
                        <li><strong>Personalize your experience</strong> — to deliver content and product offerings relevant to your interests</li>
                        <li><strong>Improve our service</strong> — to continuously enhance our platform based on user feedback and behavior</li>
                        <li><strong>Communicate with you</strong> — to send order confirmations, respond to inquiries, and provide customer support</li>
                        <li><strong>Ensure security</strong> — to protect against unauthorized access, fraud, and abuse</li>
                    </ul>
                </section>

                {/* 4 */}
                <section className="legal-section" id="pp-protection">
                    <div className="legal-section-header">
                        <span className="legal-section-num">4</span>
                        <h2>How We Protect Your Information</h2>
                    </div>
                    <p>We take data security seriously and implement multiple layers of protection:</p>
                    <ul>
                        <li><strong>SSL/TLS Encryption</strong> — all data transmitted between your browser and our servers is encrypted using industry-standard TLS 1.3 protocols</li>
                        <li><strong>Secure Infrastructure</strong> — our platform is hosted on Microsoft Azure with enterprise-grade security, including DDoS protection and regular vulnerability scanning</li>
                        <li><strong>Access Controls</strong> — personal information is accessible only by authorized personnel who are required to maintain confidentiality</li>
                        <li><strong>PCI Compliance</strong> — all payment transactions are processed through Stripe and are never stored on our servers</li>
                        <li><strong>Regular Audits</strong> — our systems undergo regular security scans and malware monitoring</li>
                    </ul>
                </section>

                {/* 5 */}
                <section className="legal-section" id="pp-cookies">
                    <div className="legal-section-header">
                        <span className="legal-section-num">5</span>
                        <h2>Cookies &amp; Tracking</h2>
                    </div>
                    <p>We use minimal cookies that are essential for the operation of our service. We do not use cookies for invasive tracking purposes.</p>
                    <p><strong>Essential cookies</strong> are used to maintain your session, remember your preferences, and ensure the proper functioning of the website.</p>
                    <p><strong>Analytics</strong> — we may use anonymized analytics to understand how users interact with our platform and improve our services. You can opt out of analytics tracking at any time through your browser settings or by using the Google Analytics Opt-Out Browser Add-on.</p>
                    <p>We honor <strong>Do Not Track (DNT)</strong> signals. When a DNT browser mechanism is detected, we do not plant tracking cookies or serve targeted advertising.</p>
                </section>

                {/* 6 */}
                <section className="legal-section" id="pp-third-party">
                    <div className="legal-section-header">
                        <span className="legal-section-num">6</span>
                        <h2>Third-Party Disclosure</h2>
                    </div>
                    <p><strong>We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties.</strong></p>
                    <p>This does not include trusted third parties who assist us in operating our website, conducting our business, or serving you — so long as those parties agree to keep this information confidential. These trusted partners include:</p>
                    <ul>
                        <li><strong>Stripe</strong> — payment processing</li>
                        <li><strong>Microsoft Azure</strong> — cloud hosting and email delivery</li>
                    </ul>
                    <p>We may also release information when its release is appropriate to comply with the law, enforce our site policies, or protect our or others' rights, property, or safety.</p>
                </section>

                {/* 7 */}
                <section className="legal-section" id="pp-caloppa">
                    <div className="legal-section-header">
                        <span className="legal-section-num">7</span>
                        <h2>California Privacy Rights (CalOPPA)</h2>
                    </div>
                    <p>In accordance with the California Online Privacy Protection Act, we agree to the following:</p>
                    <ul>
                        <li>Users can visit our site anonymously</li>
                        <li>Our Privacy Policy link is prominently displayed on our website and includes the word "Privacy"</li>
                        <li>You will be notified of any Privacy Policy changes on this page</li>
                        <li>You can request changes to your personal information by emailing us at <strong>support@drpaystub.net</strong></li>
                    </ul>
                </section>

                {/* 8 */}
                <section className="legal-section" id="pp-coppa">
                    <div className="legal-section-header">
                        <span className="legal-section-num">8</span>
                        <h2>Children's Privacy (COPPA)</h2>
                    </div>
                    <p>We comply with the Children's Online Privacy Protection Act (COPPA). Our service is designed for adults and we do not knowingly collect personal information from children under the age of 13. If we discover that we have inadvertently collected information from a child under 13, we will delete that information immediately.</p>
                </section>

                {/* 9 */}
                <section className="legal-section" id="pp-data-breach">
                    <div className="legal-section-header">
                        <span className="legal-section-num">9</span>
                        <h2>Data Breach Response</h2>
                    </div>
                    <p>In line with Fair Information Practices, should a data breach occur:</p>
                    <ul>
                        <li>We will notify affected users <strong>via email within 1 business day</strong></li>
                        <li>We will post an <strong>in-site notification within 1 business day</strong></li>
                        <li>We will work with law enforcement as required and take immediate steps to mitigate any harm</li>
                    </ul>
                    <p>We uphold the Individual Redress Principle — you have the right to legally pursue enforceable rights against data collectors and processors who fail to adhere to the law.</p>
                </section>

                {/* 10 */}
                <section className="legal-section" id="pp-canspam">
                    <div className="legal-section-header">
                        <span className="legal-section-num">10</span>
                        <h2>CAN-SPAM Compliance</h2>
                    </div>
                    <p>We collect your email address to:</p>
                    <ul>
                        <li>Send order confirmations, receipts, and document delivery notifications</li>
                        <li>Respond to inquiries and support requests</li>
                        <li>Send service updates and product announcements (with your consent)</li>
                    </ul>
                    <p>In compliance with the CAN-SPAM Act, we agree to:</p>
                    <ul>
                        <li>Never use false or misleading subjects or sender addresses</li>
                        <li>Clearly identify messages as advertisements where applicable</li>
                        <li>Include our physical business address in communications</li>
                        <li>Honor opt-out and unsubscribe requests promptly</li>
                        <li>Allow users to unsubscribe via a link at the bottom of each email</li>
                    </ul>
                </section>

                {/* 11 */}
                <section className="legal-section" id="pp-contact">
                    <div className="legal-section-header">
                        <span className="legal-section-num">11</span>
                        <h2>Contact Us</h2>
                    </div>
                    <p>If you have any questions regarding this privacy policy, you may contact us at:</p>
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
