const API_BASE_URL = "https://muraliyar-manpower-service.onrender.com/api"; // Change this for deployment

// Show Bootstrap Alert Message
function showAlert(elementId, message, type) {
    const alertBox = document.getElementById(elementId);
    alertBox.className = `alert alert-${type} text-center`;
    alertBox.innerText = message;
    alertBox.classList.remove("d-none");
    setTimeout(() => {
        alertBox.classList.add("d-none");
    }, 1000); // Hide after 3 seconds
}

// Signup Function
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            showAlert("signupAlert", "Signup successful! Redirecting...", "success");
            setTimeout(() => window.location.href = "index.html", 2000);
        } else {
            showAlert("signupAlert", data.message, "danger");
        }
    } catch (error) {
        showAlert("signupAlert", "Server error, please try again.", "danger");
        console.error(error);
    }
});

// Login Function
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            showAlert("loginAlert", "Login successful! Redirecting...", "success");
            setTimeout(() => window.location.href = "index.html", 2000);
        } else {
            showAlert("loginAlert", data.message, "danger");
        }
    } catch (error) {
        showAlert("loginAlert", "Server error, please try again.", "danger");
        console.error(error);
    }
});
