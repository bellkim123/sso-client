// handleAuthNice.js

import { refreshAccessToken } from "./refreshAccessToken";

/**
 * 본인인증 요청 핸들러
 * @param {string} accessToken - 현재 access 토큰값 (string 또는 null)
 * @param {string} refreshToken - 현재 refresh 토큰값 (string 또는 null)
 * @param {function} updateTokens - (optional) access/refresh 토큰 갱신 함수 (ex: (a, r) => ...)
 * @param {object} [options] - 추가 옵션 (쿠키 기반 동작 지원: { withCredentials: true, tryCookieRefresh: true })
 */
export async function handleAuthNice(accessToken, refreshToken, updateTokens, options = {}) {
    let currentAccessToken = accessToken;
    let currentRefreshToken = refreshToken;
    let triedRefresh = false;
    let triedCookieRefresh = false;

    while (true) {
        try {
            const res = await fetch("http://localhost:5155/api/auth/pass/request", {
                method: "POST",
                headers: currentAccessToken
                    ? { "Authorization": `Bearer ${currentAccessToken}` }
                    : undefined,
                credentials: options?.withCredentials ? "include" : undefined
            });

            // 401 Unauthorized: 토큰 만료 → 리프레시 루트
            if (res.status === 401 && !triedRefresh) {
                triedRefresh = true;
                if (currentRefreshToken) {
                    try {
                        console.log("리프레시 토큰으로 재발급 시도:", currentRefreshToken);
                        const tokens = await refreshAccessToken(currentRefreshToken);
                        if (updateTokens) updateTokens(tokens.accessToken, tokens.refreshToken);
                        currentAccessToken = tokens.accessToken;
                        currentRefreshToken = tokens.refreshToken;
                        continue; // 새 토큰으로 재시도
                    } catch (refreshError) {
                        console.error("리프레시 토큰 재발급 실패:", refreshError);
                        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                        break;
                    }
                }
                if (options?.tryCookieRefresh && !triedCookieRefresh) {
                    triedCookieRefresh = true;
                    console.log("리프레시 토큰으로 재발급 시도:", currentRefreshToken);
                    try {
                        const tokens = await refreshAccessToken();
                        if (tokens?.accessToken && updateTokens) {
                            updateTokens(tokens.accessToken, tokens.refreshToken);
                            currentAccessToken = tokens.accessToken;
                            currentRefreshToken = tokens.refreshToken;
                            continue;
                        }
                    } catch (cookieRefreshError) {
                        console.error("쿠키 기반 리프레시 재발급 실패:", cookieRefreshError);
                        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                        break;
                    }
                }
                alert("엑세스 토큰 만료: 재발급 실패. 다시 로그인해주세요.");
                break;
            }

            if (!res.ok) throw new Error("본인 인증 실패");

            const { data } = await res.json();
            const { requestUrl, postData } = data;

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
            break;
        } catch (e) {
            console.error("본인 인증 요청 중 예외:", e);
            alert(e.message || "본인 인증 요청 중 오류 발생");
            break;
        }
    }
}
