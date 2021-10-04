
function main(){
    let camera_button = document.querySelector("#start-camera");
    let video = document.querySelector("#video");
    let click_button = document.querySelector("#click-photo");
    let canvas = document.querySelector("#canvas");
    let stream=null;

    camera_button.addEventListener('click', async function() {
        video.style.display="inline";
        click_button.style.display="inline";
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
    });

    click_button.addEventListener('click', function() {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg');

        // data url of the image
        //console.log(image_data_url);
        document.getElementById("photo-preview").src=image_data_url;
        document.getElementById("taken-pic-src").value=image_data_url;
        //let stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: false });
        //video.srcObject = stream;
        stream.getTracks().forEach(function(track) {
            track.stop();
        });
        video.style.display="none";
        click_button.style.display="none";
        //video.srcObject = null;
    });
}

document.addEventListener ("DOMContentLoaded", main);