let video_player = document.querySelector(".video-player");
let record_btn = document.querySelector("#record-btn");
let capture_btn = document.querySelector("#capture-btn");

let constraints = {video:true};
let mediaPlayer = navigator.mediaDevices.getUserMedia(constraints);
let media_recorder;
let chunks = [];
let record_state = false;
let zoom = 1;
let timerInterval;
let second = 0;
let minute = 0;

let frame  = document.querySelector(".frame");
frame.style["max-width"] = video_player.offsetWidth + "px";

record_btn.addEventListener("click",function(){
    if(!record_state){
        media_recorder.start();
        record_state = true;
        timerInterval = setInterval(() => {
            second++;
            if (second == 60) {
                minute++;
                second = 0;
            }
            if (minute < 10) {
                document.querySelector(".minute").innerText = "0" + minute;
            } else {
                document.querySelector(".minute").innerText = minute;
            }

            if (second < 10) {
                document.querySelector(".second").innerText = "0" + second;
            } else {
                document.querySelector(".second").innerText = second;
            }
        }, 1000);
        record_btn.innerHTML = ` <div id="record-btn"><div class="record-btn-style"><img style="width:17px;height:17px" src="https://img.icons8.com/material-rounded/20/fa314a/stop.png"/></div></div>`;

    }else{
        media_recorder.stop();
        record_state = false;
        clearInterval(timerInterval);
        second = 0;
        minute = 0;
        document.querySelector(".minute").innerText = "00";
        document.querySelector(".second").innerText = "00";
        record_btn.innerHTML = ` <div id="record-btn"><div class="record-btn-style"><img src="https://img.icons8.com/fluent/25/000000/record.png"/></div></div>`;
    }
})

capture_btn.addEventListener("click",function(){
    capture();
})

mediaPlayer.then(function(media){
    console.log(media)
    video_player.srcObject = media;

    media_recorder = new MediaRecorder(media);

    media_recorder.ondataavailable = function(e){
        chunks.push(e.data);
    }

    media_recorder.onstop = function(){
        let blob = new Blob(chunks,{type: "video/mp4"});
        chunks = [];
        // let blobURL = URL.createObjectURL(blob);
        addData("video",blob);
        // let a = document.createElement("a");
        // a.href = blobURL;
        // a.download = "temp.mp4";
        // a.click();
    }
})
let filter= "";

function capture(){
    let canvas = document.createElement("canvas");
    canvas.width = video_player.videoWidth;
    canvas.height = video_player.videoHeight;
    let ctx = canvas.getContext("2d");
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.scale(zoom,zoom);
    ctx.translate(-canvas.width/2,-canvas.height/2);
    ctx.drawImage(video_player,0,0);

    if(filter != "") {
        ctx.fillStyle = filter;
        ctx.fillRect(0,0, canvas.width, canvas.height);
    }

    addData("image",canvas.toDataURL());
    // let link = document.createElement("a");
    // link.download = "img.png";
    // link.href =  canvas.toDataURL();
    // link.click();

}

let allFilters = document.querySelectorAll(".filter");

for(let fil of allFilters){
    fil.addEventListener("click",function(e){
        filter = e.currentTarget.style.backgroundColor;
        addFilterToScreen(filter);
    })
}


function addFilterToScreen(filter){
    let prevScreenFilter = document.querySelector(".screen-filter");
    if (prevScreenFilter) {
        prevScreenFilter.remove();
    }
    let filter_screen = document.createElement("div");  
    filter_screen.classList.add("screen-filter");
    filter_screen.style.height = video_player.offsetHeight + "px";
    filter_screen.style.width = video_player.offsetWidth + "px";
    // filterScreen.style.position ="fixed";
    // filterScreen.style.top = 0;
    filter_screen.style.backgroundColor = filter;
    document.querySelector(".filter-screen-parent").append(filter_screen);
        
}


let zoom_in_btn = document.querySelector(".zoom-in");
let zoom_out_btn = document.querySelector(".zoom-out");

zoom_in_btn.addEventListener("click",function(){
    if(zoom < 2.5){
        zoom += 0.5;
        video_player.style["transform"] = `scale(${zoom})`;
    }
})

zoom_out_btn.addEventListener("click",function(){
    if(zoom > 1){
        zoom -= 0.5;
        video_player.style["transform"] = `scale(${zoom})`;
    }
})

let galmenu = document.querySelector(".gallery-menu");
galmenu.addEventListener("click",function(){
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = ` <div class="title">
                                <span style="display:inline-block;margin-top: 5px;font-family: Brush Script MT, Brush Script Std, cursive;font-size: 40px;">Gallery</span>
                                <span class="close-modal" style="float:right;padding:2px;color:white;background-color: red;height: 30px;width: 30px; cursor: pointer;font-size: 20px;">X</span>
                            </div>
                            <div class="gallery"></div>`
    document.querySelector("body").append(modal);

    document.querySelector(".close-modal").addEventListener("click",function(){
        modal.remove();
    });
    getData();
});





