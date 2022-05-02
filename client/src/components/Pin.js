import React, { useState} from 'react'
import { urlFor, client } from '../client'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { fetchUser } from '../utils/fetchUser'

const Pin = ({ pin }) => {
    const negative = useNavigate()
    const [postHovered, setPostHovered] = useState(false)
    const [savingPost, setSavingPost] = useState(false)
    const userData = fetchUser()
    const alreadySave = !!(pin?.save?.filter(item => item.postedBy._id === userData?.googleId))?.length

    const savePin = (id) => {
        if(!alreadySave) {
            setSavingPost(true)
            client.patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: userData.googleId,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: userData.googleId
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload()
                    savingPost(false)
                })
        }
    }

    const unSavePin = (id) => {
        if(alreadySave) {
        }
    }

    const deletePost = (id) => {
        client.delete(id)
            .then(() => {
                window.location.reload()
            })
    }
    return (
        <div className='mt-8'>
            <div
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden duration-500 ease-in-out'
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => negative(`/post/detail/${pin._id}`)}
                >
                <img src={urlFor(pin?.image).width(700).url()} alt={pin.title} className='rounded-lg w-full object-cover'/>
                {postHovered && (
                    <div className='absolute top-0 h-full w-full flex flex-col justify-between p-2 pr-2 pt-2 pb-2 z-50'>
                        <div className='flex items-center justify-between w-full'>
                            <a 
                                href={`${pin?.image?.asset?.url}?dl=`}
                                download
                                onClick={(e) => e.stopPropagation()} 
                                className='w-8 h-8 flex place-items-center justify-center bg-white text-dark tex-xl rounded-full opacity-60 hover:opacity-80'>
                                <MdDownloadForOffline/>
                            </a>
                            {alreadySave ? (
                                <button className='bg-red-500 text-white font-bold px-3 py-1 text-base rounded-md text-center outlined-none' 
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        unSavePin(pin._id)
                                    }}>{`${savingPost ? 'Saving' : `${pin?.save?.length} Saved`}`}</button>
                            ) : (
                                <button 
                                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-3 py-1 text-base rounded-md text-center outlined-none'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        savePin(pin?._id)
                                    }}>Save</button>
                            )}
                        </div>
                        <div className='flex justify-between w-full'>
                            { pin?.destination && (
                                <a href={pin?.destination} target='_blank' className='bg-white flex items-center gap-2 px-1 rounded-lg opacity-70  0 hover:opacity-100 text-sm'>
                                    <BsFillArrowUpRightCircleFill/>
                                    {pin?.destination?.length > 10 ? `${pin.destination.slice(0, 8)}...` : pin?.destination}
                                </a>
                            )}
                            { pin?.postedBy?._id === userData?.googleId && (
                                <button className='bg-white p-1 opacity-70 hover:opacity-100 flex items-center justify-center rounded-lg'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deletePost(pin._id)
                                    }}>
                                    <AiTwotoneDelete/>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link to={`/profile/${pin?.postedBy?._id}`} className='flex gap-2 mt-2 items-center ml-1 text-sm font-bold'>
                <img src={pin?.postedBy?.imageUrl} alt={pin?.postedBy?.userName} className='w-6 rounded-full'/>
                {pin?.postedBy?.userName}
            </Link>
        </div>
    )
}

export default Pin