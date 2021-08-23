let order = (uID, itemID) => {
    let customer = localStorage.getItem("customerSignIn");
    customer = JSON.parse(customer);
    firebase.database().ref(`Order/${uID}/${customer.uid}/${itemID}/Pending`).once("value")
    .then((data)=>
    {
        firebase.database().ref(`Order/${uID}/${customer.uid}/${itemID}/Pending`).set({
            inCart:data.val().inCart+1
        }).then((succ)=>{
            console.log("succ=>",succ)
        }).catch((err)=>{
            console.log("err=>",err)
        })
    }).catch((err)=>{
        console.log("err=>",err)
        firebase.database().ref(`Order/${uID}/${customer.uid}/${itemID}/Pending`).set({
            inCart:1
        }).then((succ)=>{
            console.log("succ=>",succ)
        }).catch((err)=>{
            console.log("err=>",err)
        })
    }) 
}

