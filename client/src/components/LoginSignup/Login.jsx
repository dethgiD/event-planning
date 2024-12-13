import React from 'react'
import './LoginSignup.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../provider/AuthProvider'

import email_icon from '../../assets/email.svg'
import password_icon from '../../assets/password.svg'

export default function Login(){
    const api = 'https://event-planning-l5he.onrender.com/api/auth/login';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { setToken } = useAuth();
    function handleSignupClick(){
        navigate('/signup');
    }

    async function submitForm(e){
        e.preventDefault();

        try{
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            })
            if (response.ok){
                const data = await response.json();
                const token = data.token;
                setToken(token);
                //axios.defaults.headers.common["Authorization"] = "Bearer " + token;
                //localStorage.setItem('token', token);
                console.log(token);
                navigate('/');           
            }else{
                const errorData = await response.json();
                console.error('Error:', errorData.message || 'Unknown error');
                alert(errorData.message || 'Login failed. Please try again.');
            }
        }catch(error){
            console.error('Error fetching data:', error.message)
        }
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
                <div className='text'>Login</div>
                <div className='underline'></div>
            </div>
            <form className='inputs' onSubmit={submitForm}>
                <div className='input'>
                    <img src={email_icon} alt='' />
                    <input type='email' placeholder='Email' value={email} onChange={handleEmailChange}/>
                </div>
                <div className='input'>
                    <img src={password_icon} alt='' />
                    <input type='password' placeholder='Password' value={password} onChange={handlePasswordChange}/>
                </div>
                <div className='submit-container'>
                    <button className='submit' onClick={handleSignupClick}>Sign Up</button>
                    <input className='submit' type='submit' value="Login"/>
                </div>
            </form>           
        </div>
    )
}