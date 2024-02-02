'use client'
import React from 'react'
import CasesContent from '../components/usercases'
import Navbar from '../components/navbar'
import styles from '../dashboard/dashboard.module.css'
import CommentsContent from '../components/case'



const page = () => {
  return (
    <div className={styles.background}>
      <div className={styles.page}>
        <Navbar />
        <div className={styles.left}>
          <CasesContent />
        </div>

        <div className={styles.right}>
          <CommentsContent />
        </div>

      </div>



    </div >
  )
}

export default page