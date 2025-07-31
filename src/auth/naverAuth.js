import {BASE_URL, SERVICE_TYPE} from "../config/apiConfig";

// 팝업 방식 네이버 로그인
export async function openNaverLoginPopup() {
    try {
        const res = await fetch(`${BASE_URL}/auth/naver/url?serviceType=${SERVICE_TYPE}`);
        if (!res.ok) throw new Error('네이버 로그인 URL 요청 실패');
        const result = await res.json();
        if (result.success && result.data) {
            const width = 500, height = 600;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;
            window.open(
                result.data,
                "naverLoginPopup",
                `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
            );
        } else {
            alert('네이버 로그인 URL을 받아오지 못했습니다.');
        }
    } catch (e) {
        alert('네이버 로그인 요청 중 오류 발생');
        console.error(e);
    }
}