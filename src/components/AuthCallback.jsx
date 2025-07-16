import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getCookie} from "../utils/cookie";

function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            const accessToken = getCookie("access_token");
            console.log("[AuthCallback] 현재 경로:", window.location.pathname + window.location.search);
            console.log("[AuthCallback] 읽은 access_token:", accessToken);

            if (accessToken) {
                console.log("[AuthCallback] 로그인 성공! /login-success로 이동");
                navigate("/login-success", {replace: true});
            } else {
                console.log("[AuthCallback] 토큰 없음, 메인으로 이동");
                navigate("/", {replace: true});
            }
        }, 300);
    }, [navigate]);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f5f5f5 60%, #ecf9ff 100%)",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "2rem 2.5rem",
                    borderRadius: "20px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                    textAlign: "center",
                    width: 360,
                }}
            >
                <div
                    style={{
                        fontSize: "2.5rem",
                        marginBottom: "0.8rem",
                        animation: "rotate 1s linear infinite",
                    }}
                >
                    🔄
                </div>
                <h2 style={{fontSize: "1.4rem", color: "#555", fontWeight: "bold"}}>
                    로그인 처리 중...
                </h2>
                <p style={{fontSize: "0.95rem", color: "#777", marginTop: "0.5rem"}}>
                    잠시만 기다려주세요
                </p>

                <style>
                    {`
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

export default AuthCallback;
