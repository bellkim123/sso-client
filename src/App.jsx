import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthCallback from "./components/AuthCallback";
import LoginSuccess from "./components/LoginSuccess";
import Main from "./components/Main";
import PassAuthSuccessPage from "./components/PassAuthSuccessPage";
import PassAuthFailPage from "./components/PassAuthFailPage";
import EmailLoginPage from "./components/EmailLoginPage";
import RegisterPage from "./components/RegisterPage";

// 👇 비밀번호 재설정 플로우용 새 컴포넌트 추가
import SendResetLinkPage from "./components/SendResetLinkPage";
import ResetPasswordPage from "./components/ResetPasswordPage";

import { getCookie, deleteCookie } from "./utils/cookie";
import { handleNaverLogin } from "./auth/naverAuth";
import { handleKakaoLogin } from "./auth/kakaoAuth";
import { handleAuthNice } from "./auth/niceAuth";

function App() {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    useEffect(() => {
        const syncToken = () => {
            setAccessToken(getCookie("access_token"));
            setRefreshToken(getCookie("refresh_token"));
        };
        syncToken();

        window.addEventListener("focus", syncToken);
        window.addEventListener("popstate", syncToken);
        return () => {
            window.removeEventListener("focus", syncToken);
            window.removeEventListener("popstate", syncToken);
        };
    }, []);

    const handleLogout = () => {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        setAccessToken(null);
        setRefreshToken(null);
        window.location.href = "/";
    };

    return (
        <Router>
            <Routes>
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/login-success" element={<LoginSuccess handleLogout={handleLogout} />} />
                <Route path="/pass-auth-success" element={<PassAuthSuccessPage />} />
                <Route path="/pass-auth-fail" element={<PassAuthFailPage />} />
                <Route path="/email-login" element={<EmailLoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* 비밀번호 재설정 라우트 : 이메일 입력 → 재설정 적용 */}
                <Route path="/password-reset-link" element={<SendResetLinkPage />} />
                <Route path="/password-reset" element={<ResetPasswordPage />} />

                {/* 기타(메인) */}
                <Route
                    path="/*"
                    element={
                        <Main
                            accessToken={accessToken}
                            refreshToken={refreshToken}
                            handleNaverLogin={handleNaverLogin}
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