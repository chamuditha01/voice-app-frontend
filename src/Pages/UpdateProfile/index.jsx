import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/Header';
import Button2 from '../../Components/Button 2';
import { supabase } from '../../supabaseClient';

const UpdateProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState(''); // New state for name
    const [bio, setBio] = useState('');
    const [age, setAge] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const userEmail = location.state?.userEmail || 'heshanchamuditha05@gmail.com';

            if (!userEmail) {
                console.error("No email provided, redirecting to login.");
                navigate('/login');
                return;
            }

            setEmail(userEmail);

            // Fetch user profile data from your `users` table
            const { data: profileData, error: profileError } = await supabase
                .from('users')
                .select('name, bio, age, imageUrl') // Select the new 'name' column
                .eq('email', userEmail)
                .single();

            if (profileError) {
                console.error("Error fetching user profile:", profileError.message);
            } else {
                setName(profileData.name || ''); // Set the name state
                setBio(profileData.bio || '');
                setAge(profileData.age || '');
                setAvatarUrl(profileData.imageUrl || null);
            }

            setLoading(false);
        };

        fetchUserData();
    }, [navigate, location.state]);

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

        const { error: profileError } = await supabase
            .from('users')
            .update({ name, bio, age, imageUrl: avatarUrl }) // Include 'name' in the update
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
            <div style={styles.container}>
                <Header />
                <h1 style={{ margin: 'auto', textAlign: 'center', color: '#e94e9f' }}>Loading profile...</h1>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Header />
            <h1 style={{ margin: '0px', color: '#e94e9f', textAlign: 'left' }}>Update Your Profile</h1>

            <form onSubmit={handleUpdateProfile} style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={styles.avatarContainer}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" style={styles.avatarImage} />
                    ) : (
                        <div style={styles.noAvatarPlaceholder}>No Image</div>
                    )}
                    <label style={styles.avatarUploadLabel} htmlFor="single">
                        {uploading ? 'Uploading...' : 'Upload an image'}
                    </label>
                    <input
                        style={{ visibility: 'hidden', position: 'absolute' }}
                        type="file"
                        id="single"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                </div>

                <div style={{ width: '100%', marginBottom: '20px', marginTop: '25%' }}>
                    <input
                        placeholder="Email"
                        type="email"
                        id="email"
                        value={email}
                        readOnly
                        style={styles.input}
                    />
                </div>
                
                {/* New input field for name */}
                <div style={{ width: '100%', marginBottom: '20px' }}>
                    <input
                        placeholder="Name"
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={{ width: '100%', marginBottom: '20px' }}>
                    <input
                        placeholder="Bio"
                        type="text"
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={{ width: '100%', marginBottom: '25%' }}>
                    <input
                        placeholder="Age"
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <Button2 text="Update Profile" onClick={handleUpdateProfile} />
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        boxSizing: 'border-box',
        maxWidth: '360px',
        minWidth: '360px',
        padding: '20px',
    },
    input: {
        width: '100%',
        border: 'none',
        borderBottom: '1px solid #ccc',
        padding: '10px 0',
        background: 'transparent',
        fontSize: '18px',
        color: '#333',
        outline: 'none',
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
    },
    avatarImage: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '10px',
    },
    noAvatarPlaceholder: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#e0e0e0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10px',
        color: '#888',
    },
    avatarUploadLabel: {
        backgroundColor: '#e94e9f',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        cursor: 'pointer',
    },
};

export default UpdateProfile;