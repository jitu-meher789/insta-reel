import { useContext, useEffect, useRef, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { auth, storage } from "./firebase";
import { AuthContext } from "./AuthProvider";
import VideoCard from "./VideoCard";
import "./Home.css";
import {
  collection,
  query,
  doc,
  getDocs,
  addDoc,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateCurrentUser } from "firebase/auth";

const Home = () => {
  let value = useContext(AuthContext);
  let [posts, setPosts] = useState([]);
  let [uploading, setUploading] = useState("");
  let [status, setStatus] = useState("");

  useEffect(() => {
    // const q = query(collection(db, "posts"));
    let unsubscription = onSnapshot(
      query(collection(db, "posts")),
      (querySnapshot) => {
        let arr = [];
        querySnapshot.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
          // console.log(doc.data().likes);
        });

        setPosts(arr);
      }
    );

    return () => {
      unsubscription();
    };
  }, []);


  // useEffect(() => {
  //   let f = async () => {

  //     let temp = await getDoc(doc(db, "users", value.uid));
  //     console.log(temp.data().posts);
  //   };
  //   f();
  // }, []);



  return (
    <div>
      {value ? (
        <>
          <div className="posts-container">
            {posts.map((post, index) => {
              return <VideoCard key={index} post={post} />;
            })}
          </div>
          <div className="download-state">
            {status}
            {uploading}
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              auth.signOut();
            }}
          >
            Sign Out
          </button>
          <Link to="/profile">
            <button id="profile">Profile</button>
          </Link>
          <input
            onClick={(e) => {
              e.target.value = null;
            }}
            onChange={(e) => {
              // if user cancelled,
              if (!e.target.files[0]) return;

              let { name, size, type } = e.target.files[0];
              let file = e.target.files[0];
              size = size / 1000000;
              type = type.split("/")[0];

              if (type != "video") {
                alert("Please select a video");
                return;
              }

              if (size > 30) {
                alert("File is too big!");
                return;
              }

              let f1 = (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                let progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                progress = ~~progress;

                setUploading(progress);
                switch (snapshot.state) {
                  case "paused":
                    console.log("Upload is paused");
                    break;
                  case "running":
                    console.log("Upload is running");
                    break;
                }
                if (progress == 100) {
                  setUploading("");
                }
                if (progress < 100) {
                  setStatus("Uploading:");
                } else if (progress == 100) {
                  setStatus("Done");
                  setTimeout(function () {
                    setStatus("");
                  }, 2000);
                }
              };

              let f2 = (error) => {
                console.log(error);
              };

              let f3 = () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  addDoc(collection(db, "posts"), {
                    username: value.displayName,
                    downloadURL,
                    photoURL: value.photoURL,
                    likes: 0,
                    comments: [],
                  });

                  let updateUserPost = async () => {
                    let userRef = doc(db, "users", value.uid);
                    let dataTemp = await getDoc(userRef);
                    let postData = dataTemp.data().posts;
                    await updateDoc(userRef, {
                      posts: [...postData, downloadURL],
                    });
                  };
                  updateUserPost();
                });
              };

              let storageRef = ref(
                storage,
                `/posts/${value.uid}/${Date.now() + name}`
              );

              const uploadTask = uploadBytesResumable(storageRef, file);

              uploadTask.on("state_changed", f1, f2, f3);
            }}
            className="upload-btn"
            type="file"
          />
        </>
      ) : (
        <Redirect to="/" />
      )}
    </div>
  );
};

export default Home;
