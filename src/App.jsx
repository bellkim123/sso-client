import {useEffect, useState} from 'react';

function App() {
    const [ssoToken, setSsoToken] = useState(null);

    useEffect(() => {
        const cookies = document.cookie.split(';').reduce((acc, c) => {
            const [k, v] = c.trim().split('=');
            acc[k] = v;
            return acc;
        }, {});
        setSsoToken(cookies['sso_token']);
    }, []);

    const handleLogin = () => {
        const serviceType = 'flashmall';
        const state = Math.random().toString(36).substring(2);
        window.location.href = `http://localhost:5155/api/auth/naver/login?serviceType=${serviceType}&state=${state}`;
    };

    return (
        <div style={{padding: '2rem', fontFamily: 'sans-serif'}}>
            <h1>SSO 클라이언트 테스트 (Vite)</h1>
            {ssoToken ? (
                <p>✅ 로그인됨: {ssoToken}</p>
            ) : (
                <>
                    <p>❌ 로그인되지 않았습니다.</p>
                    <button onClick={handleLogin}>네이버로 로그인</button>
                </>
            )}
        </div>
    );
}

export default App;
