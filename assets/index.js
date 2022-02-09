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