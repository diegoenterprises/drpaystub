import React from "react";
import logoSvg from "../assets/img/saurellius-logo.svg";

const SaurelliusLogo = ({ size = 48, style = {} }) => (
  <img
    src={logoSvg}
    alt="Saurellius"
    width={size}
    height={size}
    style={{ objectFit: "contain", ...style }}
  />
);

export default SaurelliusLogo;
