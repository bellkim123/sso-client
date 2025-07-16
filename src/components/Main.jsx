// src/components/Main.jsx

import kakaoBtn from "../assets/kakao-login-button.png";
import naverBtn from "../assets/naver-login-button.png";

function Main({accessToken, handleNaverLogin, handleKakaoLogin, handleAuthNice, handleLogout}) {
    const profileImg =
        "https://raw.githubusercontent.com/ionic-team/ionicons/master/src/svg/person-circle-outline.svg";

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
                    boxShadow: "0 12px 32px rgba(39, 174, 96, 0.09)",
                    width: 370,
                    textAlign: "center",
                }}
            >
                <h1 style={{marginBottom: "2.2rem", color: "#34495e"}}>SSO 클라이언트</h1>
                {accessToken ? (
                    <LoggedInCard
                        accessToken={accessToken}
                        profileImg={profileImg}
                        handleAuthNice={handleAuthNice}
                        handleLogout={handleLogout}
                    />
                ) : (
                    <LoginButtons
                        handleNaverLogin={handleNaverLogin}
                        handleKakaoLogin={handleKakaoLogin}
                    />
                )}
            </div>
        </div>
    );
}

function LoggedInCard({accessToken, profileImg, handleAuthNice, handleLogout}) {
    return (
        <>
            <img
                src={profileImg}
                alt="프로필"
                width={70}
                height={70}
                style={{marginBottom: 18, borderRadius: "50%"}}
            />
            <div
                style={{
                    padding: "1rem",
                    background: "#f9fbe7",
                    borderRadius: "12px",
                    marginBottom: "1.5rem",
                    color: "#636e72",
                    fontSize: "1.07rem",
                }}
            >
                <span role="img" aria-label="login">✅</span>
                <span style={{marginLeft: 8, fontWeight: 500}}>로그인되었습니다</span>
                <br/>
                <span
                    style={{
                        color: "#009432",
                        background: "#dff9fb",
                        padding: "0.2em 0.5em",
                        borderRadius: "7px",
                        fontSize: "0.89em",
                        marginLeft: 4,
                    }}
                >
                    {accessToken.slice(0, 10) + "..."}
                </span>
            </div>
            <button
                onClick={handleAuthNice}
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
            >
                PASS 본인인증
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
                    cursor: "pointer",
                }}
            >
                로그아웃
            </button>
        </>
    );
}

function LoginButtons({handleNaverLogin, handleKakaoLogin}) {
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
    };

    return (
        <>
            <p
                style={{
                    color: "#e74c3c",
                    background: "#fbeee6",
                    borderRadius: 8,
                    padding: "0.7em 0.3em",
                    fontWeight: "bold",
                    marginBottom: "2.1rem",
                }}
            >
                로그인 해주세요😵‍💫
            </p>
            <button onClick={handleNaverLogin} style={{...btnStyle, marginBottom: 14}}>
                <img src={naverBtn} alt="네이버 로그인 버튼" style={imgStyle}/>
            </button>
            <button onClick={handleKakaoLogin} style={btnStyle}>
                <img src={kakaoBtn} alt="카카오 로그인 버튼" style={imgStyle}/>
            </button>
        </>
    );
}

export default Main;
