import {useState} from "react";
import {
    sendVerificationCode,
    verifyCode,
    registerWithEmail,
} from "../auth/emailAuth";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    // 인증번호 발송
    const handleSendCode = async () => {
        if (!email) return alert("이메일을 입력하세요.");
        setLoading(true);
        try {
            await sendVerificationCode(email);
            setIsSent(true);
            alert("인증번호가 발송되었습니다.");
        } catch (e) {
            alert(e.message);
        }
        setLoading(false);
    };

    // 인증번호 확인
    const handleVerifyCode = async () => {
        if (!email || !verificationCode) return alert("이메일과 인증번호를 모두 입력하세요.");
        setLoading(true);
        try {
            await verifyCode(email, verificationCode);
            setIsVerified(true);
            alert("이메일 인증이 완료되었습니다.");
        } catch (e) {
            alert(e.message);
        }
        setLoading(false);
    };

    // 회원가입 최종 요청
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isVerified)
            return alert("이메일 인증을 먼저 완료하세요.");
        setLoading(true);
        try {
            await registerWithEmail(email, password, verificationCode);
            alert("회원가입이 완료되었습니다. 로그인 해주세요!");
            window.location.href = "/email-login";
        } catch (e) {
            alert(e.message);
        }
        setLoading(false);
    };

    return (
        <div style={pageStyle}>
            <form onSubmit={handleRegister} style={formStyle}>
                <h2 style={headingStyle}>회원가입</h2>
                <div style={inputGroupStyle}>
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                            setIsSent(false);
                            setIsVerified(false);
                        }}
                        required
                        style={inputStyle}
                    />
                    <div style={{display: "flex", gap: 6}}>
                        <input
                            type="text"
                            placeholder="인증번호"
                            value={verificationCode}
                            onChange={e => setVerificationCode(e.target.value)}
                            style={{...inputStyle, flex: 1}}
                            disabled={!isSent}
                        />
                        <button
                            type="button"
                            onClick={isSent ? handleVerifyCode : handleSendCode}
                            style={{
                                ...miniBtnStyle,
                                background: isVerified
                                    ? "#a0e9c5"
                                    : isSent
                                        ? "#A78BFA"
                                        : "#7C3AED",
                                color: isVerified
                                    ? "#409370"
                                    : "#fff",
                                cursor: loading ? "wait" : "pointer"
                            }}
                            disabled={loading}
                        >
                            {isVerified ? "인증완료"
                                : isSent ? "인증확인"
                                    : "인증요청"}
                        </button>
                    </div>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                        disabled={!isVerified}
                    />
                </div>
                <button
                    type="submit"
                    style={btnStyle}
                    disabled={!isVerified || loading}
                >
                    회원가입
                </button>
                <p style={helperStyle}>
                    이미 계정이 있으신가요?{" "}
                    <a href="/email-login" style={linkStyle}>로그인</a>
                </p>
            </form>
        </div>
    );
}

// ---- 디자인 스타일(동일) ----
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
const miniBtnStyle = {
    padding: "0.92rem 1.1rem",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "1rem",
    minWidth: 75,
    transition: "background 0.15s, color 0.15s",
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

export default RegisterPage;
