//===================================================================================================================================
//Create new support case
//===================================================================================================================================

'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@fluentui/react-components';
import { createCase } from '../api/cases';
import styles from './form.module.css'


const CreateCase: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDesc] = useState('');
    const router = useRouter();
    const user_id = localStorage.getItem('user_id')

    const handleCreate = async () => {
        try {
            const token = await createCase({ title, description, user_id });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.cont}>
            <div className={styles.heading}>
                <h2>Write a case</h2>
                <button>
                    <p>Cancel</p>
                </button>
            </div>
            <form action="" className={styles.form}>
                <h6>Fill in the form to create a new support case</h6>
                <p>Title</p>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} />
                <p>Description</p>
                <textarea
                    required
                    value={description}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <button onClick={handleCreate}>Submit</button>
            </form>

        </div>
    );
};

export default CreateCase;