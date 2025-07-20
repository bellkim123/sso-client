export async function refreshAccessToken(refreshToken) {
    const res = await fetch("http://localhost:5155/api/auth/token/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
    });
    if (!res.ok) throw new Error("엑세스 토큰 재발급 실패");
    const json = await res.json();
    if (json?.data?.accessToken && json?.data?.refreshToken) {
        return {
            accessToken: json.data.accessToken,
            refreshToken: json.data.refreshToken
        };
    }
    throw new Error("엑세스 토큰 재발급 실패");
}