'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Input } from '@fluentui/react-components';
import { createCase } from '../api/cases';


'use client'
import React from 'react'
import CreateForm from '../components/form'
import Navbar from '../components/navbar'
import styles from './create.module.css'
import CommentsContent from '../components/case'



const page = () => {
  return (
    <div className={styles.background}>
      <div className={styles.page}>
        <Navbar />
        <div className={styles.left}>
          <CreateForm />
        </div>

        <div className={styles.right}>
          <CommentsContent />
        </div>

      </div>



    </div >
  )
}

export default page