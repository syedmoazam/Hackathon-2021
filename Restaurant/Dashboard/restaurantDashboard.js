if (!localStorage.getItem("SignedInRes")) {
    location.replace("../restaurantSignIn.html");
}
else {
    let res = JSON.parse(localStorage.getItem("SignedInRes"));
    // console.log(res.uid);
    firebase.database().ref("Category/" + res.uid).on("value", (data) => {
        console.log(data.val())
        localStorage.setItem("Category", JSON.stringify(data.val()));
    })
}

let p = 1;
let resOrders = () => {
    let orderMode = document.getElementById("resdashboardBread");
    let status = orderMode.options[orderMode.selectedIndex].value;
    let SignedInRes = localStorage.getItem("SignedInRes");
    SignedInRes = JSON.parse(SignedInRes);
    let resUID = SignedInRes.uid;
    let i = 0;
    document.getElementById("resData").innerHTML = "";
    firebase.database().ref("Order").on("value", (data) => {
        let restaurants = data.val();
        for (let restaurant in restaurants) {
            if (resUID == restaurant) {


                for (let customer in restaurants[restaurant]) {
                    console.log(customer)
                    // if(customer==customerUID){
                    document.getElementById("resOrders").style.display = "flex";
                    for (let items in restaurants[restaurant][customer]) {
                        if (status == "Pending" && restaurants[restaurant][customer][items].hasOwnProperty('Pending')) {
                            i++;
                            document.getElementById("resData").innerHTML += `
                            <tr>
                            <td>${i}</td>
                            <td><strong id="${restaurant}${i}"></strong>
                            </td>
                            <td>
                            <strong id="${items}"></strong>
                            </td>
                            <td id="price${items}"></td>
                            <td >${restaurants[restaurant][customer][items].Pending.inCart}</td>
                            <td>Pending</td>
                            <td id="${i}"></td>
                            <th>
                                <button onclick="acceptOrder('${restaurant}','${customer}','${items}')" class="btn btn-success">Accept</button>
                            </th>
                            <th>
                                <button onclick="rejectOrder('${restaurant}','${customer}','${items}')" class="btn btn-danger">Rejected</button>
                            </th>
                            </tr>
                            `
                            getRestaurantName(restaurant, i);
                            getItemName(restaurant, items, restaurants[restaurant][customer][items].Pending.inCart, i)
                        }
                        else if (status == "Accepted" && restaurants[restaurant][customer][items].hasOwnProperty('Accepted')) {
                            i++;
                            document.getElementById("resData").innerHTML += `
                            <tr>
                            <td>${i}</td>
                            <td><strong id="${restaurant}${i}"></strong>
                            </td>
                            <td>
                            <strong id="${items}"></strong>
                            </td>
                            <td id="price${items}"></td>
                            <td >${restaurants[restaurant][customer][items].Accepted.inCart}</td>
                            <td>Pending</td>
                            <td id="${i}"></td>
                            <th>
                                <button onclick="deliverOrder('${restaurant}','${customer}','${items}')" class="btn btn-success">Marks as Delivered</button>
                            </th>
                            </tr>
                            `
                            getRestaurantName(restaurant, i);
                            getItemName(restaurant, items, restaurants[restaurant][customer][items].Accepted.inCart, i)

                        }
                        else if (status == "Delivered" && restaurants[restaurant][customer][items].hasOwnProperty('Delivered')) {
                            i++;
                            document.getElementById("resData").innerHTML += `
                            <tr>
                            <td>${i}</td>
                            <td><strong id="${restaurant}${i}"></strong>
                            </td>
                            <td>
                            <strong id="${items}"></strong>
                            </td>
                            <td id="price${items}"></td>
                            <td >${restaurants[restaurant][customer][items].Delivered.inCart}</td>
                            <td>Pending</td>
                            <td id="${i}"></td>
                            </tr>
                            `
                            getRestaurantName(restaurant, i);
                            getItemName(restaurant, items, restaurants[restaurant][customer][items].Delivered.inCart, i)

                        }
                        else if (status == "Rejected" && restaurants[restaurant][customer][items].hasOwnProperty('Rejected')) {
                            i++;
                            document.getElementById("resData").innerHTML += `
                            <tr>
                            <td>${i}</td>
                            <td><strong id="${restaurant}${i}"></strong>
                            </td>
                            <td>
                            <strong id="${items}"></strong>
                            </td>
                            <td id="price${items}"></td>
                            <td >${restaurants[restaurant][customer][items].Rejected.inCart}</td>
                            <td>Pending</td>
                            <td id="${i}"></td>
                            </tr>
                            `
                            getRestaurantName(restaurant, i);
                            getItemName(restaurant, items, restaurants[restaurant][customer][items].Rejected.inCart, i)

                        }
                    }
                }
            }
        }
    })
}

