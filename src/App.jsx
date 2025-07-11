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

// 쿠키 삭제 함수
function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
}

// 인증 콜백 페이지: 쿠키 세팅 후 메인으로 이동
function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = getCookie("access_token");
        const refreshToken = getCookie("refresh_token");
        console.log("access_token:", accessToken);
        console.log("refresh_token:", refreshToken);

        if (accessToken) {
            navigate("/login-success", {replace: true});
        } else {
            navigate("/login", {replace: true});
        }
    }, [navigate]);

    return <p>로그인 처리 중...</p>;
}

// 로그인 성공 페이지
function LoginSuccess({handleLogout}) {
    const accessToken = getCookie("access_token");
    const refreshToken = getCookie("refresh_token");

    useEffect(() => {
        console.log("로그인 성공!");
        console.log("access_token:", accessToken);
        console.log("refresh_token:", refreshToken);
    }, [accessToken, refreshToken]);

    return (
        <div style={{padding: "2rem", fontFamily: "sans-serif"}}>
            <h1 style={{color: "green"}}>🎉 로그인 성공!</h1>
            <p>access_token (앞 10자): <code>{accessToken ? accessToken.slice(0, 10) + "..." : "없음"}</code></p>
            <p>refresh_token (앞 10자): <code>{refreshToken ? refreshToken.slice(0, 10) + "..." : "없음"}</code></p>
            <p>콘솔에서 전체 토큰 값을 확인할 수 있습니다.</p>
            <button onClick={handleLogout} style={{marginTop: "1rem"}}>
                로그아웃
            </button>
        </div>
    );
}

// 메인 페이지
function Main({accessToken, handleLogin, handleAuthNice, handleLogout}) {
    return (
        <div style={{padding: "2rem", fontFamily: "sans-serif"}}>
            <h1>SSO 클라이언트 테스트 (Vite)</h1>
            {accessToken ? (
                <>
                    <p>✅ 로그인됨: <code>{accessToken.slice(0, 10) + "..."}</code></p>
                    <button onClick={handleAuthNice} style={{marginTop: "1rem"}}>
                        PASS 본인인증
                    </button>
                    <button onClick={handleLogout} style={{marginLeft: "1rem", marginTop: "1rem"}}>
                        로그아웃
                    </button>
                </>
            ) : (
                <>
                    <p style={{color: "red"}}>❌ 로그인되지 않았습니다.</p>
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
        const syncToken = () => setAccessToken(getCookie("access_token"));
        window.addEventListener("focus", syncToken);
        window.addEventListener("popstate", syncToken);
        return () => {
            window.removeEventListener("focus", syncToken);
            window.removeEventListener("popstate", syncToken);
        };
    }, []);

    // 네이버 로그인 버튼 클릭 시
    const handleLogin = async () => {
        const serviceType = 2; // Pallang (필요시 변경)
        try {
            console.log("로그인 요청 시작");
            const res = await fetch(`http://localhost:5155/api/auth/naver/login?serviceType=${serviceType}`);
            console.log("fetch 응답 상태:", res.status);

            if (!res.ok) {
                console.error("fetch 실패:", res.status, res.statusText);
                alert("서버에서 네이버 로그인 URL을 받아오지 못했습니다.");
                return;
            }

            const result = await res.json();
            console.log("서버 응답 데이터:", result);

            if (result.success && result.data) {
                console.log("네이버 로그인 URL로 이동:", result.data);
                window.location.href = result.data; // 네이버 로그인 URL로 이동
            } else {
                console.error("result.success가 false이거나 data 없음:", result);
                alert("네이버 로그인 URL을 받아오지 못했습니다.");
            }
        } catch (e) {
            console.error("네이버 로그인 요청 중 오류:", e);
            alert("네이버 로그인 요청 중 오류가 발생했습니다.");
        }
    };

    // 로그아웃 버튼 클릭 시
    const handleLogout = () => {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        setAccessToken(null);
        window.location.href = "/login";
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
                <Route path="/login-success" element={<LoginSuccess handleLogout={handleLogout}/>}/>
                <Route path="/login" element={<Login handleLogin={handleLogin}/>}/>
                <Route
                    path="/*"
                    element={
                        <Main
                            accessToken={accessToken}
                            handleLogin={handleLogin}
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
