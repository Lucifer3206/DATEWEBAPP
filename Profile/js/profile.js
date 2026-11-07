const form = document.getElementById("profileForm");

const steps = document.querySelectorAll(".form-step");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");

const stepLabel = document.getElementById("stepLabel");
const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");

let currentStep = 0;

const totalSteps = steps.length;


// Show current step
function showStep(index) {
    

    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });

    currentStep = index;

    // Update progress
    const progress = Math.round(((index + 1) / totalSteps) * 100);

    stepLabel.textContent = `Step ${index + 1} of ${totalSteps}`;
    progressPercent.textContent = `${progress}%`;
    progressBar.style.width = `${progress}%`;

    // Back button
    prevBtn.disabled = index === 0;

    // Next and Submit buttons
    nextBtn.hidden = index === totalSteps - 1;
    submitBtn.hidden = index !== totalSteps - 1;

    // Update review on final step
    if (index === totalSteps - 1) {
        createProfileReview();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    // Update the seven-step progress indicators
const indicators = document.querySelectorAll(".step-indicator");

indicators.forEach((indicator, indicatorIndex) => {
    indicator.classList.toggle("active", indicatorIndex === index);
    indicator.classList.toggle("completed", indicatorIndex < index);
});
}


// Validate current step
function validateStep() {

    const currentSection = steps[currentStep];

    const requiredFields = currentSection.querySelectorAll("[required]");

    for (const field of requiredFields) {

        if (!field.value.trim()) {
            alert("Please fill in all required fields.");
            field.focus();
            return false;
        }

        if (!field.checkValidity()) {
            alert(field.validationMessage);
            field.focus();
            return false;
        }
    }

    // Age verification: user must be 18+
    if (currentStep === 0) {

        const dob = document.getElementById("dob").value;

        if (dob) {

            const birthDate = new Date(dob);
            const today = new Date();

            let age = today.getFullYear() - birthDate.getFullYear();

            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (
                monthDifference < 0 ||
                (monthDifference === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            if (age < 18) {
                alert("You must be at least 18 years old to use this platform.");
                return false;
            }
        }
    }

    // At least one dating interest
    if (currentStep === 1) {

        const selected = currentSection.querySelectorAll(
            'input[name="interestedIn"]:checked'
        );

        if (selected.length === 0) {
            alert("Please select at least one option.");
            return false;
        }
    }

    // At least one dating preference
    if (currentStep === 2) {

        const selected = currentSection.querySelectorAll(
            'input[name="lookingFor"]:checked'
        );

        if (selected.length === 0) {
            alert("Please select what you are looking for.");
            return false;
        }

        const minAge = Number(document.getElementById("minAge").value);
        const maxAge = Number(document.getElementById("maxAge").value);

        if (minAge < 18 || maxAge > 99 || minAge > maxAge) {
            alert("Please enter a valid preferred age range.");
            return false;
        }
    }

    return true;
}


// Next button
nextBtn.addEventListener("click", () => {

    if (!validateStep()) {
        return;
    }

    if (currentStep < totalSteps - 1) {
        showStep(currentStep + 1);
    }

});


// Back button
prevBtn.addEventListener("click", () => {

    if (currentStep > 0) {
        showStep(currentStep - 1);
    }

});


// Create profile review
function createProfileReview() {
    const review = document.getElementById("profileReview");

    if (!review) return;

    const formData = new FormData(form);

    const getValue = name =>
        formData.get(name) || "Not provided";

    const getAllValues = name =>
        formData.getAll(name).join(", ") || "Not selected";

    const mainPhoto = form.elements.namedItem("profilePhoto").files[0];
    const additionalPhotos = form.elements.namedItem("additionalPhotos").files;

    const reviewItems = [
        ["Full Name", getValue("fullName")],
        ["Date of Birth", getValue("dob")],
        ["Gender", getValue("gender")],
        ["City", getValue("city")],
        ["Interested In", getAllValues("interestedIn")],
        ["Looking For", getAllValues("lookingFor")],
        ["Preferred Age", `${getValue("minAge")} – ${getValue("maxAge")}`],
        ["Location Preference", getValue("locationPreference")],
        ["Interests", getAllValues("interests")],
        ["Other Interests", getValue("otherInterests")],
        ["About Yourself", getValue("bio")],
        ["Education", getValue("education")],
        ["College", getValue("college")],
        ["Occupation", getValue("occupation")],
        ["Languages", getValue("languages")],
        ["Main Photo", mainPhoto ? mainPhoto.name : "Not selected"],
        ["Additional Photos", `${additionalPhotos.length} selected`]
    ];

    review.innerHTML = "";

    reviewItems.forEach(([label, value]) => {
        const item = document.createElement("div");
        item.className = "review-item";

        const heading = document.createElement("strong");
        heading.textContent = label;

        const detail = document.createElement("span");
        detail.textContent = value;

        item.appendChild(heading);
        item.appendChild(detail);

        review.appendChild(item);
    });
}

// Final submission
form.addEventListener("submit", (event) => {

    event.preventDefault();

    if (!validateStep()) {
        return;
    }

    alert("Your profile form is ready! Backend saving will be connected later.");

});


// Start at first step
showStep(0);
// Main profile photo preview
const profilePhotoInput = document.getElementById("profilePhoto");
const mainPhotoPreview = document.getElementById("mainPhotoPreview");

// Additional photos preview
const additionalPhotosInput = document.getElementById("additionalPhotos");
const additionalPhotosPreview = document.getElementById("additionalPhotosPreview");

function displayPhotoPreviews(input, previewContainer) {
    input.addEventListener("change", function () {
        const oldURLs = previewContainer.dataset.objectUrls;

        if (oldURLs) {
            JSON.parse(oldURLs).forEach(url => URL.revokeObjectURL(url));
        }

        previewContainer.dataset.objectUrls = "[]";
        previewContainer.innerHTML = "";

        const files = Array.from(input.files);

        // Validate selected files
        const invalidFile = files.find(file =>
            !file.type.startsWith("image/") ||
            file.size > 5 * 1024 * 1024
        );

        if (invalidFile) {
            previewContainer.textContent =
                !invalidFile.type.startsWith("image/")
                    ? "Please select image files only."
                    : "Each photo must be smaller than 5 MB.";

            previewContainer.classList.add("photo-error");
            input.value = "";
            return;
        }

        previewContainer.classList.remove("photo-error");

        const validURLs = [];

        files.forEach((file, index) => {
            const wrapper = document.createElement("div");
            wrapper.className = "photo-preview-item";

            const image = document.createElement("img");
            const imageURL = URL.createObjectURL(file);

            validURLs.push(imageURL);

            image.src = imageURL;
            image.alt = "Selected profile photo";

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "×";
            removeButton.className = "remove-photo-btn";
            removeButton.setAttribute("aria-label", "Remove photo");

            removeButton.addEventListener("click", function () {
                const updatedFiles = Array.from(input.files);
                updatedFiles.splice(index, 1);

                const dataTransfer = new DataTransfer();

                updatedFiles.forEach(file => {
                    dataTransfer.items.add(file);
                });

                input.files = dataTransfer.files;

                input.dispatchEvent(new Event("change"));
            });

            wrapper.appendChild(image);
            wrapper.appendChild(removeButton);
            previewContainer.appendChild(wrapper);
        });

        previewContainer.dataset.objectUrls = JSON.stringify(validURLs);
    });
}
displayPhotoPreviews(profilePhotoInput, mainPhotoPreview);
displayPhotoPreviews(additionalPhotosInput, additionalPhotosPreview);