import React from 'react'
import './LoginSignup.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import user_icon from '../../assets/person.svg'
import email_icon from '../../assets/email.svg'
import password_icon from '../../assets/password.svg'

export default function Signup(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();
    function handleLoginClick(){
        navigate('/login');
    }

    function submitForm(){
        console.log(name)
        console.log(email);
        console.log(password);
    }
    
    function handleNameChange(e){
        setName(e.target.value);
    }
    function handleEmailChange(e) {
        setEmail(e.target.value);
    }
    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>Sign Up</div>
                <div className='underline'></div>
            </div>
            <form className='inputs' onSubmit={submitForm}>
                <div className='input'>
                    <img src={user_icon} alt='' />
                    <input type='text' placeholder='Name' value={name} onChange={handleNameChange}/>
                </div>
                <div className='input'>
                    <img src={email_icon} alt='' />
                    <input type='email' placeholder='Email' value={email} onChange={handleEmailChange}/>
                </div>
                <div className='input'>
                    <img src={password_icon} alt='' />
                    <input type='password' placeholder='Password' value={password} onChange={handlePasswordChange}/>
                </div>
                <div className='submit-container'>
                    <input className='submit' type='submit' value='Sign Up'/>
                    <button className='submit' onClick={handleLoginClick}> Login</button>
                </div>
            </form>           
        </div>
    )
}