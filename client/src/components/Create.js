import React from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { client } from '../client'
import Spinner from './Spinner'
import { categories } from '../utils/query'
import { useState } from 'react'

const Create = ({ user }) => {
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [about, setAbout] = useState('')
    const [destination, setDestination] = useState('')
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState(true)
    const [category, setCategory] = useState(null)
    const [imageAsset, setImageAsset] = useState(null)
    const [wrongImageType, setWrongImageType] = useState(false)

    const uploadImage = (e) => {
        const { type, name } = e.target.files[0]
        if(type === 'image/png' || type === 'image/svg' || type === 'image/gif' || type === 'image/jpeg') {
            setWrongImageType(false)
            setLoading(true)
            client.assets.upload('image', e.target.files[0], { contentType: name})
                .then((doc) => {
                    setImageAsset(doc)
                    setLoading(false)
                })
                .catch(err => {console.log('Err:', err);})
        } else {
            setWrongImageType(true)
        }
    }  

    const savePin = () => {
        if(title && about && destination && imageAsset._id) {
            setFields(true)
            const doc = {
                _type: 'pin',
                title,
                about,
                destination,
                image : {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset._id
                    }
                },
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id
                },
                category
            }

            client.create(doc)
                .then(() => {
                    navigate('/')
                })
        } else {
            setFields(true)
            setTimeout(() => {
                setFields(false)
            }, 2000)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center mt-10'>
            <h2 className='text-4xl font-bold text-[#999] mb-10'>New post</h2>
            {!fields && (
                <p className='text-red-500 mb-5 text-sm transition-all duration-150 ease-in'>Please fill in all the fields.</p>
            )}
            <div className='flex flex-col flex-1 gap-6 lg:pl-5 w-full md:w-2/5 mb-6'>
                <input type={'text'} placeholder='Add your title here' 
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    className='p-2 outline-none border-b-[1px] border-gray-300 w-full rounded-b-xl bg-transparent mb-2 focus:border-pink-300'/>
                <input type={'text'} placeholder='Something about picture...' 
                    value={about} onChange={(e) => setAbout(e.target.value)}
                    className='p-2 outline-none border-b-[1px] border-gray-300 w-full rounded-b-xl bg-transparent mb-2 focus:border-pink-300'/>
                <input type={'url'} placeholder='Add destination link...' 
                    value={destination} onChange={(e) => setDestination(e.target.value)}
                    className='p-2 outline-none border-b-[1px] border-gray-300 w-full rounded-b-xl bg-transparent focus:border-pink-300'/>
            </div>
            <div className='flex lg:flex-row flex-col justify-center items-center bg-white ls:p-5 p-3 lg:w-2/5 w-full'>
                <div className='bg-secondaryColor p-3 flex-0.7 w-full'>
                    <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
                        {wrongImageType && (<p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Wrong image type.</p>)}
                        {!imageAsset ? (
                            loading ? (
                                <Spinner/>
                            ) : (
                                <label>
                                    <div className='flex justify-center items-center flex-col h-full'>
                                        <div className='flex justify-center items-center flex-col'>
                                            <p className='font-bold'>
                                                <AiOutlineCloudUpload size={32}/>
                                            </p>
                                            <p>Click to upload</p>
                                            <p className='mt-32 font-thin text-gray-400 text-center'>Recommend type JPG, SVG, GIF, PNG less than 20mb.</p>
                                        </div>
                                        <input type={'file'} className='h-0 w-0' name='upload-image' onChange={uploadImage}/>
                                    </div>
                                </label>
                            )
                        ) : (
                            <div className='relative h-full'>
                                <img src={imageAsset?.url} alt= 'upload-pic' className='h-full w-full object-cover'/>
                                <button type='button' className='absolute bottom-3 right-3 p-3 bg-white rounded-full outline-none cursor-pointer opacity-70 hover:opacity-100'
                                    onClick={() => setImageAsset(false)}>
                                    <MdDelete size={32}/>
                                </button>
                            </div>
                        ) }
                    </div>
                </div>
            </div>
            <div className='flex flex-col w-full md:w-2/5 mt-8'>
                <div>
                    <p className='md-2 font-semibold text:lg sm:text-xl'>Choose Pin Category</p>
                    <select onChange={(e) => setCategory(e.target.value)}
                        className='outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'>
                        {categories.map(category => (
                            <option key={category.name} 
                                className='text-base border-0 outline-none capitalize bg-white text-black' value={category.name}>
                                {category.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-center items-center mt-5 w-full md:w-300">
                <button
                    type="button"
                    onClick={savePin}
                    className="bg-red-500 text-white font-bold p-2 rounded-full w-full  outline-none">
                Save Pin
                </button>
            </div>
        </div>
    )
}

export default Create