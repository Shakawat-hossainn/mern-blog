import React from 'react';
import { Button } from 'flowbite-react';
import { FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../features/User/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = getAuth(app);

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const { displayName, email, photoURL } = resultsFromGoogle.user;

            const res = await fetch('/api/v1/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ displayName, email, photoURL }), // Correctly stringify the object
            });

            const data = await res.json();
            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Button className="flex w-full" outline gradientDuoTone="purpleToBlue" onClick={handleGoogleClick}>
                <span className="relative top-[2px] left-[-17px] text-xl">
                    <FaGoogle />
                </span>{' '}
                <span>Continue with Google</span>
            </Button>
        </div>
    );
};

export default OAuth;
