import { refreshAccessToken } from "./refreshAccessToken";
import { BASE_URL } from "../config/apiConfig";
export async function handleAuthNice(accessToken, refreshToken, updateTokens, options = {}) {
    let currentAccessToken = accessToken;
    let currentRefreshToken = refreshToken;
    let triedRefresh = false;
    let triedCookieRefresh = false;

    while (true) {
        try {
            const res = await fetch(`${BASE_URL}/auth/pass/request`, {
                method: "POST",
                headers: currentAccessToken
                    ? { "Authorization": `Bearer ${currentAccessToken}` }
                    : undefined,
                credentials: options?.withCredentials ? "include" : undefined
            });

            if (res.status === 401 && !triedRefresh) { // 만료시 리프레시 시도
                triedRefresh = true;
                if (currentRefreshToken) {
                    try {
                        const tokens = await refreshAccessToken(currentRefreshToken);
                        if (updateTokens) updateTokens(tokens.accessToken, tokens.refreshToken);
                        currentAccessToken = tokens.accessToken;
                        currentRefreshToken = tokens.refreshToken;
                        continue;
                    } catch (refreshError) {
                        console.log(refreshError)
                        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                        break;
                    }
                }

                if (options?.tryCookieRefresh && !triedCookieRefresh) {
                    triedCookieRefresh = true;
                    try {
                        const tokens = await refreshAccessToken();
                        if (tokens?.accessToken && updateTokens) {
                            updateTokens(tokens.accessToken, tokens.refreshToken);
                            currentAccessToken = tokens.accessToken;
                            currentRefreshToken = tokens.refreshToken;
                            continue;
                        }
                    } catch {
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
            alert(e.message || "본인 인증 요청 중 오류 발생");
            break;
        }
    }
}
