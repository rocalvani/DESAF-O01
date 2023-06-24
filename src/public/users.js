function llamarApi(){
    fetch('api/users/:id',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'authorization': `Bearer ${localStorage.getItem('authToken')}`
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