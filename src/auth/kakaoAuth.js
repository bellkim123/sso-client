import { BASE_URL, SERVICE_TYPE } from "../config/apiConfig";

/** 카카오 로그인 URL 호출 후 리다이렉트 */
export async function handleKakaoLogin() {
    try {
        const res = await fetch(`${BASE_URL}/auth/kakao/url?serviceType=${SERVICE_TYPE}`);
        if (!res.ok) throw new Error('카카오 로그인 URL 요청 실패');
        const result = await res.json();
        if (result.success && result.data) {
            window.location.href = result.data;
        } else {
            alert('카카오 로그인 URL을 받아오지 못했습니다.');
        }
    } catch (e) {
        alert('카카오 로그인 요청 중 오류 발생');
        console.error(e);
    }
}