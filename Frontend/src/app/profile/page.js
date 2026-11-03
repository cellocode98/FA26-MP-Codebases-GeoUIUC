// Profile Page
// Route: /profile

"use client"

import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import SignOut from "@/components/SignoutButton";
import DeleteAccount from "@/components/DeleteAccountButton";
import {auth, db} from "../../components/firebase-config"
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore'

export default function Profile() {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [docSnap, setDocSnap] = useState();

  useEffect(() => {
    setProfilePic(localStorage.getItem("profilePic"));
    setName(localStorage.getItem("name"));
    setEmail(localStorage.getItem("email"));
    // auth.currentUser is null until Firebase restores the session after a page load,
    // so wait for the auth state instead of reading it right away.
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      const docSnap = await getDoc(doc(db, "users", user.uid));
      setDocSnap(docSnap)
    });
    return () => unsub();
  }, [router]);


  return (
    <div className={styles['container-with-background']}>
      
      <Link href= "\lobby">
        <img className={styles.logo} src="./logo.png" />
      </Link>
    
      <div className={styles.container}>
        
        <div className={styles.profileContainer}>
          <img className={styles.img} referrerPolicy="no-referrer" src={profilePic} />
          <h1>{name}</h1>
          <h3>Email: {email}</h3>
        </div>

        <div className={styles.profileContainer2}>
          <h1>High Score: {docSnap ? docSnap.get("highScore") : 0} </h1>
          <h1>Total Points: {docSnap ? docSnap.get("totalPoints") : 0} </h1>
          <br></br>
          <div className={styles['button-container']}>
            <SignOut/>
            <DeleteAccount/>
          </div>
        </div>
        
      </div>
    </div>
  );
}