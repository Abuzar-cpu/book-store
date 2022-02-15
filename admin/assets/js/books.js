import { ref, db, set, push, onValue, remove } from './firebase.js';

onValue(ref(db, "/books"), (snapshot) => {
    let data = snapshot.val();

    for (let book of Object.entries(data)) {
        $("#books").append(setBookFromSearch(book[1].name, book[1].description, book[1].imageUrl, book[1].publishDate, book[0]));
    }
});

let setBookFromSearch = (bookName, description, imageUrl, pubdate, bookID) => {

    let mainDiv = $("<div class='card mb-3 mt-3' style='max-width: 540px;'>");
    let secondaryDiv = $("<div class='row g-0'>");
    let imgDiv = $("<div class='col-md-4 d-flex'>");
    let img = $("<img src='" + imageUrl + "' class='img-fluid rounded-start' alt='Book Cover'>");

    let cardBodyContainer = $("<div class='col-md-8'>");
    let cardBody = $("<div class='card-body'>");
    let h5 = $("<h5 class='card-title'>" + bookName + "</h5>");
    let desc = $("<p class='card-text'>" + description + "</p>");
    let pubDate = $("<p class='card-text'><small class='text-muted'>Publish date: <strong>" + pubdate + "</strong></small></p>");

    let readMore = $("<button data-id='" + bookID + "' onclick='deleteBook(this)' class='btn-primary'>Remove Book</button>")
    mainDiv.append(secondaryDiv);
    secondaryDiv.append(imgDiv, cardBodyContainer);
    imgDiv.append(img);
    cardBodyContainer.append(cardBody);
    cardBody.append(h5, desc, pubDate, readMore);

    return mainDiv;
}


function deleteBook(element) {
    if (confirm("Book will be deleted permanently. Continue?")) {
        remove(ref(db, "/books/" + $(element).data("id")));
    }
}

window.deleteBook = deleteBook;