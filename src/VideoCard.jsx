import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { db } from "./firebase";
import { collection, doc, addDoc, updateDoc, getDoc } from "firebase/firestore";

const VideoCard = (props) => {
  let [boxOpen, setBoxOpen] = useState(false);
  let [playing, setPlaying] = useState(true);
  let [mute, setMute] = useState(false);
  let [play, setPlay] = useState(true);
  let [currentUserComment, setCurrentUserComment] = useState("");
  let [allComments, setAllComments] = useState([]);
  let value = useContext(AuthContext);
  let [like, setLike] = useState("");
  // let [likeCount, setLikeCount] = useState(0);


  useEffect(() => {
    const fetchComments = async () => {
      let allCommentId = props.post.comments;
      let arr = [];

      for (let i = 0; i < allCommentId.length; i++) {
        let commentId = allCommentId[i];

        const commentIdRef = doc(db, "comments", commentId);
        const docSnap = await getDoc(commentIdRef);

        const commentData = { ...docSnap.data(), id: docSnap.id };
        arr.push(commentData);
      }
      setAllComments(arr);
    };
    fetchComments();
  }, [props.post.comments]);


  return (
    <div className="video-card">
      <video
        onClick={(e) => {
          if (play) {
            setPlay(false);
          } else {
            setPlay(true);
          }

          if (playing) {
            setPlaying(false);
            e.currentTarget.pause();
          } else {
            setPlaying(true);
            e.currentTarget.play();
          }
        }}
        muted={mute}
        src={props.post.downloadURL}
      ></video>
      <div
        onClick={(e) => {
          if (!mute) {
            setMute(true);
          } else {
            setMute(false);
          }
        }}
        className="volume-div"
      >
        {mute ? (
          <span className="material-symbols-outlined ">volume_off</span>
        ) : (
          <span className="material-symbols-outlined volume">volume_up</span>
        )}
      </div>

      {!play ? (
        <div className="pause-play-div">
          <span className="material-symbols-outlined play">play_arrow</span>
        </div>
      ) : (
        ""
      )}

      <span
        onClick={async () => {
          if (like === "") {
            setLike("red");
            await updateDoc(doc(db, "posts", props.post.id), {
              likes: props.post.likes + 1,
            });
          } else {
            setLike("");
            await updateDoc(doc(db, "posts", props.post.id), {
              likes: props.post.likes - 1,
            });
          }
        }}
        className="material-symbols-outlined like"
        style={{ color: `${like}` }}
      >
        favorite
      </span>
      <div>
        <span className="like-count">{props.post.likes}</span>
      </div>
      <span
        className="material-symbols-outlined comment"
        onClick={() => {
          boxOpen ? setBoxOpen(false) : setBoxOpen(true);
        }}
      >
        chat_bubble
      </span>
      <span className="material-symbols-outlined share">send</span>
      <span className="profile-pic">
        <img src={props.post.photoURL} alt="" />
      </span>
      <p className="username">
        <b>{props.post.username}</b>
      </p>
      <p className="song">
        <span className="material-symbols-outlined">music_note</span>
        {/* <marquee scrollamount="3" behavior="" direction="">
          this is a very...
        </marquee> */}
      </p>

      {boxOpen ? (
        <div className="comment-box">
          <button
            className="commnet-box-close-btn"
            onClick={() => setBoxOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="all-commnets">
            {allComments.map((comment, idx) => {
              return (
                <div key={idx}>
                  <div className="comment-div">
                    <div className="pic-div">
                      <img src={comment.pic} alt="" />
                    </div>
                    <div className="user-comment">
                      <span className="username-text">{comment.username}</span>
                      <span className="comment-text">{comment.comment}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="comment-form">
            <img src={value.photoURL} alt="" />

            <input
              onChange={(e) => {
                setCurrentUserComment(e.currentTarget.value);
              }}
              value={currentUserComment}
              type="text"
              placeholder="Add a comment..."
            />
            <button
              onClick={async () => {
                // Add comment to "comments" collection
                let commentRef = await addDoc(collection(db, "comments"), {
                  comment: currentUserComment,
                  username: value.displayName,
                  pic: value.photoURL,
                });

                setCurrentUserComment("");
                // Update "posts" collection with the new comment ID
                await updateDoc(doc(db, "posts", props.post.id), {
                  comments: [...props.post.comments, commentRef.id],
                });
              }}
            >
              Post
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default VideoCard;

// useEffect(() => {
//   let f = async () => {
//     let allCommentId = props.post.comments;
//     let arr = [];

//     for (let i = 0; i < allCommentId.length; i++) {
//       let id = allCommentId[i];

//       let doc = await Firestore.collection("comments").doc(id).get();
//       let commentData = { ...doc.data(), id: doc.id };
//       arr.push(commentData);
//     }
//     setAllComments(arr);
//   };
//   f();
// }, [props]);
