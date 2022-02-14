import { ref, db, set, push, onValue, remove } from '../admin/assets/js/firebase.js';

let bookFound = false;
let snap;

onValue(ref(db, "/books"), (snapshot) => {
    snap = snapshot;
});

let search = () =>
{
    $("#resultContainer").empty();
    bookFound = false;
    $("#searchSpinner").show();
    $("#searchSpinner").attr('src', "./assets/img/Spinner-1s-200px.gif");
    let books = snap.val();
    // if($("#searchingFor").val() == "")
    // {    
    //     $("#resultContainer").append($("<p class='mt-3'>Search field can't be empty.</p>"));
    //     $("#searchSpinner").hide();
    //     return;
    // }

    let bookIds = Object.entries(books);

    let searchedFor = $("#searchingFor").val();
    
    for(let book of bookIds)
    {
        if(book[1].name.toLowerCase() == searchedFor)
        {        
            $("#resultContainer").empty();
            $("#resultContainer").empty();  
            $("#resultContainer").append(setBookFromSearch( book[1].name, book[1].description, book[1].imageUrl, book[1].publishDate, book[0]));

            $("#searchingFor").val("");
            return;
        }
    }
    
    $("#resultContainer").append($("<p class='mt-3' id='found'>Couldn't find the book you've searched for</p>"));
    return;
}

$("#searchButton").on('click', search);



let setBookFromSearch = (bookName, description, imageUrl, pubdate, ID) => {

    let mainDiv = $("<div class='card mb-3 mt-3' style='max-width: 540px;'>");
    let secondaryDiv = $("<div class='row g-0'>");
    let imgDiv = $("<div class='col-md-4 d-flex'>");
    let img = $("<img src='" + imageUrl + "' class='img-fluid rounded-start' alt='Book Cover'>");

    let cardBodyContainer = $("<div class='col-md-8'>");
    let cardBody = $("<div class='card-body'>");
    let h5 = $("<h5 class='card-title'>" + bookName +"</h5>");
    let desc = $("<p class='card-text'>" + description + "</p>");
    let pubDate = $("<p class='card-text'><small class='text-muted'>Publish date: <strong>" + pubdate + "</strong></small></p>");

    let readMore = ('<button data-id="'+ID+'" onclick="ReadMore(this)" class="btn-primary">Read More</button>')
    mainDiv.append(secondaryDiv);
    secondaryDiv.append(imgDiv, cardBodyContainer);
    imgDiv.append(img);
    cardBodyContainer.append(cardBody);
    cardBody.append(h5, desc, pubDate, readMore);
    return mainDiv;
}

function ReadMore(element){
    $("#read-more-main").empty();
    let ID = $(element).data("id");
    $("#main").hide();
    $(".col-md-4").hide();

    onValue(ref(db, "/books/" + ID), (snapshot) => {
        let book = snapshot.val();
        let bookHTML = '<div class="col-6 p-3" ><button class="back-btn btn-primary"> <i class="fa fa-caret-left" aria-hidden="true"></i> Back </button><span class="year">'+book.publishDate+'</span> <h2>'+book.name+' </h2> <h4>'+book.author+'</h4> <p>'+book.description+'</p>  </div><div class="col-5 "> <img src="'+book.imageUrl+'" class="img-fluid shadow rounded" alt=""> </div> ';
        $("#read-more-main").append($(bookHTML));
        ReadMoreQuit();
    })

    $(".read-more-page").show();
}
function ReadMoreQuit(){

    $("#read-more-main .back-btn").on("click", function () {
            $(".col-md-4").css("display", "block");
            $("#main").css("display", "block");
            $(".read-more-page").css("display", "none");
    });
}

//@ts-ignore
window.ReadMore = ReadMore;

//@ts-ignore
window.ReadMoreQuit = ReadMoreQuit;