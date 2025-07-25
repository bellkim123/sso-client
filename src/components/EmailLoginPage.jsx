import {useState} from "react";
import {loginWithEmail} from "../auth/emailAuth";

function EmailLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await loginWithEmail(email, password);
            if (result.success) {
                alert("로그인 성공!");
                window.location.href = "/"; // 원하는 페이지로 이동
            } else {
                alert(result.message || "로그인에 실패했습니다.");
            }
        } catch (err) {
            alert(err.message || "로그인에 실패했습니다.");
        }
        setLoading(false);
    };

    return (
        <div style={pageStyle}>
            <form onSubmit={handleLogin} style={formStyle}>
                <h2 style={headingStyle}>이메일 로그인</h2>
                <div style={inputGroupStyle}>
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                <button type="submit" style={btnStyle} disabled={loading}>
                    {loading ? "로그인 중..." : "로그인"}
                </button>
                <p style={helperStyle}>
                    아직 계정이 없으신가요?{" "}
                    <a href="/register" style={linkStyle}>회원가입</a>
                </p>
            </form>
        </div>
    );
}

// ====== 스타일 ======
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
    letterSpacing: "-0.02em"
};

const inputGroupStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
    marginBottom: "1.25rem"
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
