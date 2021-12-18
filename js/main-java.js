/**
* jQuery.textareaCounter
* Version 1.0
* Copyright (c) 2011 c.bavota - http://bavotasan.com
* Dual licensed under MIT and GPL.
* Date: 10/20/2011
**/
"use strict";

function toObject(arr) {
    var rv = {};
    for (var i = 0; i < arr.length; ++i) {
        var res=arr[i].replace("~", " ");
        if (arr[i] !== undefined) rv[i] = res;
    }

    return rv;
}

(function($){
    var source   = $("#stomp-template").html();
    var template = Handlebars.compile(source);

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
        $('.generate-label').removeClass("error success").addClass("success").css("visibility", "visible").html('<i class="fa fa-check"></i>' + 'Your teaser is successfully generated. Please <code>copy code to a new HTML file</code> and move it to <code>template</code> folder');
        var context = toObject($("#commentField").val().split(/\s+/));
        var compiledCont = template(context);
        $("#generator").remove();
        $("pre").show();
        $("code.language-html").text(compiledCont);
        $('pre.copytoclipboard').each(function () {
            var $this = $(this);
            var $button = $('<button>Copy Code</button>');
            $this.wrap('<div/>').removeClass('copytoclipboard');
            var $wrapper = $this.parent();
            $wrapper.addClass('copytoclipboard-wrapper').css({position: 'relative'})
            $button.css({position: 'absolute', top: 20, right: 40}).appendTo($wrapper).addClass('copytoclipboard btn btn-default');
            /* */
            var copyCode = new Clipboard('button.copytoclipboard', {
                target: function (trigger) {
                    return trigger.previousElementSibling;
                }
            });
            copyCode.on('success', function (event) {
                event.clearSelection();
                event.trigger.textContent = 'Copied';
                window.setTimeout(function () {
                    event.trigger.textContent = 'Copy Code';
                }, 2000);
            });
            copyCode.on('error', function (event) {
                event.trigger.textContent = 'Press "Ctrl + C" to copy';
                window.setTimeout(function () {
                    event.trigger.textContent = 'Copy Code';
                }, 2000);
            });
        });
        Prism.highlightAll();
        event.preventDefault();
    });

})(jQuery);
