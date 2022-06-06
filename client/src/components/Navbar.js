import React from 'react'
import { IoIosAdd, IoMdAdd, IoMdSearch } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ user, searchTerm, setSearchTerm }) => {
    const navigate = useNavigate()

    return (
        <div className='mt-10 flex gap-2 md:gap-4 w-full p-2 items-center justify-evenly'>
            <div className='flex items-center w-full rounded-md bg-white p-2 focus-within:shadow-sm md:w-2/3'>
                <IoMdSearch size={28} className='text-[#0ccf8e]' />
                <input className='outline-none border-none font-light p-1 text-sm '
                    placeholder='search...'
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    onFocus={() => navigate('/search')}
                    />
            </div>
                {user ? (
                    <div className='flex items-center gap-2'>
                        <Link to={'/create'}>
                            <div className='p-2 bg-black rounded-lg flex place-items-center hover:bg-violet-500/50' >
                                <IoIosAdd size={20} className='text-white' />
                            </div>
                        </Link>
                        <Link to={`/profile/${user?._id}`} className='md:block hidden'>
                            <img src={user?.imageUrl} alt={user?.userName} className='w-10 rounded-full object-cover'/>
                        </Link>
                    </div>
                ) : (
                    <Link to={'/login'}
                        className='md:block hidden py-2 px-3 rounded-lg bg-red-500 opacity-75 hover:opacity-100 text-white'>
                        Login
                    </Link>
                )}
        </div>
    )
}

export default Navbar