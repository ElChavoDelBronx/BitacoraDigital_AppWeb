const PrincipalController = {}
const API_URL = "http://localhost:8081/api/dashboards";
const getHeaders = () => {
    const token = localStorage.getItem("token");
    return{
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

PrincipalController.getInfo = async (role, userId) => {
    let endpoint = "";

    if (role === 'Administrador' || role === 'ADMIN') {
        endpoint = `${API_URL}/admin`;
    } else if (role === 'Asesor' || role === 'ASESOR') {
        endpoint = `${API_URL}/advisor/${userId}`;
    } else {
        console.warn("Rol no soportado para este dashboard web:", role);
        return { data: null }; 
    }
    
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error("Error en PrincipalController:", error);
        return null;
    }
}

export default PrincipalController