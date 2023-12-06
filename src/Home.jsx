import { useContext, useEffect, useRef, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { auth, storage } from "./firebase";
import { AuthContext } from "./AuthProvider";
import VideoCard from "./VideoCard";
import "./Home.css";
import Navigation from "./Navigation";
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

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Home = () => {
  let value = useContext(AuthContext);
  let [posts, setPosts] = useState([]);
  let [uploading, setUploading] = useState("");
  let [status, setStatus] = useState("");

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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

          <div className="fsfsfs">
            <div>
              <span class="material-symbols-outlined">person</span>
              <Link to="/profile">
                <button id="profile">Profile</button>
              </Link>
            </div>

            <div>
              <span class="material-symbols-outlined">add</span>
              <div class="file-input-wrapper">
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
                      getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
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
                        }
                      );
                    };

                    let storageRef = ref(
                      storage,
                      `/posts/${value.uid}/${Date.now() + name}`
                    );

                    const uploadTask = uploadBytesResumable(storageRef, file);

                    uploadTask.on("state_changed", f1, f2, f3);
                  }}
                  className="upload-btn file-input"
                  type="file"
                />
                <label for="fileInput" class="file-label">
                  Choose a file
                </label>
              </div>
            </div>

            <div>
              <span class="material-symbols-outlined">logout</span>
              <button
                className="logout-btn"
                onClick={() => {
                  auth.signOut();
                }}
              >
                Sign Out
              </button>
            </div>
          </div>

          <Box
              className="mui-box21"
              sx={{
                display: "flex",
                position: "absolute",
                top: "0rem",
                left: "0rem",
                color: "white",
              }}
            >
              <IconButton
                color="inherit"
                onClick={handleDrawerOpen}
                sx={{
                  mr: 2,
                  ...(open && {
                    display: "none",
                    width: "2rem",
                    height: "2rem",
                  }),
                }}
              >
                <MenuIcon sx={{ fontSize: "2rem" }} />
              </IconButton>

              <Drawer
                className="mui-drawer32"
                sx={{
                  width: 240,
                  flexShrink: 0,
                 
                  "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" ,  borderRight : "1px solid white !important",},
                }}
                variant="persistent"
                anchor="left"
                open={open}
              >
                <IconButton sx={{
                  color: "white",
                  border: "1px solid",
                  position: "relative",
                  left: "5rem",
                  top: "0.5rem",
                  backgroundColor: "#626262",
                  borderRadius: "5px",
                }} onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>

                <div>
                  <span class="material-symbols-outlined">person</span>
                  <Link to="/profile">
                    <button id="profile1">Profile</button>
                  </Link>
                </div>

                <div >
                  <span className="material-symbols-outlined">add</span>
                  <div className="file-input-wrapper">
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
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
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
                          getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL) => {
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
                            }
                          );
                        };

                        let storageRef = ref(
                          storage,
                          `/posts/${value.uid}/${Date.now() + name}`
                        );

                        const uploadTask = uploadBytesResumable(
                          storageRef,
                          file
                        );

                        uploadTask.on("state_changed", f1, f2, f3);
                      }}
                      className="upload-btn file-input"
                      type="file"
                    />
                    <label for="fileInput" class="file-label">
                      Choose a file
                    </label>
                  </div>
                </div>

                <div>
                  <span class="material-symbols-outlined">logout</span>
                  <button
                    className="logout-btn1"
                    onClick={() => {
                      auth.signOut();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </Drawer>
            </Box>
        </>
      ) : (
        <Redirect to="/" />
      )}
    </div>
  );
};

export default Home;
