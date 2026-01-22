const input = document.getElementById("cardInput");
const card = document.querySelector(".card");
const notification = document.querySelector(".notification");

input.addEventListener("input", (e) => {
    let raw = e.target.value.replace(/\D/g, "");

    let formatted = raw.match(/.{1,4}/g);
    e.target.value = formatted ? formatted.join(" ") : "";

    if (raw.length === 16) {
        isValid();
    }else{
        card.classList.remove("valid")
        card.classList.remove("unvalid")

    }
});




function isValid(){
    let sum = 0;
    const rawValue = input.value.replace(/\s/g, ""); 
    let shouldDouble = false
    for(let i = rawValue.length - 1; i>= 0; i--){
        let digit = Number(rawValue[i])
        
        if(shouldDouble){
            digit *= 2;
            if(digit > 9) digit -=9
        }
        sum+=digit;
        shouldDouble = !shouldDouble
    }
    const isValid = sum % 10 === 0;
    if(isValid){
        card.classList.add("valid")
        card.classList.remove("unvalid")
        showNotification("Card is valid ✅", "#00cc00"); 

    }else{
        card.classList.add("unvalid")
        card.classList.remove("valid")
        showNotification("Card isn't valid ❌", "#ff0000"); 

    }
}

function showNotification(text, color){
    notification.textContent = text;
    notification.style.backgroundColor = color;
    notification.classList.remove("show"); 
    void notification.offsetWidth; 
    notification.classList.add("show");
}

