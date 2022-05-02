import React, { useEffect, useState } from 'react'
import { Spinner } from '../components'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import { searchQuery, feedQuery } from '../utils/query'
import MasonryLayout from './MasonryLayout'

const Feed = () => {
    const [loading, setLoading] = useState(false)
    const [pins, setPins] = useState(null)
    const { categoryId } = useParams() 

    useEffect(() => {
        setLoading(true)
        if(categoryId) {
            const query = searchQuery(categoryId)
            client.fetch(query)
                .then(data => {
                    setPins(data)
                    setLoading(false)
                })
        } else {
            client.fetch(feedQuery)
                .then(data => {
                    setPins(data)
                    setLoading(false)
                })
        }
        
    },[categoryId])

    console.log(pins);
    console.log(categoryId);
    if(loading) return <Spinner message='Loading...'/>

    return (
        <div className='flex'>
            <MasonryLayout pins={pins}/>
        </div>
    )
}

export default Feed