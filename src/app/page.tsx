"use client";
import { useState } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
      const data = await res.json();
      setResumeText(data.text);
    } catch (err) {
      setError("Failed to parse PDF. Make sure it's a text-based PDF.");
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription || !resumeText) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, resumeText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <main className="min-h-screen p-8" style={{ background: "var(--color-background-tertiary, #f5f4f0)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');
        .tailor-btn { transition: background 0.2s, transform 0.1s; }
        .tailor-btn:hover { background: #3C3489 !important; }
        .tailor-btn:active { transform: scale(0.98); }
        .tailor-btn:disabled { background: #888780 !important; cursor: not-allowed; }
        .copy-btn:hover { background: #EEEDFE; }
        .upload-area:hover { border-color: #7F77DD !important; }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            display: "inline-block", fontSize: 11, fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase",
            background: "#EEEDFE", color: "#3C3489",
            padding: "4px 10px", borderRadius: 4, marginBottom: 12
          }}>AI-Powered</div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 700,
            margin: "0 0 6px", lineHeight: 1.1, color: "var(--color-text-primary, #1a1a1a)"
          }}>Resume Tailor</h1>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary, #666)", margin: 0, fontWeight: 300 }}>
            Paste a job description, upload your resume, and get AI-powered rewrites tailored to the role.
          </p>
        </div>

        {/* Input Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* Job Description */}
          <div style={{
            background: "var(--color-background-primary, #fff)",
            border: "0.5px solid var(--color-border-tertiary, #e0e0e0)",
            borderRadius: 12, padding: "1.25rem"
          }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-secondary, #666)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7F77DD", display: "inline-block" }}></span>
              Job Description
            </div>
            <textarea
              style={{
                width: "100%", height: 150,
                background: "var(--color-background-secondary, #f9f9f9)",
                border: "0.5px solid var(--color-border-tertiary, #e0e0e0)",
                borderRadius: 8, padding: "10px 12px",
                fontSize: 13, color: "var(--color-text-primary, #1a1a1a)",
                resize: "none", fontFamily: "'DM Sans', sans-serif",
                boxSizing: "border-box", outline: "none"
              }}
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Resume Upload */}
          <div style={{
            background: "var(--color-background-primary, #fff)",
            border: "0.5px solid var(--color-border-tertiary, #e0e0e0)",
            borderRadius: 12, padding: "1.25rem"
          }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-secondary, #666)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }}></span>
              Your Resume
            </div>
            <label htmlFor="resume-upload" style={{ cursor: "pointer" }}>
              <div className="upload-area" style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 8, height: 150,
                background: "var(--color-background-secondary, #f9f9f9)",
                border: "0.5px dashed var(--color-border-secondary, #ccc)",
                borderRadius: 8, transition: "border-color 0.2s"
              }}>
                <div style={{ width: 36, height: 36, background: "#EEEDFE", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v8M5 5l3-3 3 3M3 11v2h10v-2" stroke="#7F77DD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {resumeText ? (
                  <>
                    <span style={{ fontSize: 13, color: "var(--color-text-primary, #1a1a1a)", fontWeight: 500 }}>Resume loaded</span>
                    <span style={{ fontSize: 11, color: "#1D9E75" }}>✓ Ready to analyze</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 13, color: "var(--color-text-secondary, #666)" }}>Click to upload PDF</span>
                    <span style={{ fontSize: 11, color: "var(--color-text-tertiary, #999)" }}>Text-based PDFs only</span>
                  </>
                )}
              </div>
            </label>
            <input type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: "none" }} id="resume-upload" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#FCEBEB", color: "#A32D2D", fontSize: 13, padding: "10px 14px", borderRadius: 8, marginBottom: 12 }}>
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          className="tailor-btn"
          onClick={handleAnalyze}
          disabled={!jobDescription || !resumeText || loading}
          style={{
            width: "100%", padding: 14,
            background: "#534AB7", color: "#EEEDFE",
            border: "none", borderRadius: 8,
            fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 500,
            letterSpacing: "0.02em", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            marginBottom: 16
          }}
        >
          {loading ? (
            <>Analyzing your resume<span style={{ animation: "pulse 1s infinite" }}>...</span></>
          ) : (
            <>Tailor my resume <span style={{ fontSize: 18 }}>→</span></>
          )}
        </button>

        {/* Results */}
        {result && (
          <div style={{
            background: "var(--color-background-primary, #fff)",
            border: "0.5px solid var(--color-border-tertiary, #e0e0e0)",
            borderRadius: 12, padding: "1.25rem"
          }}>
            {/* Results Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: "var(--color-text-primary, #1a1a1a)" }}>
                Your Analysis
              </div>
              <button
                className="copy-btn"
                onClick={handleCopy}
                style={{
                  fontSize: 12, color: "#534AB7", background: "transparent",
                  border: "0.5px solid #AFA9EC", borderRadius: 6,
                  padding: "5px 12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}
              >
                Copy results
              </button>
            </div>

            <div style={{ height: "0.5px", background: "var(--color-border-tertiary, #e0e0e0)", marginBottom: 16 }} />

            {/* Result Text */}
            <pre style={{
              whiteSpace: "pre-wrap", fontSize: 13,
              color: "var(--color-text-primary, #1a1a1a)",
              lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif",
              margin: 0
            }}>
              {result}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}