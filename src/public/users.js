function llamarApi(){
    console.log("Llamando api users.");
    fetch('api/users/6481114555f43643bcb0e570',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    }).then(result=>{
        if(result.status===200){
            result.json()
            .then(json=>{
                console.log(json);
            });
        } else if (result.status === 401){
            console.log(result);
            alert("Login invalido revisa tus credenciales!");
        }
    })
};
llamarApi();