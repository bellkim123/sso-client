import {useEffect, useState} from "react";
import {getCookie} from "../utils/cookie";

function LoginSuccess() {
    const accessToken = getCookie("access_token");
    const refreshToken = getCookie("refresh_token");

    const [countdown, setCountdown] = useState(3); // 카운트다운 시작값

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
                <p
                    style={{
                        margin: "1.2rem 0 0.5rem",
                        background: "#efffd2",
                        borderRadius: 9,
                        color: "#008a32",
                        fontWeight: 500,
                        padding: "0.7em 0.8em",
                        display: "inline-block",
                    }}
                >
                    access_token:
                    <code style={{marginLeft: 6, color: "#222", fontWeight: 600}}>
                        {accessToken ? accessToken.slice(0, 10) + "..." : "없음"}
                    </code>
                </p>
                <p
                    style={{
                        margin: "0.3rem 0 1rem",
                        background: "#f8fafc",
                        borderRadius: 9,
                        color: "#257000",
                        fontWeight: 500,
                        padding: "0.7em 0.8em",
                        display: "inline-block",
                    }}
                >
                    refresh_token:
                    <code style={{marginLeft: 6, color: "#444", fontWeight: 600}}>
                        {refreshToken ? refreshToken.slice(0, 10) + "..." : "없음"}
                    </code>
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
