import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import kakaoBtn from "../assets/kakao-login-button.png";
import naverBtn from "../assets/naver-login-button.png";

function Main({
                  accessToken,
                  refreshToken,
                  handleNaverLogin,
                  handleKakaoLogin,
                  handleEmailLogin,
                  handleAuthNice,
                  handleLogout,
              }) {
    const profileImg = "https://i.pinimg.com/736x/2b/45/45/2b4545e9efe40d7aecd1cf04693658f1.jpg";

    useEffect(() => {
        if (accessToken) Cookies.set("accessToken", accessToken, {expires: 1});
        if (refreshToken) Cookies.set("refreshToken", refreshToken, {expires: 7});
    }, [accessToken, refreshToken]);

    const [copied, setCopied] = useState({key: "", show: false});

    // 복사 함수
    const handleCopy = (key, value) => {
        navigator.clipboard.writeText(value || "");
        setCopied({key, show: true});
        setTimeout(() => setCopied({key: "", show: false}), 1300);
    };

    useEffect(() => {
        function onNaverLogin(event) {
            if (event.origin !== window.location.origin) return;
            if (event.data.type === "NAVER_LOGIN_SUCCESS") {
                window.location.reload();
            }
        }

        window.addEventListener("message", onNaverLogin);
        return () => window.removeEventListener("message", onNaverLogin);
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f6fa 60%, #dff9fb 100%)",
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
                    boxShadow: "0 12px 32px rgba(39,174,96,0.09)",
                    width: 370,
                    textAlign: "center",
                    position: "relative",
                }}
            >
                <h1 style={{marginBottom: "2.2rem", color: "#34495e"}}>SSO 클라이언트</h1>
                {accessToken ? (
                    <LoggedInCard
                        accessToken={accessToken}
                        refreshToken={refreshToken}
                        profileImg={profileImg}
                        handleAuthNice={handleAuthNice}
                        handleLogout={handleLogout}
                        handleCopy={handleCopy}
                        copied={copied}
                    />
                ) : (
                    <LoginButtons
                        handleNaverLogin={handleNaverLogin}
                        handleKakaoLogin={handleKakaoLogin}
                        handleEmailLogin={handleEmailLogin}
                    />
                )}
            </div>
        </div>
    );
}

// ------------------------------------------------------
// 복사 아이콘 (SVG)
function CopyIcon({style}) {
    return (
        <svg
            style={style}
            height="18"
            width="18"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
        >
            <rect x="5" y="7" width="10" height="10" rx="3" fill="#0984e3"/>
            <rect x="7" y="3" width="8" height="12" rx="2" fill="#dff9fb"/>
            <rect x="6" y="2" width="10" height="12" rx="2" fill="#0984e3"/>
        </svg>
    );
}

