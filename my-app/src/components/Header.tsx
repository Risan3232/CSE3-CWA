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
            className="btn"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="main-menu"
            onClick={() => setOpen(v => !v)}
          >
            ☰
          </button>
        </div>
        <nav id="main-menu" role="navigation" aria-label="Main" style={{display: open ? "block" : "none"}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
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
