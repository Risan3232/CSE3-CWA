"use client";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");

  useEffect(() => {
    const fromCookie = getCookie("theme");
    const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    let initial: "light" | "dark" | "auto" = "auto";
    if (fromCookie === "dark" || fromCookie === "light" || fromCookie === "auto") {
      initial = fromCookie as "light" | "dark" | "auto";
    }
    
    setTheme(initial);
    applyTheme(initial, systemDark);
  }, []);

  const applyTheme = (selectedTheme: "light" | "dark" | "auto", systemDark: boolean) => {
    if (selectedTheme === "auto") {
      document.documentElement.setAttribute("data-theme", systemDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", selectedTheme);
    }
  };

  const toggle = () => {
    const themes: ("light" | "dark" | "auto")[] = ["light", "dark", "auto"];
    const currentIndex = themes.indexOf(theme);
    const next = themes[(currentIndex + 1) % themes.length];
    
    setTheme(next);
    setCookie("theme", next);
    
    const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(next, systemDark);
  };

  const getThemeLabel = () => {
    switch(theme) {
      case "light": return "☀️ Light";
      case "dark": return "🌙 Dark";
      case "auto": return "🔄 Auto";
      default: return "Theme";
    }
  };

  return (
    <button className="btn secondary" onClick={toggle} aria-label="Toggle theme" title={`Current: ${theme} theme`}>
      {getThemeLabel()}
    </button>
  );
}
