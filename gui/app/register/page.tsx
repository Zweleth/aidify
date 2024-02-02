'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@fluentui/react-components';
import { register } from '../api/login';
import Link from "next/link";
import styles from './page.module.css'


const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    localStorage.removeItem('token')
    localStorage.removeItem('case_id')
    localStorage.removeItem('user_id')
    localStorage.removeItem('')


    const handleLogin = async () => {
        try {
            const data = await register({ username, password });
            // Store the token in local storage or global state
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.user_id)
        }
        catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className={styles.background}>

            <form action="" className={styles.form}>
                <h2>Sign up</h2>
                <p>Username</p>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
                <p>Password</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className={styles.dont}>Already have an account? <Link href="/login">Log in</Link></p>
                <Link href="/login"><Button onClick={handleLogin}>Sign up</Button></Link>
            </form>

        </div>
    );
};

export default Register;