let getRestaurantName = (uid, i) => {
    let name = "";
    firebase.database().ref(`Restaurant/${uid}`).once("value").then((data) => {
        name = data.val().name;
        console.log(name)
        document.getElementById(uid + i).innerHTML = name;
    })
        .catch((err) => {
            console.log("err=>", err)
        })
}

let getItemName = (uid, itemID, inCart, no) => {
    let name = "";
    firebase.database().ref(`Items/${uid}/${itemID}`).once("value").then((data) => {
        name = data.val().name;
        console.log(name)
        document.getElementById(itemID).innerHTML = name;
        document.getElementById(`price${itemID}`).innerHTML = data.val().price;
        totalAmount(data.val().price, inCart, no);
    })
        .catch((err) => {
            console.log("err=>", err)
        })
}

let totalAmount = (price, inCart, no) => {
    document.getElementById(no).innerHTML = price * inCart
}


let acceptOrder = (resID, customerID, itemID) => {
    firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Pending/inCart`).once("value")
    .then((pExist)=>{
        // firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Accepted`).
        firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Accepted/inCart`).once("value")
        .then((aExist)=>{
            if(!aExist.val()){
                firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Accepted`).set({
                    inCart: pExist.val()
                })
            }
            else{
                firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Accepted`).set({
                    inCart:pExist.val()+aExist.val()
                })
            }
            firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Pending`).remove()
        })
        .catch((aErr)=>{
            console.log("err=>",aErr)
        })
    })
    .catch((pErr)=>{
        console.log("Pending",pErr) 
    })
    location.reload();
}

let deliverOrder = (resID, customerID, itemID) => {
    firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Accepted/inCart`).once("value")
    .then((pExist)=>{
        // firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Accepted`).
        firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Delivered/inCart`).once("value")
        .then((aExist)=>{
            if(!aExist.val()){
                firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Delivered`).set({
                    inCart: pExist.val()
                })
            }
            else{
                firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Delivered`).set({
                    inCart:pExist.val()+aExist.val()
                })
            }
            firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Accepted`).remove()
        })
        .catch((aErr)=>{
            console.log("err=>",aErr)
        })
    })
    .catch((pErr)=>{
        console.log("Pending",pErr) 
    })
    location.reload();
}

let rejectOrder = (resID, customerID, itemID) => {
    firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Pending/inCart`).once("value")
    .then((pExist)=>{
        // firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Accepted`).
        firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Rejected/inCart`).once("value")
        .then((aExist)=>{
            if(!aExist.val()){
                firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Rejected`).set({
                    inCart: pExist.val()
                })
            }
            else{
                firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Rejected`).set({
                    inCart:pExist.val()+aExist.val()
                })
            }
            firebase.database().ref(`Order/${resID}/${customerID}/${itemID}/Pending`).remove()
        })
        .catch((aErr)=>{
            console.log("err=>",aErr)
        })
    })
    .catch((pErr)=>{
        console.log("Pending",pErr) 
    })
    location.reload();
}
