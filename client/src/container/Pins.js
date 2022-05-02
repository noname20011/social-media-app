import React, { useState } from 'react'
import { Navbar, Feed, Create, PinDetail, Search} from '../components'
import { Routes, Route } from 'react-router-dom'

const Pins = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className='px-7 md:px-5'>
            <div className='bg-grey-50'>
                <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} />
            </div>
            <div className='h-full'>
                <Routes>
                    <Route path='/' element={<Feed/>} />
                    <Route path='/categories/:categoryId' element={<Feed/>} />
                    <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>} />
                    <Route path='/post/detail/:pinId' element={<PinDetail user={user}/>} />
                    <Route path='/create' element={<Create user={user}/>} />
                </Routes>
            </div>
        </div>
    )
}

export default Pins