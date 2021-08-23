let category = document.getElementById("itemCategory");
let options = JSON.parse(localStorage.getItem("Category"));
console.log(options)
    for(let op in options){
        category.innerHTML+= `
            <option value="${op}">${op}</option>
        `
    }
let res = JSON.parse(localStorage.getItem("SignedInRes"));
let itemsAdd = () => {
    let name = document.getElementById("itemName").value;
    let price = document.getElementById("itemPrice").value;
    let image = document.getElementById("itemPic").files[0];
    let imgName = image.name;
    let imgLink="";
    let categoryOption = category.options[category.selectedIndex].value
    let delivery = document.getElementById("deliveryType");
    let deliveryOption = delivery.options[delivery.selectedIndex].value
    firebase.storage().ref("images").child(imgName).put(image).then((succ)=>{
        console.log("success=>",succ)
        firebase.storage().ref("images").child(imgName).getDownloadURL().then(url =>{
            console.log(url)
            firebase.database().ref(`Items/${res.uid}`).push({
                name,
                price,
                url,
                categoryOption,
                deliveryOption
            }).then(succ=>{
                console.log("success=>",succ)
                location.replace("../Dashboard/restaurantDashboard.html")
            })
            .catch(err=>{
                console.log("err=>",err)
                
            })
        }).catch(err=>{
            console.log(err);
        })
    }).catch((err)=>{
        console.log("err=>",err);
    })
    
    
}
