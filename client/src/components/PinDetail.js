import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/query';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
    const [pins, setPins] = useState(null)
    const [pinDetail, setPinDetail] = useState(null)
    const [comment, setComment] = useState('')
    const [addComment, setAddComment] = useState(false)
    const { pinId } = useParams()

    const fetchPinDetail = () => {
        const query = pinDetailQuery(pinId)
        if(query) {
            client.fetch(query)
                .then((data) => {
                    setPinDetail(data[0])

                    if(data[0]) {
                        const query1 = pinDetailMorePinQuery(data[0])

                        client.fetch(query1)
                            .then(res => setPins(res))
                    }
                })
        }
    }

    useEffect(() => {
        fetchPinDetail()
    }, [pinId])

    const addComments = () => {
        if(comment) {
            setAddComment(true)
            client.patch(pinId)
                .setIfMissing({ comments: [] })
                .insert('after', 'comments[-1]', [{
                    comment,
                    _key: uuidv4(),
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user._id 
                    }
                }])
                .commit()
                .then(() => {
                    fetchPinDetail()
                    setComment('')
                    setAddComment(false)
                })
        }
    }

    if(!pinDetail) return <Spinner/>
    console.log(pinDetail);
    return (
        <>
            { pinDetail && (
                <div className='flex xl-flex-row flex-col m-auto mt-4 md:mt-10 bg-white ' style={{maxWidth: '968px', borderRadius: '32px'}}>
                    <div className='pt-4 flex justify-center items-center md:items-start flex-initial max-w-sm m-auto'>
                        <img src={pinDetail?.image && urlFor(pinDetail?.image).url()} alt='picture' className="rounded-t-3xl rounded-b-lg "/>
                    </div>
                    <div className='w-full p-5 flex-1 xl:min-w-620 pl-10'>
                        <div className='flex justify-between items-center justify-evenly'>
                            <div className='flex gap-2 items-center'>
                                <a
                                    href={`${pinDetail.image.asset.url}?dl=`}
                                    download
                                    className="bg-secondaryColor p-2 text-xl rounded-xl gap-2 flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                                    >
                                    Download
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            <a href={pinDetail.destination} target="_blank" rel="noreferrer"
                                className='bg-pink-500 p-2 text-xl rounded-xl gap-2 text-white opacity-75 hover:opacity-100'>
                                Explore
                            </a>
                        </div>
                        <Link to={`/profile/${pinDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
                            <img src={pinDetail?.postedBy.imageUrl} className="w-10 h-10 rounded-full" alt="user-profile" />
                            <p className="font-bold">{pinDetail?.postedBy.userName}</p>
                        </Link>
                        <div>
                            <p className="mt-4 ml-10">{pinDetail.about}</p>
                        </div>
                        <div className='mt-4 border-b-2 border-grey-300 w-full'></div>
                        <h2 className="mt-5 text-xl">Comments</h2>
                        <div className="max-h-370 overflow-y-auto">
                            {pinDetail?.comments?.map((item) => (
                                <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={item.comment}>
                                    <img
                                        src={item?.postedBy.imageUrl}
                                        className="w-8 h-8 rounded-full cursor-pointer"
                                        alt="user-profile"/>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold">{item.postedBy?.userName}</p>
                                        <p className='text-sm'>{item.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap mt-6 gap-3">
                            <Link to={`/profile/${user?._id}`}>
                                <img src={user?.imageUrl} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
                            </Link>
                            <input
                                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                                type="text"
                                placeholder="Add a comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}/>
                            <button
                                type="button"
                                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                                onClick={addComments}
                            >
                                {addComment ? 'Doing...' : 'Done'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {pins?.length > 0 && (
                <h2 className="text-center font-bold text-2xl mt-8 mb-4">More like this</h2>
            )}
            {pins ? (
                <MasonryLayout pins={pins} />
            ) : (
                <Spinner message="Loading more pins" />
            )}
        </>
    )
}

export default PinDetail