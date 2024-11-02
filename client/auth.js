const Auth = {
    getToken: () => localStorage.getItem("token"),

    isAuthenticated: () => !!localStorage.getItem("token"),

    login: (token) => {
        localStorage.setItem("token", token);
        window.location.href = "index.html"; // Redirects to the main page after login
    },

    logout: () => {
        localStorage.removeItem("token");
        alert("You have been logged out.");
        window.location.href = "login.html"; // Redirects to login page after logout
    },

    redirectToLoginIfNotAuthenticated: () => {
        if (!Auth.isAuthenticated()) {
            window.location.href = "login.html";
        }
    }
};

export default Auth;
