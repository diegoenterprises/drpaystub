import React from "react";
import { Helmet } from "react-helmet";

const SITE_NAME = "Saurellius";
const BASE_URL = "https://www.drpaystub.net";
const DEFAULT_IMAGE = `${BASE_URL}/logo512.png`;
const DEFAULT_DESCRIPTION =
  "Create professional, secure payroll check stubs in minutes. Bank-grade accuracy with federal & state tax calculations, digital signatures, and premium templates. Trusted by thousands of businesses.";

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = "",
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd = null,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Professional Paystub Generator | Secure & FICA Compliant`;
  const canonical = `${BASE_URL}${path}`;
  const fullImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  const baseKeywords =
    "paystub generator, pay stub maker, payroll check stub, create paystub online, paystub creator, " +
    "paycheck stub generator, salary pay stub, hourly pay stub, W2 form generator, " +
    "FICA compliant paystub, federal tax calculator, state tax calculator, " +
    "employee pay stub, self employed paystub, contractor pay stub, " +
    "professional paystub template, digital paystub, online payroll, " +
    "saurellius, dr paystub, drpaystub";

  const allKeywords = keywords ? `${keywords}, ${baseKeywords}` : baseKeywords;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
