import React, { useState } from "react";
import { BASE_URL, SERVICE_TYPE } from "../config/apiConfig";
import { useNavigate } from "react-router-dom";

const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    fontFamily: "sans-serif",
};
const formStyle = {
    background: "#fff",
    padding: "2.5rem 2.3rem 2.2rem",
    borderRadius: "22px",
    boxShadow: "0 12px 32px rgba(140, 94, 161, 0.1)",
    width: 350,
    textAlign: "center",
    minWidth: 320,
};
const headingStyle = {
    color: "#7C3AED",
    marginBottom: "2rem",
    fontWeight: 700,
    fontSize: "1.3rem",
    letterSpacing: "-0.02em",
};
const inputGroupStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
    marginBottom: "1.25rem",
};
const inputStyle = {
    width: "100%",
    padding: "0.92rem",
    border: "1px solid #ddd6fe",
    borderRadius: "10px",
    background: "#f5f3ff",
    fontSize: "1rem",
    fontFamily: "inherit",
    transition: "border 0.2s, box-shadow 0.2s",
    outline: "none",
    boxSizing: "border-box",
};
const btnStyle = {
    width: "100%",
    padding: "0.95rem",
    background: "linear-gradient(90deg, #A78BFA 70%, #E0E7FF 100%)",
    color: "#7C3AED",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "1.04rem",
    cursor: "pointer",
    boxShadow: "0 2px 8px 0 rgba(140, 94, 161, 0.07)",
    marginBottom: 10,
    transition: "background 0.15s, color 0.18s",
};

const helperStyle = {
    marginTop: 18,
    color: "#b7a6e7",
    fontSize: "0.95rem",
};
const linkStyle = {
    color: "#7C3AED",
    fontWeight: "bold",
    textDecoration: "none",
    transition: "color 0.15s",
};

function EmailLoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/auth/email/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    serviceType: SERVICE_TYPE,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {  // <=== 소문자 success 주의
                setErrorMsg(result.message || "로그인에 실패했습니다.");  // <=== message 소문자
            } else {
                const { accessToken, refreshToken } = result.data;  // <=== camelCase 키
                onLoginSuccess(accessToken, refreshToken, navigate);
            }
        } catch {
            setErrorMsg("서버와 연결할 수 없습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={headingStyle}>이메일 로그인</h2>
                <div style={inputGroupStyle}>
                    <input
                        name="email"
                        type="email"
                        placeholder="이메일"
                        required
                        autoComplete="username"
                        style={inputStyle}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        required
                        autoComplete="current-password"
                        style={inputStyle}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <button type="submit" style={btnStyle} disabled={loading}>
                    {loading ? "로그인 중..." : "로그인"}
                </button>
                {errorMsg && <p style={{ ...helperStyle, color: "red" }}>{errorMsg}</p>}

                <p style={helperStyle}>
                    아직 계정이 없으신가요?{" "}
                    <a href="/register" style={linkStyle}>
                        회원가입
                    </a>
                </p>
                <p style={{ ...helperStyle, marginTop: 6 }}>
                    비밀번호를 잃어버리셨나요?{" "}
                    <a href="/password-reset-link" style={linkStyle}>
                        비밀번호 재설정
                    </a>
                </p>
            </form>
        </div>
    );
}

export default EmailLoginPage;
