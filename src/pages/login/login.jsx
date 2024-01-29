import React from "react"
import fondo from "../../assets/images/img-fondo.png";
import logo from "../../assets/images/logo.png"

const login = () => (
    <>
        <div className="flex">
            <aside className="w-1/2 h-dvh hidden md:flex ">
                <img className="h-dvh object-cover" src={fondo}/>
            </aside>
           <section className="m-auto animate-fade-up h-dvh flex items-center	">
            <div className="w-full bg-stone-100 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex justify-center">
            <img className="w-3/5" src={logo} />

            </div>
              <h1 className="text-xl font-bold color-principal md:text-2xl text-center">
                  Inpeccion Remota              
                  </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-stone-900">Correo</label>
                      <input type="email" name="email" id="email" className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5"required=""/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-stone-900">Contraseña</label>
                      <input type="password" name="password" id="password" className="bg-gray-20 border border-gray-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-200 block w-full p-2.5" required=""/>
                  </div>
                  <button type="submit" className="w-full text-white bg-secundario focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center font-bold">Acceder</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      ¿Aun No Tienes Una Cuenta? <a href="#" className="font-medium color-principal hover:underline dark:text-primary-500">Darte de Alta</a>
                  </p>
              </form>
          </div>
      </div>
</section>
        </div>
    </>
)

export default login