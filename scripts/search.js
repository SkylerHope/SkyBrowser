document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var query = document.getElementById('search-bar').value;
    var search = 'https://skysearch.website/search?q=' + encodeURIComponent(query) + '&category_general=1&language=auto&time_range=&safesearch=2&theme=simple';
    window.location.href = search;
});