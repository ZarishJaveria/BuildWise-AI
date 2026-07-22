import VapiModule from "@vapi-ai/web";

const Vapi = VapiModule.default;

const PUBLIC_KEY = "c1e0ce59-1cbe-43e8-b255-50544a2a011f"; 
const ASSISTANT_ID = "af0eb966-f044-499d-95b9-fba26717326a";

const vapi = new Vapi(PUBLIC_KEY);

// DOM Elements
const startBtn = document.getElementById("startCallBtn");
const stopBtn = document.getElementById("stopCallBtn");
const statusText = document.getElementById("statusText");
const workspace = document.querySelector(".workspace");
const messages = document.getElementById("messages");
const emptyState = document.querySelector(".empty-state");

stopBtn.disabled = true;

function setStatus(text) {
    statusText.textContent = text;
}

function addMessage(text, sender) {
    if (!text) return;

    if (emptyState) {
        emptyState.style.display = "none";
    }

    const wrapper = document.createElement("div");
    wrapper.className = `message ${sender}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);

    messages.scrollTop = messages.scrollHeight;
}

startBtn.onclick = async () => {
    try {
        await vapi.start(ASSISTANT_ID);

        startBtn.disabled = true;
        stopBtn.disabled = false;

    } catch (err) {
        console.error(err);
        setStatus("Error");
    }
};

stopBtn.onclick = () => {
    vapi.stop();
};

vapi.on("call-start", () => {
    setStatus("Listening...");
    workspace.classList.add("listening");
});

vapi.on("call-end", () => {
    setStatus("Ready");

    workspace.classList.remove("listening");
    workspace.classList.remove("speaking");

    startBtn.disabled = false;
    stopBtn.disabled = true;
});

vapi.on("speech-start", () => {
    workspace.classList.add("speaking");
});

vapi.on("speech-end", () => {
    workspace.classList.remove("speaking");
});

vapi.on("message", (message) => {

    console.log(message);

    if (message.type === "transcript") {

        addMessage(message.transcript, "user");

    }

    if (message.type === "assistant-response") {

        addMessage(message.response, "ai");

    }

});

vapi.on("error", (e) => {

    console.error(e);

    setStatus("Error");

    workspace.classList.remove("listening");
    workspace.classList.remove("speaking");

    startBtn.disabled = false;
    stopBtn.disabled = true;

});