import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/Header';
import Button2 from '../../Components/Button 2'; // Keeping Button2, though it's not used in the JSX
import { supabase } from '../../supabaseClient';
import Button4 from '../../Components/Button4';
import './index.css';

const UpdateProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null); // 👈 ADDED: Ref for the hidden file input

    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [age, setAge] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [userLocation, setUserLocation] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const userEmail = location.state?.userEmail || 'heshanchamuditha05@gmail.com';
            console.log("Fetched user email from state:", userEmail);

            if (!userEmail) {
                console.error("No email provided, redirecting to login.");
                navigate('/login');
                return;
            }

            setEmail(userEmail);

            // Fetch user profile data from your `users` table
            const { data: profileData, error: profileError } = await supabase
                .from('users')
                .select('name, bio, age, imageUrl, location')
                .eq('email', userEmail)
                .single();

            if (profileError) {
                console.error("Error fetching user profile:", profileError.message);
            } else {
                setName(profileData.name || '');
                setBio(profileData.bio || '');
                setAge(profileData.age || '');
                setAvatarUrl(profileData.imageUrl || null);
                setUserLocation(profileData.location || '');
            }

            setLoading(false);
        };

        fetchUserData();
    }, [navigate, location.state]);

    // 👈 ADDED: Function to programmatically click the hidden file input
    const handleAvatarClick = () => {
        if (fileInputRef.current && !uploading) {
            fileInputRef.current.click(); 
        }
    };

    const handleImageUpload = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: publicUrl } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl.publicUrl);
        } catch (error) {
            alert(error.message);
            console.error('Error uploading image:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Ensure age is stored as a number (Supabase may enforce types)
        const ageValue = age ? parseInt(age, 10) : null;

        const { error: profileError } = await supabase
            .from('users')
            .update({ name, bio, age: ageValue, imageUrl: avatarUrl, location: userLocation })
            .eq('email', email);

        if (profileError) {
            console.error("Error updating profile:", profileError.message);
            alert("Error updating profile.");
        } else {
            alert("Profile updated successfully!");
            navigate('/login');
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="parentContainer">
                <div className="container">
                    <Header />
                    <h1 style={{ margin: 'auto', textAlign: 'center', color: '#e94e9f' }}>...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="parentContainer">
            <div className="container">
                <Header />
                <h1 
                    style={{ 
                        margin: '0px', 
                        color: '#e94e9f', 
                        textAlign: 'left',
                        marginBottom: '40px' 
                    }}
                >
                    Edit Profile
                </h1>

                <form 
                    onSubmit={handleUpdateProfile} 
                    style={{ 
                        width: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center' 
                    }}
                >
                    {/* ADDED: onClick handler and pointer style */}
                    <div 
                        className="avatarContainer"
                        onClick={handleAvatarClick} 
                        style={{ cursor: uploading ? 'default' : 'pointer' }}
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="avatarImage" draggable="false"/>
                        ) : (
                            // Using a button/label to show it's clickable when no image is present
                            <div className="noAvatarPlaceholder">
                                {uploading ? 'Uploading...' : 'Tap to Upload'} 
                            </div>
                        )}
                        <input
                            ref={fileInputRef} // 👈 ADDED: Attach the ref here
                            style={{ visibility: 'hidden', position: 'absolute' }}
                            type="file"
                            id="single"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                        />
                    </div>

                    {/* Email Input (Read Only) */}
                    <div style={{ width: '100%', marginBottom: '20px', marginTop: '5%' }}>
                        <input
                            placeholder="Email"
                            type="email"
                            id="email"
                            value={email}
                            readOnly
                            className="input1"
                        />
                    </div>
                    
                    {/* Name Input */}
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <input
                            placeholder="Name"
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input1"
                        />
                    </div>

                    {/* Bio Input */}
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <input
                            placeholder="Bio"
                            type="text"
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="input1"
                        />
                    </div>
                    
                    {/* Age Input */}
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <input
                            placeholder="Age"
                            type="number"
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="input1"
                        />
                    </div>

                    {/* Location Input */}
                    <div style={{ width: '100%', marginBottom: '25%' }}>
                        <input
                            placeholder="Location"
                            type="text"
                            id="location"
                            value={userLocation}
                            onChange={(e) => setUserLocation(e.target.value)}
                            className="input1"
                        />
                    </div>
                    
                    <Button4 text={loading ? "Saving..." : "Save"} disabled={loading} onClick={handleUpdateProfile} />
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;