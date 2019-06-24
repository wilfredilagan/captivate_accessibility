//Headings, Title, Web Object Tabs and Links fix
//

var interfaceObj;
var eventEmitterObj;
window.addEventListener("moduleReadyEvent", function(evt){

//evt.Data carries the interface object.
//It is same as window.cpAPIInterface
interfaceObj = evt.Data;
eventEmitterObj = interfaceObj.getEventEmitter();
      initializeEventListeners();
});

function initializeEventListeners(){
    //check if window.cpAPIInterface is available
    if(interfaceObj){
    //check if window.cpAPIEventEmitter is available
        if(eventEmitterObj){
            //add a listener to CPAPI_SLIDEENTER event
            eventEmitterObj.addEventListener("CPAPI_SLIDEENTER",function(e){
                //code of stuff that need to be performed on event.
                 $('[id^="SkipToMainContent"]').css('opacity','0')
                $('[id^="SkipToMainContent"]').focus(function(){
                    $('[id^="SkipToMainContent"]').css('opacity','')
                    $('[id^="myFrame_Nav"],[id^="myFrame_nav"]').css('top','17px')

                });
                $('[id^="SkipToMainContent"]').blur(function(){
                    $('[id^="myFrame_Nav"],[id^="myFrame_nav"]').css('top','0px')
                    $('[id^="SkipToMainContent"]').css('opacity','0')
                });
                // Change all elements that start witshh the id of "Title_" to H1
                changeH1(0,5);
                //Change all elements that start with the id of "SubTitle_" to H2
                changeH2(0,5);
                //Removes title from being read twice
                removeTitle(0,5);

                // Run textbox fix
                fixTextBoxes(0,5);
                
                //Allows links to be activated and puts them in correct reading order for
                //screen readers
                oldLinkText = ['placeholderLinkText'];
                $('[role="link"]').each(function(){
                    checkAccstr(0,this);
                });
                //Getting Web Objects in Tab Order
                if ($('[id^="Widget"]').size()){
                    setTimeout(function(){
                        webTabRead(0,10);
                        widgetTabRead(0,10);
                }, 1000);
                }else{
                    webTabRead(0,5);
                }

                $('[id^="SkipToMainContent"]').keypress(function(e){
                    if (e.which === 13){
                        if ($('#heading1').length !== 0){
                            window.location.href = "#heading1";
                            $('#heading1').focus();
                        }else{
                            id = $('[id^="Nav_"]').next().attr('id');
                            window.location.href = "#"+ id
                            $('#' + id).focus();
                        }
                     }
                 });
            });

        }    
    }
}

// Change all elements that start with the id of "Title_" to H1
function changeH1(timestamp,n){
    if (n>=1){
        //checks to see if the Title has been rendered on the page, if not re-run function.  Only run 5 times.
        if (!$('[id^="Title"][id$="accStr"]').size()) {
                window.requestAnimationFrame (function(timestamp){
                    changeH1(timestamp,n-1)});
        }else{
                // if there are more than one "Title_" then make the second one h2
                if ($('[id^="Title"][id$="accStr"]').size() > 1){
                    i=0;
                    $('[id^="Title"][id$="accStr"]').each(function(){
                        var idEle = $(this).attr('id');
                        var inner = document.getElementById(idEle).children[0].innerHTML;
                        if (i === 0){
                            $('#'+idEle+' p').replaceWith(function(){
                                return '<h1 id="heading1">' + inner + '</h1>';
                            });
                        } else{
                            $('#'+idEle+' p').replaceWith(function(){
                                return '<h2>' + inner + '</h2>';
                            });
                        }
                        i=i+1;
                    });
                } else{
                //if there is only one "Title_" make it a h1
                    var ele = $('[id^="Title"][id$="accStr"]').attr('id');
                    var inner = document.getElementById(ele).children[0].innerHTML;
                    $('[id^="Title"][id$="accStr"] p').replaceWith(function(){
                        return '<h1 id="heading1">' + inner + '</h1>';
                    });
                    n=0;
                }
        }
    }
};


function changeH2(timestamp,n){
    if(n>=1){
        //checks to see if the Sub title has been rendered on the page, if not re-run function.  Only run 5 times.
        if (!$('[id^="SubTitle"][id$="accStr"]').size()) {
            window.requestAnimationFrame (function(timestamp){
                changeH2(timestamp,n-1);
            });
        }else{
            //iterate through each SubTitle and make them h2
            $('[id^="SubTitle"][id$="accStr"]').each(function(){
                var idEle = $(this).attr('id');
                var inner = document.getElementById(idEle).children[0].innerHTML;
                $(this).children().replaceWith(function(){
                    return '<h2>' + inner + '</h2>';
                })
            });
            n=0;
        };
    };
};    