// ------------------------------------------------------
// 로그인 후 카드
function LoggedInCard({
                          accessToken,
                          refreshToken,
                          profileImg,
                          handleAuthNice,
                          handleLogout,
                          handleCopy,
                          copied,
                      }) {
    const fieldStyle = {
        display: "flex",
        alignItems: "center",
        background: "#F6F8FB",
        borderRadius: 8,
        padding: "0.85em 1em",
        fontSize: "0.97em",
        fontWeight: 500,
        marginBottom: 11,
        justifyContent: "flex-start",
        textAlign: "left",
        position: "relative",
        wordBreak: "break-all",
    };
    const tokenShorten = (token) => {
        if (!token) return "";
        if (token.length <= 17) return token;
        return token.slice(0, 8) + "..." + token.slice(-7);
    }

    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 12
            }}>
                <img
                    src={profileImg}
                    alt="프로필"
                    width={110}
                    height={110}
                    style={{
                        borderRadius: "50%",
                        border: "3px solid #e8ecf0",
                        objectFit: "cover",
                        objectPosition: "center",
                        background: "#eef3f6"
                    }}
                />
            </div>
            <div style={{color: "#009432", fontWeight: "bold", marginBottom: 30}}>
                ✅ 로그인되었습니다
            </div>
            <div style={fieldStyle}>
                <span style={{minWidth: 115, color: "#636e72"}}>AccessToken:</span>
                <span
                    style={{
                        fontFamily: "monospace",
                        color: "#34495e",
                        letterSpacing: 0.5,
                        flex: 1,
                        marginRight: 7
                    }}
                >
                    {tokenShorten(accessToken)}
                </span>
                <span
                    onClick={() => handleCopy("accessToken", accessToken)}
                    style={{
                        cursor: "pointer",
                        marginLeft: 3,
                        opacity: 0.85,
                        display: "flex",
                        alignItems: "center",
                    }}
                    title="AccessToken 복사"
                    role="button"
                >
                    <CopyIcon/>
                </span>
                {/* 복사 토스트 */}
                {(copied.key === "accessToken" && copied.show) && (
                    <span style={{
                        position: "absolute",
                        right: 5,
                        top: "100%",
                        fontSize: 13,
                        color: "#0984e3",
                        background: "#eafafa",
                        borderRadius: 9,
                        padding: "2px 9px",
                        marginTop: 3,
                        boxShadow: "0 3px 10px #ddd6",
                        zIndex: 10,  // z-index 추가
                    }}>
                        복사되었습니다!
                    </span>
                )}
            </div>
            <div style={fieldStyle}>
                <span style={{minWidth: 115, color: "#636e72"}}>RefreshToken:</span>
                <span
                    style={{
                        fontFamily: "monospace",
                        color: "#34495e",
                        letterSpacing: 0.5,
                        flex: 1,
                        marginRight: 7
                    }}
                >
                    {tokenShorten(refreshToken)}
                </span>
                <span
                    onClick={() => handleCopy("refreshToken", refreshToken)}
                    style={{
                        cursor: "pointer",
                        marginLeft: 3,
                        opacity: 0.85,
                        display: "flex",
                        alignItems: "center",
                    }}
                    title="RefreshToken 복사"
                    role="button"
                >
                    <CopyIcon/>
                </span>
                {/* 복사 토스트 */}
                {(copied.key === "refreshToken" && copied.show) && (
                    <span style={{
                        position: "absolute",
                        right: 5,
                        top: "100%",
                        fontSize: 13,
                        color: "#0984e3",
                        background: "#eafafa",
                        borderRadius: 9,
                        padding: "2px 9px",
                        marginTop: 3,
                        boxShadow: "0 3px 10px #ddd6",
                        zIndex: 10,  // z-index 추가
                    }}>
                        복사되었습니다!
                    </span>
                )}
            </div>
            <button
                onClick={() => handleAuthNice(accessToken, refreshToken)}
                style={{
                    width: "100%",
                    background: "#00b894",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "0.95rem",
                    marginBottom: "0.7rem",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    cursor: "pointer",
                }}
            >PASS 본인인증
            </button>
            <button
                onClick={handleLogout}
                style={{
                    width: "100%",
                    background: "#636e72",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "0.9rem",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    marginTop: 6,
                    cursor: "pointer"
                }}
            >로그아웃
            </button>
        </>
    );
}

// 로그인 버튼들 컴포넌트
function LoginButtons({handleNaverLogin, handleKakaoLogin, handleEmailLogin}) {
    const BUTTON_HEIGHT = 54;
    const BUTTON_WIDTH = "100%";
    const imgStyle = {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
    };
    const btnStyle = {
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        background: "transparent",
        border: "none",
        padding: 0,
        overflow: "hidden",
        borderRadius: 10,
        marginBottom: 12,
        cursor: "pointer",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
    return (
        <>
            <p style={{
                color: "#C4B5FD", background: "#F3F0FF", borderRadius: 8,
                padding: "0.7em 0.3em", fontWeight: "bold", marginBottom: "2.1rem"
            }}>
                로그인 해주세요😵‍💫
            </p>
            <button onClick={handleNaverLogin} style={{...btnStyle, marginBottom: 14}}>
                <img src={naverBtn} alt="네이버 로그인 버튼" style={imgStyle}/>
            </button>
            <button onClick={handleKakaoLogin} style={btnStyle}>
                <img src={kakaoBtn} alt="카카오 로그인 버튼" style={imgStyle}/>
            </button>
            <button
                onClick={() => window.location.href = "/email-login"}
                style={{
                    ...btnStyle,
                    background: "#EDE9FE", color: "#7C3AED", fontWeight: "bold",
                    fontSize: "1rem", marginBottom: 0,
                }}>이메일 로그인
            </button>
        </>
    );
}

export default Main;
