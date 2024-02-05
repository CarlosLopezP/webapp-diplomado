import React,{useState, useEffect} from "react";
import Navbar from "../navbar/navbar";
import "./Lista-danhos.css";
import desvanecido_2 from "/src/assets/images/desvanecido2.png";
import { useNavigate } from 'react-router-dom'
import { db, doc, onSnapshot, collection, query, addDoc, updateDoc, deleteDoc } from "../../lib/firebase";

const Listadanhos = () => {

    const navigate = useNavigate();
    const estados = [
        {id:'1', nombre : 'Aguascalientes'},
			{id:'2', nombre : 'Baja California'},
			{id:'3', nombre : 'Baja California Sur'},
			{id:'4', nombre : 'Campeche'},
			{id:'5', nombre : 'Chiapas'},
			{id:'6', nombre : 'Chihuahua'},
			{id:'7', nombre : 'Coahuila de Zaragoza'},
			{id:'8', nombre : 'Colima'},
			{id:'9', nombre : 'Ciudad de México'},
			{id:'10', nombre : 'Durango'},
			{id:'11', nombre : 'Guanajuato'},
			{id:'12', nombre : 'Guerrero'},
			{id:'13', nombre : 'Hidalgo'},
			{id:'14', nombre : 'Jalisco'},
			{id:'15', nombre : 'Mexico'},
			{id:'16', nombre : 'Michoacan de Ocampo'},
			{id:'17', nombre : 'Morelos'},
			{id:'18', nombre : 'Nayarit'},
			{id:'19', nombre : 'Nuevo Leon'},
			{id:'20', nombre : 'Oaxaca'},
			{id:'21', nombre : 'Puebla'},
			{id:'22', nombre : 'Queretaro de Arteaga'},
			{id:'23', nombre : 'Quintana Roo'},
			{id:'24', nombre : 'San Luis Potosi'},
			{id:'25', nombre : 'Sinaloa'},
			{id:'26', nombre : 'Sonora'},
			{id:'27', nombre : 'Tabasco'},
			{id:'28', nombre : 'Tamaulipas'},
			{id:'29', nombre : 'Tlaxcala'},
			{id:'30', nombre : 'Veracruz-Llave'},
			{id:'31', nombre : 'Yucatan'},
			{id:'32', nombre : 'Zacatecas'},
    ];

    const [modalAlta, setmodalAlta] = useState(false);
    const [danhosApi, setdanhosApi] = useState([]);
    const [nombreDano, setnombreDano] = useState("");
    const [fecha, setfecha] = useState("");
    const [puntos, setpuntos] = useState("");
    const [ubicacion, setUbicacion] = useState(estados[0].nombre);
    const [banderaVacioAlta, setbanderaVacioAlta] = useState(false);
    const [banderaIncorrectoAlta, setbanderaIncorrectoAlta] = useState(false);
    const [banderaUpdate,setbanderaUpdate] = useState(false);
    const [idDocumentoEdicion,setidDocumentoEdicion] = useState(0);
    const [modalEliminar,setmodalEliminar] = useState(false);
    const [idDocumentoEliminar,setidDocumentoEliminar] = useState(0);
    const [banderaIncorrectoEliminacion,setbanderaIncorrectoEliminacion] = useState(false);

    useEffect(()=>{
        const sesionActiva = localStorage.getItem("sesion");
        if(sesionActiva != null){
            verDanhos();  
        }else{
            localStorage.clear();
            navigate("/");
        }
    },[]);

    function abrirModal(){
        setbanderaUpdate(false);
        setmodalAlta(true);
    }

    function cerrarModal(){
        setmodalAlta(false);
    }

    const abrirModalEliminar = (event) => {
        setidDocumentoEliminar(event.target.id);
        setmodalEliminar(true);
    }

    function cerrarModalEliminar(){
        setmodalEliminar(false);
    }

    const navegaImagenes = (event) => {
        console.log(event.target.id);
        if(event.target.id != null){
            danhosApi.forEach(danho => {
                if(danho.idDoc === event.target.id){
                    localStorage.setItem("titulo",danho.titulo);
                    localStorage.setItem("num_secciones",danho.numero_secciones);
                    localStorage.setItem("id_danho",danho.id_danho);
                }
            });
            navigate(`/lista-imagenes/${event.target.id}`);
            
        }
    }

    const verDanhos = async () => {
        const consulta = query(collection(db,"danhos"));
        onSnapshot(consulta, (snapShot) => {
            const documentos = [];
            snapShot.forEach((documet) => {
                const danho = { ...documet.data(), idDoc: documet.id}
                documentos.push(danho); 
            });
            setdanhosApi(documentos);
        });
    };

    const altaDano = async (event) => {
        try {
            setbanderaVacioAlta(false);
            setbanderaIncorrectoAlta(false);
            event.preventDefault();
            if(nombreDano == "" || fecha == "" || puntos == "" || ubicacion == ""){
                setbanderaVacioAlta(true);
            }else{
                verDanhos();
                if (banderaUpdate) {
                    console.log("idDocumentoEdicion");
                    console.log(idDocumentoEdicion);
                    const docRef = doc(db, "danhos", idDocumentoEdicion);
                    await updateDoc(docRef, {
                        fecha: fecha,
                        numero_secciones: puntos,
                        titulo: nombreDano,
                        ubicacion: ubicacion
                    });
                    setmodalAlta(false);
                }else{
                    const doc = await addDoc(collection(db, "danhos"),{
                        id_danho: danhosApi.length + 1,
                        fecha: fecha,
                        numero_secciones: puntos,
                        titulo: nombreDano,
                        ubicacion: ubicacion                
                    });
                    if(doc != null){
                        setmodalAlta(false);
                    }else{
                        setbanderaIncorrectoAlta(true);
                    }
                }
            }
        }catch (error) {
            console.log(error);
            setbanderaIncorrectoAlta(true);
        }
    }

    const modNombreDano = (event) => {
        setbanderaVacioAlta(false);
        setbanderaIncorrectoAlta(false);
        setnombreDano(event.target.value);
    };
    const modFecha = (event) => {
        setbanderaVacioAlta(false);
        setbanderaIncorrectoAlta(false);
        setfecha(event.target.value);
    };
    const modPuntos = (event) => {
        setbanderaVacioAlta(false);
        setbanderaIncorrectoAlta(false);
        setpuntos(event.target.value);
    };
    const modUbicacion = (event) => {
        setbanderaVacioAlta(false);
        setbanderaIncorrectoAlta(false);
        setUbicacion(event.target.value);
    };

    const edicionDanho = (event) => {
        setidDocumentoEdicion(event.target.id);
        setbanderaVacioAlta(false);
        setbanderaIncorrectoAlta(false);
        event.preventDefault();
        danhosApi.forEach(danho => {
            if(danho.idDoc == event.target.id){
                setnombreDano(danho.titulo);
                setfecha(danho.fecha);
                setpuntos(danho.numero_secciones);
                setUbicacion(danho.ubicacion);
            }
        });
        setbanderaUpdate(true);
        setmodalAlta(true);
    }

    const eliminarCaso = () =>{
        try {
            if (idDocumentoEliminar != null) {
                var iddanho = 0;
                danhosApi.forEach(dano => {
                    if (dano.idDoc == idDocumentoEliminar) {
                        iddanho = dano.id_danho;
                    }
                });
                if(iddanho > 0){
                    const consulta = query(collection(db,"galeria"));
                    onSnapshot(consulta, async (snapShot) => {
                        var imagenes = [];
                        snapShot.forEach((documet) => {
                            const danho = { ...documet.data(), idDoc: documet.id}
                            imagenes.push(danho); 
                        });
                        var imagenesFiltradasApi = [];
                        imagenes.forEach(imagen => {
                            if(imagen.id_danho == parseInt(iddanho)){
                                imagenesFiltradasApi.push(imagen);
                            }
                        });
                        imagenesFiltradasApi.forEach(async imgfiltrada => {
                            await deleteDoc(doc(db, "galeria", imgfiltrada.idDoc));
                        });
                        await deleteDoc(doc(db, "danhos", idDocumentoEliminar));
                        cerrarModalEliminar();
                    });
                }
            }
        } catch (error) {
            setbanderaIncorrectoEliminacion(true);
        }
    }

    return(
        <>
            <Navbar />
            <header className="grid grid-cols-1 sm:flex justify-between items-center px-4">
                <div>
                    <h3 className="color-principal font-bold text-2xl sm:text-4xl">Listado de daños</h3>
                </div>
                <section className="">
                    <button className="bg-secundario text-white text-sm w-28 h-8 font-bold rounded-md shadow-md mx-6 hover:opacity-90 hidden sm:inline" onClick={abrirModal} >Crear Daño</button>
                    <button className="bg-secundario h-20 w-20 flex items-center justify-center text-white shadow-2xl shadow-red-950 sm:hidden fixed bottom-2 right-2 z-10 rounded-full" onClick={abrirModal} >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    
                    <input className="w-full sm:max-w-fit h-8 px-4 border-solid border-2 rounded-md focus:outline-none shadow-sm" type="search" name="buscador" id="buscador" placeholder="Buscar daño" />
                </section>
            </header>
            <section className="principal-contenedor bg-no-repeat bg-contain bg-right-bottom px-2 pb-20 sm:pl-10 sm:pr-10 sm:pb-10 overflow-auto animate-fade-down" style={{backgroundImage:`url(${desvanecido_2})`}}>
                
                {danhosApi.map(item => (
                    <div key={`danhos_${item.id_danho}`} className="rounded-md shadow-md w-full flex h-24 sm:h-32 my-4 sm:my-6 border border-gray-200 bg-gradient-to-r from-[#e2edef] to-[#ffffff82]">
                        <div className="w-5/6 grid items-center px-2 sm:px-6">
                            <h2 className="color-secundario font-bold text-xl sm:text-2xl">{item.titulo}</h2>
                            <div className="grid sm:flex">
                                <div className="w-5/6">
                                    <span className="text-base sm:text-xl">{item.ubicacion}</span>
                                </div>
                                <span className="text-base sm:text-xl">{item.fecha}</span>
                            </div>
                        </div>
                        <div className="flex w-2/6 sm:w-1/6 justify-evenly items-center">
                            <svg id={item.idDoc} onClick={navegaImagenes} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 color-secundario cursor-pointer">
                                <path className="h-14" strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <svg id={item.idDoc} onClick={edicionDanho} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 color-secundario cursor-pointer">
                                <path className="h-14" strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                            <svg id={item.idDoc} onClick={abrirModalEliminar} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 color-secundario cursor-pointer">
                                <path className="h-14" strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </div>
                    </div>

                ))}

            </section>
            {
                modalAlta &&
                <div className="h-screen w-screen bg-[#00000099] fixed left-0 top-0 z-[1055] flex items-center justify-center">
                    <section className="bg-white w-5/6 sm:w-3/6 px-6 animate-fade-up">
                        <header className="flex justify-between h-12 items-center">
                            <h2 className="color-principal font-bold text-2xl">
                                { banderaUpdate ? `Actualizar Inspección` : 'Crear Inpección' }
                            </h2>
                            <svg onClick={cerrarModal} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </header>
                        <form className="space-y-4 md:space-y-6 py-6" onSubmit={altaDano}>
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-stone-900">Nombre Daños</label>
                                <input onChange={modNombreDano} value={nombreDano} type="text" name="nombre" id="nombre" className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5"required=""/>
                            </div>
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-stone-900">Ubicación</label>
                                <select name="" id="ubicacion" onChange={modUbicacion} value={ubicacion} placeholder="Selecciona la ubicación" className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5">
                                    {
                                        estados.map(estado => (
                                            <option value={estado.nombre} key={`estado_${estado.id}`} >{estado.nombre}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div>
                                <label htmlFor="date" className="block mb-2 text-sm font-medium text-stone-900">Fecha Ocurrido</label>
                                <input onChange={modFecha} value={fecha} type="date" name="date" id="date" className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5"required=""/>
                            </div>
                            <div>
                                <label htmlFor="number" className="block mb-2 text-sm font-medium text-stone-900">Número de Puntos a Visitar</label>
                                <input onChange={modPuntos} value={puntos} type="number" name="number" id="number" min="1" className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5"required=""/>
                            </div>
                            <div className="flex justify-end">
                                {
                                    banderaUpdate ? 
                                    <button type="submit" className="w-2/6 text-white bg-secundario focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center font-bold">Editar</button>
                                    :
                                    <button type="submit" className="w-2/6 text-white bg-secundario focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center font-bold">Agregar</button>

                                }
                            </div>
                            {
                                banderaVacioAlta && 
                                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                    <p className="font-bold">Todos los campos son obligatorios</p>
                                </div>
                            }
                            {
                                banderaIncorrectoAlta &&    
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                                    <p className="font-bold">Ocurrió un error favor de intentralo más tarde</p>
                                </div>
                            }
                        </form>
                    </section>
                </div>
            }
             {
                modalEliminar &&
                <div className="h-screen w-screen bg-[#00000099] fixed left-0 top-0 z-[1055] flex items-center justify-center">
                    <section className="bg-white w-5/6 sm:w-3/6 px-6 animate-fade-up">
                        <header className="flex justify-between h-12 items-center">
                            <h2 className="color-principal font-bold text-2xl">
                                Eliminar Daño
                            </h2>
                            <svg onClick={cerrarModalEliminar} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </header>
                        <div>
                            <h2 className="text-xl text-center">¿Esta seguro de eliminar este daño?</h2>
                            <span className="text-md">
                                Todas las fotografías asignadas a ese será eliminadas igualmente
                            </span>
                            <div className="flex justify-end py-5">
                                <button onClick={eliminarCaso} type="submit" className="w-2/6 text-white bg-secundario focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center font-bold">Eliminar</button>
                            </div>
                        </div>
                        {
                            banderaIncorrectoEliminacion &&    
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                                <p className="font-bold">Ocurrió un error favor de intentralo más tarde</p>
                            </div>
                        }
                    </section>
                </div>
             }
        </>
    );

}
export default Listadanhos;