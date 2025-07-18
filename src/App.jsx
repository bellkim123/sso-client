import {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AuthCallback from "./components/AuthCallback";
import LoginSuccess from "./components/LoginSuccess";
import Main from "./components/Main";
import PassAuthSuccessPage from "./components/PassAuthSuccessPage";
import PassAuthFailPage from "./components/PassAuthFailPage";

import {getCookie, deleteCookie} from "./utils/cookie";
import {handleNaverLogin} from "./auth/naverAuth";
import {handleKakaoLogin} from "./auth/kakaoAuth";
import {handleAuthNice} from "./auth/niceAuth";

function App() {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const syncToken = () => setAccessToken(getCookie("access_token"));
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
        window.location.href = "/";
    };

    // handleAuthNice는 props로 바로 전달

    return (
        <Router>
            <Routes>
                <Route path="/auth/callback" element={<AuthCallback/>}/>
                <Route path="/login-success" element={<LoginSuccess handleLogout={handleLogout}/>}/>
                {/* PASS 본인인증 성공/실패 결과 페이지 라우트 추가 */}
                <Route path="/pass-auth-success" element={<PassAuthSuccessPage/>}/>
                <Route path="/pass-auth-fail" element={<PassAuthFailPage/>}/>
                {/* 메인 라우터는 마지막에 와야함 */}
                <Route
                    path="/*"
                    element={
                        <Main
                            accessToken={accessToken}
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