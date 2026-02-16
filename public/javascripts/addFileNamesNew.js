function previewMultiple(event) {
    var image = document.getElementById("image");
    var number = image.files.length;
    document.getElementById("formFile").innerHTML = ''
    for (i = 0; i < number; i++) {
        // Here event.target is image array selected in the html form
        // image has an array named files embedded with it
        // so , images.files or event.target.files is one and the same thing
        var urls = URL.createObjectURL(event.target.files[i]);
        document.getElementById("formFile").innerHTML += '<img src="' + urls + '">';
    }
}