import { BASE_URL, SERVICE_TYPE } from "../config/apiConfig";

/** 비밀번호 재설정 링크 이메일 발송 */
export async function sendResetLink(email) {
    const res = await fetch(`${BASE_URL}/send-reset-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, serviceType: SERVICE_TYPE }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
        throw new Error(data?.message || "재설정 링크 발송 실패");
    }
    return data;
}

/** 비밀번호 재설정 제출 */
export async function resetPassword(token, newPassword) {
    const res = await fetch(`${BASE_URL}/reset-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
        throw new Error(data?.message || "비밀번호 재설정 실패");
    }
    return data;
}
