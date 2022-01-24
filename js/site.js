$(document).ready(function () {
    $.get('https://api.giphy.com/v1/gifs/random?api_key=0SUGMx8ZrtWvB6PeJAqJtzKFFheWaWJW&rating=r', function (response) {
        $('#img').html("<img src=" + response.data.images.downsized_large.url + ">")
    })
});