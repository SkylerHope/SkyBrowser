document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var query = document.getElementById('search-bar').value;
    var search = 'https://www.google.com/search?q=' + encodeURIComponent(query);
    window.location.href = search;
});