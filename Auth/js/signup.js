// ==========================================
// CONNECT. — SIGNUP JAVASCRIPT
// ==========================================


// 1. HTML ELEMENTS

const signupForm = document.getElementById("signupForm");

const fullNameInput = document.getElementById("fullName");
const usernameInput = document.getElementById("username");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const termsCheckbox = document.getElementById("terms");

const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpSection = document.getElementById("otpSection");
const otpInput = document.getElementById("otp");

const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const resendOtpBtn = document.getElementById("resendOtpBtn");

const signupBtn = document.getElementById("signupBtn");
const signupMessage = document.getElementById("signupMessage");


// 2. API CONFIGURATION

const API_BASE_URL = "/api/auth";

const API = {
    sendOtp: `${API_BASE_URL}/send-otp`,
    verifyOtp: `${API_BASE_URL}/verify-otp`,
    signup: `${API_BASE_URL}/signup`
};


// 3. STATE VARIABLES

let isOtpVerified = false;
let verifiedPhone = "";

let isSendingOtp = false;
let isVerifyingOtp = false;
let isSigningUp = false;

let resendTimer = null;
let resendSeconds = 30;


// 4. MESSAGE HANDLER

function showMessage(text, type = "error") {
    signupMessage.textContent = text;
    signupMessage.className = `form-message ${type}`;
}


// 5. PHONE VALIDATION

function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
}


// 6. AGE VALIDATION

function isAdult(dob) {
    if (!dob) return false;

    const birthDate = new Date(`${dob}T00:00:00`);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime())) {
        return false;
    }

    if (birthDate > today) {
        return false;
    }

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
        today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {
        age--;
    }

    return age >= 18;
}


// 7. API RESPONSE HANDLER

async function handleResponse(response) {
    let data = {};

    try {
        data = await response.json();
    } catch {
        throw new Error("Invalid server response.");
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong."
        );
    }

    return data;
}


// 8. RESET OTP STATE

function resetOtpState() {
    isOtpVerified = false;
    verifiedPhone = "";

    clearInterval(resendTimer);
    resendTimer = null;

    resendSeconds = 30;

    otpSection.hidden = true;

    otpInput.value = "";
    otpInput.disabled = false;

    sendOtpBtn.disabled = false;
    sendOtpBtn.textContent = "Send OTP";

    verifyOtpBtn.disabled = false;
    verifyOtpBtn.textContent = "Verify OTP";

    resendOtpBtn.disabled = true;
    resendOtpBtn.textContent = "Resend OTP";

    signupBtn.disabled = true;
}


// 9. RESEND OTP TIMER

function startResendTimer() {
    clearInterval(resendTimer);

    resendSeconds = 30;

    sendOtpBtn.disabled = true;
    resendOtpBtn.disabled = true;

    resendOtpBtn.textContent =
        `Resend OTP (${resendSeconds}s)`;

    resendTimer = setInterval(() => {
        resendSeconds--;

        if (resendSeconds <= 0) {
            clearInterval(resendTimer);
            resendTimer = null;

            sendOtpBtn.disabled = true;
            resendOtpBtn.disabled = false;

            resendOtpBtn.textContent = "Resend OTP";

            return;
        }

        resendOtpBtn.textContent =
            `Resend OTP (${resendSeconds}s)`;

    }, 1000);
}


// 10. SEND OTP

async function sendOtp() {
    const phone = phoneInput.value.trim();

    if (isSendingOtp) return;

    if (!isValidPhone(phone)) {
        showMessage(
            "Enter a valid 10-digit Indian mobile number."
        );

        phoneInput.focus();
        return;
    }

    isSendingOtp = true;

    sendOtpBtn.disabled = true;
    resendOtpBtn.disabled = true;

    sendOtpBtn.textContent = "Sending OTP...";

    showMessage("Sending OTP...", "info");

    try {
        const response = await fetch(API.sendOtp, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({ phone })
        });

        const data = await handleResponse(response);

        // Do not use a response for an old phone number.
        if (phoneInput.value.trim() !== phone) {
            return;
        }

        isOtpVerified = false;
        verifiedPhone = "";

        otpSection.hidden = false;

        otpInput.value = "";
        otpInput.disabled = false;

        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = "Verify OTP";

        signupBtn.disabled = true;

        startResendTimer();

        showMessage(
            data.message || "OTP sent successfully.",
            "success"
        );

        otpInput.focus();

    } catch (error) {
        showMessage(error.message);

        sendOtpBtn.disabled = false;
        resendOtpBtn.disabled = true;

    } finally {
        isSendingOtp = false;
        sendOtpBtn.textContent = "Send OTP";
    }
}


