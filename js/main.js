/**
* jQuery.textareaCounter
* Version 1.0
* Copyright (c) 2011 c.bavota - http://bavotasan.com
* Dual licensed under MIT and GPL.
* Date: 10/20/2011
**/
(function($){
    $('#commentField').highlightTextarea({
        caseSensitive: false,
        words: ["Hello and welcome to", "Now just look how cool", "it's just a~stylish text"]
    });
    //$('#commentField').highlightTextarea('setWords', ["Rhythm"]);

    $.fn.textareaCounter = function(options) {
        // setting the defaults
        // $("textarea").textareaCounter({ limit: 100 });
        var defaults = {
            limit: 100
        };
        var options = $.extend(defaults, options);
        var $inputBoxes = $('input, [type=\'submit\']', "#generator");
        $inputBoxes.prop('disabled', true);

        // and the plugin begins
        return this.each(function() {
            var obj, text, wordcount, limited, hil1, hil2, hil3;

            obj = $(this);
            obj.parent().after('<span style="font-size: 14px; clear: both; margin-top: 3px; margin-bottom: 20px; display: block;" id="counter-text">Max. '+options.limit+' words</span>');

            obj.keyup(function() {
                text = obj.val();
                if(text === "") {
                    wordcount = 0;
                } else {
                    wordcount = $.trim(text).split(/\s+/).length;
                }

                hil1 = text.split(/\s+/).slice(0,4).join(" ");
                hil2 = text.split(/\s+/).slice(14,19).join(" ");
                hil3 = text.split(/\s+/).slice(60,64).join(" ");

                var hilArray = [];
                if(hil1.length) {
                    hilArray.push(hil1);
                }

                if(hil2.length) {
                    hilArray.push(hil2);
                }

                if(hil3.length) {
                    hilArray.push(hil3);
                }

                $('#commentField').highlightTextarea('setWords', hilArray);
                if(wordcount > options.limit) {
                    $inputBoxes.prop('disabled', true);
                    $("#counter-text").html('<span style="color: #DD0000;">' + (options.limit - wordcount) + ' words left</span>');
                } else if(wordcount == options.limit) {
                    $("#counter-text").html((options.limit - wordcount)+' words left');
                    $inputBoxes.prop('disabled', false);
                } else {
                    $inputBoxes.prop('disabled', true);
                    $("#counter-text").html((options.limit - wordcount)+' words left');

                }
            });
        });
    };
    $("textarea").textareaCounter();
    $("#commentField").trigger("keyup");



    $("#generator [type='submit']").on('click submit', function(event) {
        var formData = $("#generator").serialize();
        var $inputBoxes = $('input, [type=\'submit\']', "#generator");
        $inputBoxes.prop('disabled', true);
        $('.generate-label').css("visibility", "hidden");
        $('.generate-label').css("visibility", "visible").html('<i class="fa fa-hourglass-start"></i>generating scenes...');
        var url = "php/generate.php";
        $.ajax({
            type: "POST",
            url: url,
            data: formData, // serializes the form's elements.
            dataType: 'json',
            success: function(data) {
                if (data.error) {
                    $('.generate-label').css("visibility", "hidden");
                    $('.generate-label').removeClass("error success").addClass("error").css("visibility", "visible").html('<i class="fa fa-times"></i>' + data.message);
                    $inputBoxes.prop('disabled', false);
                } else {
                    $('.generate-label').css("visibility", "hidden");
                    $('.generate-label').removeClass("error success").addClass("success").css("visibility", "visible").html('<i class="fa fa-check"></i>' + data.message);
                }
            },
            error: function() {
                $('.generate-label').css("visibility", "hidden");
                $('.generate-label').removeClass("error success").addClass("error").css("visibility", "visible").html('<i class="fa fa-times"></i>Problem connecting to server. Please try again');
                $inputBoxes.prop('disabled', false);
            }
        });
        event.preventDefault();
    });
})(jQuery);
