import { BASE_URL, SERVICE_TYPE } from "../config/apiConfig";

/** 이메일 인증번호 발송 */
export async function sendVerificationCode(email) {
    const res = await fetch(`${BASE_URL}/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceType: SERVICE_TYPE, email }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "인증번호 발송 실패");
    return result;
}

/** 인증번호 검증 */
export async function verifyCode(email, code) {
    const res = await fetch(`${BASE_URL}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceType: SERVICE_TYPE, email, code }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "인증번호 확인 실패");
    return result;
}

/** 회원가입 */
export async function registerWithEmail(email, password, verificationCode) {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            serviceType: SERVICE_TYPE,
            verificationCode,
            email,
            password,
        }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "회원가입 실패");
    return result;
}
