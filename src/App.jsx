import { useState, useRef, useEffect, useCallback } from "react";
import tick from "./assets/tick.png";
import notebook from "./assets/note-book.png";
import hero from "./assets/hero.png";
import uploadIcon from "./assets/upload-file.png";



const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f0f11;
    --surface: #17171a;
    --surface2: #1e1e22;
    --surface3: #252529;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --accent: #6c63ff;
    --accent2: #9d78ff;
    --accent-dim: rgba(108,99,255,0.15);
    --text: #e8e8f0;
    --text2: #9898a8;
    --text3: #60607a;
    --green: #3ecf8e;
    --green-dim: rgba(62,207,142,0.12);
    --amber: #f5a623;
    --amber-dim: rgba(245,166,35,0.12);
    --red: #ff6b6b;
    --red-dim: rgba(255,107,107,0.12);
    --mono: 'JetBrains Mono', monospace;
    --sans: 'Sora', sans-serif;
  }

  body { font-family: var(--sans); background: var(--bg); color: var(--text); }

  .app {
    display: grid;
    grid-template-columns: 280px 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* SIDEBAR */
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-header {
    padding: 20px;
    border-bottom: 1px solid var(--border);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }

  .logo-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }

  .logo-icon img {
    width: 50px;
    height: 50px;
    margin-top: 16.5px;
    
    
    border-radius: 8px;
  }

  .logo h1 {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.3px;
  }

  .logo-sub {
    font-size: 11px;
    color: var(--text3);
    font-family: var(--mono);
    margin-left: 38px;
  }

  /* UPLOAD ZONE */
  .upload-zone {
    margin: 16px;
    border: 1.5px dashed var(--border2);
    border-radius: 12px;
    padding: 20px 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
  }

  .upload-zone:hover, .upload-zone.drag {
    border-color: var(--accent);
    background: var(--accent-dim);
  }

  .upload-zone input { display: none; }

  .upload-icon {
    font-size: 24px;
    margin-bottom: 8px;
    color: var(--text3);
  }

  .upload-icon img {
    width: 40px;
    height: 40px;
    
  }

  .upload-zone:hover .upload-icon { color: var(--accent2); }

  .upload-text {
    font-size: 12px;
    color: var(--text2);
    line-height: 1.5;
  }

  .upload-text strong { color: var(--text); font-weight: 500; }

  /* DOC META */
  .doc-meta {
    margin: 0 16px 16px;
    padding: 12px;
    background: var(--surface2);
    border-radius: 10px;
    border: 1px solid var(--border);
  }

  .doc-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .doc-stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-label {
    font-size: 11px;
    color: var(--text3);
    font-family: var(--mono);
  }

  .stat-val {
    font-size: 11px;
    color: var(--green);
    font-family: var(--mono);
    font-weight: 500;
  }

  /* PIPELINE STEPS */
  .pipeline {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    padding-top: 0;
  }

  .pipeline-title {
    font-size: 10px;
    font-family: var(--mono);
    color: var(--text3);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  .step {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 0;
    position: relative;
  }

  .step:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 11px; top: 30px;
    width: 1px; height: calc(100% - 10px);
    background: var(--border);
  }

  .step-dot {
    width: 22px; height: 22px;
    border-radius: 50%;
    border: 1.5px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
    flex-shrink: 0;
    transition: all 0.3s;
    color: var(--text3);
    background: var(--surface);
  }

  .step.done .step-dot {
    border-color: var(--green);
    background: var(--green-dim);
    color: var(--green);
  }

  .step.active .step-dot {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent2);
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(108,99,255,0.4); }
    50% { box-shadow: 0 0 0 6px rgba(108,99,255,0); }
  }

  .step-info { flex: 1; }

  .step-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 2px;
  }

  .step.done .step-name { color: var(--green); }
  .step.active .step-name { color: var(--accent2); }

  .step-desc {
    font-size: 11px;
    color: var(--text3);
    line-height: 1.4;
  }

  /* MAIN CHAT AREA */
  .main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background: var(--bg);
  }

  .chat-header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
  }

  .chat-title { font-size: 14px; font-weight: 500; color: var(--text); }
  .chat-sub { font-size: 12px; color: var(--text3); margin-top: 2px; }

  .model-badge {
    font-family: var(--mono);
    font-size: 10px;
    padding: 4px 10px;
    border-radius: 20px;
    background: var(--accent-dim);
    color: var(--accent2);
    border: 1px solid rgba(108,99,255,0.3);
  }

  /* MESSAGES */
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scroll-behavior: smooth;
  }

  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  /* WELCOME */
  .welcome {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
    gap: 16px;
  }

  .welcome-icon {
    
    font-size: 20px;
    margin-bottom: 2px;
    filter: grayscale(0.3);
  }

  .welcome-icon img {
    width: 50px;
    height: 50px;
  }

  .welcome h2 {
    font-size: 20px;
    font-weight: 500;
    color: var(--text);
    letter-spacing: -0.4px;
  }

  .welcome p {
    font-size: 14px;
    color: var(--text2);
    max-width: 400px;
    line-height: 1.6;
  }

  .welcome-steps {
    display: flex;
    gap: 12px;
    margin-top: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .welcome-step {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 12px;
    color: var(--text2);
  }

  .ws-num {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--accent-dim);
    color: var(--accent2);
    font-size: 10px;
    font-weight: 600;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* MESSAGES */
  .msg {
    display: flex;
    gap: 12px;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msg.user { flex-direction: row-reverse; }

  .msg-avatar {
    width: 30px; height: 30px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
    font-weight: 600;
  }

  .msg.user .msg-avatar {
    background: var(--accent-dim);
    color: var(--accent2);
    border: 1px solid rgba(108,99,255,0.2);
  }

  .msg.assistant .msg-avatar {
    background: var(--green-dim);
    color: var(--green);
    border: 1px solid rgba(62,207,142,0.2);
  }

  .msg-body { max-width: 80%; }
  .msg.user .msg-body { align-items: flex-end; display: flex; flex-direction: column; }

  .msg-bubble {
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.65;
  }

  .msg.user .msg-bubble {
    background: var(--accent-dim);
    border: 1px solid rgba(108,99,255,0.2);
    color: var(--text);
    border-top-right-radius: 3px;
  }

  .msg.assistant .msg-bubble {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    border-top-left-radius: 3px;
  }

  .msg-chunks {
    margin-top: 8px;
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .chunk-badge {
    font-size: 10px;
    font-family: var(--mono);
    padding: 3px 8px;
    border-radius: 20px;
    background: var(--amber-dim);
    color: var(--amber);
    border: 1px solid rgba(245,166,35,0.2);
    cursor: help;
  }

  /* THINKING */
  .thinking {
    display: flex;
    gap: 4px;
    padding: 14px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    border-top-left-radius: 3px;
    width: fit-content;
  }

  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text3); }
  .dot:nth-child(1) { animation: blink 1.2s 0s infinite; }
  .dot:nth-child(2) { animation: blink 1.2s 0.2s infinite; }
  .dot:nth-child(3) { animation: blink 1.2s 0.4s infinite; }
  @keyframes blink { 0%,80%,100% { opacity:0.2; } 40% { opacity:1; } }

  /* INPUT */
  .input-area {
    padding: 16px 24px;
    border-top: 1px solid var(--border);
    background: var(--surface);
  }

  .input-row {
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

  .input-wrap {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: 12px;
    padding: 10px 14px;
    transition: border-color 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .input-wrap:focus-within { border-color: var(--accent); }

  .chat-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text);
    font-family: var(--sans);
    font-size: 14px;
    resize: none;
    max-height: 120px;
    min-height: 20px;
    line-height: 1.5;
  }

  .chat-input::placeholder { color: var(--text3); }

  .send-btn {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: var(--accent);
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: white;
    font-size: 16px;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .send-btn:hover { background: var(--accent2); transform: scale(1.05); }
  .send-btn:disabled { background: var(--surface3); color: var(--text3); cursor: not-allowed; transform: none; }

  .input-hint {
    font-size: 11px;
    color: var(--text3);
    margin-top: 8px;
    font-family: var(--mono);
  }

  /* PROGRESS BAR */
  .progress-bar {
    height: 2px;
    background: var(--border);
    border-radius: 1px;
    overflow: hidden;
    margin-top: 6px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 1px;
    transition: width 0.4s ease;
  }

  /* CLEAR BTN */
  .clear-btn {
    font-size: 11px;
    font-family: var(--mono);
    color: var(--text3);
    background: none;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .clear-btn:hover { border-color: var(--red); color: var(--red); background: var(--red-dim); }

  /* SUGGESTED QUESTIONS */
  .suggestions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  .suggestion-btn {
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 20px;
    background: var(--surface2);
    border: 1px solid var(--border2);
    color: var(--text2);
    cursor: pointer;
    transition: all 0.15s;
    font-family: var(--sans);
  }

  .suggestion-btn:hover {
    border-color: var(--accent);
    color: var(--accent2);
    background: var(--accent-dim);
  }

  /* ERROR */
  .error-msg {
    padding: 10px 14px;
    background: var(--red-dim);
    border: 1px solid rgba(255,107,107,0.2);
    border-radius: 8px;
    font-size: 13px;
    color: var(--red);
  }
`;

const PIPELINE_STEPS = [
  { id: "upload", name: "Document ingestion", desc: "Load PDF or plain text file" },
  { id: "chunk", name: "Chunking", desc: "Sliding window (600 chars, 100 overlap)" },
  { id: "embed", name: "TF-IDF indexing", desc: "Build vector index over chunks" },
  { id: "ready", name: "Vector store ready", desc: "In-memory store indexed & ready" },
];

const SUGGESTIONS = [
  "What is this document about?",
  "Summarize the main points",
  "What are the key findings?",
  "List the most important topics",
];

export default function NotebookLM() {
  const [docState, setDocState] = useState(null); // { name, chunks, vectors, charCount }
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1); // -1 = idle
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const processFile = useCallback(async (file) => {
    if (!file) return;
    const allowed = ["application/pdf", "text/plain", "text/markdown", "text/csv"];
    if (!allowed.includes(file.type) && !file.name.match(/\.(txt|md|csv|pdf)$/i)) {
      setError("Please upload a PDF or plain text file (.txt, .md, .csv, .pdf)");
      return;
    }
    setError(null);
    setMessages([]);
    setPipelineStep(0);
    setProgress(10);

    try {
      // Step 1: Uploading and Text Extraction
      const formData = new FormData();
      formData.append("file", file);
      
      setProgress(30); setPipelineStep(1);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload file");
      }

      setProgress(60); setPipelineStep(2);

      const data = await response.json();
      
      setProgress(85); setPipelineStep(3);
      await new Promise(r => setTimeout(r, 300));

      setProgress(100);
      setDocState({ 
        name: data.metadata.name, 
        charCount: data.metadata.charCount, 
        chunkCount: data.metadata.chunkCount 
      });
    } catch (err) {
      setError(err.message || "Failed to process document.");
      setPipelineStep(-1);
    }
  }, []);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer?.files[0] || e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const sendMessage = useCallback(async (text) => {
    const q = (text || input).trim();
    if (!q || !docState || loading) return;
    setInput("");
    setError(null);
    setLoading(true);

    const userMsg = { role: "user", content: q, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.role === "assistant" ? m.content : m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: q,
          history
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate answer");
      }

      const data = await response.json();

      const assistantMsg = {
        role: "assistant",
        content: data.answer,
        retrievedChunks: data.chunks.map(c => ({ chunk: c })),
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "error",
        content: err.message || "Something went wrong.",
        id: Date.now() + 1
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, docState, loading, messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const activePipelineStep = pipelineStep;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <div className="logo-icon"><img src={notebook} alt="Notebook" /></div>
              <h1>NotebookRAG</h1>
            </div>
            <div className="logo-sub">RAG pipeline</div>
          </div>

          {/* Upload */}
          <div
            className={`upload-zone ${dragging ? "drag" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleFileDrop}
          >
            <input ref={fileRef} type="file" accept=".pdf,.txt,.md,.csv" onChange={handleFileDrop} />
            <div className="upload-icon"><img src={uploadIcon} alt="Upload" /></div>
            <div className="upload-text">
              <strong>Drop a file or click to upload</strong><br />
              PDF, TXT, MD, CSV supported
            </div>
          </div>

          {/* Doc meta */}
          {docState && (
            <div className="doc-meta">
              <div className="doc-name">📄 {docState.name}</div>
              <div className="doc-stats">
                <div className="stat-row">
                  <span className="stat-label">characters</span>
                  <span className="stat-val">{docState.charCount.toLocaleString()}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">chunks</span>
                  <span className="stat-val">{docState.chunkCount}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">strategy</span>
                  <span className="stat-val">sliding-window</span>
                </div>
              </div>
              {progress > 0 && progress < 100 && (
                <div className="progress-bar" style={{marginTop: 8}}>
                  <div className="progress-fill" style={{width: `${progress}%`}} />
                </div>
              )}
            </div>
          )}

          {/* Pipeline steps */}
          <div className="pipeline">
            <div className="pipeline-title">RAG pipeline</div>
            {PIPELINE_STEPS.map((step, i) => {
              const state = activePipelineStep < 0 ? "idle"
                : i < activePipelineStep ? "done"
                : i === activePipelineStep ? "active"
                : docState && i <= 3 ? "done"
                : "idle";
              const finalState = docState ? "done" : state;
              return (
                <div key={step.id} className={`step ${finalState}`}>
                  <div className="step-dot">
                    {finalState === "done" ? "✓" : finalState === "active" ? "⋯" : i + 1}
                  </div>
                  <div className="step-info">
                    <div className="step-name">{step.name}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="chat-header">
            <div>
              <div className="chat-title">
                {docState ? docState.name : "No document loaded"}
              </div>
              <div className="chat-sub">
                {docState
                  ? `${docState.chunkCount} chunks indexed · ask anything about this document`
                  : "Upload a document to start chatting"}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {messages.length > 0 && (
                <button className="clear-btn" onClick={() => setMessages([])}>clear chat</button>
              )}
              <div className="model-badge">NotebookRAG</div>
            </div>
          </div>

          {/* Messages */}
          <div className="messages">
            {!docState && messages.length === 0 && (
              <div className="welcome">
                <div className="welcome-icon">{<img src={hero} alt="hero" />}</div>
                <h2>Your RAG-powered notebook</h2>
                <p>Upload any document and have a grounded conversation with it. Answers come only from your document — not from the model's memory.</p>
                <div className="welcome-steps">
                  {["Upload a document", "System chunks & indexes it", "Ask any question", "Get grounded answers"].map((s, i) => (
                    <div key={i} className="welcome-step">
                      <div className="ws-num">{i+1}</div>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {docState && messages.length === 0 && (
              <div className="welcome" style={{paddingTop:20}}>
                <div className="welcome-icon">{<img src={tick} alt="tick" />}</div>
                <h2>Document ready</h2>
                <p>Your document has been chunked and indexed. Ask anything about it below.</p>
              </div>
            )}

            {messages.map(msg => (
              msg.role === "error" ? (
                <div key={msg.id} className="error-msg">⚠ {msg.content}</div>
              ) : (
                <div key={msg.id} className={`msg ${msg.role}`}>
                  <div className="msg-avatar">
                    {msg.role === "user" ? "U" : "AI"}
                  </div>
                  <div className="msg-body">
                    <div className="msg-bubble">
                      {msg.content.split("\n").map((line, i) => (
                        <span key={i}>{line}{i < msg.content.split("\n").length - 1 && <br/>}</span>
                      ))}
                    </div>

                  </div>
                </div>
              )
            ))}

            {loading && (
              <div className="msg assistant">
                <div className="msg-avatar">AI</div>
                <div className="msg-body">
                  <div className="thinking">
                    <div className="dot"/><div className="dot"/><div className="dot"/>
                  </div>
                </div>
              </div>
            )}

            {error && !loading && <div className="error-msg">⚠ {error}</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="input-area">
            {docState && messages.length === 0 && (
              <div className="suggestions">
                {SUGGESTIONS.map(s => (
                  <button key={s} className="suggestion-btn" onClick={() => sendMessage(s)}>{s}</button>
                ))}
              </div>
            )}
            <div className="input-row">
              <div className="input-wrap">
                <textarea
                  ref={textareaRef}
                  className="chat-input"
                  placeholder={docState ? "Ask a question about your document…" : "Upload a document first…"}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!docState || loading}
                  rows={1}
                  style={{resize:"none"}}
                />
              </div>
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={!docState || loading || !input.trim()}
              >
                ↑
              </button>
            </div>
            <div className="input-hint">
              {docState
                ? `↵ to send · shift+↵ for newline · ${docState.chunkCount} chunks in context`
                : "drop a PDF or .txt file in the sidebar to begin"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
