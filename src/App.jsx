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
    const [refreshToken, setRefreshToken] = useState(null);

    useEffect(() => {
        // 동기화 함수! (cookie로부터 다시 읽음)
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

    // handleAuthNice도 props로 전달

    return (
        <Router>
            <Routes>
                <Route path="/auth/callback" element={<AuthCallback/>}/>
                <Route path="/login-success" element={<LoginSuccess handleLogout={handleLogout}/>}/>
                <Route path="/pass-auth-success" element={<PassAuthSuccessPage/>}/>
                <Route path="/pass-auth-fail" element={<PassAuthFailPage/>}/>
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