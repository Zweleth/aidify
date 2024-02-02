'use client'
import { useEffect, useState } from 'react';
import { fetchCases, fetchComments } from '../api/cases';
import styles from './case.module.css'
import CreateComment from '../components/comment'

const CommentsContent: React.FC = () => {
  const [comments, setComments] = useState([]);
  const [selcases, setCase] = useState([]);



  const id = {
    case_id: localStorage.getItem('case_id')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchComments(id);
        setComments(data.comments);
        setCase(data.case)
      } catch (error) {
        console.error('Failed to fetch cases:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Comments</h2>
      <div className={styles.cont}>

        <div className={styles.caseList}>
          {selcases.map((item) => (
            <div key={item.case_id} className={styles.case}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.desc}>{item.description}</p>
            </div>
          ))}
        </div>
        <div className={styles.commentList}>
          {comments.map((item) => (
            <div key={item.comment_id} className={styles.comment}>
              <p className={styles.commentDesc}>{item.description}</p>
              <p className={styles.likes}>{item.likes} likes</p>

            </div>
          ))}
        </div>
      </div>
      <CreateComment />
    </div>
  );
};

export default CommentsContent;