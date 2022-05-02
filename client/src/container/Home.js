import React, { useRef, useEffect, useState } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { SideBar, UserProfile } from '../components'
import Logo from '../assets/logo.png'
import { Link, Routes, Route } from 'react-router-dom'
import { userQuery } from '../utils/query'
import { client } from '../client'
import Pins from './Pins'
import { fetchUser } from '../utils/fetchUser'

const Home = () => {
    const [user, setUser] = useState(null)
    const [toggleSideBar, setToggleSideBar] = useState(false)
    const userData = fetchUser()
    const scrollRef = useRef(null)

    useEffect(() => {
        const query = userQuery(userData?.googleId)
        client.fetch(query)
            .then(data => {
                setUser(data[0])
            })
            .catch(err => {console.log('Err: ', err);})
    }, [])

    useEffect(() => {
        scrollRef.current.scrollTo(0, 0);
    });

    return (
        <div className='flex flex-col md:flex-row h-screen bg-grey-50 transaction-height duration-25 ease-out'>
            <div className='hidden md:mt-10 md:block md:flex-col h-screen flex-initial w-275 hide-scrollbar'>
                <SideBar user={user && user} />
            </div>
            <div className='flex flex-row md:hidden'>
                <div className='flex items-center justify-between w-full shadow-md p-2'>
                    <HiMenu className='cursor-pointer' size={32} onClick={() => setToggleSideBar(true)}/>
                    <Link to={'/'}>
                        <img className='w-28' src={Logo} alt='app-media'/>
                    </Link>
                    {user ? (
                        <Link to={`/profile/${user?._id}`}>
                            <img className='w-10 rounded-full' src={user?.imageUrl} alt='app-media'/>
                        </Link>
                    ) : (
                        <Link to={'/login'}
                            className='py-2 px-3 rounded-lg bg-red-500 opacity-75 hover:opacity-100 text-white'>
                            Login
                        </Link>
                    )}
                </div>
                {toggleSideBar && (
                    <div className='fixed w-4/5 bg-white overflow-y-auto h-screen shadow-md z-50 animate-slide-in transaction-height duration-25 ease-out'>
                        <AiFillCloseCircle className='absolute right-4 top-4' size={30} onClick={() => setToggleSideBar(false)}/>
                        <div className='mt-20'>
                            <SideBar user={user && user} setToggleSideBar={setToggleSideBar}/>
                        </div>
                    </div>
                )}
            </div>
            <div className='pb-2 flex-1 h-screen overflow-y-scroll bg-[#f8f8f8] hide-scrollbar' ref={scrollRef} >
                <Routes>
                    <Route path='/profile/:userId' element={<UserProfile user={user && user}/> }/>
                    <Route path='/*' element={<Pins user={user && user}/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default Home