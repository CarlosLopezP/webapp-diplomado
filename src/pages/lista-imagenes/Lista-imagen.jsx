import React, {useState, useRef, useEffect} from "react";
import Navbar from "../navbar/navbar";
import desvanecido from "/src/assets/images/otrodegradado1.png";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { db, doc, onSnapshot, collection, query, addDoc, updateDoc, deleteDoc } from "../../lib/firebase";


const Listaimagenes = ({match}) =>{

    const navigate = useNavigate();
    const [modalAlta, setmodalAlta] = useState(false);
    const { id } = useParams();
    const [numeroAcciones,setnumeroAcciones] = useState("");
    const [titulo,settitulo] = useState("");
    const [arregloAcciones,setArregloAcciones] = useState([]);
    const [idDanho,setidDanho] = useState(0);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const fileInputRef2 = useRef(null);
    const [imagenesFiltradas,setimagenesFiltradas] = useState([]);
    const [banderaIncorrectoAlta,setbanderaIncorrectoAlta] = useState(false);
    const [banderaEdicion,setBanderaEdicion] = useState(false);
    const [idDanhoEdicion, setidDanhoEdicion] = useState(0);
    const [numeroImgenEdicion,setnumeroImgenEdicion] = useState(0);
    const [modalEliminar,setmodalEliminar] = useState(false);
    const [idDocumentoEliminar,setidDocumentoEliminar] = useState(false);
    const [banderaIncorrectoEliminacion,setbanderaIncorrectoEliminacion] = useState(false);

    useEffect(() => {
        const sesionActiva = localStorage.getItem("sesion");
        const tituloS = localStorage.getItem("titulo");
        const num_seccionesS = parseInt(localStorage.getItem("num_secciones"));
        const iddanhoS = localStorage.getItem("id_danho");
        settitulo(tituloS);
        if(sesionActiva != null && tituloS != null && num_seccionesS != null && iddanhoS != null){
            var arregloAccion = [];
            for (let index = 0; index < num_seccionesS; index++) {
                arregloAccion.push(index+1);
            }
            setArregloAcciones(arregloAccion);
            obtenerImagenesApi();
        } else{
            localStorage.clear();
            navigate("/");
        }
    }, []);

    function regresar(){
        navigate("/lista-danhos")
    }

    const abrirModal = async (event) => {
        setBanderaEdicion(false);
        const geo = await getLocationAsync();
        await obtenerImagenes(event, geo.latitude, geo.longitude);
        setmodalAlta(true);
    }

    function cerrarModal(){
        limpiarInput();
        setmodalAlta(false);
    }

    const getLocationAsync = async () => {
        return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
                resolve({ latitude, longitude });
              },
              (error) => {
                reject(error);
              }
            );
          } else {
            reject(new Error('Geolocation is not supported by this browser.'));
          }
        });
    };

    const obtenerImagenes = async (event, lat, lon) => {
        return new Promise((resolve, reject) => {
            try {
                const fileList = event.target.files;
                const imageList = [];
                for (let i = 0; i < fileList.length; i++) {
                    const file = fileList[i];
                    const imageUrl = URL.createObjectURL(file);
                    const objetoImg = {
                        numeroImagen: i, 
                        imgurl: imageUrl,
                        subSeccion: arregloAcciones[0],
                        descripcion: "",
                        lat:lat,
                        long:lon,
                        imagen:file
                    }
                    imageList.push(objetoImg);
                }
                resolve(setImages(imageList))
            } catch (error) {
                reject(error);
            }
        });
    }

    const botonSeleccionar = () => {
        fileInputRef.current.click();
    }

    const botonSeleccionar2 = () => {
        fileInputRef2.current.click();
    }

    const obtenerImagenesApi = () => {
        const iddanhoS = localStorage.getItem("id_danho");
        const consulta = query(collection(db,"galeria"));
        onSnapshot(consulta, (snapShot) => {
            var imagenes = [];
            snapShot.forEach((documet) => {
                const danho = { ...documet.data(), idDoc: documet.id}
                imagenes.push(danho); 
            });
            var imagenesFiltradasApi = [];
            imagenes.forEach(imagen => {
                if(imagen.id_danho == parseInt(iddanhoS)){
                    imagenesFiltradasApi.push(imagen);
                }
            });
            setimagenesFiltradas(imagenesFiltradasApi);
        });
    }
    const limpiarInput = () => {
        const input = document.getElementById("cargaImagen");
        input.value = "";
    }

    const altaImagenes = async () => {
        try {
            setbanderaIncorrectoAlta(false);
            const iddanhoS = localStorage.getItem("id_danho");
            const consulta = query(collection(db,"galeria"));
            var ultimoId = 0;
            if(banderaEdicion){
                const docRef = doc(db, "galeria", idDanhoEdicion);
                const obtenerSeccion = document.getElementById(`alta_seccion_${numeroImgenEdicion}`);
                const obtenerDescripcion = document.getElementById(`alta_descripcion_${numeroImgenEdicion}`);
                await updateDoc(docRef, {
                    descripcion : obtenerDescripcion.value,
                    seccion : obtenerSeccion.value
                });
                cerrarModal ();
            }else{
                onSnapshot(consulta, (snapShot) => {
                    var imagenes = [];
                    snapShot.forEach((documet) => {
                        const danho = { ...documet.data(), idDoc: documet.id}
                        imagenes.push(danho); 
                    });
                    if(imagenes.length > 0){
                        ultimoId = imagenes[imagenes.length -1].id_imagen;
                    }else{
                        ultimoId = 1;
                    }
                    var errores = false;
                    images.forEach(async imagen => {
                        const obtenerSeccion = document.getElementById(`alta_seccion_${imagen.numeroImagen}`);
                        const obtenerDescripcion = document.getElementById(`alta_descripcion_${imagen.numeroImagen}`);
                        ultimoId++;
                        const file = imagen.imagen;
                        const reader = new FileReader();
                        reader.onload = async () => {
                            const base64String = reader.result;
                            if(base64String != ""){
                                const doc = await addDoc(collection(db, "galeria"),{
                                    descripcion: obtenerDescripcion.value,
                                    id_danho: parseInt(iddanhoS),
                                    id_imagen: parseInt(ultimoId),
                                    latitud: imagen.lat,
                                    longitud: imagen.long,
                                    seccion: obtenerSeccion.value,
                                    imagen: base64String
                                });
                                if (doc == null) {
                                    errores = true;
                                }
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                    if(errores){
                        setbanderaIncorrectoAlta(true)
                    }else{
                        cerrarModal();
                    }
                });
            }
        } catch (error) {
            console.log(error);
            setbanderaIncorrectoAlta(true);
        }
    }

    const edicionImagen = (event) => {
        setBanderaEdicion(true);
        var imagenEncontrada = [];
        imagenesFiltradas.forEach(imagen => {
            if(imagen.idDoc == event.target.id){
                imagenEncontrada.push(imagen);
            }
        });
        if(imagenEncontrada.length > 0){
            setImages(imagenEncontrada);
            setmodalAlta(true);
            setidDanhoEdicion(imagenEncontrada[0].idDoc);
            setnumeroImgenEdicion(imagenEncontrada[0].numeroImagen)
            setTimeout(() => {
                const seccion = document.getElementById(`alta_seccion_${imagenEncontrada[0].numeroImagen}`);
                seccion.value = imagenEncontrada[0].seccion;
                const descripcion = document.getElementById(`alta_descripcion_${imagenEncontrada[0].numeroImagen}`);
                descripcion.value = imagenEncontrada[0].descripcion;
                
            }, 500);
        }
    }

    const abrirModalEliminar = (event) => {
        setidDocumentoEliminar(event.target.id);
        setmodalEliminar(true);
    }

    function cerrarModalEliminar(){
        setmodalEliminar(false);
    }

    const eliminarImagen = async () => {
        try {
            await deleteDoc(doc(db, "galeria", idDocumentoEliminar));
            cerrarModalEliminar();
        } catch (error) {
            setbanderaIncorrectoEliminacion(true);
        }
    }

    return (
        <>
            <Navbar />
            <header className="grid grid-cols-1 sm:flex justify-between items-center px-4">
                <div className="flex items-center">
                    <svg onClick={regresar} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-4 cursor-pointer color-secundario hover:animate-jump">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    <h3 className="color-principal font-bold text-2xl sm:text-3xl">{titulo}</h3>
                </div>
                <section className="">
                    <button className="bg-secundario text-white text-sm w-28 h-8 font-bold rounded-md shadow-md mx-6 hover:opacity-90 hidden sm:inline" onClick={botonSeleccionar}>Cargar Foto</button>
                    <input id="cargaImagen" type="file" accept="image/jpeg, image/png" multiple onChange={abrirModal} ref={fileInputRef} className="hidden"/>
                    <button className="bg-secundario h-20 w-20 flex items-center justify-center text-white shadow-2xl shadow-red-950 sm:hidden fixed bottom-2 right-2 z-10 rounded-full" onClick={botonSeleccionar2}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                    </button>
                    <input type="file" accept="image/jpeg, image/png" capture="camera"onChange={abrirModal} ref={fileInputRef2} className="hidden"/>
                    <input className="w-full sm:max-w-fit h-8 px-4 border-solid border-2 rounded-md focus:outline-none shadow-sm" type="search" name="buscador" id="buscador" placeholder="Buscar foto" />
                </section>
            </header>
            <section className="principal-contenedor grid bg-no-repeat bg-contain bg-right-bottom px-2 sm:p-10 sm:pt-0 overflow-auto" style={{backgroundImage:`url(${desvanecido})`}}>

            {arregloAcciones.map(item => (
                <div key={`item_${item}`} className="grid my-0 sm:my-3">
                    <h3 className="text-2xl sticky top-0 bg-white"> Sub Seccion {item}</h3>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6 lg:gap-6 animate-fade-left">
                        {imagenesFiltradas.map(imagen => (
                            imagen.seccion == item &&
                                <div key={`img_${imagen.id_imagen}`} className="grid border border-gray-200 bg-white rounded-md shadow-lg">
                                
                                <img className="w-full h-28 object-cover border-r-4" src={imagen.imagen} />
                                <div className="flex justify-end">
                                    <svg id={imagen.idDoc} onClick={edicionImagen} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 color-secundario mx-2 cursor-pointer">
                                        <path className="h-14" strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                    <svg id={imagen.idDoc} onClick={abrirModalEliminar} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 color-secundario mx-2 cursor-pointer">
                                        <path className="h-14" strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </div>
                                <span className="text-sm p-2">
                                    {imagen.descripcion} 
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            </section>
            {
                modalAlta &&
                <div className="h-screen w-screen bg-[#00000099] fixed left-0 top-0 z-[1055] flex items-center justify-center">
                    <section className="bg-white w-11/12 h-11/12 sm:h-auto sm:w-5/6 p-2 sm:p-6 animate-fade-up ">
                        <header className="flex justify-between h-12 items-center">
                            <h2 className="color-principal font-bold text-2xl">
                                {
                                    banderaEdicion ? "Edición" : "Subir Imágenes"
                                }
                            </h2>
                            <svg onClick={cerrarModal} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </header>
                        <section className="py-2 min-h-5/6 min-w-full sm:max-h-[500px] sm:min-h-[200px] overflow-auto">
                            {
                                images.map(img =>(
                                    <div key={img.imgurl} className="grid grid-rows-6 gap-2 sm:grid-rows-1 sm:grid-cols-5 sm:gap-6 items-center mb-5" >
                                        <div className="border-2 border-gray-200 rounded-xl shadow-md row-span-3 sm:row-span-1">
                                            {
                                                banderaEdicion ? 
                                                <img className="h-52 sm:h-24 w-full object-cover rounded-xl" src={img.imagen} /> 
                                                : 
                                                <img className="h-52 sm:h-24 w-full object-cover rounded-xl" src={img.imgurl} />
                                            }
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-stone-900">Sub-sección</label>
                                            <select id={`alta_seccion_${img.numeroImagen}`} placeholder="Selecciona la ubicación" className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5">
                                                {
                                                    arregloAcciones.map(accion => (
                                                        <option value={accion} key={`accion_${accion}`} >{accion}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-stone-900">Descripción (opcional)</label>
                                                <input id={`alta_descripcion_${img.numeroImagen}`} type="text" name="nombre" className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5"required=""/>
                                            </div>
                                        </div>
                                        <div className="grid grid-rows-2">
                                            <label className="block mb-2 text-sm font-medium text-stone-900">Lat:
                                                { banderaEdicion ? img.latitud : img.lat}
                                            </label>
                                            <label className="block mb-2 text-sm font-medium text-stone-900">Lon:
                                                { banderaEdicion ? img.longitud : img.long}
                                            </label>
                                        </div>
                                    </div>
                                ))
                            }
                        </section>
                        <div className="flex justify-end">
                            <button onClick={cerrarModal} type="submit" className="w-3/6 sm:w-1/6 color-secundario bg-white border-red-900 border-2 rounded-lg text-sm px-5 py-2.5 text-center font-bold mr-6">Cancelar</button>
                            <button type="submit" className="w-3/6 sm:w-1/6 text-white bg-secundario rounded-lg text-sm px-5 py-2.5 text-center font-bold" onClick={altaImagenes}>{ banderaEdicion ? "Editar" : "Cargar"}</button>
                        </div>
                        {
                            banderaIncorrectoAlta &&    
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                                <p className="font-bold">Ocurrió un error al subir una o varias imágenes, favor de intentralo más tarde</p>
                            </div>
                        }
                    </section>
                </div>
            }
            {
                modalEliminar &&
                <div className="h-screen w-screen bg-[#00000099] fixed left-0 top-0 z-[1055] flex items-center justify-center">
                    <section className="bg-white w-5/6 sm:w-3/6 px-6 animate-fade-up">
                        <header className="flex justify-between h-12 items-center">
                            <h2 className="color-principal font-bold text-2xl">
                                Eliminar Imagen
                            </h2>
                            <svg onClick={cerrarModalEliminar} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </header>
                        <div>
                            <h2 className="text-xl text-center">¿Esta seguro de eliminar esta imagen?</h2>
                            <div className="flex justify-end py-5">
                                <button onClick={eliminarImagen} type="submit" className="w-2/6 text-white bg-secundario focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center font-bold">Eliminar</button>
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
};

export default Listaimagenes;