import React from 'react'
import { RiHome2Fill } from 'react-icons/ri'
import { IoIosArrowForward } from 'react-icons/io'
import { AiOutlineLogout } from 'react-icons/ai'
import { GoogleLogout } from 'react-google-login'
import { categories } from '../utils/query'
import Logo from '../assets/logo.png'
import { NavLink, Link, useNavigate } from 'react-router-dom'

const Sidebar = ({user, setToggleSideBar}) => {
    const navigate = useNavigate()
    const isActiveStyle = 'flex items-center gap-2 mt-4 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize'
    const isNotActiveStyle = 'flex items-center text-lg gap-2 mt-4 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'

    const handleCloseSideBar = () => {
        if(setToggleSideBar) setToggleSideBar(false)
    }
    
    const handleLogout = () => {
        setToggleSideBar(false)
        localStorage.clear()
        navigate('/')
    }
    return (
        <div className='ml-6 w-inherit flex flex-col justify-between bg-white h-full overflow-y-scroll md:overflow-y-hidden'>
            <div className='flex flex-col'>
                <div className='flex justify-center items-center w-full mb-2 md:justify-start'>
                    <Link to={'/'} className='w-160 '>
                        <img className='w-full object-cover' src={Logo} alt='share app'/>
                    </Link>
                </div>
                <div className='flex flex-col gap-2 '>
                    <NavLink to={'/'} 
                        className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)} 
                        onClick={handleCloseSideBar}>
                        <RiHome2Fill size={28} />
                        Home
                    </NavLink>
                    <div>
                        <h3 className="mt-3 text-lg 2xl:text-xl">Discover cateogries</h3>
                        {categories.map(category => (
                            <NavLink
                                to={`/categories/${category.name}`}
                                className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                                onClick={handleCloseSideBar}
                                key={category.name}
                            >
                                <div className='flex items-center gap-2 text-sm'>
                                    <img src={category.image} alt={category.name} className='w-8 h-8 rounded-full objet-cover'/>
                                    {category.name}
                                </div>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
            {user && (
                <div className='mt-8 mb-4'>
                    <GoogleLogout
                        clientId='593365380236-m2d8rfm1coptppqebha102c93akj8jkq.apps.googleusercontent.com'
                        render={(renderProps) => (
                            <button type='button' className='px-5 py-1 rounded-lg flex justify-center items-center text-red-300 bg-gray-200 opacity-75 hover:opacity-100'
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}>    
                                <AiOutlineLogout size={32}/>
                                Logout
                            </button>
                        )}
                        onLogoutSuccess={handleLogout}
                        cookiePolicy='single_host_origin'
                    />
                </div>
            )}
        </div>  
    )
}

export default Sidebar