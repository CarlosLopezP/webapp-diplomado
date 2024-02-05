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
        <div className="w-screen h-screen grid gap-1 justify-center lg:justify-end bg-no-repeat bg-cover lg:bg-contain content-center" style={{backgroundImage:`url(${fondo})`}}>
            <div className="p-8 bg-gradient-to-r from-cyan-500 to-blue-500 lg:bg-gradient-to-r lg:from-[#ffffff00] lg:to-[#ffffff00] rounded-lg">
              <h1 className="text-3xl  lg:text-5xl text-center px-3 lg:pr-32 colorPrincipal font-semibold">Página no encontrada</h1>
              <div className="px-3 lg:pr-32 text-center">
                  <button className="h-14 w-fit px-5 bg-secundario text-white m-3 rounded-md text-xl font-bold shadow-lg hover:animate-shake" onClick={regresar}>Regresar</button>
              </div>
            </div>
        </div>
      </>  
    );
}
export default nofound