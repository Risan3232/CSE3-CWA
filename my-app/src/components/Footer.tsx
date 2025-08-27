export default function Footer({ name, studentNumber }: { name: string; studentNumber: string }) {
  const now = new Date();
  const date = now.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  return (
    <footer className="footer" role="contentinfo">
      <div className="container" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <small>
          © {now.getFullYear()} – {name} – {studentNumber} – {date}
        </small>
        <a href="#main" className="nav-link" style={{textDecoration:"underline"}}>Skip to main</a>
      </div>
    </footer>
  );
}
