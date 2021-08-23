let logout = () => {
    localStorage.clear();
    location.replace("restaurantSignIn.html")
}

let userName = document.getElementById("userName");
let SignedInRes = localStorage.getItem("SignedInRes")
SignedInRes = JSON.parse(SignedInRes)
userName.innerHTML = SignedInRes.name;