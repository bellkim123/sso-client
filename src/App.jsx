import {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import AuthCallback from "./components/AuthCallback";
import LoginSuccess from "./components/LoginSuccess";
import Main from "./components/Main";
import PassAuthSuccessPage from "./components/PassAuthSuccessPage";
import PassAuthFailPage from "./components/PassAuthFailPage";
import EmailLoginPage from "./components/EmailLoginPage"; // ✅ 추가
import RegisterPage from "./components/RegisterPage";     // ✅ 추가

import {getCookie, deleteCookie} from "./utils/cookie";
import {handleNaverLogin} from "./auth/naverAuth";
import {handleKakaoLogin} from "./auth/kakaoAuth";
import {handleAuthNice} from "./auth/niceAuth";

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
                <Route path="/auth/callback" element={<AuthCallback/>}/>
                <Route path="/login-success" element={<LoginSuccess handleLogout={handleLogout}/>}/>
                <Route path="/pass-auth-success" element={<PassAuthSuccessPage/>}/>
                <Route path="/pass-auth-fail" element={<PassAuthFailPage/>}/>
                <Route path="/email-login" element={<EmailLoginPage/>}/> {/* ✅ 이메일 로그인 페이지 */}
                <Route path="/register" element={<RegisterPage/>}/> {/* ✅ 회원가입 페이지 */}
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
