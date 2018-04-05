// JavaScript source code

// read the image
$("#file0").on("change", function () {
    let fileReader = new FileReader(),
        fileType = this.files[0].type;
    fileReader.onload = function () {
        if (/^image/.test(fileType)) {   
            $("#img0").attr("src", this.result);
            $("#img0").removeClass("hide");
        }
    }

    console.log(this.files[0]);
    fileReader.readAsDataURL(this.files[0]);
});

// click event
$("#analyze_text").on("click", function () {
    // get the file name of the local image
    var images_file = $("#file0").val();
    var file = images_file.substring(images_file.lastIndexOf('\\') + 1, images_file.length); 
    if (images_file == "" ) return false;

    // POST the file name get above to python
    $.ajax({
        url: 'analyze',
        method: 'POST',
        data: { 'text': file },
        beforeSend: function () {
            $("#loader").fadeIn();
        },

        // POST success, get the response(result) of the api call to waston visual recognition server
        success: function (response) {
            $("#loader").fadeOut();

            console.log(response);

            $("#results").html("");
            $("#result_text").html("");

            score = 0;
            classes = 0;
            response['images'][0]['classifiers'][0]['classes'].forEach(function (element, index) {
               
                /*$("#results").append(
                    "<a class='list-group-item' href='#'>" +
                    element['class'] +
                    "(" +
                    (element['score'] * 100).toFixed(2) +
                    "%)</a>" + "<br>");*/
                if (element['score'] > score)
                {
                    score = element['score']
                    classes = element['class']
                }
                    
            });

            $("#result_text").html("<p>Watson is <span class='score'>"
                + (score * 100).toFixed(2)
                + "%</span> confident that this waste is <span class= 'class'>"
                + classes
                + "</span></p>");

            $(window).scrollTop($("#results").offset().top);
        }

           

    });

    return false;
});