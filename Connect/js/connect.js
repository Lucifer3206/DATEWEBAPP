// LOAD JOINED COMMUNITIES

const joinedCommunities = JSON.parse(
    localStorage.getItem("joinedCommunities") || "[]"
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

        const details = document.createElement("div");
        details.className = "community-details";

        const title = document.createElement("h3");
        title.textContent = community;

        const description = document.createElement("p");
        description.textContent = "You're a member of this community.";

        const openButton = document.createElement("button");
        openButton.className = "open-community-btn";
        openButton.textContent = "Open Chat";

        details.appendChild(title);
        details.appendChild(description);

        card.appendChild(details);
        card.appendChild(openButton);

        communityList.appendChild(card);

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