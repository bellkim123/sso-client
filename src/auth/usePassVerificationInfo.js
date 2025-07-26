import { useEffect, useState } from "react";
import { BASE_URL } from "../config/apiConfig";

function usePassVerificationInfo(token) {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (!token) {
            setErrorMsg("인증 토큰이 없습니다.");
            setLoading(false);
            return;
        }

        fetch(`${BASE_URL}/auth/pass/info?token=${encodeURIComponent(token)}`)
            .then(res => {
                if (!res.ok) throw new Error("본인인증 정보를 불러올 수 없습니다.");
                return res.json();
            })
            .then(data => {
                setUserInfo(data.result || data);
                setLoading(false);
            })
            .catch(e => {
                setErrorMsg(e.message);
                setLoading(false);
            });
    }, [token]);

    return { userInfo, loading, errorMsg };
}

export default usePassVerificationInfo;
