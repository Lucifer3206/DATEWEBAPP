// ==========================================
// PROFILE DISCOVERY
// ==========================================

let currentProfileIndex = 0;

let filteredProfiles = [...profileData];
let preferenceFilteredProfiles = [...profileData];

let searchQuery = "";


// ==========================================
// DISPLAY PROFILE
// ==========================================

function displayProfile(index, skipAnimation = false) {

    const profile = filteredProfiles[index];
    const discovery = document.querySelector(".profile-discovery");

    // Profile transition
    if (
        !skipAnimation &&
        discovery.querySelector(".profile-gallery")
    ) {
        discovery.classList.add("profile-transition-out");

        setTimeout(() => {
            discovery.classList.remove("profile-transition-out");
            displayProfile(index, true);
        }, 200);

        return;
    }

    // No profile available
    if (!profile) {

        discovery.innerHTML = `
            <div class="empty-state">
                <h2>No profiles found</h2>
                <p>Try changing your search or preferences.</p>
            </div>
        `;

        document.querySelector(".profile-actions").style.display = "none";

        return;
    }

    const photos = profile.photos || [];
    const interests = profile.interests || [];
    const communities = profile.communities || [];

    let currentPhotoIndex = 0;

    // Optional information
    const extraDetails = [];

    if (profile.education) {
        extraDetails.push(`
            <div class="extra-detail">
                <span>Education</span>
                <strong>${profile.education}</strong>
            </div>
        `);
    }

    if (profile.occupation) {
        extraDetails.push(`
            <div class="extra-detail">
                <span>Occupation</span>
                <strong>${profile.occupation}</strong>
            </div>
        `);
    }

    if (profile.languages && profile.languages.length) {
        extraDetails.push(`
            <div class="extra-detail">
                <span>Languages</span>
                <strong>${profile.languages.join(", ")}</strong>
            </div>
        `);
    }

    // Optional conversation prompt
    const conversationPrompt = profile.promptQuestion && profile.promptAnswer
        ? `
            <div class="profile-prompt">
                <div class="prompt-heading">
                    <span class="prompt-icon">✦</span>
                    <h3>Get to Know Me</h3>
                </div>

                <p class="prompt-question">${profile.promptQuestion}</p>
                <p class="prompt-answer">${profile.promptAnswer}</p>
            </div>
        `
        : "";


    // ======================================
    // PROFILE HTML
    // ======================================

    discovery.innerHTML = `

        <!-- PROFILE PHOTO -->

        <div class="profile-gallery">

            ${
                photos.length
                ? `
                    <div class="gallery-blur-background"></div>

                    <div class="gallery-main-photo">

                        <img
                            class="main-profile-photo"
                            src="${photos[0]}"
                            alt="${profile.name}'s profile photo"
                        >

                        <div class="gallery-counter">
                            <span class="gallery-current">1</span>
                            /
                            <span class="gallery-total">${photos.length}</span>
                        </div>

                        <button class="gallery-arrow gallery-prev"
                            type="button"
                            aria-label="Previous photo">
                            &#10094;
                        </button>

                        <button class="gallery-arrow gallery-next"
                            type="button"
                            aria-label="Next photo">
                            &#10095;
                        </button>

                        <div class="gallery-indicators">
                            ${photos.map((photo, i) => `
                                <span class="${i === 0 ? "active" : ""}"></span>
                            `).join("")}
                        </div>

                    </div>
                `
                : `
                    <div class="no-profile-photo">
                        <span>Photo not available</span>
                    </div>
                `
            }

        </div>


        <!-- PROFILE INFORMATION -->

        <div class="profile-details-section">

            <!-- BASIC INFORMATION -->

            <div class="profile-basic-info">

                <h2>
                    ${profile.name}, ${profile.age}
                    ${profile.verified ? '<span class="verified-badge">✓</span>' : ''}
                </h2>

                <p class="profile-location">
                    <span>⌖</span>
                    ${profile.city}
                </p>

            </div>


            <!-- ABOUT ME -->

            ${
                profile.about
                ? `
                    <div class="profile-detail-group">

                        <h3>About Me</h3>

                        <p>${profile.about}</p>

                    </div>
                `
                : ""
            }


            <!-- INTERESTS -->

            ${
                interests.length
                ? `
                    <div class="profile-detail-group">

                        <h3>Interests & Hobbies</h3>

                        <div class="profile-tags">

                            ${interests.map(item => `
                                <span>${item}</span>
                            `).join("")}

                        </div>

                    </div>
                `
                : ""
            }


            <!-- LOOKING FOR -->

            ${
                profile.lookingFor
                ? `
                    <div class="profile-detail-group">

                        <h3>♡ &nbsp; Looking For</h3>

                        <p>${profile.lookingFor}</p>

                    </div>
                `
                : ""
            }


            <!-- COMMUNITIES -->

            ${
                communities.length
                ? `
                    <div class="profile-detail-group">

                        <h3>Communities</h3>

                        <div class="profile-tags">

                            ${communities.map(item => `
                                <span>${item}</span>
                            `).join("")}

                        </div>

                    </div>
                `
                : ""
            }


            <!-- OPTIONAL EXTRA DETAILS -->

            ${
                extraDetails.length
                ? `
                    <div class="profile-detail-group">

                        <h3>A Little More About Me</h3>

                        <div class="profile-extra-details">

                            ${extraDetails.join("")}

                        </div>

                    </div>
                `
                : ""
            }

        </div>


        <!-- CONVERSATION PROMPT -->

        ${conversationPrompt}

    `;


    // ======================================
    // PROFILE TRANSITION IN
    // ======================================

    discovery.classList.add("profile-transition-in");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            discovery.classList.remove("profile-transition-in");
        });
    });


    // ======================================
    // PHOTO GALLERY FUNCTIONALITY
    // ======================================

    if (!photos.length) return;

    const gallery = discovery.querySelector(".profile-gallery");

    const mainImage = discovery.querySelector(".main-profile-photo");

    const blurBackground = discovery.querySelector(".gallery-blur-background");

    const previousButton = discovery.querySelector(".gallery-prev");
    const nextButton = discovery.querySelector(".gallery-next");

    const currentCounter = discovery.querySelector(".gallery-current");

    const indicators = discovery.querySelectorAll(".gallery-indicators span");


    function updatePhoto() {

        const photo = photos[currentPhotoIndex];

        mainImage.src = photo;

        blurBackground.style.backgroundImage = `url("${photo}")`;

        currentCounter.textContent = currentPhotoIndex + 1;

        indicators.forEach((indicator, index) => {

            indicator.classList.toggle(
                "active",
                index === currentPhotoIndex
            );

        });

        gallery.classList.remove("is-portrait", "is-landscape");
    }


    mainImage.addEventListener("load", () => {

        const isPortrait =
            mainImage.naturalHeight > mainImage.naturalWidth;

        gallery.classList.toggle("is-portrait", isPortrait);

        gallery.classList.toggle("is-landscape", !isPortrait);

    });


    previousButton.addEventListener("click", () => {

        if (photos.length <= 1) return;

        currentPhotoIndex =
            (currentPhotoIndex - 1 + photos.length) % photos.length;

        updatePhoto();

    });


    nextButton.addEventListener("click", () => {

        if (photos.length <= 1) return;

        currentPhotoIndex =
            (currentPhotoIndex + 1) % photos.length;

        updatePhoto();

    });


    if (photos.length <= 1) {

        previousButton.style.display = "none";
        nextButton.style.display = "none";

    }

    updatePhoto();

}


