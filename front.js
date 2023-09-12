
let anchor = document.getElementById("fileDownload")


var fileUpload = document.getElementsByClassName("file")[0]
fileUpload.addEventListener("change", ()=>{
        const reader = new FileReader();
        reader.readAsDataURL(fileUpload.files[0]);
        reader.onload = (evt) => {
          let attribute = document.getElementsByClassName("attribute");

          loadFile(
            `${evt.target.result}`,
            function (error, content) {
                if (error) {
                    throw error;
                }
                socket.emit("sendToBack", content)
            }
        );
        };
})

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}


document.getElementById("drop_zone").addEventListener("dragover", (event)=>{
  event.preventDefault();
})

document.getElementById("drop_zone").addEventListener("drop", (ev)=>{
    
    ev.preventDefault();

    [...ev.dataTransfer.items].forEach((item, i) => {
        
        if (item.kind === "file") {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (evt) => {
            createDocxString(evt)
          };
        }
    }); 
})


socket.on("sendToError", (error)=>{alert(error)})



socket.on("sendToFront", (tags, content)=>{
    createInputs(Object.keys(tags))
    document.getElementById("button").addEventListener("click", ()=>{

        let attribute = document.getElementsByClassName("attribute");
        for(let i = 0; i< attribute.length; i++){
            if(attribute[i].value == ''){
                tags[Object.keys(tags)[i]] = "_____"
            }else{
                tags[Object.keys(tags)[i]] = `${attribute[i].value}`
            }
           
        } 
        console.log(tags)
        const zip = new PizZip(content);
        const doc = new window.docxtemplater(zip, {paragraphLoop: true,linebreaks: true, delimiters: { start: "[", end: "]"}});
        doc.toH
        doc.render(tags);

        const blob = doc.getZip().generate({
           type: "blob",
           mimeType:
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
       
           compression: "DEFLATE",
        });

        const data = window.URL.createObjectURL(blob);
        anchor.href = data
        anchor.download = "file Name"
        anchor.click()
        
    })
})


// FUNCITON FOR UPDATING INTERFACE. Takes in an array of lables and creates new HTML with labels and input elements

function createInputs(labels){
    for(i = 0; i<labels.length; i++){
        let labelText = document.createTextNode(`${labels[i]}`)
        let label =  document.createElement("div")

        label.appendChild(labelText)
        
      
        let newInput = document.createElement("input")
        document.getElementById("mainContent").appendChild(label)
        document.getElementById("mainContent").appendChild(newInput)
        newInput.setAttribute("class", 'attribute')
        label.setAttribute("class", 'label')
    }
    document.getElementById("button").style.display = "block"
    document.getElementById("buttonNew").style.display = "block"

    document.getElementById("first").style.display = "none"
    document.getElementById("second").style.display = "block"

    document.getElementById("drop_zone").style.display = "none"
    document.getElementById("buttonNew").onclick = ()=>{
        location.reload();
    }
}


function createDocxString(evt){
    loadFile(
        `${evt.target.result}`,
        function (error, content) {
            if (error) {
                throw error;
            }
            socket.emit("sendToBack", content)
        }
    );
}