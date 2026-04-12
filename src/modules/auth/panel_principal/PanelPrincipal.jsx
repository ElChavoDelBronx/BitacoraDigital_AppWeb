import { useState, useEffect } from "react";
import BaseCard from "../../../components/cards/BaseCard";
import EstadisticasCard from "./components/EstadisticasCard";
import ProgresoProyectoItem from "./components/ProgresoProyectoItem";
import ValidacionesCard from "./components/ValidacionesCard";
import PrincipalController from "./principal.controller";

const MOCK_STATS = [
    { title: "Estudiantes Activos", value: "48", iconId: "users", color: "bg-primary" },
    { title: "Proyectos en Curso", value: "12", iconId: "projects", color: "bg-danger" },
    { title: "Tareas Completadas", value: "156", iconId: "tasks", color: "bg-success" },
];

const MOCK_ADVANCE = [
    { title: "Sistema de inventarios", progress: 75 },
    { title: "App Móvil Clínica", progress: 45 },
    { title: "Portal Web Escolar", progress: 90 },
    { title: "API REST Municipal", progress: 30 }
];

const MOCK_ACTIVITIES = [
    { name: "Pedro Ramirez", title: "Módulo de autenticación", date: "04/02/2026", type: "Archivo" },
    { name: "Sofia Torres", title: "Base de datos relacional", date: "04/02/2026", type: "Texto" },
    { name: "Diego Flores", title: "Interfaz de usuario", date: "04/02/2026", type: "Archivo" }
];

export default function PanelPrincipal() {
    
    const [stats, setStats] = useState(MOCK_STATS);
    const [advance, setAdvance] = useState(MOCK_ADVANCE);
    const [activities, setActivities] = useState(MOCK_ACTIVITIES);
    const [cargando, setCargando] = useState(false);

    //if(cargando) return <div className="p-5 text-center">Cargando panel...</div>;

    const cargarDashboard = async () => {
        setCargando(true);
        
        try {
            const { data } = await PrincipalController.getInfo();
            
            if (data && data.stats) {
                console.log("Datos recibidos:", data);
                
                setStats(prevStats => prevStats.map(stat => {
                    if (stat.iconId === "users") {
                        return { ...stat, value: data.stats.activeStudents || 0 };
                    }
                    if (stat.iconId === "projects") {
                        return { ...stat, value: data.stats.activeProjects || 0 };
                    }
                    if (stat.iconId === "tasks") {
                        return { ...stat, value: data.stats.completedTasks || 0 };
                    }
                    return stat;
                }));

                // Si el backend también trae las actividades recientes, podrías mapearlas aquí:
                if (data.recentEvidences) {
                    setActivities(data.recentEvidences); // Descomenta si quieres usar datos reales
                }
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarDashboard();
    }, []);

    return (
        <div className="container-fluid p-0">
            <div className="row g-4 mb-5">
                {stats.map((stat, index) => (
                    <EstadisticasCard key={index} item={stat} />
                ))}
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <BaseCard style={{ height: '100%', minHeight: '620px' }}>
                        <div className="p-4 mb-4 d-flex justify-content-between align-items-center">
                            <p className="h4 fw-bold mb-0">Avance por Proyecto</p>
                            <span className="text-primary" style={{ cursor: 'pointer' }}>Ver todos &gt;</span>
                        </div>
                        <div className="p-4">
                            {advance.map((item, index) => (
                                <ProgresoProyectoItem key={index} item={item} />
                            ))}
                        </div>
                    </BaseCard>
                </div>

                <div className="col-12 col-lg-4">
                    <BaseCard style={{ height: '100%', minHeight: '620px' }}>
                        <div className="p-4">
                            <p className="h4 fw-bold mb-4">Validaciones Pendientes</p>
                            
                            <div className="d-flex flex-column">
                                {activities.map((activity, index) => (
                                    <ValidacionesCard key={index} item={activity} />
                                ))}
                            </div>

                            <button className="btn btn-outline-secondary text-primary w-100 mt-3 fw-bold">
                                Ver todas las validaciones
                            </button>
                        </div>
                    </BaseCard>
                </div>
            </div>
        </div>
    );
}