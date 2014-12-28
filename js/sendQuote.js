/*Pressing the New Quote text either puts up the quoteSendDiv or removes it*/
$(function(){
    $("#newQuote").click(function(){
        if($("#quoteSendDiv").hasClass("fadeInUp")){
            $("#quoteSendDiv").removeClass("animated fadeInUp");
            $("#quoteSendDiv").addClass("animated fadeOutDown");
        }else{
            $("#quoteSendDiv").removeClass("animated fadeOutDown");
            $("#quoteSendDiv").css("visibility", "visible");
            $("#quoteSendDiv").addClass("animated fadeInUp");
        }
    });

    /*reclicking the sendQuote puts down the quoteSendDiv*/
    $("#sendQuote").click(function(){
        $("#quoteSendDiv").removeClass("animated fadeInUp");
        $("#quoteSendDiv").addClass("animated fadeOutDown");
    });

    /*pressing the circle puts down the quoteSendDiv*/
    $("#circle").click(function(){
        $("#quoteSendDiv").removeClass("animated fadeInUp");
        $("#quoteSendDiv").addClass("animated fadeOutDown");
    });

    /*Reads form info and sends to node app -> mongodb*/
    $("quoteForm").submit(function(e) {
        e.preventDefault(); // Prevents the page from refreshing
        var $this = $(this);

        $.post(
            $this.attr("action"),
            $this.serialize(),
            function(data) {
                /** code to handle response **/ 
            },
            "json" // The format the response should be in
        );
    });
});