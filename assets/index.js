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
    $("#found").html("");
    let books = snap.val();
    if($("#searchingFor").val() == "")
    {    
        $("#found").append($("<p>Search field can't be empty.</p>"));

        return;
    }

    let bookIds = Object.entries(books);

    let searchedFor = $("#searchingFor").val();
    
    for(let book of bookIds)
    {
        if(book[1].name.toLowerCase() == searchedFor)
        {
            let author = $("<p>");
            let description = $("<p>");
            let name = $("<p>");
            let something = $("<p>");
            let pubDate = $("<p>");
            
            name.text("Name: " + book[1].name);
            description.text("description: " + book[1].description);
            author.text("Author: " + book[1].author);
            something.text("Something: " + book[1].something);
            pubDate.text("Publish date: " + book[1].publishDate);

            $("#found").append(name, author, something, description, pubDate, $("<hr>"));

            $("#searchingFor").val("");
            bookFound = true;
        }
    }

    if(!bookFound)
    {
        $("#found").text("Couldn't find the book you've searched for");
    }
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
 
/**
 * For dynamic home page
 */

onValue(ref(db, "/categories"), (snapshot) => {
    $("#catalog-home-list").empty();
    let data = snapshot.val();
    
    for(var type of Object.entries(data))
    {
        let div1 = $("<div class='col-md-4 mb-4'>");
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
        let div1 = $("<div class='col-3' id='category'>");
        let div2 = $("<div class='d-flex align-items-center'>");
        let div3 = $("<div class='display-4 font-weight-bolder mr-4'>" + numbers[1] + "</div>");
        let div4 = $("<div class='h6'>" + numbers[0] + "</div>");

        div1.append(div2);
        div2.append(div3, div4);

        $("#homeAbout").append(div1);
    }
});