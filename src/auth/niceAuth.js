export async function handleAuthNice(accessToken) {
    try {
        const res = await fetch("http://localhost:5155/api/auth/pass/request", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        if (!res.ok) throw new Error("본인 인증 실패");

        const {data} = await res.json();
        const {requestUrl, postData} = data;

        console.log("requestUrl:", requestUrl);
        console.log("postData:", postData);

        const form = document.createElement("form");
        form.method = "POST";
        form.action = requestUrl;

        for (const key in postData) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = postData[key];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    } catch (e) {
        console.error(e);
        alert("본인 인증 요청 중 오류 발생");
    }
}