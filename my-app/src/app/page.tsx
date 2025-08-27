"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("title");
  const [content, setContent] = useState("This is generated content.");
  const [bg, setBg] = useState("#e5e7eb");
  const [fg, setFg] = useState("#111827");

  const html = useMemo(() => {
    const esc = (s: string) => s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    const btnId = "btn-" + Math.random().toString(36).slice(2, 8);
    return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>${esc(title)}</title>\n</head>\n<body style="margin:0;padding:24px;background:${bg};color:${fg};font-family:Arial,Helvetica,sans-serif;">\n  <main style="max-width:900px;margin:auto;">\n    <h1 style="margin:0 0 16px 0;font-size:28px;">${esc(title)}</h1>\n    <p style="margin:0 0 16px 0;">${esc(content)}</p>\n    <button id="${btnId}" style="border:1px solid ${fg};border-bottom-left-radius:6px;border-radius:8px;padding:8px 12px;background:transparent;color:${fg};">click me</button>\n  </main>\n  <script>\n    document.getElementById('${btnId}').addEventListener('click', function(){\n      alert('Button clicked!');\n    });\n  <\/script>\n</body>\n</html>`;
  }, [title, content, bg, fg]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  const copy = async () => {
    await navigator.clipboard.writeText(html);
    alert("Copied!");
  };

  return (
    <div>
      <h1 style={{fontSize:20, marginBottom:12}}>HTML5 Code Generator</h1>

      <div className="grid-2">
        <section className="card" aria-labelledby="form-heading">
          <h2 id="form-heading" style={{marginTop:0}}>Inputs</h2>
          <div className="grid-2">
            <div>
              <label htmlFor="title">Title</label>
              <input id="title" type="text" value={title} onChange={e=>setTitle(e.target.value)} />
            </div>
            <div>
              <label htmlFor="content">Content</label>
              <input id="content" type="text" value={content} onChange={e=>setContent(e.target.value)} />
            </div>
            <div>
              <label htmlFor="bg">Background</label>
              <input id="bg" type="color" value={bg} onChange={e=>setBg(e.target.value)} aria-label="Background color" />
            </div>
            <div>
              <label htmlFor="fg">Text color</label>
              <input id="fg" type="color" value={fg} onChange={e=>setFg(e.target.value)} aria-label="Text color" />
            </div>
          </div>

          <div style={{marginTop:16}}>
            <h3 style={{marginTop:0}}>Generated HTML</h3>
            <textarea
              aria-label="Generated HTML"
              rows={16}
              value={html}
              readOnly
              style={{width:"100%", fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace", fontSize:12}}
            />
            <button className="btn" onClick={copy} style={{marginTop:8}}>Copy</button>
          </div>
        </section>

        <section className="card" aria-labelledby="preview-heading">
          <h2 id="preview-heading" style={{marginTop:0}}>Live Preview</h2>
          <iframe ref={iframeRef} title="Live preview" style={{width:"100%", height:360, border:"1px solid #444", borderRadius:8, background:"white"}} />
        </section>
      </div>
    </div>
  );
}
