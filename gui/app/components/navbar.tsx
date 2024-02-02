'use client'
import React from 'react'
import styles from './navbar.module.css'
import Link from "next/link";

const navbar = () => {
  return (
    <div className={styles.nav}>
      <div className={styles.logo}>
        <h3>aidify</h3>
      </div>
      <div className={styles.links}>
        <Link href="/dashboard" className={styles.link}><p>Dashboard</p></Link>
        <Link href="/create" className={styles.link}><p>Create case</p></Link>
        <Link href="/my_cases" className={styles.link}><p>My cases</p></Link>
        <Link href="/profile" className={styles.link}><p>Profile</p></Link>
      </div>
      <div className={styles.logout}>
        <Link href="/login" className={styles.link} onClick={()=>{localStorage.clear}}><p>Logout</p></Link>
      </div>
    </div>
  )
}

export default navbar