import {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AuthCallback from "./components/AuthCallback";
import LoginSuccess from "./components/LoginSuccess";
import Main from "./components/Main";
import PassAuthSuccessPage from "./components/PassAuthSuccessPage";
import PassAuthFailPage from "./components/PassAuthFailPage";
import EmailLoginPage from "./components/EmailLoginPage";
import RegisterPage from "./components/RegisterPage";
import SendResetLinkPage from "./components/SendResetLinkPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import NaverCallbackPage from "./components/NaverCallbackPage";

import {deleteCookie} from "./utils/cookie";
import {openNaverLoginPopup} from "./auth/naverAuth";
import {handleKakaoLogin} from "./auth/kakaoAuth";
import {handleAuthNice} from "./auth/niceAuth";

function App() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token"));

    useEffect(() => {
        const syncToken = () => {
            setAccessToken(localStorage.getItem("access_token"));
            setRefreshToken(localStorage.getItem("refresh_token"));
        };
        syncToken();

        window.addEventListener("focus", syncToken);
        window.addEventListener("popstate", syncToken);

        function onNaverLogin(event) {
            if (event.origin !== window.location.origin) return;
            if (event.data.type === "NAVER_LOGIN_SUCCESS") {
                // ⬇️ postMessage로 받은 토큰을 반드시 메인창에서 직접 저장!
                const {accessToken, refreshToken} = event.data.payload;
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", refreshToken);
                // 상태 갱신
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                // 완벽 반영 원하면 새로고침까지
                // window.location.reload();
            }
        }

        window.addEventListener("message", onNaverLogin);
        return () => {
            window.removeEventListener("focus", syncToken);
            window.removeEventListener("popstate", syncToken);
            window.removeEventListener("message", onNaverLogin);
        };
    }, []);

    const handleLogout = () => {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setAccessToken(null);
        setRefreshToken(null);
        window.location.href = "/";
    };

    return (
        <Router>
            <Routes>
                <Route path="/auth/callback" element={<AuthCallback/>}/>
                <Route path="/naver-callback" element={<NaverCallbackPage/>}/>
                <Route path="/login-success" element={<LoginSuccess handleLogout={handleLogout}/>}/>
                <Route path="/pass-auth-success" element={<PassAuthSuccessPage/>}/>
                <Route path="/pass-auth-fail" element={<PassAuthFailPage/>}/>
                <Route path="/email-login" element={<EmailLoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/password-reset-link" element={<SendResetLinkPage/>}/>
                <Route path="/password-reset" element={<ResetPasswordPage/>}/>
                <Route
                    path="/*"
                    element={
                        <Main
                            accessToken={accessToken}
                            refreshToken={refreshToken}
                            handleNaverLogin={openNaverLoginPopup}
                            handleKakaoLogin={handleKakaoLogin}
                            handleAuthNice={handleAuthNice}
                            handleLogout={handleLogout}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;