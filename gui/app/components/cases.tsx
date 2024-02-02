'use client'
import { useEffect, useState } from 'react';
import { fetchCases, fetchComments } from '../api/cases';
import styles from './cases.module.css'
import Link from "next/link";



const CasesContent: React.FC = () => {
  const [cases, setCases] = useState([]);



  const getComments = async (case_id) => {
    localStorage.setItem('case_id', case_id)
    location.reload()
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCases();
        setCases(data.cases);
      } catch (error) {
        console.error('Failed to fetch cases:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className={styles.heading}><h2>Support cases</h2><button><Link href="/create" className={styles.link}><p>Create case</p></Link></button></div>
      <div className={styles.scroll}>
        <div className={styles.caseList}>
          {cases.map((item) => (
            <div key={item.case_id} className={styles.case} onClick={() => getComments(item.case_id)}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.desc}>{item.description}</p>
              <p className={styles.replies}>{item.num_of_replies} replies</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CasesContent;