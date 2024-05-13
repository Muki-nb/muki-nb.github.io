let game = buildGame();

function start(){
    game.start();
    refresh();
}

let over = false;
function useCard(card){
    if(over) return;
    game.useCard(card);
    let result = game.isOver();
    if(result.code){
        refresh();
        over = true;
        alert(result.content + `\n你的文明存活了 ${game.lifetime} 轮！你行动了 ${game.activetime} 次！`);
    }else{
        game.afterUseCard();
        refresh();
    }
}

function refresh(){
    handRefresh();
    attributeRefresh();
    otherRefresh();
}

let attributeElement = [];
let attributes = document.getElementById("attributes");
function attributeRefresh(){
    while(attributeElement.length > 0){
        attributeElement[0].remove();
        attributeElement.shift();
    }
    for(let attribute in game.attribute){
        let element = createAttributeElement(attribute, game.attribute[attribute]);
        attributeElement.push(element);
        attributes.appendChild(element);
    }
}

let handElement = [];
let hand = document.getElementById("hand");
function handRefresh(){
    while(handElement.length > 0){
        handElement[0].remove();
        handElement.shift();
    }
    for(let card of game.hand){
        let element = createCardElement(card);
        element.addEventListener("click", function(e){
            useCard(card);
        });
        handElement.push(element);
        hand.appendChild(element);
    }
}

function otherRefresh(){

}

function createAttributeElement(name, content){
    if(content <= 1) content = "<span style = 'color:#ff4a4a'>" + content + "</span>";

    let element = document.createElement("div");
    element.classList.add("attribute");
    let nameElement = document.createElement("div");
    nameElement.classList.add("name");
    nameElement.innerHTML = name;
    let contentElement = document.createElement("div");
    contentElement.classList.add("content");
    contentElement.innerHTML = content;
    element.appendChild(nameElement);
    element.appendChild(contentElement);
    return element;
}

function createCardElement(card){
    let element = document.createElement("div");
    element.classList.add("card");
    let title = document.createElement("div");
    title.classList.add("title");
    title.innerHTML = card.name;
    let description = document.createElement("div");
    description.classList.add("description");
    description.innerHTML = card.description;
    element.appendChild(title);
    element.appendChild(description);
    return element;
}