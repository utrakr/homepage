async function fillInClipboard(inputElm, callback) {
    const text = await navigator.clipboard.readText();
    if (text && text.startsWith("http")) {
        inputElm.value = await navigator.clipboard.readText();
        if (callback) {
            callback();
        }
    }
}

function setup() {
    const msgElm = document.getElementById("info-message");
    const formElm = document.getElementById("long-url-form");
    if (!msgElm || !formElm) {
        return;
    }

    // paste
    const pasteElm = document.getElementById("long-url-paste");
    const inputElm = document.getElementById("long-url-input");
    if (inputElm && pasteElm) {
        pasteElm.onclick = async function (event) {
            event.preventDefault();
            await fillInClipboard(inputElm, () => submitFormData(msgElm, formElm));
        };
    }

    // form
    formElm.addEventListener("submit", function (event) {
        event.preventDefault();
        submitFormData(msgElm, formElm);
    });
}

function submitFormData(msgElm, formElm) {
    sendData(
        formElm,
        (data) => {
            console.info("data", data);
            const murl = data["data"]["micro_url"];

            const i = document.createElement("i");
            i.className = "material-icons copy";
            i.innerText = "content_paste";
            i.addEventListener("click", async () => {
                console.info("add to clipboard", murl);
                await navigator.clipboard.writeText(murl);
                i.innerText = "check";
            });
            const span = document.createElement("span");
            span.className = "o-message-success";
            span.innerHTML = `Your new micro url is <a href="${murl}">${murl}</a> `;
            span.append(i);

            msgElm.innerHTML = "";
            msgElm.append(span);
        },
        (error) => {
            console.error("error", error);
            msgElm.innerHTML = `<span class="o-message-error">Unable to create micro url</span>`;
        }
    );
}

function sendData(form, onSuccess, onError) {
    const formAction = form.action;
    const formMethod = form.method;

    const XHR = new XMLHttpRequest();

    XHR.addEventListener("load", function (event) {
        const tgt = event.target;
        const status = tgt.status;
        if (status === 200) {
            if (onSuccess) {
                const responseText = tgt.responseText;
                const data = JSON.parse(responseText);
                onSuccess(data);
            }
        } else {
            onError({ message: "Bad Response", status: status });
        }
    });

    if (onError) {
        XHR.addEventListener("error", function (event) {
            console.error("target", event.target);
            onError({ message: "No Response" });
        });
    }

    // create and send data
    const data = {};
    const FD = new FormData(form);
    for (const [k, v] of FD) {
        data[k] = v;
    }
    XHR.open(formMethod, formAction);
    XHR.setRequestHeader("Content-Type", "application/json");
    XHR.send(JSON.stringify(data));
}

window.addEventListener("load", function () {
    setup();
});

window['onSignIn'] = function(user) {
    const name = user.getBasicProfile().getName();
    const idToken = user.getAuthResponse().id_token;
    const sigElm = document.getElementById("signin-message");
    if (sigElm) {
        sigElm.innerHTML = `<input type="hidden" name="id_token" value="${idToken}"><span>Signed in as ${name}</span>`
    } else {
        console.error("unable to find sig elm");
    }
}
