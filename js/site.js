$(document).ready(function () {
    $.get('https://meme-api.herokuapp.com/gimme', function (response) {
        $('#img').html("<img src=" + response.preview[2] + ">")
    })
});