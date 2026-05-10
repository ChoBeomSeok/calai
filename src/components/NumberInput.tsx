"use client";

import { useState, useEffect } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  step?: number;
};

function formatWithCommas(s: string): string {
  if (!s) return "";
  const cleaned = s.replace(/,/g, "");
  if (!/^-?\d*\.?\d*$/.test(cleaned)) return s;
  const [intPart, decPart] = cleaned.split(".");
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
}

function stripCommas(s: string): string {
  return s.replace(/,/g, "");
}

export default function NumberInput({
  value,
  onChange,
  placeholder,
  className = "",
  min = 0,
  step,
}: Props) {
  const [display, setDisplay] = useState(formatWithCommas(value));

  useEffect(() => {
    setDisplay(formatWithCommas(value));
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      value={display}
      placeholder={placeholder}
      className={className}
      onChange={(e) => {
        const raw = stripCommas(e.target.value);
        if (raw === "" || /^-?\d*\.?\d*$/.test(raw)) {
          setDisplay(formatWithCommas(raw));
          onChange(raw);
        }
      }}
      onBlur={() => {
        const num = parseFloat(stripCommas(display));
        if (!isNaN(num) && min !== undefined && num < min) {
          onChange(String(min));
        }
      }}
    />
  );
}
