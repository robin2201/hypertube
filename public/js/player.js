/**
 * Created by rberthie on 4/29/17.
 */

function renderVideo(file){
    const reader = new FileReader();
    reader.onload = function(event){

        the_url = event.target.result
        console.log(the_url)
        //of course using a template library like handlebars.js is a better solution than just inserting a string
        $('#data-vid').html("<video width='400' controls><source id='vid-source' src='""' type='video/mp4'></video>")
        $('#name-vid').html(file.name)
        $('#size-vid').html(humanFileSize(file.size, "MB"))
        $('#type-vid').html(file.type)

    }

    //when the file is read it triggers the onload event above.
    reader.readAsDataURL(file);
}


    const video = document.getElementById('video')
    video.load()
    $(".lol").click(() => {
        $.post('/movie/download', {
            imdb: $('video').data('id'),
            torrent:$('video').data('magnet')
        }).done(stream => {

            lol = document.createElement('track')




            $( "#the-video-file-field" ).change(function() {
                console.log("video file has been chosen")
                //grab the first image in the fileList
                //in this example we are only loading one file.
                console.log(this.files[0].size)
                renderVideo(this.files[0])

            });


        })
    })






//var test = document.getElementById('test')

//console.log(test)