// ==========================================
// APPLY SEARCH AND PREFERENCES
// ==========================================

function applyExploreFilters() {

    filteredProfiles = preferenceFilteredProfiles.filter(profile => {

        const matchesSearch =
            !searchQuery ||
            profile.name.toLowerCase().includes(searchQuery) ||
            profile.city.toLowerCase().includes(searchQuery) ||
            (profile.interests || []).some(interest =>
                interest.toLowerCase().includes(searchQuery)
            );

        return matchesSearch;

    });

    currentProfileIndex = 0;

    document.querySelector(".profile-actions").style.display = "flex";

    displayProfile(currentProfileIndex);

}


// ==========================================
// SKIP PROFILE
// ==========================================

document.querySelector(".skip-btn").addEventListener("click", () => {

    currentProfileIndex++;

    displayProfile(currentProfileIndex);

});


// ==========================================
// SUCCESS BUTTON ANIMATION
// ==========================================

function showButtonSuccess(button) {

    button.classList.remove("success-feedback");

    void button.offsetWidth;

    button.classList.add("success-feedback");

    setTimeout(() => {

        button.classList.remove("success-feedback");

    }, 500);

}


// ==========================================
// MOVE TO NEXT PROFILE
// ==========================================

function moveToNextProfile() {

    currentProfileIndex++;

    displayProfile(currentProfileIndex);

}


// ==========================================
// TOAST NOTIFICATION
// ==========================================

function showExploreToast(message) {

    const oldToast = document.querySelector(".explore-toast");

    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");

    toast.className = "explore-toast";

    toast.textContent = message;

    toast.setAttribute("role", "status");

    document.body.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add("show");

    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => toast.remove(), 300);

    }, 2500);

}


// ==========================================
// INTERESTED BUTTON
// ==========================================

