import { useNavigate, useSearchParams } from "react-router-dom";
import usePassVerificationInfo from "../auth/usePassVerificationInfo";

function InfoRow({ label, value }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", marginBottom: 15
        }}>
      <span style={{
          color: "#347ae2",
          fontWeight: 600,
          minWidth: 85,
          letterSpacing: "-0.5px"
      }}>{label}</span>
            <span style={{
                color: "#21242a",
                fontWeight: 400,
                fontSize: 16
            }}>
        {value ?? <span style={{color: "#bdbdbd"}}>없음</span>}
      </span>
        </div>
    );
}

function PassAuthSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("pass_token");
    const { userInfo, loading, errorMsg } = usePassVerificationInfo(token);

    if (loading) {
        return (
            <div style={{
                margin: "88px auto",
                color: "#347ae2",
                fontSize: 18,
                textAlign: "center"
            }}>
                본인인증 정보를 불러오는 중입니다...
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div style={containerStyle}>
                <h2 style={titleStyle}>
                    <span role="img" aria-label="fail">❗</span> PASS 본인인증 실패
                </h2>
                <div style={errorMsgStyle}>{errorMsg}</div>
                <button style={buttonStyle} onClick={() => navigate("/")}>
                    메인으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>
                <span role="img" aria-label="success">🎉</span> 본인인증 성공
            </h2>
            <div style={cardStyle}>
                <InfoRow label="이름" value={userInfo?.name} />
                <InfoRow label="휴대폰번호" value={userInfo?.phone} />
                <InfoRow label="생년월일" value={userInfo?.birth} />
                <InfoRow label="성별" value={userInfo?.gender} />
            </div>
            <button style={buttonStyle} onClick={() => navigate("/")}>
                메인으로 이동
            </button>
        </div>
    );
}

const containerStyle = {
    maxWidth: 400,
    margin: "56px auto",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 32px #74B9FF22",
    padding: "2.4rem 1.6rem 2.2rem 1.6rem",
    textAlign: "center",
    border: "1px solid #e5ebf8"
};

const cardStyle = {
    margin: "1.3em 0 1.6em 0",
    background: "linear-gradient(90deg, #f7fbff 80%, #ecf6ff 100%)",
    borderRadius: 12,
    padding: "1.1em 1.65em",
    textAlign: "left",
    boxShadow: "0 1px 8px #dbedfd1a",
};

const buttonStyle = {
    marginTop: 13,
    padding: "0.7em 2.4em",
    borderRadius: 8,
    border: 0,
    background: "linear-gradient(90deg, #347ae2 0%, #71afff 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 17,
    cursor: "pointer",
    letterSpacing: "1px",
    boxShadow: "0 2px 12px #c1def844",
};
const titleStyle = {
    color: "#347ae2",
    marginBottom: 8,
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: "-0.5px"
};
const errorMsgStyle = {
    color: "#d13c3c",
    margin: "1.5em 0"
};

export default PassAuthSuccessPage;