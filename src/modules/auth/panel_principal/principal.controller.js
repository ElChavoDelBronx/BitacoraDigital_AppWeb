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
PrincipalController.getInfo = async () =>
    await fetch(`${API_URL}/admin`, {
        method: "GET",
        headers: getHeaders()
    })
    .then(response => response.json())
    .then(result => (result))
    .catch(console.log())

export default PrincipalController