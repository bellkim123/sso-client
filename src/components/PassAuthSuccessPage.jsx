import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

function PassAuthSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (!token) {
            setErrorMsg("인증 토큰이 없습니다.");
            setLoading(false);
            return;
        }

        fetch(`/api/v1/authinfo?token=${encodeURIComponent(token)}`, {
            credentials: "include",
        })
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

    if (loading) return <div>본인인증 정보를 불러오는 중입니다...</div>;

    if (errorMsg) {
        return (
            <div>
                <h2>PASS 본인인증 성공</h2>
                <div style={{color: "red", margin: "1em 0"}}>{errorMsg}</div>
                <button onClick={() => navigate("/")}>메인으로 돌아가기</button>
            </div>
        );
    }

    return (
        <div
            style={{
                maxWidth: 480,
                margin: "2rem auto",
                background: "#ecf6ff",
                borderRadius: "13px",
                boxShadow: "0 2px 16px #b3e6ec77",
                padding: "2.2rem",
            }}>
            <h2 style={{color: "#009944"}}>PASS 본인인증 성공 🎉</h2>
            <div
                style={{
                    textAlign: "left",
                    background: "#f9fbe7",
                    padding: "1em",
                    borderRadius: 6,
                    margin: "1em 0",
                }}>
                <b>본인인증 정보</b>
                <pre
                    style={{
                        fontSize: 14,
                        marginTop: 10,
                        background: "#fffbe7",
                        padding: "8px",
                        borderRadius: 6,
                    }}>
          {JSON.stringify(userInfo, null, 2)}
        </pre>
            </div>
            <button
                style={{
                    marginTop: 20,
                    padding: "0.7em 2em",
                    borderRadius: 9,
                    border: 0,
                    background: "#009944",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 17,
                    cursor: "pointer",
                }}
                onClick={() => navigate("/")}>
                메인으로 이동
            </button>
        </div>
    );
}

export default PassAuthSuccessPage;