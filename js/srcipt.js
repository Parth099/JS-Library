//book object
var id = 0;
var shiftflag = 0;
var undo = [];
function book(title, author, pages, isRead){
    this.title = title;
    this.author = author
    this.pages = pages;
    this.isRead = isRead
    this.id = `B${id++}`; //RMDBS !!!
}

function makeBookCopy(b){
    let x = new book(b.title, b.author, b.pages, b.isRead);
    x.id = b.id;
    return x;
}

const daLibrary = [
    new book("Divergent", "Veronica Roth", 487 , true),
    new book("Insurgent ", "Veronica Roth", 525 , false),
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
function findBookById(id){
    let idx = 0;
    for(let i = 0; i < daLibrary.length; i++){
        if(id == daLibrary[i].id){
            idx = i;
            break;
        }
    }
    return idx;
}
function getBookById(id){
    return daLibrary[findBookById(id)];
}
function delBookById(id){
    let idx = findBookById(id);
    daLibrary.splice(delIdx, 1);
}

//events!
function delBook(e){
    //frontend 
    let id = e.target.getAttribute("data-id")
    let card = document.querySelector(`div.book-card[data-id='${id}']`)
    card.remove();

    //array reflection
    let delIdx = findBookById(id)

    let u = daLibrary.splice(delIdx, 1)[0]
    if(!shiftflag){
        undo.push(u);
    }
    shiftflag = 0;
}

function shiftBook(e){
    let id = e.explicitOriginalTarget.parentElement.getAttribute("data-id");
    let copy = makeBookCopy(getBookById(id));
    copy.isRead = !copy.isRead;
    //copy is made

    shiftflag = 1;
    delBook(e)

    //removed from old section

    pushBook(copy);
    daLibrary.push(copy);
    //added onto display & memory
}

function undoDelete(e){
    if(!undo.length || shiftflag){
        shiftflag = 0;
        return
    }
    let x = undo.splice(undo.length - 1, 1)[0]
    pushBook(x)
    daLibrary.push(x);
}
//events end
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

    delKey.setAttribute('data-id', `${B.id}`)
    main.setAttribute('data-id', `${B.id}`)
    //events
    delKey.addEventListener("click", delBook)

    let moveBook = document.createElement('img');
    moveBook.classList.toggle("shiftBook");
    let moveBookStatus = (B.isRead) ? "down": "up"
    let srcPath = `img/${(B.isRead) ? "down": "up"}.png`;
    moveBook.setAttribute("src", srcPath);
    main.appendChild(moveBook);
    moveBook.addEventListener("click", shiftBook);
    moveBook.setAttribute('data-id', `${B.id}`)
    return main
}

function pushBook(B){
    let grid = getLocationToPush(B.isRead); //returns location to push book {css - grid}
    let bookCard = createBookCard(B);//creates a DOM object based on B.keys
    grid.appendChild(bookCard);
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
        daLibrary.push(b)
        formInfo.style.display = 'none';
    }
    else{
        formInfo.style.display = 'block';
        formInfo.textContent = "The Form was not filled out properly\ntry Again"
    }
}

function main(){
    let undoDeleteLink = document.getElementById("undo")
    undoDeleteLink.addEventListener("click", undoDelete)

    showBooks()
}

main()
//FIX ID --> DATA-id