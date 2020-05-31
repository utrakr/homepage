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
    const msgElm = document.getElementById('info-message');
    const formElm = document.getElementById('long-url-form');
    if (!msgElm || !formElm) {
        return;
    }

    // paste
    const pasteElm = document.getElementById('long-url-paste');
    const inputElm = document.getElementById('long-url-input');
    if (inputElm && pasteElm) {
        pasteElm.onclick = async function (event) {
            event.preventDefault();
            await fillInClipboard(inputElm, () => submitFormData(msgElm, formElm))
        }
    }

    // form
    formElm.addEventListener( "submit", function ( event ) {
        event.preventDefault();
        submitFormData(msgElm, formElm);
    } );
}

function submitFormData(msgElm, formElm) {
    sendData(formElm, (data) => {
        console.info('data', data);
        msgElm.innerHTML = `<span class="o-message-success">Your new micro url is <a href="${data['micro_url']}">${data['micro_url']}</a></span>`
    }, (error) => {
        console.error('error', error);
    });
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
                onSuccess(data)
            }
        } else {
            onError({'message': 'Bad Response', 'status': status})
        }
    });

    if (onError) {
        XHR.addEventListener("error", function (event) {
            console.error('target', event.target);
            onError({'message': 'No Response'});
        });
    }

    // create and send data
    const data = {};
    const FD = new FormData(form);
    for (const [k,v] of FD) {
        data[k] = v;
    }
    XHR.open(formMethod, formAction);
    XHR.setRequestHeader( 'Content-Type', 'application/json' );
    XHR.send(JSON.stringify(data));
}

window.addEventListener( "load", function () {
    setup();
});