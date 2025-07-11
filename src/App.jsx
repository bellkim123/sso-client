import {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";

// 쿠키 파싱 함수
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

// 인증 콜백 페이지: 쿠키 세팅 후 메인으로 이동
function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getCookie("access_token");
        if (token) {
            // access_token이 갱신된 것을 반영하기 위해 새로고침
            navigate("/", {replace: true});
            window.location.reload();
        } else {
            navigate("/login", {replace: true});
        }
    }, [navigate]);

    return <p>로그인 처리 중...</p>;
}

// 메인 페이지
function Main({accessToken, handleLogin, handleAuthNice}) {
    return (
        <div style={{padding: "2rem", fontFamily: "sans-serif"}}>
            <h1>SSO 클라이언트 테스트 (Vite)</h1>
            {accessToken ? (
                <>
                    <p>✅ 로그인됨: {accessToken}</p>
                    <button onClick={handleAuthNice} style={{marginTop: "1rem"}}>
                        PASS 본인인증
                    </button>
                </>
            ) : (
                <>
                    <p>❌ 로그인되지 않았습니다.</p>
                    <button onClick={handleLogin}>네이버로 로그인!!!</button>
                </>
            )}
        </div>
    );
}

// 로그인 전용 페이지 (옵션)
function Login({handleLogin}) {
    return (
        <div style={{padding: "2rem", fontFamily: "sans-serif"}}>
            <h1>로그인 필요</h1>
            <button onClick={handleLogin}>네이버로 로그인!!!</button>
        </div>
    );
}

function App() {
    const [accessToken, setAccessToken] = useState(null);

    // access_token 쿠키를 읽어서 상태에 저장 (페이지 진입 시마다 동기화)
    useEffect(() => {
        setAccessToken(getCookie("access_token"));
        // hashchange, popstate 등 라우팅 변화에도 동기화
        const syncToken = () => setAccessToken(getCookie("access_token"));
        window.addEventListener("focus", syncToken);
        window.addEventListener("popstate", syncToken);
        return () => {
            window.removeEventListener("focus", syncToken);
            window.removeEventListener("popstate", syncToken);
        };
    }, []);

    // 로그인 버튼 클릭 시
    const handleLogin = () => {
        const serviceType = 2; // Pallang (필요시 변경)
        window.location.href = `http://localhost:5155/api/auth/naver/login?serviceType=${serviceType}`;
    };

    // PASS 본인인증 버튼 클릭 시
    const handleAuthNice = async () => {
        try {
            const res = await fetch("/user/AuthNice", {method: "POST"});
            if (!res.ok) throw new Error("본인인증 요청 실패");
            const result = await res.json();
            const {postData, requestUrl} = result.data.data;

            const form = document.createElement("form");
            form.method = "POST";
            form.action = requestUrl;

            for (const key in postData) {
                if (Object.prototype.hasOwnProperty.call(postData, key)) {
                    const hiddenField = document.createElement("input");
                    hiddenField.type = "hidden";
                    hiddenField.name = key;
                    hiddenField.value = postData[key];
                    form.appendChild(hiddenField);
                }
            }

            document.body.appendChild(form);
            form.submit();
        } catch {
            alert("본인인증 요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/auth/callback" element={<AuthCallback/>}/>
                <Route path="/login" element={<Login handleLogin={handleLogin}/>}/>
                <Route
                    path="/*"
                    element={
                        <Main
                            accessToken={accessToken}
                            handleLogin={handleLogin}
                            handleAuthNice={handleAuthNice}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;