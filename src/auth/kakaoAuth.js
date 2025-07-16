export async function handleKakaoLogin() {
    const serviceType = 3;
    try {
        const res = await fetch(`http://localhost:5155/api/auth/kakao/login?serviceType=${serviceType}`);
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
