//book object
var id = 0;
function book(title, author, pages, isRead){
    this.title = title;
    this.author = author
    this.pages = pages;
    this.isRead = isRead
    this.id = id++; //RMDBS !!!
}


//6/24/21

const daLibrary = [
    new book("Sample Book 1", "Good Question", 12, true),
    new book("Sample Book 1", "Good Question", 14, false),
]

function getLocationToPush(isRead){
    if(isRead){
        return document.querySelector("#read");
    }
    return document.querySelector("#not-read");
}

function createBookCardNode(cardInfo, bookInfo){
    let div = document.createElement('div');

    let p = document.createElement('p');
    p.classList.toggle("card-info");
    p.textContent = cardInfo;

    let span = document.createElement('span');
    span.classList.toggle("book-info");
    span.textContent = bookInfo;

    div.appendChild(p);
    div.appendChild(span);

    return div
}

function createBookCard(B){
    let main = document.createElement("div");
    main.classList.toggle("book-card");

    let title = createBookCardNode("Book Title:", B.title)
    let author = createBookCardNode("Author:", B.author)
    let pages = createBookCardNode("# Of Pages: ", B.pages)

    main.appendChild(title)
    main.appendChild(author)
    main.appendChild(pages)

    let delKeyCont = document.createElement('div') //creates the delete image
    delKeyCont.classList.toggle("card-img-cont")

    let delKey = document.createElement('img')
    delKey.classList.toggle("card-img")
    delKey.setAttribute("src", "img/trash.png")

    delKeyCont.appendChild(delKey) 
    main.appendChild(delKeyCont)
    return main
}

function pushBook(B){
    let grid = getLocationToPush(B.isRead) //returns location to push book {css - grid}
    let bookCard = createBookCard(B) //creates a DOM object based on B.keys
    grid.appendChild(bookCard)
}

function showBooks(){
    for(bk of daLibrary){
        pushBook(bk)
    }
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function ValidateBookForm(){
    let formInfo = document.querySelector(".form-info")
    const formBookName = document.getElementById("bk-ttl").value;
    const formBookAuth = document.getElementById("bk-auth").value;
    const formBookPages = document.getElementById("n-pgn").value;
    const formIsRead = document.getElementById("yes").checked //logical optimization 

    if(!isBlank(formBookName) && !isBlank(formBookAuth) && !isBlank(formBookPages)){
        let b = new book(formBookName, formBookAuth, formBookPages, formIsRead)
        pushBook(b) //adds book to queue
        formInfo.setAttribute("display", 'none')
    }
    else{
        formInfo.setAttribute("display", 'relative')
        formInfo.textContent = "The Form was not filled out properly\ntry Again"
    }
}

