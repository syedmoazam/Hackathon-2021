let logout = () => {
    localStorage.clear();
    location.replace("index.html")
}
let userName = document.getElementById("userName");
let customerSignIn = localStorage.getItem("customerSignIn")
customerSignIn = JSON.parse(customerSignIn)
userName.innerHTML = customerSignIn.name;