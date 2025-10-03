import  { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import { supabase } from '../../supabaseClient';
import Button4 from '../../Components/Button4';
import showPasswordIcon from './show.png';
import hidePasswordIcon from './hide.png';
import './index.css';

const LoginScreen = ({ role }) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Supabase login error:', error.message);
                alert('Login failed: ' + error.message);
            } else {
                console.log('User logged in successfully:', data.user);

                // Fetch the user's session to get their role
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session fetch error:', sessionError.message);
                    alert('Failed to get user session.');
                    return;
                }

                const user = sessionData.session?.user;
                const userRole = user?.user_metadata?.role;

                if (user && userRole) {
                    // Fetch additional user profile data from the `users` table
                    const { data: profileData, error: profileError } = await supabase
                        .from('users')
                        .select('name, age, bio, imageUrl, location')
                        .eq('email', user.email)
                        .single();

                    if (profileError) {
                        console.error('Error fetching user profile data:', profileError.message);
                        alert('Failed to fetch user profile data.');
                        // You can choose to proceed with only email and role or block login
                        // For now, we will proceed.
                    } else {
                        // Save all user data to local storage
                        localStorage.setItem('userEmail', user.email);
                        localStorage.setItem('userRole', userRole);
                        localStorage.setItem('userName', profileData.name || '');
                        localStorage.setItem('userAge', profileData.age || '');
                        localStorage.setItem('userBio', profileData.bio || '');
                        localStorage.setItem('userImageUrl', profileData.imageUrl || '');
                        localStorage.setItem('userLocation', profileData.location || '');

                        console.log('User data saved to local storage.');
                    }

                    // CONDITIONAL NAVIGATION BASED ON ROLE
                    if (userRole === 'learner') {
                        navigate('/speakers');
                    } else if (userRole === 'speaker') {
                        navigate('/sp-dashboard');
                    } else {
                        navigate('/home');
                    }
                } else {
                    console.error('User or role data is missing after login.');
                    alert('An unexpected error occurred. Please try again.');
                }
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
            alert('An unexpected error occurred.');
        }
    };

    return (
        <div className="parentContainer">
    <div className="container">
        {/* Header */}
        <Header />

        {/* Grid Section */}
        <h1 
            style={{ 
                margin: '0px', 
                color: '#e14e97', 
                textAlign: 'left',
                fontSize:'32px',
                fontWeight:'bold', 
                lineHeight:'1.2' 
            }}
        >
            Sign In to start talking right now...
        </h1>

        {/* Inputs connected to state */}
        <div className='customInputWrapper'>
            <input
                placeholder="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input1"
            />
        </div>

        <div className='passwordwrapper'>
            <div className="passwordContainer">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="input1"
                />
                {password.length > 0 && (
                    <img
                        src={showPassword ? showPasswordIcon : hidePasswordIcon}
                        onClick={() => setShowPassword(!showPassword)}
                        className="passwordToggleIcon"
                        alt="Toggle Password Visibility"
                    />
                )}
            </div>
        </div>

        {/* Main Text */}
        <div className="textContainer">
            <p className="mainText">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="mainText">
                Lorem ipsum dolor sit amet, consectetur ipsum adipiscing <a style={{textDecoration:'none'}} href='/signup1'><span style={{color:'#e14e97'}}>Sign Up</span></a> here. 
            </p>
        </div>
     


        {/* Sign up button calls the correct handler */}
        <Button4 text="Sign In" onClick={handleLogin} />
    </div>
</div>
    );
};



export default LoginScreen;