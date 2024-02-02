'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@fluentui/react-components';
import { login } from '../api/login';
import Link from "next/link";
import styles from './page.module.css'


const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    localStorage.removeItem('token')
    localStorage.removeItem('case_id')
    localStorage.removeItem('user_id')
    localStorage.removeItem('')


    const handleLogin = async () => {
        try {
            const data = await login({ username, password });
            // Store the token in local storage or global state
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.user_id)
            window.location.href = "http://localhost:3000/dashboard";
        }
        catch (error) {
            alert("Invalid password or username")
        }
    };

    return (
        <div className={styles.background}>

            <form action="" className={styles.form}>
                <h2>Log in</h2>
                <p>Username</p>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
                <p>Password</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className={styles.dont}>Don't have an account? <Link href="/register">Sign up</Link></p>
                <Button onClick={handleLogin}>Login</Button>
            </form>

        </div>
    );
};

export default LoginPage;