document.getElementById("orders").style.display="none";
let p=1;
let customerOrders = () => {
    let orderMode = document.getElementById("dashboardBread");
    let status = orderMode.options[orderMode.selectedIndex].value;
    let customerSignIn = localStorage.getItem("customerSignIn");
    customerSignIn = JSON.parse(customerSignIn);
    let customerUID = customerSignIn.uid;
    let i = 0;
    document.getElementById("customerData").innerHTML="";
    firebase.database().ref("Order").on("value", (data) => {
        let restaurants = data.val();
        for (let restaurant in restaurants) {
            for (let customer in restaurants[restaurant]) {
                console.log(customer)
                if(customer==customerUID){
                    document.getElementById("orders").style.display="flex";
                    for (let items in restaurants[restaurant][customer]) {
                        if(status == "Pending" && restaurants[restaurant][customer][items].hasOwnProperty('Pending')){
                            i++;
                            // console.log(restaurants[restaurant][customer][items].Pending)
                            // console.log(restaurant)
                            document.getElementById("customerData").innerHTML+=`
                            <tr>
                            <td>${i}</td>
                            <td><strong id="${restaurant}${i}">'${getRestaurantName(restaurant,i)}'</strong>
                            </td>
                            <td>
                            <strong id="${items}">${getItemName(restaurant,items,restaurants[restaurant][customer][items].Pending.inCart,i)}</strong>
                            </td>
                            <td id="price${items}"></td>
                            <td >${restaurants[restaurant][customer][items].Pending.inCart}</td>
                            <td>Pending</td>
                            <td id="${i}"></td>
                            </tr>
                            `
                        }
                        else if(status == "Accepted" && restaurants[restaurant][customer][items].hasOwnProperty('Accepted')){
                            i++;
                            // console.log(restaurants[restaurant][customer][items].Pending)
                            // console.log(restaurant)
                            document.getElementById("customerData").innerHTML+=`
                            <tr>
                            <td>${i}</td>
                            <td><strong id="${restaurant}${i}">'${getRestaurantName(restaurant,i)}'</strong>
                            </td>
                            <td>
                            <strong id="${items}">${getItemName(restaurant,items,restaurants[restaurant][customer][items].Accepted.inCart,i)}</strong>
                            </td>
                            <td id="price${items}"></td>
                            <td >${restaurants[restaurant][customer][items].Accepted.inCart}</td>
                            <td>Pending</td>
                            <td id="${i}"></td>
                            </tr>
                            `
                        }
                        else if(status == "Rejected" && restaurants[restaurant][customer][items].hasOwnProperty('Rejected')){
                            i++;
                            // console.log(restaurants[restaurant][customer][items].Pending)
                            // console.log(restaurant)
                            document.getElementById("customerData").innerHTML+=`
                            <tr>
                            <td>${i}</td>
                            <td><strong id="${restaurant}${i}">'${getRestaurantName(restaurant,i)}'</strong>
                            </td>
                            <td>
                            <strong id="${items}">${getItemName(restaurant,items,restaurants[restaurant][customer][items].Rejected.inCart,i)}</strong>
                            </td>
                            <td id="price${items}"></td>
                            <td >${restaurants[restaurant][customer][items].Rejected.inCart}</td>
                            <td>Pending</td>
                            <td id="${i}"></td>
                            </tr>
                            `
                        }
                        else if(status == "Delivered" && restaurants[restaurant][customer][items].hasOwnProperty('Delivered')){
                            i++;
                            // console.log(restaurants[restaurant][customer][items].Pending)
                            // console.log(restaurant)
                            document.getElementById("customerData").innerHTML+=`
                            <tr>
                            <td>${i}</td>
                            <td><strong id="${restaurant}${i}">'${getRestaurantName(restaurant,i)}'</strong>
                            </td>
                            <td>
                            <strong id="${items}">${getItemName(restaurant,items,restaurants[restaurant][customer][items].Delivered.inCart,i)}</strong>
                            </td>
                            <td id="price${items}"></td>
                            <td >${restaurants[restaurant][customer][items].Delivered.inCart}</td>
                            <td>Pending</td>
                            <td id="${i}"></td>
                            </tr>
                            `
                        }
                    }
                }
            }
        }
    })  
}

let getRestaurantName = (uid,i) =>{
    let name="";
    firebase.database().ref(`Restaurant/${uid}`).once("value").then((data)=>{
        name = data.val().name;
        console.log(name)
        document.getElementById(uid+i).innerHTML=name;
    })
    .catch((err)=>{
        console.log("err=>",err)
    })
}

let getItemName = (uid,itemID,inCart,no) => {
    let name="";
    firebase.database().ref(`Items/${uid}/${itemID}`).once("value").then((data)=>{
        name = data.val().name;
        console.log(name)
        document.getElementById(itemID).innerHTML=name;
        document.getElementById(`price${itemID}`).innerHTML=data.val().price;
        totalAmount(data.val().price,inCart,no);
    })
    .catch((err)=>{
        console.log("err=>",err)
    })
}

let totalAmount = (price,inCart,no) => {
    document.getElementById(no).innerHTML= price*inCart
}   