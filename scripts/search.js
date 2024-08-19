document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var query = document.getElementById('search-bar').value;
    var search = 'https://search.rhscz.eu/search?q=' + encodeURIComponent(query) + '&category_general=1&language=all&time_range=&safesearch=2&theme=simple';
    window.location.href = search;
});