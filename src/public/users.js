function llamarApi(){
    fetch('api/users/64237858258ee2308f298c14',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    }).then(result=>{
        if(result.status===200){
            result.json()
            .then(json=>{
            });
        } else if (result.status === 401){
            alert("Login invalido revisa tus credenciales!");
        }
    })
};
llamarApi();