// @ts-check

// @ts-ignore
import { ref, db, set, push, onValue, remove } from '../admin/assets/js/firebase.js';
// import { sort } from "./catalog.js"

let snap;
// @ts-ignore
let bookFound = false;
onValue(ref(db, "/books"), (snapshot) => {
    snap = snapshot;
});


// @ts-ignore
$("#sendButton").on('click', () => {
    // @ts-ignore
    let name = $("#name").val();
    // @ts-ignore
    let address = $("#address").val();
    // @ts-ignore
    let email = $("#email").val();
    // @ts-ignore
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

// @ts-ignore
$("#joinBookBtn").on("click", () => {
    // @ts-ignore
    let name = $("#joinBookFullName").val();
    // @ts-ignore
    let email = $("#joinBookEmail").val();

    if(name != "" && email != "")
    {
        let joinPush = push(ref(db, "/joinedUsers"));
        set(joinPush, {
            fullName: name,
            email
        });
        // @ts-ignore
        $("#joinBookFullName").val("");
        // @ts-ignore
        $("#joinBookEmail").val("");
    }
});

let search = () =>
{
    bookFound = false;
    // @ts-ignore
    $("#searchSpinner").attr('src', "./assets/img/Spinner-1s-200px.gif");
    let books = snap.val();
    // @ts-ignore
    if($("#searchingFor").val() == "")
    {    
        // @ts-ignore
        $("#resultContainer").append($("<p class='mt-3'>Search field can't be empty.</p>"));

        return;
    }

    let bookIds = Object.entries(books);

    // @ts-ignore
    let searchedFor = $("#searchingFor").val();
    
    for(let book of bookIds)
    {
        if(book[1].name.toLowerCase() == searchedFor)
        {        
            // @ts-ignore
            $("#resultContainer").empty();  
            // @ts-ignore
            $("#resultContainer").append(setBookFromSearch( book[1].name, book[1].description, book[1].imageUrl, book[1].publishDate));

            // @ts-ignore
            $("#searchingFor").val("");
            return;
        }
    }
    
    // @ts-ignore
    $("#resultContainer").append($("<p class='mt-3' id='found'>Couldn't find the book you've searched for</p>"));
    return;
}

// @ts-ignore
$("#searchButton").on('click', search);


/**
 * For dynamic about page
 */

 onValue(ref(db, "/about"), (snapshot) =>
 {
     let data = snapshot.val();
     // @ts-ignore
     $("#header").text(data.header);
     // @ts-ignore
     $("#about").text(data.about);
     // @ts-ignore
     $("#bookImage").attr('src', data.url)
 });
 

let setBookFromSearch = (bookName, description, imageUrl, pubdate) => {

    // @ts-ignore
    let mainDiv = $("<div class='card mb-3 mt-3' style='max-width: 540px;'>");
    // @ts-ignore
    let secondaryDiv = $("<div class='row g-0'>");
    // @ts-ignore
    let imgDiv = $("<div class='col-md-4 d-flex'>");
    // @ts-ignore
    let img = $("<img src='" + imageUrl + "' class='img-fluid rounded-start' alt='Book Cover'>");

    // @ts-ignore
    let cardBodyContainer = $("<div class='col-md-8'>");
    // @ts-ignore
    let cardBody = $("<div class='card-body'>");
    // @ts-ignore
    let h5 = $("<h5 class='card-title'>" + bookName +"</h5>");
    // @ts-ignore
    let desc = $("<p class='card-text'>" + description + "</p>");
    // @ts-ignore
    let pubDate = $("<p class='card-text'><small class='text-muted'>Publish date: <strong>" + pubdate + "</strong></small></p>");

    let readMore = ("<button id='readMoreSearch' class='btn-primary'>Read More</button>")
    mainDiv.append(secondaryDiv);
    secondaryDiv.append(imgDiv, cardBodyContainer);
    imgDiv.append(img);
    cardBodyContainer.append(cardBody);
    cardBody.append(h5, desc, pubDate, readMore);

    return mainDiv;
}

/**
 * For dynamic home page
 */

let goToCatalog = (category) => {
    window.location.replace("./catalog.html");
    window.localStorage.setItem("sort", category);
}

onValue(ref(db, "/categories"), (snapshot) => {
    // @ts-ignore
    $("#catalog-home-list").empty();
    let data = snapshot.val();
    
    for(var type of Object.entries(data))
    {
        // @ts-ignore
        let div1 = $("<div class='col-md-4 mb-4'>");
        div1.attr('onclick', "goToCatalog('"+type[1].type+"')");
        // @ts-ignore
        let div2 = $("<div class='card shadow cursor-pointer py-3'></div>");
        // @ts-ignore
        let div3 = $("<div class='card-body'>");
        // @ts-ignore
        let h4 = $("<h4 class='card-title m-0 text-center h5 font-weight-bold'>" + type[1].type + "</h4>");

        div1.append(div2);
        div2.append(div3);
        div3.append(h4);

        // @ts-ignore
        $("#catalog-home-list").append(div1);
    }
});

onValue(ref(db, "/aboutHome"), (snapshot) => {
    // @ts-ignore
    $("#homeAbout").empty();
    let data = snapshot.val();
    for(var numbers of Object.entries(data))
    {
        // @ts-ignore
        let div1 = $("<div class='col-md-3 col-12' id='category'>");
        // @ts-ignore
        let div2 = $("<div class='d-flex align-items-center'>");
        // @ts-ignore
        let div3 = $("<div class='display-4 font-weight-bolder mr-4'>" + numbers[1] + "</div>");
        // @ts-ignore
        let div4 = $("<div class='h6'>" + numbers[0] + "</div>");

        div1.append(div2);
        div2.append(div3, div4);

        // @ts-ignore
        $("#homeAbout").append(div1);
    }
});

//@ts-ignore
window.goToCatalog = goToCatalog;

//@ts-ignore
window.sort = sort;

//@ts-ignore
// window.readMore = readMore;