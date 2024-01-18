// ==UserScript==
// @name        Excerpter
// @namespace   https://github.com/tmyoda/GM-excerpter
// @description Creates a excerption of urls.
// @author      Ayato Tokubi (bitoku@), Tomoya Oda (tmyoda@) 
// @wiki        https://github.com/tmyoda/GM-excerpter/blob/main/README.md
// @downloadURL https://raw.githubusercontent.com/tmyoda/GM-excerpter/main/excerpter.user.js
// @updateURL   https://raw.githubusercontent.com/tmyoda/GM-excerpter/main/excerpter.user.js
// @include     http://*/*
// @include     https://*/*
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @version     0.1.0
// ==/UserScript==

const style = {
    display: 'flex',
    visibility: 'visible',
    border: '1px solid rgba(0,0,0,0.1);',
    'border-radius': '3px',
    'z-index': '999',
    'background-color': '#d4edda',
    position: 'fixed',
    top: '30px',
    left: '30px',
    opacity: '0.9',
    padding: '20px'
}

const notification = (text, timeout = 3000) => {
    const div = document.createElement('div');
    div.textContent = text
    for (const prop of Object.keys(style)) {
        div.style.setProperty(prop, style[prop]);
    }
    document.body.appendChild(div);
    // disappear after a few seconds.
    setTimeout(function () {
        div.style.visibility = "hidden";
        div.remove();
    }, timeout);
}

function makeGetRequest(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                resolve(response);
            },
            onerror: function (error) {
                reject(error);
            }
        });
    });
}

const generateText = (url) => {
    let text =
        `◆ ${document.title}
${url}
`;
    const copiedText = window.getSelection().toString().trim();
    if (copiedText) {
        text +=
            `===
${copiedText}
===
`
    }
    return text;
}

(function () {
    document.addEventListener('keydown', async function (event) {
        if (!event.ctrlKey || event.key !== 't') return;
        event.stopPropagation();

        try {
            const loc = window.location;
            const url = loc.href;
            const text = generateText(url);
            GM_setClipboard(text);
            notification("Copied Successfully");
            console.log("copied to clipboard!");
            console.log(text);
        } catch (e) {
            alert("Excerpter (GM script): Something went wrong. Please see the console log.")
        }
    });
})();
