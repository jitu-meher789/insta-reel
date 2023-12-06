import { useContext, useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { db } from "./firebase";

import "./Profile.css";
import { doc, getDoc } from "firebase/firestore";

let Profile = () => {
  let value = useContext(AuthContext);
  let [postCount, setPostCount] = useState(0);
  let [totalPosts, setTotalPosts] = useState([]);
  let [playing, setPlaying] = useState(true);
  console.log(value);

  useEffect(() => {
    let f = async () => {
      let userRef = doc(db, "users", value.uid);
      let userRefDoc = await getDoc(userRef);
      let userPostsLen = userRefDoc.data().posts.length;
      let userPosts = userRefDoc.data().posts;
      setPostCount(userPostsLen);
      setTotalPosts(userPosts);
    };

    f();
  });

  return (
    <>
      {value ? (
        <div className="profile-container">
          <Link
            style={{ position: "absolute", left: "1rem", top: "1rem" }}
            to="/home"
          >
            <button id="" style={{backgroundColor:"black", border:"none"}}>
              <span class="material-symbols-outlined" style={{color:"white", fontSize:"2rem"}}>arrow_back</span>
            </button>
          </Link>
          <div className="profile-details">
            <div className="profile-pic1">
              <img src={value.photoURL} alt="profile picture"></img>
            </div>
            <div className="profiles-info">
              <div>Posts : {postCount}</div>
              <div>User Name : {value.displayName}</div>
              <div>Follower : {}</div>
            </div>
          </div>
          <div className="profile-posts">
            <div className="container text-center">
              <div className="row row-cols-3">
                {totalPosts.map((post, index) => {
                  return (
                    <div className="col ">
                      <video
                        onClick={(e) => {
                          if (playing) {
                            setPlaying(false);
                            e.currentTarget.pause();
                          } else {
                            setPlaying(true);
                            e.currentTarget.play();
                          }
                        }}
                        style={{
                          width: "100%",
                          height: "96%",
                          objectFit: "fill",
                        }}
                        src={post}
                      ></video>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

export default Profile;
