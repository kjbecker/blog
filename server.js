var express = require('express');
var app = express();
var scriptString = "";
var buttons = [];
var toolbar;
var ls = require("./leatherstrap");
var formidable = require('formidable');
var debug;
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
app.get("/index", function (request, response) {

    page = new ls.Page("Test Editor");
    toolbar = new ls.container();
    addButton("bold", "bold", "bold");
    addButton("italic", "italic", "italic");
    addButton("underline", "hand-down", "underline");
    addButton("heading", "header", "formatBlock", "<h1>");
    addButton("left", "align-left", "justifyLeft");
    addButton("right", "align-right", "justifyRight");    
    addButton("center", "align-center", "justifyCenter");
    addButton("full", "align-justify", "justifyFull");

    buttons["image"] = new ls.button('<span class="glyphicon glyphicon-picture"></span>');
    buttons["image"].addAttribute("id", "imageButton");
    buttons["image"].addAttribute("data-toggle", "modal");    
    buttons["image"].addAttribute("data-target", "#imageBox");

        modalBox = new ls.componentBase("div");
        modalBox.addClass("modal fade");
        modalBox.addAttribute("id", "imageBox");
        modalBox.addAttribute("role", "dialog");
        modalDialog = new ls.componentBase("div");
        modalDialog.addClass("modal-dialog");
        modalBox.add(modalDialog);
        modalContent = new ls.componentBase("div");
        modalContent.addClass("modal-content");
        modalDialog.add(modalContent);
        modalBody = new ls.componentBase("div");
        modalBody.add(new ls.rawHtml("TEST"));
        modalContent.add(modalBody);
        uploadForm = new ls.form('inline', '/');
        uploadForm.addAttribute("enctype", "multipart/form-data");
        uploadForm.addAttribute("id", "imageUploadForm");
        uploadForm.add(new ls.input('file', "File:", 'img'));
        uploadForm.add(new ls.rawHtml('<input type="submit" value="upload"></input>'));
        buttons["upload"] = new ls.button('Upload');
        buttons["upload"].addAttribute("id", "uploadButton");
                modalBody.add(uploadForm);
                modalBody.add(buttons["upload"]);
        scriptString += `document.getElementById("uploadButton").addEventListener("click", function(){
                form = document.getElementById("imageUploadForm");
                url = form.action;
                xhr = new XMLHttpRequest();


                xhr.open("POST", url);


                var formdata = new FormData();
                xhr.send(formdata);});
            `;

        
        
    toolbar.add(buttons["image"]);
    
    page.add(toolbar);
            page.add(modalBox);
    editable = new ls.container();
    editable.addAttribute("contenteditable", "");
    editable.addAttribute("id", "editable");
    editable.add(new ls.rawHtml("Edit me"));
    editable.addClass("well");
    page.add(editable);
    page.add(new ls.rawHtml("<script>" + scriptString + "</script>"));
    response.send(page.build());
    //response.send(response);
});
app.get("*", function (request, response) {
        var simpleObject = {};
    for (var prop in debug ){
        if (!debug.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(debug[prop]) == 'object'){
            continue;
        }
        if (typeof(debug[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = debug[prop];
    }
    response.send(JSON.stringify(simpleObject));

});
app.post('/', upload.single('img'), function(req, res){
  console.log(req.file);
  res.json(req.file);
});
app.listen(8888);


function addButton(name, icon, com, arg = "null"){
    buttons[name] = new ls.button('<span class="glyphicon glyphicon-' + icon + '"></span>');
    buttons[name].addAttribute("id", name + "Button");
    toolbar.add(buttons[name]);
    scriptString += 'document.getElementById("' + name + 'Button").addEventListener("click", function(){ document.execCommand("' + com + '", false, "'+ arg + '");document.getElementById("editable").focus();});';
}
console.log("Server Started");
//# sourceMappingURL=server.js.map