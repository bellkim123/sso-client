import {useEffect, useState} from "react";
import {getCookie} from "../utils/cookie";

function LoginSuccess() {
    const accessToken = getCookie("access_token");
    const refreshToken = getCookie("refresh_token");

    const [countdown, setCountdown] = useState(3); // 카운트다운 시작값
    const [copyStatus, setCopyStatus] = useState({access: "", refresh: ""});

    useEffect(() => {
        console.log("로그인 성공!", {accessToken, refreshToken});

        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            window.location.href = "/";
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [accessToken, refreshToken]);

    const copyToClipboard = (tokenType, tokenValue) => {
        if (!tokenValue) return;
        navigator.clipboard.writeText(tokenValue).then(() => {
            setCopyStatus((prev) => ({
                ...prev,
                [tokenType]: "복사 완료!",
            }));
            setTimeout(() => {
                setCopyStatus((prev) => ({
                    ...prev,
                    [tokenType]: "",
                }));
            }, 1500);
        }).catch(() => {
            setCopyStatus((prev) => ({
                ...prev,
                [tokenType]: "복사 실패",
            }));
        });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #e0ffe0 60%, #dff9fb 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "2.5rem 2.5rem 2rem",
                    borderRadius: "22px",
                    boxShadow: "0 12px 32px rgba(39, 174, 96, 0.12)",
                    width: 400,
                    textAlign: "center",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        fontSize: "3.5rem",
                        marginBottom: "0.8rem",
                        filter: "drop-shadow(0 3px 9px rgba(0,174,64,.18))",
                        animation: "bounce 1.2s cubic-bezier(.28,.84,.42,1) infinite alternate",
                    }}
                >
                    🎉
                </div>
                <h1 style={{color: "#0abc64", marginBottom: 8}}>로그인 성공!</h1>

                {/* access_token */}
                <p
                    style={{
                        margin: "1.2rem 0 0.5rem",
                        background: "#efffd2",
                        borderRadius: 9,
                        color: "#008a32",
                        fontWeight: 500,
                        padding: "0.7em 0.8em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    <span>access_token:</span>
                    <code style={{color: "#222", fontWeight: 600, userSelect: "text"}}>
                        {accessToken ? accessToken.slice(0, 10) + "..." : "없음"}
                    </code>
                    <button
                        onClick={() => copyToClipboard("access", accessToken)}
                        style={{
                            cursor: accessToken ? "pointer" : "not-allowed",
                            background: "#0abc64",
                            border: "none",
                            color: "white",
                            borderRadius: 4,
                            padding: "0.25em 0.5em",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                        }}
                        disabled={!accessToken}
                        type="button"
                    >
                        복사
                    </button>
                    <span style={{color: "#0abc64", fontWeight: "bold"}}>{copyStatus.access}</span>
                </p>

                {/* refresh_token */}
                <p
                    style={{
                        margin: "0.3rem 0 1rem",
                        background: "#f8fafc",
                        borderRadius: 9,
                        color: "#257000",
                        fontWeight: 500,
                        padding: "0.7em 0.8em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    <span>refresh_token:</span>
                    <code style={{color: "#444", fontWeight: 600, userSelect: "text"}}>
                        {refreshToken ? refreshToken.slice(0, 10) + "..." : "없음"}
                    </code>
                    <button
                        onClick={() => copyToClipboard("refresh", refreshToken)}
                        style={{
                            cursor: refreshToken ? "pointer" : "not-allowed",
                            background: "#0abc64",
                            border: "none",
                            color: "white",
                            borderRadius: 4,
                            padding: "0.25em 0.5em",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                        }}
                        disabled={!refreshToken}
                        type="button"
                    >
                        복사
                    </button>
                    <span style={{color: "#0abc64", fontWeight: "bold"}}>{copyStatus.refresh}</span>
                </p>

                <p
                    style={{
                        color: "#005a2c",
                        fontSize: "1rem",
                        marginTop: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        fontWeight: "bold",
                        letterSpacing: -0.5,
                    }}
                >
  <span
      style={{
          display: "inline-block",
          animation: "rotate 1s linear infinite",
          fontSize: "1.3rem",
      }}
  >
    ⏳
  </span>
                    <span>{countdown}초 후 메인 페이지로 이동합니다.</span>
                </p>

                {/* CSS에 이 코드 추가 */}
                <style>
                    {`
    @keyframes bounce {
      0% { transform: translateY(0); }
      100% { transform: translateY(-18px); }
    }
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
                </style>

            </div>
        </div>
    );
}

export default LoginSuccess;
