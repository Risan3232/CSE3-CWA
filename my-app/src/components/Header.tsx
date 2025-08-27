"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
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

export default function Header({ studentNumber }: { studentNumber: string }) {
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState<string>("/");

  useEffect(() => {
    const current = typeof window !== "undefined" ? window.location.pathname : "/";
    setActivePath(current);
    const last = getCookie("activeTab");
    if (last) setActivePath(last);
  }, []);

  useEffect(() => {
    if (activePath) setCookie("activeTab", activePath);
  }, [activePath]);

  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className="nav-link"
      aria-current={activePath === href ? "page" : undefined}
      onClick={() => setActivePath(href)}
    >
      {label}
    </Link>
  );

  return (
    <header className="header" role="banner">
      <div className="container" style={{display:"flex",alignItems:"center",gap:12,justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <strong aria-label="Student number" style={{fontWeight:800}}>{studentNumber}</strong>
          <button
            className="hamburger-btn"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="main-menu"
            onClick={() => setOpen(v => !v)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              position: "relative",
              width: "32px",
              height: "32px"
            }}
          >
            <div 
              className="hamburger-line"
              style={{
                width: "20px",
                height: "2px",
                background: "var(--foreground)",
                position: "absolute",
                left: "6px",
                top: "8px",
                transition: "all 0.3s ease",
                transform: open ? "rotate(45deg) translate(5px, 5px)" : "none"
              }}
            />
            <div 
              className="hamburger-line"
              style={{
                width: "20px",
                height: "2px",
                background: "var(--foreground)",
                position: "absolute",
                left: "6px",
                top: "15px",
                transition: "all 0.3s ease",
                opacity: open ? "0" : "1"
              }}
            />
            <div 
              className="hamburger-line"
              style={{
                width: "20px",
                height: "2px",
                background: "var(--foreground)",
                position: "absolute",
                left: "6px",
                top: "22px",
                transition: "all 0.3s ease",
                transform: open ? "rotate(-45deg) translate(7px, -6px)" : "none"
              }}
            />
          </button>
        </div>
        <nav 
          id="main-menu" 
          role="navigation" 
          aria-label="Main" 
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            right: "0",
            background: "var(--background)",
            border: "1px solid color-mix(in oklab, var(--foreground), #000 85%)",
            borderTop: "none",
            transform: open ? "translateY(0)" : "translateY(-10px)",
            opacity: open ? "1" : "0",
            visibility: open ? "visible" : "hidden",
            transition: "all 0.3s ease",
            zIndex: 1000
          }}
        >
          <div style={{display:"flex",gap:8,flexWrap:"wrap",padding:"16px"}}>
            <NavLink href="/" label="Home" />
            <NavLink href="/about" label="About" />
            <NavLink href="/escape-room" label="Escape Room" />
            <NavLink href="/coding-races" label="Coding Races" />
            <NavLink href="/court-room" label="Court Room" />
          </div>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
