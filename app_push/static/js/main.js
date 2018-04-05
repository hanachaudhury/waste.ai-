// JavaScript source code

// this reads the image that was uploaded by the user 
$("#file0").on("change", function () {
    let fileReader = new FileReader(),
        fileType = this.files[0].type;
    //loads the image on click 
    fileReader.onload = function () {
        if (/^image/.test(fileType)) {   
            $("#img0").attr("src", this.result);
            $("#img0").removeClass("hide");
        }
    }
    //displays the file to the user 
    console.log(this.files[0]);
    fileReader.readAsDataURL(this.files[0]);
});

// This is triggered when the user clicks the "Analyze" button in the user interfaction 
$("#analyze_text").on("click", function () {
    // get the file name of the local image
    var images_file = $("#file0").val();
    var file = images_file.substring(images_file.lastIndexOf('\\') + 1, images_file.length); 
    if (images_file == "" ) return false // if the file name is empty nothing is returned 

    // a POST call is made to retrieve the file name from python 
    $.ajax({
        url: 'analyze', //url 
        method: 'POST', //defines the method to get the file 
        data: { 'text': file },
        beforeSend: function () {
            $("#loader").fadeIn();
        },

        // POST success, get the response(result) of the api call to waston visual recognition server
        success: function (response) {
            $("#loader").fadeOut();

            console.log(response); //displays the response to the user 

            $("#results").html("");
            $("#result_text").html("");
            
            //retrieves the top result from the classifier 
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
            //Displays the confidence level as a percentage for classifying the image 
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
