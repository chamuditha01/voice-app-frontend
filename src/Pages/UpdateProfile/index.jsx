import  { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/Header';
import { supabase } from '../../supabaseClient';
import Button4 from '../../Components/Button4';
import './index.css';

const UpdateProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [age, setAge] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [userLocation, setUserLocation] = useState('');
    
    // State to handle processing indicator
    const [processingImage, setProcessingImage] = useState(false); 
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

    const handleAvatarClick = () => {
        // Only allow click if not busy
        if (fileInputRef.current && !uploading && !processingImage) {
            fileInputRef.current.click(); 
        }
    };

    // --- UPDATED: handleImageUpload function for Cloudinary backend on PORT 3001 ---
    const handleImageUpload = async (event) => {
        try {
            setUploading(true); // Start general uploading state
            setProcessingImage(true); // Start specific processing state

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            
            // 1. Prepare data for the backend
            const formData = new FormData();
            formData.append('profilePhoto', file); 
            // Send the user's email/unique identifier to the backend
            formData.append('userId', email); 
            
            // 2. Send image to your Node.js/Cloudinary backend endpoint
            const backendUrl = 'http://localhost:3001/upload-profile-photo'; // 👈 Node.js/Cloudinary Endpoint
            
            const response = await fetch(backendUrl, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle errors returned by the backend (details is from the Cloudinary server)
                throw new Error(data.details || data.error || `Backend failed with status ${response.status}`);
            }

            // 3. Update avatar URL with the processed image link from the backend
            setAvatarUrl(data.imageUrl); 
            alert("Profile image processed and updated!");
            
        } catch (error) {
            alert(`Error updating image: ${error.message}`);
            console.error('Error updating image:', error);
        } finally {
            setUploading(false); // End general uploading state
            setProcessingImage(false); // End specific processing state
        }
    };
    // -----------------------------------------------------------

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Ensure age is stored as a number (Supabase may enforce types)
        const ageValue = age ? parseInt(age, 10) : null;

        // Save the updated profile data, including the new avatarUrl
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
    
    // Use combined state for disabling buttons and showing indicators
    const isBusy = loading || uploading || processingImage;

    if (loading) {
        return (
            <div className="parentContainer">
                <div className="container">
                    <Header />
                    <h1 style={{ margin: 'auto', textAlign: 'center', color: '#e94e9f' }}>Loading...</h1>
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
                    
                    <div 
                        className="avatarContainer"
                        onClick={handleAvatarClick} 
                        style={{ cursor: isBusy ? 'default' : 'pointer' }}
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="avatarImage" draggable="false"/>
                        ) : (
                            <div className="noAvatarPlaceholder">
                                {/* Indicator shows if it's currently processing */}
                                {processingImage ? 'Processing Image...' : (uploading ? 'Uploading...' : 'Tap to Upload')} 
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            style={{ visibility: 'hidden', position: 'absolute' }}
                            type="file"
                            id="single"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isBusy}
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
                            disabled={isBusy}
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
                            disabled={isBusy}
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
                            disabled={isBusy}
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
                            disabled={isBusy}
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
                            disabled={isBusy}
                        />
                    </div>
                    
                    <Button4 text={isBusy ? "Processing..." : "Save"} disabled={isBusy} onClick={handleUpdateProfile} />
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;