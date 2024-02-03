import React from "react";
import fondo from "../../assets/images/img-fondo.png"
import { useNavigate } from 'react-router-dom';

const nofound = () => {
    const navigate = useNavigate();
    
    function regresar() {
        navigate(-1);
    }
    return(
      <>
        <div className="w-screen h-screen grid gap-1 justify-end bg-no-repeat bg-contain content-center" style={{backgroundImage:`url(${fondo})`}}>
            <h1 className="text-7xl pr-36 colorPrincipal font-semibold">Página no encontrada</h1>
            <div className="pr-36 text-center">
                <button className="h-14 w-fit px-5 bg-secundario text-white m-3 rounded-md text-xl font-bold shadow-lg hover:animate-shake" onClick={regresar}>Regresar</button>
            </div>
        </div>
      </>  
    );
}
export default nofound