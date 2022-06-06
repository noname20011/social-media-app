import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { GoogleLogout } from 'react-google-login'
import { userCreatePinsQuery, userSavedPinsQuery, userQuery } from '../utils/query'
import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none'
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'
const UserProfile = () => {

    const [user, setUser] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [pins, setPins] = useState(null)
    const [text, setText] = useState('Created')
    const [activeBtn, setActiveBtn] = useState('created')
    const navigate = useNavigate()
    const { userId } = useParams()

    useEffect(() => {
        const query = userQuery(userId)
        client.fetch(query)
            .then(data => {
                setUser(data[0])
            })
        if(JSON.parse(localStorage.getItem('user')) !== null) {
            const { googleId } = JSON.parse(localStorage.getItem('user')) 
            setCurrentUser(googleId)
        }
    }, [userId])

    useEffect(() => {
        if(text === 'Created') {
            const query = userCreatePinsQuery(userId) 
            client.fetch(query)
                .then((data) => {
                    setPins(data)
                })
        } else if (text === 'Saved') {
            const query = userSavedPinsQuery(userId) 
            client.fetch(query)
                .then((data) => {
                    setPins(data)
                    console.log(data);
                })
        }
    },[text, user?._id])

    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }
    
    if(!user) return <Spinner/>

    return (
        <div className='relative h-full pb-2 justify-center items-center'>
            <div className='flex flex-col pb-5'>
                <div className='relative flex flex-col mb-7'>
                    <div className='flex flex-col justify-center items-center'>
                        <img src='https://source.unsplash.com/1600x900/?nature,photography,technology'
                            className='w-full h-730 2xl:h-510 shadow-lg object-cover'/>
                        <img src={user?.imageUrl} alt={user?.userName}
                            className='-mt-10 w-20 h-20 rounded-full '/>
                        <h1 className='font-bold text-2xl text-center mt-3'>{user?.userName}</h1>
                        <div className='absolute right-3 top-3 z-10 p-2'>
                            { userId === currentUser ? <GoogleLogout
                                clientId='593365380236-m2d8rfm1coptppqebha102c93akj8jkq.apps.googleusercontent.com'
                                render={(renderProps) => (
                                        <button type='button' className='p-3 rounded-full flex justify-center items-center text-red-300 bg-gray-500 opacity-75 hover:opacity-100'
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}>
                                            <AiOutlineLogout size={32}/>
                                        </button>
                                    )}
                                onLogoutSuccess={handleLogout}
                                cookiePolicy='single_host_origin'
                            /> : null }
                        </div>
                    </div>
                    <div className='text-center mt-7 '>
                        <button type='button'
                            onClick={(e) => {
                                setText(e.target.textContent)
                                setActiveBtn('created')
                            }}
                            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}>
                        Create
                        </button>
                        <button type='button'
                            onClick={(e) => {
                                setText(e.target.textContent)
                                setActiveBtn('saved')
                            }}
                            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}>
                        Saved
                        </button>
                    </div>
                    { pins?.length ? (
                        <div className='px-5 md:px-10'>
                            <MasonryLayout pins={pins}/>
                        </div>
                    ) : (
                        <div className='mt-10 px-2 text-center'>No post</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfile