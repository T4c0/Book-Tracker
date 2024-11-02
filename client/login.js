import Auth from './auth.js';

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:4004/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        console.log(response.status); // Check the status for debugging

        if (response.ok) {
            const data = await response.json();
            Auth.login(data.token); // Use Auth's login function
        } else {
            alert("Login failed: " + response.statusText); // Show a more descriptive error
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred");
    }
});
