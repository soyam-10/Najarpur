"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { village } from "@/config/village";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Email and password are required."); return; }
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      router.replace("/admin");
    } else {
      setError("Wrong email or password.");
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px",
    padding: "10px 14px",
    color: "white",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0c0a09" }}>
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,127,42,0.6)", marginBottom: "8px" }}>
            Admin
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
            {village.name}
          </h1>
        </div>

        <div style={{ background: "#0f0d0b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.75rem" }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "rgba(239,68,68,0.9)", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="admin@email.com"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "#C97F2A")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "#C97F2A")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "rgba(201,127,42,0.4)" : "#C97F2A",
              color: "#0c0a09",
              border: "none",
              borderRadius: "6px",
              padding: "11px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}