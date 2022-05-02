import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { GoogleLogin } from 'react-google-login'
import LogoWhite from '../assets/logowhite.png'
import Video from '../assets/share.mp4' 
import { useNavigate } from 'react-router-dom'
import { urlFor, client } from '../client'


const Login = () => {
    const navigate = useNavigate()
    
    const responseSuccess = (res) => {
        localStorage.setItem('user', JSON.stringify(res.profileObj))
        
        const { googleId, name, imageUrl } = res.profileObj
        const doc = {
            _id: googleId,
            _type: 'user',
            userName: name,
            imageUrl: imageUrl
        }

        client.createIfNotExists(doc)
            .then(() => {
                navigate('/', { replace: true })
                urlFor(imageUrl)
            })
            .catch(err => {console.log('ERR: ', err);})
    }
    
    const responseFailure = () => {
        console.log('Sign in failure!');
    }

    return (
        <div className='h-screen justify-start items-center start-col'>
            <div className='relative h-full w-full'>
                <video className='h-full w-full object-cover' 
                type='video/mp4'
                src={Video}
                loop
                controls={false}
                muted
                autoPlay
                />
                <div className=' absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-blackOverlay'>
                    <div className='p-5'>
                        <img width={130} src={LogoWhite} alt='logo' />
                    </div>
                    <div className='shadow-2xl'>
                        <GoogleLogin
                            clientId= '593365380236-m2d8rfm1coptppqebha102c93akj8jkq.apps.googleusercontent.com'
                            render={(renderProps) => (
                                <button type='button' className='flex items-center p-2 bg-mainColor rounded-md cursor-pointer outline-none'
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}>
                                    <FcGoogle className='mr-2'/> Sign in with Google
                                </button>
                            )}
                            onSuccess={responseSuccess}
                            onFailure={responseFailure}
                            cookiePolicy="single_host_origin"
                        />
                    </div>
                </div>
            </div>
        </div>  
    )
}

export default Login