// 11. VERIFY OTP

async function verifyOtp() {
    const phone = phoneInput.value.trim();
    const otp = otpInput.value.trim();

    if (isVerifyingOtp) return;

    if (!isValidPhone(phone)) {
        showMessage("Enter a valid mobile number.");
        phoneInput.focus();
        return;
    }

    if (!/^\d{6}$/.test(otp)) {
        showMessage("Enter the 6-digit OTP.");
        otpInput.focus();
        return;
    }

    isVerifyingOtp = true;

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.textContent = "Verifying...";

    showMessage("Verifying OTP...", "info");

    try {
        const response = await fetch(API.verifyOtp, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({ phone, otp })
        });

        const data = await handleResponse(response);

        if (phoneInput.value.trim() !== phone) {
            throw new Error(
                "Phone number changed. Request a new OTP."
            );
        }

        if (data.verified !== true) {
            throw new Error(
                data.message || "Invalid or expired OTP."
            );
        }

        isOtpVerified = true;
        verifiedPhone = phone;

        otpInput.disabled = true;

        verifyOtpBtn.disabled = true;
        verifyOtpBtn.textContent = "Verified";

        clearInterval(resendTimer);
        resendTimer = null;

        sendOtpBtn.disabled = true;

        resendOtpBtn.disabled = true;
        resendOtpBtn.textContent = "Verified";

        signupBtn.disabled = false;

        showMessage(
            "Phone number verified successfully.",
            "success"
        );

    } catch (error) {
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = "Verify OTP";

        showMessage(error.message);

    } finally {
        isVerifyingOtp = false;
    }
}


// 12. SIGNUP

async function signup() {
    const fullName = fullNameInput.value.trim();
    const username = usernameInput.value.trim();
    const phone = phoneInput.value.trim();
    const dob = dobInput.value;

    if (isSigningUp) return;

    if (fullName.length < 2) {
        showMessage("Enter your full name.");
        fullNameInput.focus();
        return;
    }

    if (username.length < 3) {
        showMessage(
            "Username must contain at least 3 characters."
        );

        usernameInput.focus();
        return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showMessage(
            "Username can only contain letters, numbers and underscores."
        );

        usernameInput.focus();
        return;
    }

    if (!isValidPhone(phone)) {
        showMessage("Enter a valid mobile number.");
        phoneInput.focus();
        return;
    }

    if (!isAdult(dob)) {
        showMessage(
            "You must be at least 18 years old to join."
        );

        dobInput.focus();
        return;
    }

    if (!termsCheckbox.checked) {
        showMessage(
            "Please accept the Terms and Conditions."
        );

        termsCheckbox.focus();
        return;
    }

    if (!isOtpVerified || phone !== verifiedPhone) {
        showMessage(
            "Please verify your phone number first."
        );

        signupBtn.disabled = true;
        return;
    }

    isSigningUp = true;

    signupBtn.disabled = true;
    signupBtn.textContent = "Creating account...";

    showMessage("Creating your account...", "info");

    try {
        const response = await fetch(API.signup, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                fullName,
                username,
                phone,
                dob
            })
        });

        const data = await handleResponse(response);

        showMessage(
            data.message || "Account created successfully!",
            "success"
        );

        signupForm.reset();
        resetOtpState();

        setTimeout(() => {
            window.location.href = "./login.html";
        }, 1500);

    } catch (error) {
        showMessage(error.message);

        signupBtn.disabled = false;

    } finally {
        isSigningUp = false;
        signupBtn.textContent = "Create Account";
    }
}


// 13. EVENT LISTENERS

sendOtpBtn.addEventListener("click", sendOtp);

verifyOtpBtn.addEventListener("click", verifyOtp);

resendOtpBtn.addEventListener("click", () => {
    if (resendOtpBtn.disabled || isSendingOtp) return;

    sendOtp();
});

phoneInput.addEventListener("input", () => {
    resetOtpState();
    showMessage("");
});

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    signup();
});


// 14. INITIAL STATE

signupBtn.disabled = true;
otpSection.hidden = true;
resendOtpBtn.disabled = true;