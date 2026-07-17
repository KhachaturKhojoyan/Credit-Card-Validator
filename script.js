const input = document.getElementById("cardInput");
const card = document.querySelector(".card");
const notification = document.querySelector(".notification");

const cardTypeIcon = document.querySelector(".cardType");
const cardTypeName = document.querySelector(".card-name");

const skeletonImg = document.querySelector(".skeleton-img");
const skeletonText = document.querySelector(".skeleton-text");



showSkeleton();


input.addEventListener("input", (e) => {

    let raw = e.target.value.replace(/\D/g, "");

    let formatted = raw.match(/.{1,4}/g);
    e.target.value = formatted ? formatted.join(" ") : "";

    detectCardType(raw);


    if (raw.length >= 13 && raw.length <= 19) {
        isValid();
    } else {
        card.classList.remove("valid");
        card.classList.remove("unvalid");
    }

});


// Card validation (Luhn algorithm)
function isValid(){

    const rawValue = input.value.replace(/\s/g, "");

    let sum = 0;
    let shouldDouble = false;


    for(let i = rawValue.length - 1; i >= 0; i--){

        let digit = Number(rawValue[i]);

        if(shouldDouble){
            digit *= 2;

            if(digit > 9){
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }


    if(sum % 10 === 0){

        card.classList.add("valid");
        card.classList.remove("unvalid");

        showNotification(
            "Card is valid ✅",
            "#00cc00"
        );

    }else{

        card.classList.add("unvalid");
        card.classList.remove("valid");

        showNotification(
            "Card isn't valid ❌",
            "#ff0000"
        );
    }
}



// Detect card type
function detectCardType(number){

    if(!number){
        showSkeleton();
        return;
    }


    
    if(isArca(number)){

        setIcon("Arca");

    }else if(/^4/.test(number)){

        setIcon("Visa");

    }else if(/^(5[1-5]|2[2-7])/.test(number)){

        setIcon("MasterCard");

    }else if(/^3[47]/.test(number)){

        setIcon("American Express");

    }else if(/^(6011|65)/.test(number)){

        setIcon("Discover");

    }else{

        showSkeleton();
    }
}



function showCardType(type){

    skeletonImg.classList.add("hidden");
    skeletonText.classList.add("hidden");


    cardTypeIcon.classList.remove("hidden");
    cardTypeName.classList.remove("hidden");


    cardTypeIcon.src = `img/${type}.png`;
    cardTypeName.textContent = type;
}



// Show skeleton
function showSkeleton(){

    skeletonImg.classList.remove("hidden");
    skeletonText.classList.remove("hidden");


    cardTypeIcon.classList.add("hidden");
    cardTypeName.classList.add("hidden");
}



function setIcon(type){

    showCardType(type);

}



function isArca(number){

    const arcaBins = [
        "417729",
        "437420",
        "441254"
        // more ARCA BINs
    ];


    return arcaBins.some(bin =>
        number.startsWith(bin)
    );
}



function showNotification(text, color){

    notification.textContent = text;
    notification.style.backgroundColor = color;


    notification.classList.remove("show");

    void notification.offsetWidth;

    notification.classList.add("show");
}


