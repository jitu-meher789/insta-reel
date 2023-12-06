import React from "react";
import { createContext, useEffect } from "react";
import { useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";



export const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  let [currentUser, setCurrentUser] = useState(null);
  let [loading, setLoading] = useState(true);

  

  useEffect(() => {
    let unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        let { displayName, email, photoURL, uid } = user;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            displayName,
            email,
            photoURL,
            posts: [],
          });
        }
            setCurrentUser({ displayName, email, photoURL, uid });
        } else {
            setCurrentUser(user); 
        }
        
        setLoading(false);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
