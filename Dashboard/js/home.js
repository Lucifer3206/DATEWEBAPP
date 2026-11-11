// COMMUNITY JOIN INTERACTION
const joinedCommunities = JSON.parse(
    localStorage.getItem("joinedCommunities") || "[]"
);

document.querySelectorAll(".join-btn").forEach((button) => {
    const communityCard = button.closest(".discover-community-card");
    const communityName = communityCard
        ?.querySelector(".discover-community-info h4")
        ?.textContent.trim();

    if (!communityName) return;

    const alreadyJoined = joinedCommunities.includes(communityName);

    button.textContent = alreadyJoined ? "Joined" : "Join";
    button.classList.toggle("is-joined", alreadyJoined);
    button.setAttribute("aria-pressed", alreadyJoined);

    button.addEventListener("click", () => {
        const isJoined = joinedCommunities.includes(communityName);

        if (isJoined) {
            joinedCommunities.splice(
                joinedCommunities.indexOf(communityName), 1
            );
            button.textContent = "Join";
        } else {
            joinedCommunities.push(communityName);
            button.textContent = "Joined";
        }

        button.classList.toggle("is-joined", !isJoined);
        button.setAttribute("aria-pressed", !isJoined);

        localStorage.setItem(
            "joinedCommunities",
            JSON.stringify(joinedCommunities)
        );
    });
});
// DASHBOARD LIVE SEARCH

const dashboardSearch = document.querySelector(
    'input[placeholder*="Search people"]'
);

if (dashboardSearch) {
    const searchableItems = document.querySelectorAll(`
        .my-community-item,
        .community-card,
        .conversation-card,
        .trending-card,
        .suggested-card,
        .discover-community-card,
        .popular-discussion-card,
        .similar-person-card
    `);

    dashboardSearch.addEventListener("input", () => {
        const searchTerm = dashboardSearch.value
            .trim()
            .toLowerCase();

        searchableItems.forEach((item) => {
            const itemText = item.textContent.toLowerCase();

            item.style.display =
                itemText.includes(searchTerm) ? "" : "none";
        });
    });
}