// @ts-check

import { ref, db, set, push, onValue, remove } from '../admin/assets/js/firebase.js';

let snap;
let bookFound = false;
onValue(ref(db, "/books"), (snapshot) => {
    snap = snapshot;
});


$("#sendButton").on('click', () => {
    let name = $("#name").val();
    let address = $("#address").val();
    let email = $("#email").val();
    let number = $("#number").val();
    
    if(name != "" && address != "" && email != "" && number != "")
    {
        let userPush = push(ref(db, "/contact"));
        set(userPush, {
            address,
            email,
            fullName: name,
            phone: number
        });
    }

    else{
        alert("Please fill the form correctly")
    }
});

$("#joinBookBtn").on("click", () => {
    let name = $("#joinBookFullName").val();
    let email = $("#joinBookEmail").val();

    if(name != "" && email != "")
    {
        let joinPush = push(ref(db, "/joinedUsers"));
        set(joinPush, {
            fullName: name,
            email
        });
        $("#joinBookFullName").val("");
        $("#joinBookEmail").val("");
    }
});
let search = () =>
{
    bookFound = false;
    $("#resultContainer").empty();
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
            $("#resultContainer").append(setBookFromSearch( book[1].name, book[1].description, book[1].imageUrl, book[1].publishDate));

            $("#searchingFor").val("");
            return;
        }
    }
    
    $("#resultContainer").append($("<p class='mt-3' id='found'>Couldn't find the book you've searched for</p>"));
    return;
}

$("#searchButton").on('click', search);


/**
 * For dynamic about page
 */

 onValue(ref(db, "/about"), (snapshot) => 
 {
     let data = snapshot.val();
     $("#header").text(data.header);
     $("#about").text(data.about);
     $("#bookImage").attr('src', data.url)
 });
 
let setBookFromSearch = (bookName, description, imageUrl, pubdate) => {
    // <div class="card mb-3" style="max-width: 540px;">
    //     <div class="row g-0">
    //       <div class="col-md-4">
    //         <img src="..." class="img-fluid rounded-start" alt="...">
    //       </div>
    //       <div class="col-md-8">
    //         <div class="card-body">
    //           <h5 class="card-title">Card title</h5>
    //           <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    //           <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    //         </div>
    //       </div>
    //     </div>
    // </div>

    let mainDiv = $("<div class='card mb-3 mt-3' style='max-width: 540px;'>");
    let secondaryDiv = $("<div class='row g-0'>");
    let imgDiv = $("<div class='col-md-4 d-flex'>");
    let img = $("<img src='" + imageUrl + "' class='img-fluid rounded-start' alt='Book Cover'>");

    let cardBodyContainer = $("<div class='col-md-8'>");
    let cardBody = $("<div class='card-body'>");
    let h5 = $("<h5 class='card-title'>" + bookName +"</h5>");
    let desc = $("<p class='card-text'>" + description + "</p>");
    let pubDate = $("<p class='card-text'><small class='text-muted'>Publish date: <strong>" + pubdate + "</strong></small></p>");

    mainDiv.append(secondaryDiv);
    secondaryDiv.append(imgDiv, cardBodyContainer);
    imgDiv.append(img);
    cardBodyContainer.append(cardBody);
    cardBody.append(h5, desc, pubDate);

    return mainDiv;
}