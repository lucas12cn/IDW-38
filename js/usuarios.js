document.addEventListener('DOMContentLoaded', async() => { 
    const tablaUsuariosBody = document.querySelector('#tablaUsuarios tbody')

    try {
        const response = await fetch('https://dummyjson.com/users');
        if(response.ok){
            const data = await response.json();
            const usuarios = data.users;

            usuarios.forEach(element => {  
                const fila = document.createElement('tr');
                fila.innerHTML = `
                <td style="vertical-align: middle;">${element.firstName}</td>
                <td style="vertical-align: middle;">${element.username}</td>
                <td style="vertical-align: middle;">${element.email}</td>
                <td style="vertical-align: middle;">${element.phone}</td>
                `;
                tablaUsuariosBody.appendChild(fila);
            });  
        }else{
            console.error(response.status);  
            throw Error("Error");
        }    
    }catch(error){
        console.error("error", error);
        alert("Error");  
    }
})