import React from "react";
import { BASE_URL, SERVICE_TYPE } from "../config/apiConfig";

function EmailLoginPage() {
    return (
        <div style={pageStyle}>
            <form
                method="POST"
                action={`${BASE_URL}/login`}  // 환경변수 기반 URL 사용
                style={formStyle}
            >
                <h2 style={headingStyle}>이메일 로그인</h2>
                <div style={inputGroupStyle}>
                    <input
                        name="email"
                        type="email"
                        placeholder="이메일"
                        required
                        autoComplete="username"
                        style={inputStyle}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        required
                        autoComplete="current-password"
                        style={inputStyle}
                    />
                    <input
                        type="hidden"
                        name="serviceType"
                        value={SERVICE_TYPE}  // config에서 관리하는 문자열 사용
                    />
                </div>
                <button type="submit" style={btnStyle}>
                    로그인
                </button>
                <p style={helperStyle}>
                    아직 계정이 없으신가요?{" "}
                    <a href="/register" style={linkStyle}>회원가입</a>
                </p>
                <p style={{ ...helperStyle, marginTop: 6 }}>
                    비밀번호를 잃어버리셨나요?{" "}
                    <a href="/password-reset-link" style={linkStyle}>비밀번호 재설정</a>
                </p>
            </form>
        </div>
    );
}

// ===== 스타일 (생략 가능, 기존과 동일하게 유지) =====

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
    boxShadow: "0 12px 32px rgba(140, 94, 161, 0.10)",
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

export default EmailLoginPage;