document.querySelector(".interested-btn").addEventListener("click", () => {

    const profile = filteredProfiles[currentProfileIndex];

    if (!profile) return;

    let interestedProfiles = JSON.parse(
        localStorage.getItem("interestedProfiles") || "[]"
    );

    if (interestedProfiles.some(item => item.id === profile.id)) {

        showExploreToast(`You've already expressed interest in ${profile.name}.`);

        return;

    }

    interestedProfiles.push(profile);

    localStorage.setItem(
        "interestedProfiles",
        JSON.stringify(interestedProfiles)
    );

    showButtonSuccess(document.querySelector(".interested-btn"));

    showExploreToast(`Interest sent to ${profile.name}!`);

    setTimeout(moveToNextProfile, 500);

});


// ==========================================
// CONNECT BUTTON
// ==========================================

document.querySelector(".connect-btn").addEventListener("click", () => {

    const profile = filteredProfiles[currentProfileIndex];

    if (!profile) return;

    let sentRequests = JSON.parse(
        localStorage.getItem("sentConnectionRequests") || "[]"
    );

    if (sentRequests.some(item => item.id === profile.id)) {

        showExploreToast(`You've already sent a request to ${profile.name}.`);

        return;

    }

    sentRequests.push(profile);

    localStorage.setItem(
        "sentConnectionRequests",
        JSON.stringify(sentRequests)
    );

    showButtonSuccess(document.querySelector(".connect-btn"));

    showExploreToast(`Connection request sent to ${profile.name}!`);

    setTimeout(moveToNextProfile, 500);

});


// ==========================================
// INITIAL PROFILE
// ==========================================

displayProfile(currentProfileIndex);


// ==========================================
// PREFERENCES PANEL
// ==========================================

const preferencesBtn = document.querySelector(".explore-filter-btn");

const preferencesOverlay = document.getElementById("preferencesOverlay");

const closePreferencesBtn = document.getElementById("closePreferences");


preferencesBtn.addEventListener("click", () => {

    preferencesOverlay.hidden = false;

});


closePreferencesBtn.addEventListener("click", () => {

    preferencesOverlay.hidden = true;

});


preferencesOverlay.addEventListener("click", (event) => {

    if (event.target === preferencesOverlay) {

        preferencesOverlay.hidden = true;

    }

});


document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && !preferencesOverlay.hidden) {

        preferencesOverlay.hidden = true;

    }

});


// ==========================================
// APPLY PREFERENCES
// ==========================================

document.getElementById("preferencesForm").addEventListener("submit", (event) => {

    event.preventDefault();

    const minAge = Number(document.getElementById("minAge").value) || 18;

    const maxAge = Number(document.getElementById("maxAge").value) || Infinity;

    const city = document.getElementById("filterCity").value.trim().toLowerCase();

    const gender = document.getElementById("filterGender").value;

    const goal = document.getElementById("filterGoal").value.toLowerCase();

    const interests = document.getElementById("filterInterests").value
        .split(",")
        .map(item => item.trim().toLowerCase())
        .filter(item => item !== "");


    if (minAge < 18 || maxAge < minAge) {

        showExploreToast("Please enter a valid age range.");

        return;

    }


    if (gender) {

        showExploreToast("Gender filtering is unavailable until profile gender data is added.");

        return;

    }


    preferenceFilteredProfiles = profileData.filter(profile => {

        const matchesAge =
            profile.age >= minAge && profile.age <= maxAge;

        const matchesCity =
            !city || profile.city.toLowerCase().includes(city);

        const matchesGoal =
            !goal || (profile.datingGoals || "").toLowerCase().includes(goal);

        const matchesInterests =
            interests.length === 0 ||
            interests.some(interest =>
                (profile.interests || []).some(profileInterest =>
                    profileInterest.toLowerCase().includes(interest)
                )
            );

        return matchesAge && matchesCity && matchesGoal && matchesInterests;

    });


    applyExploreFilters();

    preferencesOverlay.hidden = true;

    showExploreToast(`${filteredProfiles.length} profile(s) found.`);

});


// ==========================================
// RESET PREFERENCES
// ==========================================

document.getElementById("resetPreferences").addEventListener("click", () => {

    document.getElementById("preferencesForm").reset();

    preferenceFilteredProfiles = [...profileData];

    applyExploreFilters();

    preferencesOverlay.hidden = true;

    showExploreToast("Preferences reset.");

});


// ==========================================
// SEARCH PROFILES
// ==========================================

const exploreSearchInput = document.getElementById("exploreSearchInput");

exploreSearchInput.addEventListener("input", () => {

    searchQuery = exploreSearchInput.value.trim().toLowerCase();

    applyExploreFilters();

});