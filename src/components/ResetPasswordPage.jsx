// src/components/ResetPasswordPage.jsx
import { useState } from "react";
import { resetPassword } from "../auth/passwordAuth";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPasswordPage() {
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { search } = useLocation();

    // 이메일 재설정 메일 링크(https://your-service/reset?token=XXX)에 포함된 token을 추출
    const token = new URLSearchParams(search).get("token") || "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        if (pw.length < 8) {
            setMsg("비밀번호는 8자 이상이어야 합니다.");
            return;
        }
        if (pw !== pw2) {
            setMsg("비밀번호가 서로 일치하지 않습니다.");
            return;
        }
        if (!token) {
            setMsg("유효하지 않은 링크입니다. (토큰 없음)");
            return;
        }
        setLoading(true);
        try {
            await resetPassword(token, pw);
            setMsg("비밀번호가 성공적으로 변경되었습니다. 로그인 화면으로 이동합니다.");
            setTimeout(() => navigate("/email-login"), 1700);
        } catch (err) {
            setMsg(err.message || "재설정 실패");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={headingStyle}>비밀번호 재설정</h2>
                <input
                    type="password"
                    placeholder="새 비밀번호"
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    required minLength={8}
                    autoComplete="new-password"
                    style={inputStyle}
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="새 비밀번호 확인"
                    value={pw2}
                    onChange={e => setPw2(e.target.value)}
                    required minLength={8}
                    autoComplete="new-password"
                    style={inputStyle}
                    disabled={loading}
                />
                <button type="submit" style={btnStyle} disabled={loading}>
                    {loading ? "변경 중..." : "비밀번호 변경"}
                </button>
                {msg && (
                    <p style={msg.startsWith("비밀번호가 성공적으로") ? successStyle : errorStyle}>{msg}</p>
                )}
                <p style={helperStyle}>
                    <a href="/email-login" style={linkStyle}>로그인 화면 →</a>
                </p>
            </form>
        </div>
    );
}

// (스타일은 SendResetLinkPage와 동일)
const pageStyle = {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "#fff", fontFamily: "sans-serif"
};
const formStyle = {
    background: "#fff", padding: "2.5rem 2.3rem 2.2rem", borderRadius: "22px",
    boxShadow: "0 12px 32px rgba(140, 94, 161, 0.10)", width: 350, textAlign: "center", minWidth: 320
};
const headingStyle = {
    color: "#7C3AED", marginBottom: "2rem", fontWeight: 700, fontSize: "1.3rem", letterSpacing: "-0.02em"
};
const inputStyle = {
    width: "100%", padding: "0.92rem", border: "1px solid #ddd6fe",
    borderRadius: "10px", background: "#f5f3ff", fontSize: "1rem", fontFamily: "inherit",
    outline: "none", marginBottom: "1.1rem", boxSizing: "border-box"
};
const btnStyle = {
    width: "100%", padding: "0.95rem", background: "linear-gradient(90deg, #A78BFA 70%, #E0E7FF 100%)",
    color: "#7C3AED", border: "none", borderRadius: "10px", fontWeight: "bold",
    fontSize: "1.04rem", cursor: "pointer", boxShadow: "0 2px 8px 0 rgba(140, 94, 161, 0.07)",
    marginBottom: 10
};
const helperStyle = {
    marginTop: 14, color: "#b7a6e7", fontSize: "0.95rem"
};
const linkStyle = {
    color: "#7C3AED", fontWeight: "bold", textDecoration: "none"
};
const errorStyle = {
    color: "red", marginTop: 10, fontSize: "0.93rem"
};
const successStyle = {
    color: "#29B02D", marginTop: 10, fontSize: "1rem"
};

export default ResetPasswordPage;