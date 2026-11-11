// LOAD JOINED COMMUNITIES

const joinedCommunities = JSON.parse(
    localStorage.getItem("joinedCommunities") || "[]"
);
// LOAD SAVED COMMUNITY MESSAGES
const communityMessages = JSON.parse(
    localStorage.getItem("communityMessages") || "{}"
);
const communityList = document.getElementById("joined-community-list");
const communityCount = document.getElementById("community-count");

// UPDATE COMMUNITY COUNT IF ELEMENT EXISTS
if (communityCount) {
    communityCount.textContent = joinedCommunities.length;
}

// DISPLAY JOINED COMMUNITIES
if (communityList && joinedCommunities.length > 0) {

    communityList.innerHTML = "";

    joinedCommunities.forEach((community) => {

    const card = document.createElement("div");
    card.className = "joined-community-card";

    // COMMUNITY AVATAR
    const avatar = document.createElement("div");
    avatar.className = "community-avatar";
    avatar.textContent = community.charAt(0).toUpperCase();

    // COMMUNITY DETAILS
    const details = document.createElement("div");
    details.className = "community-details";

    const title = document.createElement("h3");
    title.textContent = community;

    const description = document.createElement("p");
    description.textContent = "You're a member of this community.";

    details.appendChild(title);
    details.appendChild(description);

    // COMMUNITY STATUS
    const status = document.createElement("span");
    status.className = "community-status";
    status.textContent = "Community";

    // OPEN CHAT BUTTON
    const openButton = document.createElement("button");
    openButton.className = "open-community-btn";
    openButton.textContent = "Open Chat";

    card.appendChild(avatar);
    card.appendChild(details);
    card.appendChild(status);
    card.appendChild(openButton);

    communityList.appendChild(card);
    // OPEN SELECTED COMMUNITY
openButton.addEventListener("click", () => {
    // HIGHLIGHT SELECTED COMMUNITY
document.querySelectorAll(".joined-community-card").forEach((item) => {
    item.classList.remove("is-selected");
});

card.classList.add("is-selected");
// OPEN FULL-SCREEN CHAT ON MOBILE
const connectWorkspace = document.querySelector(".connect-workspace");

if (connectWorkspace && window.matchMedia("(max-width: 760px)").matches) {
    if (!connectWorkspace.classList.contains("mobile-chat-open")) {
        window.history.pushState(
            { mobileChatOpen: true },
            ""
        );
    }

    connectWorkspace.classList.add("mobile-chat-open");
}

    const chatPanel = document.querySelector(".chat-panel");

    if (!chatPanel) return;

   chatPanel.querySelectorAll(":scope > :not(#mobile-chat-back)").forEach((element) => {
    element.remove();
});

    const header = document.createElement("div");
    header.className = "community-chat-header";

    const title = document.createElement("h2");
    title.textContent = community;

    const subtitle = document.createElement("p");
    subtitle.textContent = "Community conversation";

    header.appendChild(title);
    header.appendChild(subtitle);

    const body = document.createElement("div");
    body.className = "community-chat-body";
    // LOAD PREVIOUS MESSAGES
const savedMessages = communityMessages[community] || [];

if (savedMessages.length > 0) {
    savedMessages.forEach((text) => {
        const messageBubble = document.createElement("div");
        messageBubble.className = "sent-message";
        messageBubble.textContent = text;
        body.appendChild(messageBubble);
    });
} else {
    const message = document.createElement("p");
    message.className = "empty-chat-message";
    message.textContent = "No messages yet. Start the conversation!";
    body.appendChild(message);
}


    chatPanel.appendChild(header);
    chatPanel.appendChild(body);
    // MESSAGE COMPOSER
const composer = document.createElement("div");
composer.className = "community-chat-composer";

const input = document.createElement("input");
input.type = "text";
input.placeholder = "Write a message...";
input.id = "community-message-input";

const sendButton = document.createElement("button");
sendButton.textContent = "Send";
sendButton.type = "button";

composer.appendChild(input);
composer.appendChild(sendButton);

chatPanel.appendChild(composer);
// SEND MESSAGE
function sendMessage() {

    const messageText = input.value.trim();

    if (messageText === "") return;

    const messageBubble = document.createElement("div");
    const emptyMessage = body.querySelector(".empty-chat-message");

if (emptyMessage) {
    emptyMessage.remove();
}
    messageBubble.className = "sent-message";
    messageBubble.textContent = messageText;

    body.appendChild(messageBubble);
    // SAVE MESSAGE FOR THIS COMMUNITY
if (!communityMessages[community]) {
    communityMessages[community] = [];
}

communityMessages[community].push(messageText);

localStorage.setItem(
    "communityMessages",
    JSON.stringify(communityMessages)
);

    input.value = "";

    body.scrollTop = body.scrollHeight;
}

// SEND BUTTON CLICK
sendButton.addEventListener("click", sendMessage);

// SEND MESSAGE WITH ENTER
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
});
});
}
// CONNECT SECTION NAVIGATION

const connectNavItems = document.querySelectorAll(".connect-nav-item");
const connectSections = document.querySelectorAll(".connect-content-section");

connectNavItems.forEach((item) => {
    item.addEventListener("click", () => {

        const selectedSection = item.dataset.section;

        // Update active sidebar item
        connectNavItems.forEach((navItem) => {
            navItem.classList.remove("active");
        });

        item.classList.add("active");

        // Show selected section
        connectSections.forEach((section) => {
            section.classList.remove("active");
        });

        const targetSection = document.getElementById(
            `${selectedSection}-section`
        );

        if (targetSection) {
            targetSection.classList.add("active");
        }
    });
});
// MOBILE CHAT BACK BUTTON
const mobileChatBack = document.getElementById("mobile-chat-back");

if (mobileChatBack) {
    mobileChatBack.addEventListener("click", () => {
        const connectWorkspace = document.querySelector(".connect-workspace");

        if (connectWorkspace) {
            connectWorkspace.classList.remove("mobile-chat-open");
        }
    });
}
// HANDLE MOBILE BROWSER BACK NAVIGATION
window.addEventListener("popstate", () => {
    const connectWorkspace = document.querySelector(".connect-workspace");

    if (connectWorkspace) {
        connectWorkspace.classList.remove("mobile-chat-open");
    }
});