import {useNavigate} from "react-router-dom";

function PassAuthFailPage() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                maxWidth: 400,
                margin: "4rem auto",
                background: "#fffbe7",
                borderRadius: "13px",
                boxShadow: "0 2px 14px #ffd6e077",
                padding: "2rem",
            }}>
            <h2 style={{color: "#c22"}}>PASS 본인인증 실패 😵‍💫</h2>
            <div style={{color: "#888", margin: "1.5em 0"}}>
                본인확인이 정상적으로 완료되지 않았어요.<br/>
                다시 시도하시려면 아래 버튼을 눌러주세요.
            </div>
            <button
                style={{
                    marginTop: 10,
                    padding: "0.6em 1.8em",
                    borderRadius: 9,
                    border: 0,
                    background: "#fdcb6e",
                    color: "#333",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                }}
                onClick={() => navigate("/")}>
                메인으로 이동
            </button>
        </div>
    );
}

export default PassAuthFailPage;