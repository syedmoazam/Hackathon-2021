
let categoryAdd = () => {
    let res = JSON.parse(localStorage.getItem("SignedInRes"));
    // console.log(res.uid);
    firebase.database().ref("Category/"+res.uid).on("value", (data) => {
        console.log(data.val())
        localStorage.setItem("Category", JSON.stringify(data.val()));

    })
    let cat = localStorage.getItem("Category");
    cat = JSON.parse(cat);
    let categoryName = document.getElementById("categoryName").value;
    if (cat) {
        cat = {
            ...cat,
            [categoryName]: categoryName
        }
    }
    else {
        cat = {
            [categoryName]: categoryName
        }
    }
    localStorage.setItem("Category", JSON.stringify(cat));
    firebase.database().ref(`Category/${res.uid}`).set(cat)
        .then(() => {
            console.log("success")
            location.replace("../Dashboard/restaurantDashboard.html")
        })
        .catch((err) => {
            console.log(err.message)
        })
}