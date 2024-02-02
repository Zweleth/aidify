//===================================================================================================================================
//Create new comment
//===================================================================================================================================


'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@fluentui/react-components';
import { addComment } from '../api/cases';
import styles from './comment.module.css'


const CreateComment: React.FC = () => {
    const [description, setDesc] = useState('');
    const router = useRouter();
    const user_id = localStorage.getItem('user_id')
    const case_id = localStorage.getItem('case_id')
    const likes = 0

    //Call create comment function
    const handleCreate = async () => {
        try {
            const token = await addComment({ case_id, user_id, description, likes });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.cont}>
            <form action="" className={styles.form}>
                <input
                    required
                    value={description}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <button onClick={handleCreate}>Submit</button>
            </form>

        </div>
    );
};

export default CreateComment;