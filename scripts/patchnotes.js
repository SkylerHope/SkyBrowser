function showPatchNotes() {
    var notes = document.getElementById('patchnotes');
    if (notes.style.display === 'none' || notes.style.display === '') {
        notes.style.display = 'block';
    }
    else {
        notes.style.display = 'none';
    }
}