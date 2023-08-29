$(document).ready(function () {
    $.get('https://meme-api.com/gimme', function (response) {
        $('#img').html("<img src=" + response.preview[2] + ">")
    })
});