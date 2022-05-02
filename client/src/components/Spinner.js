import React from 'react'
import  { Hearts } from 'react-loader-spinner'

const Spinner = ({ message }) => {
    return (
        <div className='flex justify-center items-center h-340 w-full'>
            <Hearts
                type='TailSpin'
                color= '#D8745E'
                height={50}
                width={200}
                className='m-5'
            />
        </div>
    )
}

export default Spinner