/*
Daniel Leach
Intro to Internet Computing
COP 3813

Project 4 ToDo List with JQuery
*/

var submit = new Audio();
submit.src = "./sounds/submit.wav";

$(function(){
    var originalValue;

    /* this part of code i modified to work with my program
    https://www.taniarascia.com/how-to-use-local-storage-with-javascript/
    */
    let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')):[];
    localStorage.setItem('items', JSON.stringify(itemsArray));
    const data = JSON.parse(localStorage.getItem('items'));

    /*******************************************************************************/
    
   //submit button for new list items
   // checks for empty list submissions
    $('.button').click(function(){    
        if ($.trim($('#inputBox').val()) == '') {   
        }else{
            submit.play();
            var text = $('#inputBox').val();
            $('ul').append('<li id="'+text+'">'  
            +"<input type='checkbox' class='checkboxes name= 'checkbox-name'>"
            +'<label>'
            + text 
            +'</label>'
            +'<button class = "btn cross" >'
            +'<i class = "fas fa-times">'+'</i>'
            +'</button>'
            +'</li>');
            itemsArray.push(text);
            localStorage.setItem('items', JSON.stringify(itemsArray));
            $('input:text').val('');
        }
    });

    //submit new list item from enter key
    // calls previous function to complete submition
    $('#inputBox').keyup(function (event) {
        if (event.which === 13) {
            $('.button').click();
        }
    });

    // loads list from local storage
    data.forEach(item=>{
        $('ul').append('<li id="list">'
            + "<input type='checkbox' class='checkboxes' >"
            + '<label>'
            + item
            + '</label>'
            + '<button class = "btn cross" >'
            + '<i class = "fas fa-times">' + '</i>'
            + '</button>'
            + '</li>');
        $('input:text').val('');
    })
        
    //hides sleceted items from checkboxes
    $('ul').on('click','.cross', function () {
        $(this).closest('li').fadeOut('slow');
        var textID = $(this).closest('li').attr('id')
        for (var i = 0; i < itemsArray.length; i++) {
            if (itemsArray[i] === textID) {
                itemsArray.splice(i, 1);
                localStorage.setItem('items', JSON.stringify(itemsArray));
            }
        }
    });

    // edit list function, this also changes the element in local storage
    // on reload will show apropriate list items 
    // also checks for empty submitions
     $('ul').on('dblclick','label',function(){
        originalValue = $(this).text();
        $(this).text("");
        $("<input type = 'text' class='edit' id='edit'>").appendTo(this).focus();
        $("ul").on('focusout', 'label > input', function () {
            var newtext = $('#edit').val();
            if ($.trim($('#edit').val()) == ''){
                newtext = originalValue;
            }
            $(this).parent().text($(this).val() || originalValue);    
            for (var i = 0; i < itemsArray.length; i++) {
                if (itemsArray[i] === originalValue) 
                        itemsArray.splice(i, 1,newtext);
                        localStorage.setItem('items', JSON.stringify(itemsArray));
                }
             $(this).remove(); 
         });
        $('.edit').keyup(function(event){
            if(event.which === 13){
                $(this).parent().text($(this).val() || originalValue);
                $(this).remove();
            }  
        })    
    });

    // undo button for checked and delete buttons
    $('#undo').click( function(){
        $('.checkedOff').show();
        $('.cross').closest('li').show();
    });

    // adds and removes a class from the list, also removes from local storage
    // when page reloads it will only show active list items
    $('ul').on('click','.checkboxes',function () {
        if($(this).is(':checked')){    
            $(this).closest('li').addClass('checkedOff');
            var textID = $(this).closest('li').attr('id');
            for(var i = 0; i < itemsArray.length; i++){
                if(itemsArray[i] === textID){
                    itemsArray.splice(i,1);
                    localStorage.setItem('items', JSON.stringify(itemsArray));
                }
            }
        }else{
            $(this).closest('li').removeClass('checkedOff');  
        }
    });

    // Clear crossed-out items when the Clear Checked Items button is pushed!
        $('#clearChecked').click(function () {
            $('.checkedOff').hide();
        });
    
    //removes entire list from local storage
    // checks with user if they are sure they want to 
    $('#clear').on('click', function() {
       var getConfirm = confirm('Are you sure you want to clear the list.\n*You will not be able to undo after*');
        if(getConfirm == true){
            if (localStorage) {
                localStorage.clear();
            }
            $('ul').children().remove();
            itemsArray = [];
            return true;
        } 
    });
});

