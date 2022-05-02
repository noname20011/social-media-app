import React, { useState, useEffect } from 'react'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/query'


const Search = ({ searchTerm }) => {
    const [pins, setPins] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        if(searchTerm.trim() !== '') {
            const query = searchQuery(searchTerm.toLowerCase())
            client.fetch(query)
                .then(data => {
                    setPins(data)
                    setLoading(false)
                })
        } else {
            client.fetch(useEffect)
                .then(data => {
                    setPins(data)
                    setLoading(false)
                })
        }
    },[searchTerm])

    console.log(pins);

    if(loading) return <Spinner/>
    return (
        <>
        {loading && <Spinner/>}
        {pins?.length !== 0 && <MasonryLayout pins={pins}/>}
        {pins?.length === 0 && <div className='mt-10 text-center text-xl'>No Pins Found!</div>} 
        </>
    )
}

export default Search