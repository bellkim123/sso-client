import React, {useEffect, useRef} from "react";
import {BASE_URL} from "../config/apiConfig";

function NaverCallbackPage() {
    const requestedRef = useRef(false);

    useEffect(() => {
        if (requestedRef.current) {
            console.log("[NaverCallbackPage] 이미 토큰 요청함 → 스킵");
            return;
        }
        requestedRef.current = true;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        console.log("[NaverCallbackPage] code:", code, "state:", state);

        async function fetchToken() {
            try {
                const res = await fetch(
                    `${BASE_URL}/auth/naver/token?code=${code}&state=${state}`,
                    {credentials: "include"}
                );
                if (!res.ok) throw new Error("토큰 요청 실패");
                const data = await res.json();
                console.log("[NaverCallbackPage] 서버 응답:", data);

                // localStorage.setItem(...) 하지 않는다!

                // 무조건 부모창에 토큰만 안전하게 전송
                if (window.opener) {
                    window.opener.postMessage(
                        {
                            type: "NAVER_LOGIN_SUCCESS",
                            payload: {
                                accessToken: data.data.accessToken, // 소문자로!
                                refreshToken: data.data.refreshToken
                            }
                        },
                        window.location.origin
                    );
                }
                setTimeout(() => window.close(), 300);
            } catch (err) {
                console.error("[NaverCallbackPage] 로그인 처리 중 오류:", err);
                alert("로그인 처리 중 오류: " + (err.message ? err.message : err));
                window.close();
            }
        }

        if (code && state) {
            fetchToken();
        } else {
            alert("인증 코드 없음. 창을 닫습니다.");
            window.close();
        }
    }, []);

    return (
        <div style={{textAlign: "center", paddingTop: 60}}>
            <h3>네이버 로그인 처리 중...</h3>
        </div>
    );
}

export default NaverCallbackPage;