function webTabRead(timestamp,n){
    if (n>=1){
        //Checks to see if the iframes have been rendered on the page, if not re-run function.  Only run 5 times.
        if (!$('[id^="myFrame"]').size()) {
            window.requestAnimationFrame (function(timestamp){
                webTabRead(timestamp,n-1);
            });
        }else{
            //Add a function to iframe to be loaded when frame is fully loaded
            if ($('[id^="myFrame"]').size()){
                $('[id^="myFrame"]').each(function(){
                    $(this).attr('onload', "onMyFrameLoad(this)");
                });
            }
            n=0
        };
    }
};

function widgetTabRead(timestamp,n){
    if (n>=1){
        //Checks to see if the iframes have been rendered on the page, if not re-run function.  Only run 5 times.
        if (!$('[id^="Widget"]').size()) {
            window.requestAnimationFrame (function(timestamp){
                webTabRead(timestamp,n-1);
            });
        }else{
            //Add a function to iframe to be loaded when frame is fully loaded
            $('.cp-widget').each(function(){
                $(this).children().children().attr('tabindex', '2500');
            });
            $('[id^="Widget"]').each(function(){
                $(this).attr('tabindex','-1');
            })
            n=0
        };
    }
};

function removeTitle(timestamp,n){
    if (n>=1){
        //checks to see if the slide titles have been rendered on the page, if not re-run function.  Only run 5 times.
        if (!$('[id^="Slide"][id$="accStr"]').size() || !$('[id^="Slide"][id$="accStr2"]').size()) {
            window.requestAnimationFrame (function(timestamp){
                removeTitle(timestamp,n-1);
            });
        }else{
        //removes duplicate titles
            $('[id^="Slide"][id$="accStr"]').remove();
            $('[id^="Slide"][id$="accStr2"]').remove();
            n=0
        }
        
    }
};

//Fix links
function checkAccstr(timestamp,ele){
    //check if the <p> element exists under the accessbility string section for this link.
    if ($(ele).parent().find('p').size() >0){
        linkId = $(ele).attr('id');
        var objStart = cp.model.data[linkId];
        var linkText = objStart.accstr;
        //find target for link
        var tempUrl = /'h.*',/.exec(objStart.oca);

        //get last <p> node in the accessibility section
        var textNode = $(ele).parent().find('p').last()[0];
        if (tempUrl !== null){
            //get URL to put in <a> link
            var url = tempUrl[0].substring(1, tempUrl[0].length-2);
        } 
        $(ele).attr('tabindex', '2500');
        //Remove opacity and background so that focus can be visible
        $(ele).css('opacity','');
        $(ele).css('background','');

        //remove the accessibility class on parent so that div link that is inserted can have visible focus
        $(textNode).parent().removeClass('cp-accessibility');
        var textIn = textNode.innerHTML;

        console.log(linkText);
        console.log(oldLinkText);
        for (var j = 0; j < oldLinkText.length; j++){
            if (linkText.indexOf(oldLinkText[j]) !== -1){
                var replaceATag = new RegExp('<a.*>' + oldLinkText[j] + '<\/a>', 'g');
                console.log(replaceATag);
                var newTextIn = textIn.replace(replaceATag, oldLinkText[j]);
                console.log(textIn);
                textNode.innerHTML = newTextIn;
                j= j+1;
            }else {
                j = j + 1;
            }
        }
        
        //split text node at the link text
        var textParts = extended_split(textNode.innerHTML, linkText, 2);
        //create the two <p> that surrounds the div link
        for (var i=0;i<textParts.length;i++){
            textParts[i] = '<p class="cp-accessibility">'+ textParts[i] + '</p>';
        };

         //create <a> link to be put into div link
         if (typeof url !== 'undefined' && textParts.length > 1){
            var newWrapper = document.createElement('a');
            newWrapper.setAttribute('href', url);
            newWrapper.setAttribute('tabindex', "-1");
            newWrapper.setAttribute('class', 'cp-accessibility');
            newWrapper.innerHTML = linkText;
            ele.appendChild(newWrapper);
            //ele.setAttribute('onclick',"cp.runJavascript(cp.openURL('"+ url+"'))");
            //find subsequent occurences of the link text in the text node and replace with <a> link
            var replaceSearch = new RegExp(linkText, "g");
            textParts[1] = textParts[1].replace(replaceSearch,newWrapper.outerHTML);
            $(ele).focus(function(){
                $(ele).keypress(function(e){
                    if (e.which === 13){
                        cp.runJavascript(cp.openURL(url));
                        $(this).unbind('keypress');
                    }
                });
            })
            $(textNode).parent().append(textParts[0]);
            $(textNode).parent().append(ele);
            $(textNode).parent().append(textParts[1]);
            $(textNode).remove();
            oldLinkId = linkId;
            oldLinkText = oldLinkText.concat([linkText]);
         }else if(typeof url == 'undefined' && textParts.length > 1){
            var newWrapper = document.createElement('a');
                
            //set url to # because it is an captivate action
            newWrapper.setAttribute('href', '#');
            
            //start captivate action when activated
            var actionScript = objStart.oca
            var replaceActionScript = actionScript.replace('cp.actionChoiceContinueMovie();', '');
            newWrapper.setAttribute("onclick","cp.runJavascript('" + replaceActionScript + "')");
            newWrapper.setAttribute('tabindex', "-1");
            newWrapper.setAttribute('class', 'cp-accessibility');
            newWrapper.innerHTML = linkText
            ele.appendChild(newWrapper);
            //ele.setAttribute("onclick","cp.runJavascript('" + objStart.oca + "')");

            //find subsequent occurences of the link text in the text node and replace with <a> link
            var replaceSearch = new RegExp(linkText, "g");
            textParts[1] = textParts[1].replace(replaceSearch,newWrapper.outerHTML);
            $(ele).focus(function(){
                $(ele).keypress(function(e){
                    if (e.which === 13){
                        var actionScript = objStart.oca
                        var replaceActionScript = actionScript.replace('cp.actionChoiceContinueMovie();', '');
                        cp.runJavascript(replaceActionScript);
                        $(this).unbind('keypress');
                    }
                });
            })
            $(textNode).parent().append(textParts[0]);
            $(textNode).parent().append(ele);
            $(textNode).parent().append(textParts[1]);
            $(textNode).remove();
            oldLinkId = linkId;
            oldLinkText = oldLinkText.concat([linkText]);
        } else{
            //if the link spans two lines in the paragraph, there will be two instances of the link side by side.
            //this makes sure that that duplicate link follows the original link
            lastCharLink = parseInt(/.$/.exec(linkId));
            lastCharLink = lastCharLink - 1

            oldLinkId = linkId.replace(/.$/, lastCharLink);
            $(ele).removeAttr("aria-label");
            $(ele).insertAfter('#'+ oldLinkId);
            $(ele).focus(function(){
                $(ele).keypress(function(e){
                    if (e.which === 13){
                        var linkId = $(this).attr('id');
                        var objStart = cp.model.data[linkId]
                        var tempUrl = /'h.*',/.exec(objStart.oca);
                        if (tempUrl !== null){
                            //get URL to put in <a> link
                            var url = tempUrl[0].substring(1, tempUrl[0].length-2);
                        }
                        if (typeof url == 'undefined'){
                            var actionScript = objStart.oca
                            var replaceActionScript = actionScript.replace('cp.actionChoiceContinueMovie();', '');
                            cp.runJavascript(replaceActionScript);
                            $(this).unbind('keypress');
                        }else{
                            cp.runJavascript(cp.openURL(url));
                            $(this).unbind('keypress');
                        }
                    }
                });
            })
        };
        //if enter is pressed on a link, it should activate the link
    } else {
        //if link does not exist, re-run function
        result = window.requestAnimationFrame (function(timestamp){
            checkAccstr(timestamp,ele);
        });
    }
    
}

