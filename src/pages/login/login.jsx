import React,{useState} from "react"
import fondo from "../../assets/images/img-fondo.png"
import logo from "../../assets/images/logo.png"
import { useNavigate } from 'react-router-dom'
import { db, doc, onSnapshot, collection, query, addDoc } from "../../lib/firebase";

const login = () => {
    const [correo,setCorreo] = useState('');
    const [contrasenha,setContrasenha] = useState('');
    const [banderaVacio,setBanderaVacio] = useState(false);
    const [banderaIncorrecto,setBanderaIncorrecto] = useState(false);
    const navigate = useNavigate();
    const passwordInput = document.getElementById('input_contra');
    const [banderaAlta,setbanderaAlta] = useState(false);
    const [banderaVacioAlta,setbanderaVacioAlta] = useState(false);
    const [banderaIncorrectoAlta,setbanderaIncorrectoAlta] = useState(false);

    const login = (event) => {
        event.preventDefault()
        setBanderaIncorrecto(false);
        setBanderaVacio(false);
        if (correo.length === 0 || contrasenha.length === 0) {
            setBanderaVacio(true);
        }else{
            validaAcceso();
        }
    }

    const validaAcceso = () => {
        try {
            const consulta = query(collection(db,"sesion"));
            var validado = 0; 
            onSnapshot(consulta, (snapShot) => {
                const documentos = [];
                snapShot.forEach((documet) => {
                    const danho = { ...documet.data(), idDoc: documet.id}
                    documentos.push(danho); 
                });
                documentos.forEach(usuario => {
                    const CEA = `${usuario.contra}`;
                    //root@rd.com
                    if (usuario.correo === correo && CEA === contrasenha) {
                        validado++;
                    }
                });
                if(validado > 0){
                    localStorage.setItem("sesion",true);
                    navigate("/lista-danhos");
                }else{
                    setBanderaIncorrecto(true);
                }
            });
        } catch (error) {
        }
    }

    const actualizaCorreo = (event) => {
        setCorreo(event.target.value);
        setBanderaIncorrecto(false);
        setBanderaVacio(false);
    }

    const actualizaContrasenha = (event) => {
        setContrasenha(event.target.value);
        setBanderaIncorrecto(false);
        setBanderaVacio(false);
    }

    function mostrarContra() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
          } else {
            passwordInput.type = 'password';
          }
    }

    const cerrarAlta = () => {
        setbanderaAlta(false);
    }

    const abrirAlta = () => {
        setbanderaAlta(true);
    }

    const alta = async (event) => {
        try {
            event.preventDefault()
            setbanderaIncorrectoAlta(false);
            setbanderaVacioAlta(false);
            if (correo.length === 0 || contrasenha.length === 0) {
                setbanderaVacioAlta(true);
            }else{
                const doc = await addDoc(collection(db, "sesion"),{
                    contra: contrasenha,
                    correo: correo,              
                });
                if(doc != null){
                    localStorage.setItem("sesion",true);
                    navigate("/lista-danhos");
                }else{
                    setbanderaIncorrectoAlta(true);
                }
            }
            
        } catch (error) {
            console.log(error)
            setbanderaIncorrectoAlta(true);
            
        }

    }

    return(
        <>
            <div className="flex">
                <aside className="w-1/2 h-dvh hidden lg:flex ">
                    <img className="h-dvh object-cover" src={fondo}/>
                </aside>
            <section className="m-auto animate-fade-up h-dvh flex items-center	">
                <div className="w-full bg-stone-100 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <div className="flex justify-center">
                <img className="w-3/5" src={logo} />

                </div>
                <div className="flex gap-2 text-center justify-center">
                    {
                        banderaAlta &&
                        <svg onClick={cerrarAlta} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    }
                    <h1 className="text-xl font-bold color-principal md:text-2xl text-center">
                        { banderaAlta ? "Registrate" : "Registro de Daños" }               
                    </h1>
                </div>
                    {
                        banderaAlta ? 
                        <form className="space-y-4 md:space-y-6 grid animate-fade-up" onSubmit={alta}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-stone-900">Correo</label>
                                <input type="email" onChange={actualizaCorreo} value={correo} className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5"required=""/>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-stone-900">Contraseña</label>
                                <div className="flex items-center cursor-pointer">
                                    <input id="input_contra" type="password" onChange={actualizaContrasenha} value={contrasenha} className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5" required=""/>
                                    <svg onClick={mostrarContra} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </div>
                            </div>
                            <button type="submit" className="w-full text-white bg-secundario focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center font-bold">Registrarse</button>
                            {
                                banderaVacioAlta && 
                                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                    <p className="font-bold">Usuario y Contraseña Obligatorios</p>
                                </div>
                            }
                            {
                                banderaIncorrectoAlta &&    
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                                    <p className="font-bold">Error al dar de alta los datos</p>
                                </div>
                            }
                        </form>
                        :
                        <form className="space-y-4 md:space-y-6 grid animate-fade-up" onSubmit={login}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-stone-900">Correo</label>
                                <input type="email" onChange={actualizaCorreo} value={correo} className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5"required=""/>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-stone-900">Contraseña</label>
                                <div className="flex items-center cursor-pointer">
                                    <input id="input_contra" type="password" onChange={actualizaContrasenha} value={contrasenha} className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5" required=""/>
                                    <svg onClick={mostrarContra} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </div>
                            </div>
                            <button type="submit" className="w-full text-white bg-secundario focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center font-bold">Acceder</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                ¿Aun No Tienes Una Cuenta? <a href="#" className="font-medium color-principal hover:underline dark:text-primary-500" onClick={abrirAlta}>Darte de Alta</a>
                            </p>
                            {
                                banderaVacio && 
                                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                                    <p className="font-bold">Usuario y Contraseña Obligatorios</p>
                                </div>
                            }
                            {
                                banderaIncorrecto &&    
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                                    <p className="font-bold">Usuario/Contraseña Invalidos</p>
                                </div>
                            }
                        </form>
                    }
            </div>
        </div>
    </section>
            </div>
        </>
    )
}

export default login