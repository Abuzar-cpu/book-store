// @ts-check


import { ref, db, set, push, onValue, remove } from '../admin/assets/js/firebase.js';
// import { sort } from "./catalog.js"

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
        $(".alert-danger").hide();
        $(".alert-success").show();
        let userPush = push(ref(db, "/contact"));
        set(userPush, {
            address,
            email,
            fullName: name,
            phone: number
        });

        $("#name").val("");
        $("#address").val("");
        $("#email").val("");
        $("#number").val("");
    }

    else{
        $(".alert-danger").show();
        $(".alert-success").hide();
    }
});

$("#joinBookBtn").on("click", () => {
    let name = $("#joinBookFullName").val();
    
    let email = $("#joinBookEmail").val();

    if(name != "" && email != "")
    {
        $(".alert-danger").hide();
        $(".alert-success").show();
        let joinPush = push(ref(db, "/joinedUsers"));
        set(joinPush, {
            fullName: name,
            email
        });
        
        $("#joinBookFullName").val("");
        
        $("#joinBookEmail").val("");
    }

    else{
        $(".alert-success").hide();
        $(".alert-danger").show();
    }
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

/**
 * For dynamic home page
 */

let goToCatalog = (category) => {
    window.location.replace("./catalog.html");
    window.localStorage.setItem("sort", category);
}

onValue(ref(db, "/categories"), (snapshot) => {
    
    $("#catalog-home-list").empty();
    let data = snapshot.val();
    
    for(var type of Object.entries(data))
    {
        
        let div1 = $("<div class='col-md-4 mb-4'>");
        div1.attr('onclick', "goToCatalog('"+type[1].type+"')");
        
        let div2 = $("<div class='card shadow cursor-pointer py-3'></div>");
        
        let div3 = $("<div class='card-body'>");
        
        let h4 = $("<h4 class='card-title m-0 text-center h5 font-weight-bold'>" + type[1].type + "</h4>");

        div1.append(div2);
        div2.append(div3);
        div3.append(h4);

        
        $("#catalog-home-list").append(div1);
    }
});

onValue(ref(db, "/aboutHome"), (snapshot) => {
    
    $("#homeAbout").empty();
    let data = snapshot.val();
    for(var numbers of Object.entries(data))
    {
        
        let div1 = $("<div class='col-md-3 col-12' id='category'>");
        
        let div2 = $("<div class='d-flex align-items-center'>");
        
        let div3 = $("<div class='display-4 font-weight-bolder mr-4'>" + numbers[1] + "</div>");
        
        let div4 = $("<div class='h6'>" + numbers[0] + "</div>");

        div1.append(div2);
        div2.append(div3, div4);

        
        $("#homeAbout").append(div1);
    }
});

let unsetStatus = () => {
    $(".alert-success").hide();
    $(".alert-danger").hide();
}

//@ts-ignore
window.goToCatalog = goToCatalog;

//@ts-ignore
window.sort = sort;

//@ts-ignore
// window.readMore = readMore;