//When Web Object is finished loading, run this function to put it into the tab order
function onMyFrameLoad(ele){
    var idEle = '#'+ $(ele).attr('id');
    //var youtubeFrame = $(idEle).contents().find('iframe');
    
    //types of actionable Web Objects in the templates
    var type = ['button','textarea','input','select','a','audio','video'];
    var inputType = 0;
    try{
        //check to see if the web object is actionable, if it is size() > 0
        for(i=0;i<type.length;i++){
            inputType = inputType + $(ele).contents().find(type[i]).size();
        };
        //if web object is actionable and is visible, then put it into the tab order
        if (inputType > 0){
            $(idEle).attr('tabindex','2500');
        } else if($(idEle).attr('src').indexOf('pagination') !== 1){
            $(idEle).attr('tabindex', '-1');
       }
    

    //Web Objects that are hosted in another domain will throw up a CORS error
    //These objects are put into the tab order if they are visible.
    }catch(err){
        $(idEle).attr('tabindex','2500');
    }
    $('p:contains("Trigger this button to go to the previous slide")').parents('div.cp-frameset').attr('tabindex','9000')
    $('p:contains("Trigger this button to go to the next slide")').parents('div.cp-frameset').attr('tabindex','9000')
    $('p:contains("Trigger this button to exit")').parents('div.cp-frameset').attr('tabindex','9000')
}

//splits text at the first occurence and creates an array with two pieces of text
function extended_split(str, separator, max) {
    var out = [], 
        index = 0,
        next;

    while (!max || out.length < max - 1 ) { 
        next = str.indexOf(separator, index);
        if (next === -1) {
            break;
        }
        out.push(str.substring(index, next));
        index = next + separator.length;
    }
    out.push(str.substring(index));
    return out;
};

function fixTextBoxes(timestamp,n){
    if (n>=1)
    {
        //Checks to see if the textboxes have been rendered on the page, if not re-run function.  Only run 5 times.
        if (!$('[id$="_inputField"]').size()) 
        {
            window.requestAnimationFrame (function(timestamp)
            {
                fixTextBoxes(timestamp,n-1);
            });
        }
        else
        {
        //textboxes have been rendered
            $("textarea[id$='_inputField']").each(function() {
                if ($(this).val() === '0') 
                {
                    $(this).val('');
                }
            });
            n=0
        }
        
    }
};