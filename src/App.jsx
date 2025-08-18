// App.jsx
import { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

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

import { deleteCookie } from "./utils/cookie";
import { openNaverLoginPopup } from "./auth/naverAuth";
import { handleKakaoLogin } from "./auth/kakaoAuth";
import { handleAuthNice } from "./auth/niceAuth";

function App() {
    // 최초 로드 시 localStorage에서 복원
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("access_token") || ""
    );
    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem("refresh_token") || ""
    );

    useEffect(() => {
        // 창이 포커스를 얻거나, 히스토리 이동(popstate) 시 로컬스토리지 값으로 동기화
        const syncToken = () => {
            const at = localStorage.getItem("access_token") || "";
            const rt = localStorage.getItem("refresh_token") || "";
            setAccessToken(at);
            setRefreshToken(rt);
        };

        syncToken();
        window.addEventListener("focus", syncToken);
        window.addEventListener("popstate", syncToken);

        // 네이버 로그인 팝업에서 postMessage로 전달되는 토큰 수신
        function onNaverLogin(event) {
            if (event.origin !== window.location.origin) return;
            if (event.data?.type === "NAVER_LOGIN_SUCCESS") {
                const { accessToken: at, refreshToken: rt } = event.data.payload || {};
                if (at && rt) {
                    localStorage.setItem("access_token", at);
                    localStorage.setItem("refresh_token", rt);
                    setAccessToken(at);
                    setRefreshToken(rt);
                }
            }
        }

        window.addEventListener("message", onNaverLogin);

        return () => {
            window.removeEventListener("focus", syncToken);
            window.removeEventListener("popstate", syncToken);
            window.removeEventListener("message", onNaverLogin);
        };
    }, []);

    // 로그아웃: 쿠키/로컬스토리지 정리 후 상태 초기화
    const handleLogout = () => {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setAccessToken("");
        setRefreshToken("");
        window.location.href = "/";
    };

    // 이메일 로그인 성공 시: 상위 상태 및 로컬스토리지 저장 후 메인으로 이동
    const handleEmailLoginSuccess = (access, refresh, navigate) => {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        setAccessToken(access);
        setRefreshToken(refresh);
        if (navigate) navigate("/"); // 메인으로 이동
    };

    return (
        <Router>
            <Routes>
                {/* 소셜/공통 콜백 라우트 */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/naver-callback" element={<NaverCallbackPage />} />

                {/* 인증/결과 페이지들 */}
                <Route
                    path="/login-success"
                    element={<LoginSuccess handleLogout={handleLogout} />}
                />
                <Route path="/pass-auth-success" element={<PassAuthSuccessPage />} />
                <Route path="/pass-auth-fail" element={<PassAuthFailPage />} />

                {/* 이메일 인증/회원가입/비밀번호 재설정 */}
                <Route
                    path="/email-login"
                    element={
                        <EmailLoginPage onLoginSuccess={handleEmailLoginSuccess} />
                    }
                />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/password-reset-link" element={<SendResetLinkPage />} />
                <Route path="/password-reset" element={<ResetPasswordPage />} />

                {/* 메인 및 그 외 경로 */}
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
