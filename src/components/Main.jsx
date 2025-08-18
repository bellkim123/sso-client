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
    const profileImg =
        "https://i.pinimg.com/736x/2b/45/45/2b4545e9efe40d7aecd1cf04693658f1.jpg";

    useEffect(() => {
        if (accessToken) Cookies.set("accessToken", accessToken, {expires: 1});
        if (refreshToken) Cookies.set("refreshToken", refreshToken, {expires: 7});
    }, [accessToken, refreshToken]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js";
        script.async = true;
        document.body.appendChild(script);

        // NICEPAY가 호출할 콜백 함수 등록
        window.nicepaySubmit = function () {
            alert("✅ 결제가 정상 처리되었습니다.");

            // 결제 요청 시 우리가 생성한 form을 찾아서 submit
            const payForm = document.forms["payForm"] || document.querySelector("form[name='payForm']");
            if (payForm) {
                payForm.submit();
            } else {
                console.error("payForm을 찾을 수 없음 - submit 불가");
            }
        };

        window.nicepayClose = function () {
            alert("❌ 결제가 취소되었습니다.");
        };

        return () => {
            document.body.removeChild(script);
            delete window.nicepaySubmit;
            delete window.nicepayClose;
        };
    }, []);
    const [copied, setCopied] = useState({key: "", show: false});

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
                <h1 style={{marginBottom: "2.2rem", color: "#34495e"}}>
                    SSO 클라이언트
                </h1>
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

// 복사 아이콘
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
    };

    // NICEPAY 스크립트 로드
    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // NICEPAY 결제 시작
    const handleNicepayPayment = async () => {
        try {
            const response = await fetch(
                "https://localhost:7036/api/payments/nicepay/init",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        orderPrepareId: "b1c575df-72fd-443b-a9f3-01054341b344",
                        payMethod: "Card",
                        goodsName: "테스트 상품",
                    }),
                }
            );

            if (!response.ok) throw new Error("결제 정보 요청 실패");
            const {data} = await response.json();

            // ✅ name="payForm" 추가
            const form = document.createElement("form");
            form.name = "payForm";
            form.method = "POST";
            form.action = "https://localhost:7036/api/payments/nicepay/callback";
            form.setAttribute("accept-charset", "euc-kr");

            const fields = {
                GoodsName: data.goodsName,
                Amt: data.amt,
                MID: data.mid,
                EdiDate: data.ediDate,
                Moid: data.moid,
                SignData: data.signData,
                PayMethod: data.payMethodCode,
                ReturnURL: "",
                ReqReserved: JSON.stringify({
                    customerAddressId: 1
                })
            };

            Object.keys(fields).forEach((key) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = fields[key] || "";
                form.appendChild(input);
            });

            document.body.appendChild(form);

            if (typeof window.goPay === "function") {
                window.goPay(form);
            } else {
                alert("NICEPAY 스크립트를 불러오지 못했습니다.");
            }
        } catch (err) {
            console.error(err);
            alert("결제 요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >
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
                        background: "#eef3f6",
                    }}
                />
            </div>
            <div style={{color: "#009432", fontWeight: "bold", marginBottom: 30}}>
                ✅ 로그인되었습니다
            </div>

            {/* Token UI */}
            {/* AccessToken */}
            <div style={fieldStyle}>
                <span style={{minWidth: 115, color: "#636e72"}}>AccessToken:</span>
                <span
                    style={{
                        fontFamily: "monospace",
                        color: "#34495e",
                        letterSpacing: 0.5,
                        flex: 1,
                        marginRight: 7,
                    }}
                >
          {tokenShorten(accessToken)}
        </span>
                <span
                    onClick={() => handleCopy("accessToken", accessToken)}
                    style={{cursor: "pointer", marginLeft: 3, opacity: 0.85}}
                    title="AccessToken 복사"
                    role="button"
                >
          <CopyIcon/>
        </span>
                {copied.key === "accessToken" && copied.show && (
                    <span style={toastStyle}>복사되었습니다!</span>
                )}
            </div>

            {/* RefreshToken */}
            <div style={fieldStyle}>
                <span style={{minWidth: 115, color: "#636e72"}}>RefreshToken:</span>
                <span
                    style={{
                        fontFamily: "monospace",
                        color: "#34495e",
                        letterSpacing: 0.5,
                        flex: 1,
                        marginRight: 7,
                    }}
                >
          {tokenShorten(refreshToken)}
        </span>
                <span
                    onClick={() => handleCopy("refreshToken", refreshToken)}
                    style={{cursor: "pointer", marginLeft: 3, opacity: 0.85}}
                    title="RefreshToken 복사"
                    role="button"
                >
          <CopyIcon/>
        </span>
                {copied.key === "refreshToken" && copied.show && (
                    <span style={toastStyle}>복사되었습니다!</span>
                )}
            </div>

            {/* PASS 인증 버튼 */}
            <button
                onClick={() => handleAuthNice(accessToken, refreshToken)}
                style={btnStyle("#00b894")}
            >
                PASS 본인인증
            </button>

            {/* NICEPAY 결제 버튼 */}
            <button
                onClick={handleNicepayPayment}
                style={btnStyle("#4CAF50", "결제하기")}
            >
                NICEPAY 결제하기
            </button>

            {/* 로그아웃 */}
            <button onClick={handleLogout} style={btnStyle("#636e72")}>
                로그아웃
            </button>
        </>
    );
}

const toastStyle = {
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
    zIndex: 10,
};

const btnStyle = (bg) => ({
    width: "100%",
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "0.95rem",
    marginBottom: "0.7rem",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
});

// 로그인 버튼들
function LoginButtons({handleNaverLogin, handleKakaoLogin, handleEmailLogin}) {
    const BUTTON_HEIGHT = 54;
    const BUTTON_WIDTH = "100%";
    const imgStyle = {width: "100%", height: "100%", objectFit: "cover"};
    const btnStyle = {
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        background: "transparent",
        border: "none",
        borderRadius: 10,
        marginBottom: 12,
        cursor: "pointer",
    };
    return (
        <>
            <p
                style={{
                    color: "#C4B5FD",
                    background: "#F3F0FF",
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
            <button
                onClick={() => (window.location.href = "/email-login")}
                style={{
                    ...btnStyle,
                    background: "#EDE9FE",
                    color: "#7C3AED",
                    fontWeight: "bold",
                    fontSize: "1rem",
                }}
            >
                이메일 로그인
            </button>
        </>
    );
}

export default Main;
