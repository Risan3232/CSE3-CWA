"use client";
import { useEffect, useMemo, useRef, useState } from "react";

interface Tab {
  id: string;
  heading: string;
  content: string;
}

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab1", heading: "Tab 1", content: "Content for tab 1" }
  ]);
  const [activeTab, setActiveTab] = useState("tab1");
  const [bg, setBg] = useState("#ffffff");
  const [fg, setFg] = useState("#333333");

  // Load tabs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("html-generator-tabs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTabs(parsed);
          setActiveTab(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse saved tabs:", e);
      }
    }
  }, []);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("html-generator-tabs", JSON.stringify(tabs));
  }, [tabs]);

  const addTab = () => {
    if (tabs.length >= 15) return;
    const newId = `tab${Date.now()}`;
    const newTab = { id: newId, heading: `Tab ${tabs.length + 1}`, content: `Content for tab ${tabs.length + 1}` };
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
  };

  const removeTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }
  };

  const updateTab = (tabId: string, field: 'heading' | 'content', value: string) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, [field]: value } : tab
    ));
  };

  const html = useMemo(() => {
    const esc = (s: string) => s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    const tabsHtml = tabs.map((tab, index) => `
    <div class="tab-content" id="content-${tab.id}" style="display:${index === 0 ? 'block' : 'none'};">
      <h2 style="margin:0 0 16px 0;">${esc(tab.heading)}</h2>
      <p style="margin:0;">${esc(tab.content)}</p>
    </div>`).join('');

    const tabButtonsHtml = tabs.map((tab, index) => `
    <button class="tab-btn" data-tab="${tab.id}" style="background:${index === 0 ? fg : 'transparent'};color:${index === 0 ? bg : fg};border:1px solid ${fg};padding:8px 16px;cursor:pointer;border-radius:4px 4px 0 0;margin-right:2px;">${esc(tab.heading)}</button>`).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tab Interface</title>
</head>
<body style="margin:0;padding:24px;background:${bg};color:${fg};font-family:Arial,Helvetica,sans-serif;">
  <main style="max-width:900px;margin:auto;">
    <h1 style="margin:0 0 24px 0;font-size:28px;">Tab Interface</h1>
    
    <div class="tabs-container" style="border:1px solid ${fg};border-radius:8px;overflow:hidden;">
      <div class="tab-buttons" style="background:color-mix(in srgb, ${bg} 95%, ${fg} 5%);padding:0;border-bottom:1px solid ${fg};display:flex;flex-wrap:wrap;">
        ${tabButtonsHtml}
      </div>
      
      <div class="tab-contents" style="padding:20px;min-height:200px;">
        ${tabsHtml}
      </div>
    </div>
  </main>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const buttons = document.querySelectorAll('.tab-btn');
      const contents = document.querySelectorAll('.tab-content');
      
      buttons.forEach(function(button) {
        button.addEventListener('click', function() {
          const targetTab = this.getAttribute('data-tab');
          
          // Hide all contents
          contents.forEach(function(content) {
            content.style.display = 'none';
          });
          
          // Reset all button styles
          buttons.forEach(function(btn) {
            btn.style.background = 'transparent';
            btn.style.color = '${fg}';
          });
          
          // Show target content
          document.getElementById('content-' + targetTab).style.display = 'block';
          
          // Highlight active button
          this.style.background = '${fg}';
          this.style.color = '${bg}';
        });
      });
    });
  <\/script>
</body>
</html>`;
  }, [tabs, bg, fg]);

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
      <h1 style={{fontSize:20, marginBottom:12}}>HTML5 Tabs Generator</h1>

      <div className="grid-2">
        <section className="card" aria-labelledby="form-heading">
          <h2 id="form-heading" style={{marginTop:0}}>Tab Configuration</h2>
          
          {/* Tab Controls */}
          <div style={{marginBottom:16, display:"flex", gap:8, alignItems:"center", flexWrap:"wrap"}}>
            <button 
              className="btn" 
              onClick={addTab}
              disabled={tabs.length >= 15}
              title={tabs.length >= 15 ? "Maximum 15 tabs allowed" : "Add new tab"}
            >
              + Add Tab ({tabs.length}/15)
            </button>
            {tabs.length > 1 && (
              <button 
                className="btn secondary" 
                onClick={() => removeTab(activeTab)}
                title="Remove current tab"
              >
                - Remove Tab
              </button>
            )}
          </div>

          {/* Tab Selector */}
          <div style={{marginBottom:16}}>
            <label>Active Tab:</label>
            <div style={{display:"flex", gap:4, flexWrap:"wrap", marginTop:8}}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`btn ${activeTab === tab.id ? '' : 'secondary'}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{fontSize:12, padding:"4px 8px"}}
                >
                  {tab.heading}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Editor */}
          {tabs.find(t => t.id === activeTab) && (
            <div className="grid-2">
              <div>
                <label htmlFor="tab-heading">Tab Heading</label>
                <input 
                  id="tab-heading"
                  type="text" 
                  value={tabs.find(t => t.id === activeTab)?.heading || ''} 
                  onChange={e => updateTab(activeTab, 'heading', e.target.value)} 
                />
              </div>
              <div>
                <label htmlFor="tab-content">Tab Content</label>
                <textarea 
                  id="tab-content"
                  rows={3}
                  value={tabs.find(t => t.id === activeTab)?.content || ''} 
                  onChange={e => updateTab(activeTab, 'content', e.target.value)} 
                />
              </div>
            </div>
          )}

          {/* Color Controls */}
          <div className="grid-2" style={{marginTop:16}}>
            <div>
              <label htmlFor="bg">Background Color</label>
              <input id="bg" type="color" value={bg} onChange={e=>setBg(e.target.value)} />
            </div>
            <div>
              <label htmlFor="fg">Text Color</label>
              <input id="fg" type="color" value={fg} onChange={e=>setFg(e.target.value)} />
            </div>
          </div>

          {/* Generated HTML Output */}
          <div style={{marginTop:16}}>
            <h3 style={{marginTop:0}}>Generated HTML</h3>
            <textarea
              aria-label="Generated HTML"
              rows={12}
              value={html}
              readOnly
              style={{
                width:"100%", 
                fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace", 
                fontSize:12,
                background:"var(--background)",
                color:"var(--foreground)"
              }}
            />
            <button className="btn" onClick={copy} style={{marginTop:8}}>Copy HTML</button>
          </div>
        </section>

        <section className="card" aria-labelledby="preview-heading">
          <h2 id="preview-heading" style={{marginTop:0}}>Live Preview</h2>
          <iframe 
            ref={iframeRef} 
            title="Live preview" 
            style={{
              width:"100%", 
              height:400, 
              border:"1px solid var(--foreground)", 
              borderRadius:8, 
              background:"white"
            }} 
          />
          <p style={{fontSize:12, marginTop:8, opacity:0.7}}>
            Preview shows {tabs.length} tab{tabs.length !== 1 ? 's' : ''} with interactive functionality
          </p>
        </section>
      </div>
    </div>
  );
}
