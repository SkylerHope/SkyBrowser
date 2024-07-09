document.addEventListener('DOMContentLoaded', () => {
    var button = document.getElementById("dark-mode-button");
    var body = document.body;

    button.addEventListener('click', () => {
    body.classList.toggle("dark-mode");
    });
});
