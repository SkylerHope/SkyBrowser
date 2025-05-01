document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var query = document.getElementById('search-bar').value.trim();
    var domains = ['.com', '.net', '.org', '.io', '.edu', '.gov', '.co', '.dev', '.ai'];

    var isURL = domains.some(ext => query.endsWith(ext) || query.includes(ext + '/'));

    if (isURL) {
        if (!/^https?:\/\//i.test(query)) {
            query = 'https://' + query;
        }
        window.location.href = query;
    }
    else {
        var search = 'https://search.rhscz.eu/search?q=' + encodeURIComponent(query) + '&category_general=1&language=all&time_range=&safesearch=2&theme=simple';
        window.location.href = search;
    }
});