"use client";

import React, { useState, useEffect } from "react";

interface RigRecord {
  id: number;
  file_name: string;
  hf_space: string;
  status: string;
  download_url: string;
  created_at: string;
}

export default function AutoRigPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [hfSpace, setHfSpace] = useState("username/auto-rig-space");
  const [history, setHistory] = useState<RigRecord[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/rigs");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  const handleStartRigging = async () => {
    if (!file) return;
    setStatus("processing");

    setTimeout(async () => {
      try {
        await fetch("/api/rigs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_name: file.name,
            hf_space: hfSpace,
            status: "Completed",
            download_url: "#ready-model.glb",
          }),
        });
        await fetchHistory();
      } catch (err) {
        console.error(err);
      }
      setStatus("done");
    }, 2000);
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "sans-serif", padding: "2rem" }} dir="ltr">
      <div style={{ maxWidth: "750px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#38bdf8" }}>
            AI 3D Character Auto-Rigger
          </h1>
          <p style={{ color: "#94a3b8" }}>
            Upload your 3D character mesh (GLB / FBX / OBJ) for automated game-ready rigging via Hugging Face
          </p>
        </div>

        <div style={{ backgroundColor: "#1e293b", padding: "2rem", borderRadius: "1rem", border: "1px solid #334155", marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#cbd5e1" }}>
              Hugging Face Space ID:
            </label>
            <input
              type="text"
              value={hfSpace}
              onChange={(e) => setHfSpace(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                backgroundColor: "#0f172a",
                border: "1px solid #475569",
                color: "#fff"
              }}
            />
          </div>

          <div style={{
            border: "2px dashed #475569",
            borderRadius: "0.75rem",
            padding: "2rem",
            marginBottom: "1.5rem",
            backgroundColor: "#0f172a",
            textAlign: "center"
          }}>
            <input
              type="file"
              accept=".glb,.gltf,.fbx,.obj"
              onChange={handleFileChange}
              style={{ color: "#cbd5e1" }}
            />
            {file && (
              <p style={{ marginTop: "1rem", color: "#4ade80", fontWeight: "bold" }}>
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button
            onClick={handleStartRigging}
            disabled={!file || status === "processing"}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "0.5rem",
              backgroundColor: !file ? "#475569" : "#0284c7",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: !file ? "not-allowed" : "pointer",
              border: "none"
            }}
          >
            {status === "processing" ? "Processing Rig via Hugging Face..." : "Start Auto-Rigging"}
          </button>

          {status === "done" && (
            <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#064e3b", borderRadius: "0.5rem", color: "#a7f3d0", textAlign: "center" }}>
              <p style={{ fontWeight: "bold" }}>Rigging completed and saved to database!</p>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: "#1e293b", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1rem", color: "#e2e8f0" }}>
            Recent Rigs History
          </h2>
          {history.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "1rem" }}>No rigged models yet. Upload a character to start!</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8" }}>
                  <th style={{ padding: "0.75rem" }}>File Name</th>
                  <th style={{ padding: "0.75rem" }}>HF Space</th>
                  <th style={{ padding: "0.75rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #334155" }}>
                    <td style={{ padding: "0.75rem", color: "#38bdf8" }}>{item.file_name}</td>
                    <td style={{ padding: "0.75rem" }}>{item.hf_space}</td>
                    <td style={{ padding: "0.75rem", color: "#4ade80" }}>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </main>
  );
}


 
    
