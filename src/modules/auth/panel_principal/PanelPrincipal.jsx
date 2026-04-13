import { useState, useEffect } from "react";
import BaseCard from "../../../components/cards/BaseCard";
import EstadisticasCard from "./components/EstadisticasCard";
import ProgresoProyectoItem from "./components/ProgresoProyectoItem";
import ValidacionesCard from "./components/ValidacionesCard";
import PrincipalController from "./principal.controller";
import { useNavigate } from "react-router-dom";

export default function PanelPrincipal() {

    const navigate = useNavigate();

    const [stats, setStats] = useState([]);
    const [activities, setActivities] = useState([]);
    const [advance, setAdvance] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const role = localStorage.getItem("role");
        const userId = localStorage.getItem("userId");

        const response = await PrincipalController.getInfo(role, userId);

        if (response && response.data) {
            const data = response.data;
            console.log("DATOS RECIBIDOS DEL BACKEND:", data);

            
            if (role === 'Administrador' || role === 'ADMIN') {
               
                setStats([
                    { 
                        title: "Estudiantes Activos", 
                        value: data.stats.activeStudents || 0, 
                        iconId: "users", 
                        color: "bg-primary" 
                    },
                    { 
                        title: "Proyectos en Curso", 
                        value: data.stats.activeProjects || 0, 
                        iconId: "projects", 
                        color: "bg-danger" 
                    },
                    { 
                        title: "Tareas Completadas", 
                        value: data.stats.completedTasks || 0, 
                        iconId: "tasks", 
                        color: "bg-success" 
                    },
                ]);
            } else if (role === 'Asesor' || role === 'ASESOR') {
                
                setStats([
                    { 
                        title: "Tareas Totales", 
                        value: data.stats.totalTasks || 0, 
                        iconId: "tasks", 
                        color: "bg-primary" 
                    },
                    { 
                        title: "En Progreso", 
                        value: data.stats.inProgressTasks || 0, 
                        iconId: "clock", 
                        color: "bg-warning" 
                    },
                    { 
                        title: "Horas Validadas", 
                        value: data.stats.validatedHours || 0, 
                        iconId: "circle-check", 
                        color: "bg-success" 
                    },
                ]);
            }

            
            const mappedEvidences = data.recentEvidences?.map(ev => ({
                id: ev.id,
                name: ev.studentName,
                title: ev.taskTitle,
                date: ev.uploadDate ? new Date(ev.uploadDate).toLocaleDateString() : "Sin fecha",
                type: "Evidencia"
            })) || [];
            
            setActivities(mappedEvidences);
            
           
            setAdvance(data.advance || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(() => {
            fetchData();
        }, 30000); 

        
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <div className="p-5 text-center">Cargando datos reales...</div>;

    return (
        <div className="container-fluid p-4">
            <div className="row g-4 mb-4">
                {stats.map((item, index) => (
                    <EstadisticasCard key={index} item={item} />
                ))}
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <BaseCard style={{ height: '100%', minHeight: '620px' }}>
                        <div className="p-4 d-flex justify-content-between align-items-center">
                            <p className="h4 fw-bold mb-0">Avance por Proyecto</p>
                            <span 
                                className="text-primary fw-medium" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate('/projects')} 
                            >
                                Ver todos &gt;
                            </span>
                        </div>
                        <div className="p-4">
                            {advance.slice(0, 4).map((item, index) => (
                                <div 
                                    key={index} 
                                    //onClick={() => navigate(`/projects/${proyecto.id}`)} // Ajusta a tu ruta real de proyectos
                                    //style={{ cursor: "pointer", transition: "transform 0.2s" }}
                                    className="proyecto-card-hover"
                                >
                                    <ProgresoProyectoItem item={item} />
                                </div>
                            ))}
                            
                            {advance.length === 0 && (
                                <p className="text-muted text-center mt-4">No hay proyectos activos.</p>
                            )}
                        </div>
                    </BaseCard>
                </div>

                <div className="col-12 col-lg-4">
                    <BaseCard style={{ height: '100%', minHeight: '620px' }}>
                        <div className="p-4">
                            <p className="h4 fw-bold mb-4">Actividad Reciente</p>
                            <div className="d-flex flex-column">
                                {activities.slice(0, 3).map((activity, index) => (
                                    <div 
                                        key={index} 
                                        //onClick={() => navigate(`/evidence/${activity.id}`)} // Ajusta a tu ruta real de evidencias
                                        //style={{ cursor: "pointer" }}
                                    >
                                        <ValidacionesCard item={activity} />
                                    </div>
                                ))}

                                {activities.length === 0 && (
                                    <p className="text-muted text-center mt-4">No hay actividad reciente.</p>
                                )}
                            </div>
                            <button 
                                    className="btn btn-outline-secondary text-primary w-100 mt-auto fw-bold rounded-pill"
                                    onClick={() => navigate('/evidence')} 
                                >
                                    Ver todas las validaciones
                                </button>
                        </div>
                    </BaseCard>
                </div>
            </div>
        </div>
    );
}