/*
                                     [MADE BY GOOGLEX]


    JANGAN PERNAH EDIT !!!
	
	DO NOT EDIT ANY OF THIS (UNLESS YOU KNOW WHAT YOU ARE DOING)

*/
/* NOTIFY */
$(document).on('click', '.notifyjs-bootstrap-base', function() {
    $('#chat-messages').animate({
        scrollTop: $('#chat-messages').height() + 100000000000000
    }, 1000);
    //hide notification
    $(this).trigger('notify-hide');
});

/* CORE */
$(document).ready(function() {
    var mid, clone, name, email, contacts = [],
        msgtext, xdata, xhtml, xmyid, xmypic, ismessaging = false,
        lastmsg;
    xmyid = $("#myid").val();
    xmypic = $("#mypic").val();

    $(".friend").each(function(index) {
        contacts[index] = $(this).html();
        //console.info(this);
    });

    function replaceNaN(param) {
        if (param === undefined || !param || param == '' || param == null) {
            return 'unknown';
        } else {
            return param;
        }
    }

    /* Refresh Chat */
    setInterval(function() {
        $.get("/renew/chat/group");
    }, 5100);
    setInterval(function() {
        //console.log(ismessaging+mid)
        if (ismessaging == true) {
            $.get("/" + mid + ".json").done(function(xdata) {
                if (!lastmsg) {
                    lastmsg = xdata[xdata.length - 1].id;
                } else if (lastmsg != xdata[xdata.length - 1].id) {
                    $(".floatingImg").notify("New message !!", {
                        className: "success",
                        position: "bottom center"
                    });
                    lastmsg = xdata[xdata.length - 1].id;
                    //$('.floatingImg').fadeOut();
                    //$('.floatingImg').fadeIn();
                    $('.floatingImg').css('border', '3px solid #a0ff00');
                    setTimeout(function() {
                        $('.floatingImg').css('border', '3px solid #fff');
                    }, 2000);
                }
                xhtml = '';
                if (xdata == 'FILE_NOT_FOUND') {
                    $("#chat-messages").html("<label>No chat history</label>");
                } else {
                    for (var i = 0; i < xdata.length; i++) {
                        //console.log(xdata[i]._from)
                        //console.log(xdata[i].text)
                        if (xdata[i].text) {
                            let xdate = new Date(xdata[i].createdTime - new Date().getTimezoneOffset());
                            if (xdata[i].type == 26) {
                                console.log("not right")
                                xhtml += '<div class="message"><img src="' + xdata[i].picturePath + '"><div class="bubble">' + xdata[i].text + '<span class="spanleft">' + xdate.getHours() + ':' + xdate.getMinutes() + '</span><div class="nameleft">' + xdata[i].displayName + '</div></div></div>';
                            } else if (xdata[i].type == 25) {
                                console.log("right")
                                xhtml += '<div class="message right"><img src="images/winter-soldier.jpg"><div class="bubble">' + xdata[i].text + '<span class="spanright">' + xdate.getHours() + ':' + xdate.getMinutes() + '</span></div></div>';
                            }
                        } else if (xdata[i].type == 10) {
                            xhtml += '<label>You changed group settings</label>';
                        } else if (xdata[i].type == 11) {
                            xhtml += '<label>' + replaceNaN(xdata[i].personName) + ' changed group settings</label>';
                        } else if (xdata[i].type == 12) {
                            xhtml += '<label>You invite ' + replaceNaN(xdata[i].personName) + ' to the group</label>';
                        } else if (xdata[i].type == 13) {
                            xhtml += '<label>' + replaceNaN(xdata[i].personName2) + ' invite ' + replaceNaN(xdata[i].personName) + ' to the group</label>';
                        } else if (xdata[i].type == 14) {
                            xhtml += '<label>You left the group</label>';
                        } else if (xdata[i].type == 15) {
                            xhtml += '<label>' + replaceNaN(xdata[i].personName) + ' left the group</label>';
                        } else if (xdata[i].type == 16) {
                            xhtml += '<label>You joined the group</label>';
                        } else if (xdata[i].type == 17) {
                            xhtml += '<label>' + replaceNaN(xdata[i].personName) + ' joined the group</label>';
                        } else if (xdata[i].type == 19) {
                            xhtml += '<label>' + replaceNaN(xdata[i].personName2) + ' removed ' + replaceNaN(xdata[i].personName) + ' from the group</label>';
                        } else if (xdata[i].type == 18) {
                            xhtml += '<label>You kicked from the group</label>';
                        }
                    }
                    $("#chat-messages").html(xhtml);
                    //$(".message").not(".right").find("img").attr("src", $(clone).attr("src"));
                    $(".message.right").find("img").attr("src", xmypic);
                    //$('#chat-messages').animate({ scrollTop: $('#chat-messages').height()+100000000000000 }, 1000);					
                }
            });
        }
    }, 10000);

    $("#searchfield").focus(function() {
        if ($(this).val() == "Search contacts...") {
            //$(".friend").html("");
            $(this).val("");
        }
    });
    $("#searchfield").focusout(function() {
        if ($(this).val() == "") {
            $(this).val("Search contacts...");
        }
    });
    $("#searchfield").keyup(function() {
        let matched, rex;
        let matchstring = $(this).val(); //console.log(matchstring);
        if (typeof matchstring === 'undefined' || !matchstring) {
            for (var i = 0; i < contacts.length; i++) {
                if (typeof contacts[i] !== 'undefined' && contacts[i]) {
                    $("#friends").prepend('<div class="friend">' + contacts[i] + '</div>');
                    clickRegist();
                }
                //console.log(contacts[i]);
            }
        } else {
            for (var i = 0; i < contacts.length; i++) {
                rex = new RegExp(matchstring, "gi");
                if (contacts[i].match(rex) != null) {
                    $(".friend").first().html(contacts[i]);
                    $(".friend").slice(1).remove();
                }
            }
        }
    });

    $("#sendmessage input").focus(function() {
        if ($(this).val() == "Send message...") {
            $(this).val("");
            /*$('#send').mousedown(function(event) {
            switch (event.which) {
             case 3:
                 //alert('Left Mouse button pressed.');
                 break;
             case 2:
                 //alert('Middle Mouse button pressed.');
                 break;
             case 1:
			 console.info($("#sendmessage input").val());
			  if($("#sendmessage input").val() == '' && typeof $("#sendmessage input").val() != 'undefined' && $("#sendmessage input").val() != null && $("#sendmessage input").val() && $("#sendmessage input").val() != "Send message..."){
			     $.get( "/sendMessage/"+mid+"/"+$("#sendmessage input").val() ).done(function( data ) {
				//console.log(data);
				     if(data.error == null){
					     lastmsg = data.result.id;
				         $('#chat-messages').append('<div class="message right"><img src="'+xmypic+'"><div class="bubble">'+$("#sendmessage input").val()+'<span class="spanright">'+new Date().getHours()+':'+new Date().getMinutes()+'</span></div></div>');
				     }
			     });
		         $('#chat-messages').animate({ scrollTop: $('#chat-messages').height()+1000000 }, 1000);
				 $("#sendmessage input").val("Send message...");
			     //$("#sendmessage input").blur();
			  }
                 break;
             default:
                 console.info('You have a strange Mouse!');
            }
            });*/
        }
    });
    $("#sendmessage input").focusout(function() {
        if ($(this).val() == "") {
            $(this).val("Send message...");

        }
    });
    $("#sendmessage input").keypress(function(e) {
        if (e.keyCode == 13 && $(this).val() != "") {
            msgtext = $(this).val();
            $.get("/sendMessage/" + mid + "/" + $(this).val()).done(function(data) {
                //console.log(data);
                if (data.error == null) {
                    lastmsg = data.result.id;
                    $('#chat-messages').append('<div class="message right"><img src="' + xmypic + '"><div class="bubble">' + msgtext + '<span class="spanright">' + new Date().getHours() + ':' + new Date().getMinutes() + '</span></div></div>');
                }
            });
            $('#chat-messages').animate({
                scrollTop: $('#chat-messages').height() + 1000000
            }, 1000);
            $(this).blur();
            $(this).val("Send message...");
        }
    });

    function clickRegist() {
        $(".friend").each(function() {
            $(this).click(function() {
                lastmsg = '';
                //$("#searchfield").blur();
                //$("#searchfield").val("Search contacts...");
                ismessaging = true;
                mid = $(this).find("input").val();
                console.log(mid);
                var childOffset = $(this).offset();
                var parentOffset = $(this).parent().parent().offset();
                var childTop = childOffset.top - parentOffset.top;
                clone = $(this).find('img').eq(0).clone();
                //console.log($(clone).attr("src"));
                var top = childTop + 12 + "px";

                $.get("/" + mid + ".json").done(function(xdata) {
                    lastmsg = xdata[xdata.length - 1].id;
                    xhtml = '';
                    if (xdata == 'FILE_NOT_FOUND') {
                        $("#chat-messages").html("<label>No chat history</label>");
                    } else {
                        for (var i = 0; i < xdata.length; i++) {
                            console.log(xdata[i]._from)
                            console.log(xdata[i].text)
                            if (xdata[i].text) {
                                let xdate = new Date(xdata[i].createdTime - new Date().getTimezoneOffset());
                                if (xdata[i].type == 26) {
                                    console.log("not right")
                                    xhtml += '<div class="message"><img src="' + xdata[i].picturePath + '"><div class="bubble">' + xdata[i].text + '<span class="spanleft">' + xdate.getHours() + ':' + xdate.getMinutes() + '</span><div class="nameleft">' + xdata[i].displayName + '</div></div></div>';
                                } else if (xdata[i].type == 25) {
                                    console.log("right")
                                    xhtml += '<div class="message right"><img src="images/winter-soldier.jpg"><div class="bubble">' + xdata[i].text + '<span class="spanright">' + xdate.getHours() + ':' + xdate.getMinutes() + '</span></div></div>';
                                }
                            } else if (xdata[i].type == 10) {
                                xhtml += '<label>You changed group settings</label>';
                            } else if (xdata[i].type == 11) {
                                xhtml += '<label>' + replaceNaN(xdata[i].personName) + ' changed group settings</label>';
                            } else if (xdata[i].type == 12) {
                                xhtml += '<label>You invite ' + replaceNaN(xdata[i].personName) + ' to the group</label>';
                            } else if (xdata[i].type == 13) {
                                xhtml += '<label>' + replaceNaN(xdata[i].personName2) + ' invite ' + replaceNaN(xdata[i].personName) + ' to the group</label>';
                            } else if (xdata[i].type == 14) {
                                xhtml += '<label>You left the group</label>';
                            } else if (xdata[i].type == 15) {
                                xhtml += '<label>' + replaceNaN(xdata[i].personName) + ' left the group</label>';
                            } else if (xdata[i].type == 16) {
                                xhtml += '<label>You joined the group</label>';
                            } else if (xdata[i].type == 17) {
                                xhtml += '<label>' + replaceNaN(xdata[i].personName) + ' joined the group</label>';
                            } else if (xdata[i].type == 19) {
                                xhtml += '<label>' + replaceNaN(xdata[i].personName2) + ' removed ' + replaceNaN(xdata[i].personName) + ' from the group</label>';
                            } else if (xdata[i].type == 18) {
                                xhtml += '<label>You kicked from the group</label>';
                            }
                        }
                        //console.info(xhtml)
                        $("#chat-messages").html(xhtml);
                        //$(".message").not(".right").find("img").attr("src", $(clone).attr("src"));
                        $(".message.right").find("img").attr("src", xmypic);
                        $('#chat-messages').animate({
                            scrollTop: $('#chat-messages').height() + 100000000000000
                        }, 1000);
                    }
                });

                $(clone).css({
                    'top': top
                }).addClass("floatingImg").appendTo("#chatbox");
                //$('#chatbox').append('<div id="container"><div class="dot"></div><div class="pulse"></div></div>')
                setTimeout(function() {
                    $("#profile p").addClass("animate");
                    $("#profile").addClass("animate");
                }, 100);
                setTimeout(function() {
                    $("#chat-messages").addClass("animate");
                    $('.cx, .cy').addClass('s1');
                    setTimeout(function() {
                        $('.cx, .cy').addClass('s2');
                    }, 100);
                    setTimeout(function() {
                        $('.cx, .cy').addClass('s3');
                    }, 200);
                }, 150);

                $('.floatingImg').animate({
                    'width': "68px",
                    'left': '108px',
                    'top': '20px'
                }, 200);

                name = $(this).find("p strong").html();
                email = $(this).find("p span").html();
                $("#profile p").html(name);
                $("#profile span").html('Members: ' + email);

                //$(".message").not(".right").find("img").attr("src", $(clone).attr("src"));									
                $('#friendslist').fadeOut();
                $('#chatview').fadeIn();


                $('#close').unbind("click").click(function() {
                    ismessaging = false;
                    $("#chat-messages, #profile, #profile p").removeClass("animate");
                    $('.cx, .cy').removeClass("s1 s2 s3");
                    $('.floatingImg').animate({
                        'width': "40px",
                        'top': top,
                        'left': '12px'
                    }, 200, function() {
                        $('.floatingImg').remove()
                    });

                    setTimeout(function() {
                        $('#chatview').fadeOut();
                        $('#friendslist').fadeIn();
                    }, 50);
                });
            });
        });
    }
    clickRegist();
});
