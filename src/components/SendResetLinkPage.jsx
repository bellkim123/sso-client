import { useState } from "react";
import { sendResetLink } from "../auth/passwordAuth";
import { FaEnvelopeOpenText } from "react-icons/fa6"; // react-icons 설치시

function SendResetLinkPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult("");
        setLoading(true);

        try {
            await sendResetLink(email);
            setResult("이메일로 비밀번호 재설정 링크를 발송했습니다. 이메일을 확인해 주세요.");
        } catch (err) {
            setResult(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={modernPageStyle}>
            <form onSubmit={handleSubmit} style={modernFormStyle}>
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <span style={modernIconWrap}>
                        <FaEnvelopeOpenText size={32} color="#6C5DD3" />
                    </span>
                </div>
                <h2 style={modernHeadingStyle}>비밀번호 재설정</h2>
                <p style={modernSubText}>
                    가입하신 이메일을 입력하면,
                    <span style={{ color: "#6C5DD3", fontWeight: 700 }}> 재설정 링크</span>를 이메일로 보내드립니다.
                </p>
                <input
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={modernInputStyle}
                    autoComplete="email"
                    disabled={loading}
                />
                <button type="submit" style={{
                    ...modernBtnStyle,
                    opacity: loading ? 0.65 : 1,
                    cursor: loading ? "not-allowed" : "pointer"
                }} disabled={loading}>
                    {loading ? "전송 중..." : "링크 메일 보내기"}
                </button>
                {result && (
                    <div style={{
                        marginTop: 18,
                        borderRadius: 10,
                        padding: "1.1rem 1rem",
                        background: result.startsWith("이메일로") ? "linear-gradient(90deg,#f4fcfa,#e8f9eb)" : "linear-gradient(90deg,#FFF0F1,#FCE6EC)",
                        color: result.startsWith("이메일로") ? "#18a364" : "#B91C1C",
                        fontWeight: 500,
                        fontSize: "1.1rem",
                        border: result.startsWith("이메일로") ? "1.5px solid #94dfa6" : "1.5px solid #FCA3A3",
                        boxShadow: "0 2px 8px rgba(40,80,60,0.08)",
                        animation: "popFade .7s",
                        lineHeight: 1.7
                    }}>
                        <span style={{ fontWeight: 700 }}>
                            {result.startsWith("이메일로")
                                ? <>이메일 발송 완료!<br /></>
                                : null}
                        </span>
                        {result.startsWith("이메일로") ? (
                            <>
                                입력한 주소로 재설정 안내 메일을 보냈어요.<br />
                                <span style={{ color: "#6c5dd3", fontWeight: 600 }}>메일이 2~3분 내로 도착하지 않으면 스팸함을 꼭 확인!</span><br />
                                <span style={{ fontSize: ".97em", color: "#666" }}>
                                    메일 내 <b>[비밀번호 재설정]</b> 버튼 또는 링크를 클릭해 주세요.
                                </span>
                            </>
                        ) : (
                            result
                        )}
                    </div>
                )}
                <p style={modernHelperStyle}>
                    <span>로그인 화면으로 </span>
                    <a href="/email-login" style={modernLinkStyle}>돌아가기</a>
                </p>
            </form>
            <style>
                {`
                    @keyframes popFade {
                        0% { opacity: 0; transform: translateY(16px) scale(0.95);}
                        70% { opacity: 1; transform: translateY(-4px) scale(1.04);}
                        100% { opacity: 1; transform: translateY(0) scale(1);}
                    }
                    input:focus { box-shadow: 0 0 0 2px #b2a7f7!important }
                    button:active { transform: scale(.98); }
                `}
            </style>
        </div>
    );
}

// ==== 현대적 스타일 ====
const modernPageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(140deg, #F4F1FF 40%, #FDF6FA 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, 'Noto Sans KR', sans-serif"
};
const modernFormStyle = {
    width: 370,
    background: "#fff",
    padding: "2.7rem 2.7rem 2rem",
    borderRadius: 18,
    boxShadow: "0 10px 36px 0 rgba(116, 102, 169, .07), 0 1.5px 4px rgba(108, 93, 211, 0.06)",
    textAlign: "center",
    margin: "0 1rem"
};
const modernIconWrap = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: 54, height: 54,
    background: "linear-gradient(135deg,#ede9fe,#fffbe9 95%)",
    borderRadius: "50%",
    boxShadow: "0 3px 10px rgba(140,94,210,0.13)",
    marginBottom: 8,
};
const modernHeadingStyle = {
    color: "#6C5DD3",
    fontWeight: 800,
    fontSize: "1.37rem",
    margin: "0 0 .3em 0",
    letterSpacing: "-0.015em"
};
const modernSubText = {
    color: "#676574",
    fontSize: "1.02em",
    margin: "0 0 1.7em 0",
    fontWeight: 400,
    lineHeight: 1.7
};
const modernInputStyle = {
    width: "100%",
    padding: "1.02rem",
    borderRadius: 9,
    border: "1.5px solid #DEDFFB",
    background: "#F7F8FE",
    fontSize: "1.08rem",
    fontFamily: "inherit",
    marginBottom: "1.4rem",
    outline: "none",
    transition: "box-shadow .21s, border .22s",
    fontWeight: 500,
    boxSizing: "border-box"
};
const modernBtnStyle = {
    width: "100%",
    padding: "1.03rem",
    background: "linear-gradient(90deg, #8B77F2 70%, #F6D3F5 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: "1.09rem",
    cursor: "pointer",
    marginBottom: 10,
    letterSpacing: "0.02em",
    transition: "background .18s, opacity .18s"
};
const modernHelperStyle = {
    color: "#b7a6e7",
    fontSize: "1.04rem",
    marginTop: 26,
};
const modernLinkStyle = {
    color: "#6C5DD3",
    fontWeight: 700,
    marginLeft: 5,
    textDecoration: "underline",
    cursor: "pointer"
};

export default SendResetLinkPage;
