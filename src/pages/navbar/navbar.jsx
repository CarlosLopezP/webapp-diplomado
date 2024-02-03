import React, {useState} from "react";
import logo from "../../assets/images/logo.png"
import logoBlanco from "../../assets/images/logo-blanco.png"
import "./navbar.css";

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const [seleccionActual, setSeleccionActual] = useState(1);
    
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'Lista de Daños', svg: <svg color="#CAF92B" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg> },
    { id: 2, text: 'Contacto', svg:<svg color="#CAF92B" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg> },
    { id: 3, text: 'FAQ', svg: <svg color="#CAF92B" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg> },
    { id: 4, text: 'Cerrar Sesión', svg: <svg color="#CAF92B" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" /></svg> },
  ];
  


  function itemSeleccionado(item){
    if(seleccionActual == item.id){
        return <div className="flex"> {item.svg} <p className="border-b-4 border-[#CAF92B] px-2">
         {item.text}
        </p></div>;
    }else{
        return <div className="flex"> {item.svg} <p className="hover:border-b-4 hover:border-[#CAF92B] px-2">
        {item.text}
        </p></div>;
    }
  };

  return (
    <div className='flex justify-between items-center mx-auto px-4 text-white contenedor-header-nav bg-[#20556B] sm:bg-[#ffffff]'>
        <a href="">
            <img className="h-20 hidden sm:block" src={logo} alt="Inicio" />
            <img className="h-16 sm:hidden" src={logoBlanco} alt="Inicio" />
        </a>
        
      <ul className='hidden md:flex'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='text-black p-4 hover: m-2 cursor-pointer'
          >
            {itemSeleccionado(item)}
          </li>
        ))}
      </ul>
      
      <h1 className="sm:hidden text-2xl">
          Inspección de daños
      </h1>

      <div onClick={handleNav} className='block md:hidden'>
        <button type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden" aria-controls="mobile-menu-2" aria-expanded="false">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg> 
        </button>
      </div>
      
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#303030] ease-in-out duration-500 z-10'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%] z-10'
        }
      >
        <div className="flex justify-center my-4">
        <a href="">
            <img className="h-20" src={logoBlanco} alt="Inicio" />
        </a>

        </div>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 duration-300'
          >
            {itemSeleccionado(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Navbar