import { useEffect, useContext } from "react";
import { auth, signInWithGoogle, db } from "./firebase";
import { Redirect } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const Login = (props) => {
  let value = useContext(AuthContext);

  return (

    <div>
      {value ? <Redirect to="/home" /> : ""}
      <div class="container">
        <div>
          <h1 style={{textAlign:"center", color: "pink"}}>Insta Reels</h1>
          <div>
            <div>
              <button
                onClick={signInWithGoogle}
                className="btn" id="signIn">
                Log In Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
