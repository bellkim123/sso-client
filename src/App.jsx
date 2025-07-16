import {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AuthCallback from "./components/AuthCallback";
import LoginSuccess from "./components/LoginSuccess";
import Main from "./components/Main";

import {getCookie, deleteCookie} from "./utils/cookie";
import {handleNaverLogin} from "./auth/naverAuth";
import {handleKakaoLogin} from "./auth/kakaoAuth";

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

    const handleAuthNice = async () => {
        try {
            const res = await fetch("/user/AuthNice", {method: "POST"});
            if (!res.ok) throw new Error("본인 인증 실패");

            const {data} = await res.json();
            const {requestUrl, postData} = data.data;

            const form = document.createElement("form");
            form.method = "POST";
            form.action = requestUrl;

            for (const key in postData) {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = postData[key];
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
        } catch (e) {
            alert("본인 인증 요청 중 오류 발생");
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/auth/callback" element={<AuthCallback/>}/>
                <Route path="/login-success" element={<LoginSuccess handleLogout={handleLogout}/>}/>
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
