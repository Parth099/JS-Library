//book object
var id = localStorage.length;
var shiftflag = 0;
var undo = [];
var sideBar = 1;
const daLibrary = []

//book defi and methods
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

//DOM methods
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

    let gearImg = document.createElement('img');
    gearImg.classList.toggle("model-img");
    gearImg.classList.toggle("model");
    gearImg.setAttribute("src", 'img/settings.png');
    gearImg.setAttribute('data-id', `${B.id}`)
    gearImg.setAttribute("data-modal-target", "#modal")
    gearImg.addEventListener('click', displayModel);
    main.appendChild(gearImg)


    
    return main
}

function pushBook(B){
    updateStats()
    let grid = getLocationToPush(B.isRead); //returns location to push book {css - grid}
    let bookCard = createBookCard(B);//creates a DOM object based on B.keys
    grid.appendChild(bookCard);
}

function showBooks(){
    for(bk of daLibrary){
        pushBook(bk)
    }
}

function _updateStats(id, v){
    document.getElementById(id).textContent = v;
}

function updateStats(){
    let t = daLibrary.length;
    let read = daLibrary.filter( (b) => b.isRead)
    _updateStats("tbooks-input", t)
    _updateStats("rbooks-input", read.length)
    _updateStats("ubooks-input", t - read.length)
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
        localStorage.removeItem(id)
    }
    updateStats()
    shiftflag = 0;
}

function shiftBook(e){
    updateStats()
    let id = e.explicitOriginalTarget.parentElement.getAttribute("data-id");
    let copy = makeBookCopy(getBookById(id));
    copy.isRead = !copy.isRead;
    localStorage.setItem(copy.id, JSON.stringify(copy))
    //copy is made

    shiftflag = 1;
    delBook(e)
    //removed from old section

    daLibrary.push(copy);
    pushBook(copy);
    
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
    localStorage.setItem(x.id, JSON.stringify(x))
    updateStats()
}
//events end


function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
function isValidLSkey(str){
    return /^B[\d]+$/.test(str)
}

function ValidateBookForm(){
    let formInfo = document.querySelector(".form-info")
    const formBookName = document.getElementById("bk-ttl").value;
    const formBookAuth = document.getElementById("bk-auth").value;
    const formBookPages = document.getElementById("n-pgn").value;
    const formIsRead = document.getElementById("yes").checked //logical optimization 

    if(!isBlank(formBookName) && !isBlank(formBookAuth) && !isBlank(formBookPages)){
        let b = new book(formBookName, formBookAuth, formBookPages, formIsRead)
        daLibrary.push(b)
        pushToLS(b)
        pushBook(b) //adds book to queue
        formInfo.style.display = 'none';
    }
    else{
        formInfo.style.display = 'block';
        formInfo.textContent = "The Form was not filled out properly\ntry Again"
    }
}
function pushToLS(b){
    localStorage.setItem(b.id, JSON.stringify(b))
}
function ValidateModelForm(id){
    let mTitle = document.querySelector(`#modal-bk-ttl`).value;
    let mAuth  = document.querySelector(`#modal-bk-auth`).value;
    let mPages = document.querySelector(`#modal-n-pgn`).value;
    const bookLoc = findBookById(id)

    if(!isBlank(mTitle) && !isBlank(mAuth) && !isBlank(mPages)){
        daLibrary[bookLoc].title = mTitle;
        daLibrary[bookLoc].author = mAuth;
        daLibrary[bookLoc].pages = mPages;
        refreshBook(id, daLibrary[bookLoc]);
        return true;
    }
    return false;
}
function refreshBook(id, B){
    pushToLS(B);
    const card = document.querySelector(`div.book-card[data-id="${id}"]`)
    let infoNodes = card.querySelectorAll(".book-info")

    infoNodes[0].textContent = B.title;
    infoNodes[1].textContent = B.author;
    infoNodes[2].textContent = B.pages;

}

//model setter & getter
function setElementContentById(id, content){ //void
    document.querySelector(`#${id}`).value = content;
}
function getElementContentById(id){
    return document.querySelector(`#${id}`).value;
}


var closeModalButtons;
var overlay;

function displayModel(e){
    const bookId = e.originalTarget.getAttribute("data-id");
    let book = getBookById(bookId)
    var model = document.querySelector(e.target.dataset.modalTarget)
    if(model == null){
        //console.log("failure to display")
        return
    }

    //if modal is valid
    setElementContentById("modal-bk-ttl", book.title);
    setElementContentById("modal-bk-auth", book.author);
    setElementContentById("modal-n-pgn", book.pages);

    model.classList.add('active')
    overlay.classList.add('active')

    model.setAttribute("data-isViewing", bookId)
}

function closeModel(e){
    let model = e.target.closest(".modal")
    if(model == null){
        //console.log("failure to close")
        return
    }
    model.classList.remove('active')
    overlay.classList.remove('active')
}

function localStorageInit(){
    for(bk of daLibrary){
        localStorage.setItem(`${bk.id}`, JSON.stringify(bk))

    }
}

function getLocalStorage(){
    if(localStorage.length > 0){
        Object.keys(localStorage).forEach(function(key){
            if(isValidLSkey(key)){
                daLibrary.push(JSON.parse(localStorage.getItem(key)))
            }
         });
        daLibrary.reverse(); //json read makes array out of place
    }
    else{
        daLibrary.push(new book("Dinosaurs Before Dark", "Mary Pope Osborne ", 82 , true))
        daLibrary.push(new book("The Knight at Dawn", "Mary Pope Osborne", 	80 , false))
        localStorageInit();
    }
}
function openNav() {
    document.querySelector(".side-menu").style.width = "400px"
    document.querySelector(".book-display").style.marginLeft = "400px";
  }
  
function closeNav() {
    document.querySelector(".side-menu").style.width = "0px"
    document.querySelector(".book-display").style.marginLeft = "25px";
}
function navHandler(){
    if(sideBar){
        closeNav()
        sideBar = 0;
    }
    else{
        openNav()
        sideBar = 1;
    }
}

function main(){
    updateStats()
    let undoDeleteLink = document.getElementById("undo")
    undoDeleteLink.addEventListener("click", undoDelete)

    getLocalStorage()
    showBooks()

    openModalButtons = document.querySelectorAll("[data-modal-target]")
    closeModalButtons = document.querySelectorAll("[data-close-btn]")
    overlay = document.getElementById('overlay')

    /*
    openModalButtons.forEach(btn => {
        btn.addEventListener('click', displayModel);
    })
    */
    
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', closeModel)
    })
    
    overlay.addEventListener("click", () => {
        const toClose = document.querySelectorAll(".modal.active")
        toClose.forEach(btn => {
            btn.classList.remove("active")
        })
        overlay.classList.remove('active')
    })

    let modelSubmit = document.querySelector("#submit-model-info");
    modelSubmit.addEventListener('click', function(e){
        let id = document.querySelector("#modal").getAttribute("data-isviewing");
        const isValid = ValidateModelForm(id);

        if(isValid){
            let m = document.getElementById("modal")
            m.classList.remove("active")
            overlay.classList.remove('active')
        }

    })

    let slider = document.querySelector(".slider-img")
    slider.addEventListener('click', function(e){
        e.target.classList.toggle("faceing-right")
    })

    openNav() //landing page --> nav: open


}

//if __name__ == "__main__":
main()





