// ==========================================
// CONNECT. — LOGIN JAVASCRIPT
// ==========================================


// 1. HTML ELEMENTS

const loginForm = document.getElementById("loginForm");
const phoneInput = document.getElementById("loginPhone");
const sendOtpBtn = document.getElementById("loginSendOtpBtn");

const otpSection = document.getElementById("loginOtpSection");
const otpInput = document.getElementById("loginOtp");

const verifyOtpBtn = document.getElementById("loginVerifyOtpBtn");
const resendOtpBtn = document.getElementById("loginResendOtpBtn");

const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("loginMessage");


// 2. API CONFIGURATION

// Confirm these routes with your backend team.

const API_BASE_URL = "/api/auth/login";

const API = {
    sendOtp: `${API_BASE_URL}/send-otp`,
    verifyOtp: `${API_BASE_URL}/verify-otp`,
    login: API_BASE_URL
};


// 3. STATE VARIABLES

let isOtpVerified = false;
let verifiedPhone = "";

let resendTimer = null;
let resendSeconds = 30;

let isSendingOtp = false;
let isVerifyingOtp = false;
let isLoggingIn = false;


// 4. MESSAGE FUNCTION

function showMessage(text, type = "error") {
    message.textContent = text;
    message.className = `form-message ${type}`;
}


// 5. PHONE VALIDATION

function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
}


// 6. API RESPONSE HANDLER

async function handleResponse(response) {
    let data = {};

    try {
        data = await response.json();
    } catch {
        throw new Error("Invalid server response.");
    }

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
    }

    return data;
}


// 7. RESET OTP STATE

function resetOtpState() {
    isOtpVerified = false;
    verifiedPhone = "";

    clearInterval(resendTimer);
    resendTimer = null;

    resendSeconds = 30;

    otpSection.hidden = true;

    otpInput.value = "";
    otpInput.disabled = false;

    verifyOtpBtn.disabled = false;
    verifyOtpBtn.textContent = "Verify OTP";

    sendOtpBtn.disabled = false;
    sendOtpBtn.textContent = "Send OTP";

    resendOtpBtn.disabled = true;
    resendOtpBtn.textContent = "Resend OTP";

    loginBtn.disabled = true;
}


// 8. RESEND COOLDOWN

function startResendTimer() {
    clearInterval(resendTimer);

    resendSeconds = 30;

    sendOtpBtn.disabled = true;
    resendOtpBtn.disabled = true;

    resendOtpBtn.textContent = `Resend OTP (${resendSeconds}s)`;

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

        resendOtpBtn.textContent = `Resend OTP (${resendSeconds}s)`;

    }, 1000);
}


// 9. SEND OTP

async function sendOtp() {
    const phone = phoneInput.value.trim();

    if (isSendingOtp) return;

    if (!isValidPhone(phone)) {
        showMessage("Enter a valid 10-digit Indian mobile number.");
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

        // Ignore response if the phone number changed.
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

        loginBtn.disabled = true;

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


// 10. VERIFY OTP

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

        resendOtpBtn.disabled = true;
        resendOtpBtn.textContent = "Verified";

        sendOtpBtn.disabled = true;

        loginBtn.disabled = false;

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


// 11. FINAL LOGIN

async function login() {
    const phone = phoneInput.value.trim();

    if (isLoggingIn) return;

    if (!isOtpVerified || phone !== verifiedPhone) {
        showMessage("Please verify your phone number first.");
        loginBtn.disabled = true;
        return;
    }

    isLoggingIn = true;

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    showMessage("Logging in...", "info");

    try {
        const response = await fetch(API.login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ phone })
        });

        const data = await handleResponse(response);

        showMessage(
            data.message || "Login successful!",
            "success"
        );

        if (data.redirectTo) {
            window.location.href = data.redirectTo;
        }

    } catch (error) {
        showMessage(error.message);
        loginBtn.disabled = false;

    } finally {
        isLoggingIn = false;
        loginBtn.textContent = "Log In";
    }
}


// 12. EVENT LISTENERS

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

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    login();
});