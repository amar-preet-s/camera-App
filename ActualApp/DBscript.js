let request = indexedDB.open("camera", 1);
let db;
request.onsuccess = function(e) {
    db = request.result;
    getData("gallery-menu");

}

request.onerror = function () { 
    console.log("error");
 }

request.onupgradeneeded = function(e) {
    db = request.result;
    db.createObjectStore("gallery", { keyPath: "nId"})
}

// for transaction
// 
function addData (type,data) {
    let tx = db.transaction("gallery","readwrite");
    let store = tx.objectStore("gallery");
    store.add({nId: Date.now(), type: type, data: data});

} 

function getData(caller){
    let tx = db.transaction("gallery","readonly");
    let store = tx.objectStore("gallery");
    let req = store.openCursor();
    let gallery = document.querySelector(".gallery");
    if(gallery){
        gallery.innerHTML = "";}
    let galmenu = document.querySelector(".gallery-menu");
    let last = "";
    let image;
    let video;
    let len = 0;
    req.onsuccess = function(){
        let cursor = req.result;
        if(cursor){
            if(cursor.value.type == "image"){
                image = document.createElement("div");
                image.classList.add("image");

                if(caller == "gallery-menu"){
                    image.innerHTML = `<img src="${cursor.value.data}" style="max-width:11vw;max-height:13vh">`;
                    console.log("gall_man");
                    last = "image";
                }else{
                 
                    // image.innerHTML = `<img src="${cursor.value.data}">`
                    image.innerHTML = `<img src="${cursor.value.data}">
                                        <div class= Buttons>
                                            <button class="delete${cursor.value.nId}">Delete</button>
                                            <button class='download${cursor.value.nId}'>Download</button>
                                        </div>`;
                    image.classList.add("gal_content");
                    gallery.append(image);
                    let url = cursor.value.data;
                    let fileName = cursor.value.nId + ".png";
                    let nId = cursor.value.nId; 
                    document.querySelector(`.download${cursor.value.nId}`).addEventListener("click", function(){
                        download(url,fileName);
                    });
                    document.querySelector(`.delete${cursor.value.nId}`).addEventListener("click", function(){
                        deleteFromGallery(nId);
                    });
                    len++;
                }
            }else{
                let videoURL = URL.createObjectURL(cursor.value.data);
                video = document.createElement("div");
                video.classList.add("video");
                video.classList.add("gal_content");
                if(caller == "gallery-menu"){
                    video.innerHTML = `<video autoplay src='${videoURL}' style="max-width:11vw;max-height:13vh" loop></video>`;
                    last = "video";
                }else{
                    // video.innerHTML = `<video autoplay src='${videoURL}' loop></video>`
                    video.innerHTML = `<video autoplay src='${videoURL}' loop></video>
                                        <div class="buttons">
                                            <button class="delete${cursor.value.nId}">Delete</button>
                                            <button class="download${cursor.value.nId}">Download</button>
                                        </div>`;
                    gallery.append(video);
                    len++;   
                    let fileName = cursor.value.nId + ".mp4";
                    let nId = cursor.value.nId;
                    document.querySelector(`.download${cursor.value.nId}`).addEventListener("click", function(){
                        download(videoURL,fileName);
                    });
                    document.querySelector(`.delete${cursor.value.nId}`).addEventListener("click", function(){
                        deleteFromGallery(nId);
                    });  
                }
            }
            cursor.continue();
        }else{
            if(last == "image"){
                galmenu.append(image);
            }else if(last == "video"){
                galmenu.append("video");
            }
            console.log("data fetched");
        }

        // if(len>0 && !cursor){
        //     let gal_content = document.querySelectorAll(".gal_content");
        //     console.log(gal_content.length);
        //     for(let i = 0; i<gal_content.length;i++){
        //         gal_content[i].addEventListener("click",function(){
        //             console.log("hello");
        //         });
        //     }
        // }
    }
}

function download(url,name) {
    let a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
} 

function deleteFromGallery(nId) {
    let tx = db.transaction("gallery","readwrite");
    let store = tx.objectStore("gallery");
    store.delete(Number(nId));
    getData();
}
