import { ref, db, set, push, onValue, remove } from '../admin/assets/js/firebase.js';

let bookFound = false;
let snap;

onValue(ref(db, "/books"), (snapshot) => {
    snap = snapshot;
});

let search = () =>
{
    bookFound = false;
    $("#searchSpinner").attr('src', "./assets/img/Spinner-1s-200px.gif");
    let books = snap.val();
    if($("#searchingFor").val() == "")
    {    
        $("#resultContainer").append($("<p class='mt-3'>Search field can't be empty.</p>"));

        return;
    }

    let bookIds = Object.entries(books);

    let searchedFor = $("#searchingFor").val();
    
    for(let book of bookIds)
    {
        if(book[1].name.toLowerCase() == searchedFor)
        {        
            $("#resultContainer").empty();  
            $("#resultContainer").append(setBookFromSearch( book[1].name, book[1].description, book[1].imageUrl, book[1].publishDate));

            $("#searchingFor").val("");
            return;
        }
    }
    
    $("#resultContainer").append($("<p class='mt-3' id='found'>Couldn't find the book you've searched for</p>"));
    return;
}

$("#searchButton").on('click', search);



let setBookFromSearch = (bookName, description, imageUrl, pubdate) => {

    let mainDiv = $("<div class='card mb-3 mt-3' style='max-width: 540px;'>");
    let secondaryDiv = $("<div class='row g-0'>");
    let imgDiv = $("<div class='col-md-4 d-flex'>");
    let img = $("<img src='" + imageUrl + "' class='img-fluid rounded-start' alt='Book Cover'>");

    let cardBodyContainer = $("<div class='col-md-8'>");
    let cardBody = $("<div class='card-body'>");
    let h5 = $("<h5 class='card-title'>" + bookName +"</h5>");
    let desc = $("<p class='card-text'>" + description + "</p>");
    let pubDate = $("<p class='card-text'><small class='text-muted'>Publish date: <strong>" + pubdate + "</strong></small></p>");

    let readMore = ("<button id='readMoreSearch' class='btn-primary'>Read More</button>")
    mainDiv.append(secondaryDiv);
    secondaryDiv.append(imgDiv, cardBodyContainer);
    imgDiv.append(img);
    cardBodyContainer.append(cardBody);
    cardBody.append(h5, desc, pubDate, readMore);

    return mainDiv;
}