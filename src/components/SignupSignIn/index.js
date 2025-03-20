import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getDoc, doc, setDoc } from "firebase/firestore";

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log("name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("confirmPass", confirmPass);
    // Authenticate the user or basically create  a new account using email and pass

    if (name != "" && email != "" && password != "" && confirmPass != "") {
      if (password == confirmPass) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("User: ", user);
            toast.success("User created");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPass("");
            createDoc(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("password and confirmPassword don't match");
        setLoading(false);
      }
    } else {
      toast.error("All fields ae mandatory!!");
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    console.log("Email", email);
    console.log("password", password);
    setLoading(true);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User: ", user);
          toast.success("User Logged In");
          setEmail("");
          setPassword("");
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("All fields are mandatory!!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc Created");
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      // toast.error("Doc already exists");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          console.log(user);
          createDoc(user);
          setLoading(false);
          navigate('/dashboard')
          toast.success("User Authenticated");

        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
          setLoading(false);
        });
    }
    catch (e) {
      toast.error(e.message);
      setLoading(false);
    }

  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login <span style={{ color: "var(--theme)" }}> Financely.</span>
          </h2>
          <form>
            <Input
              type={"email"}
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"example@gmail.com"}
            />
            <Input
              type={"password"}
              label={"password"}
              state={password}
              setState={setPassword}
              placeholder={"example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "loading..." : "Login using email and password"}
              onClick={loginUsingEmail}
            />
            <p className="p-login"> or </p>
            <Button
              onClick={googleAuth}
              text={loading ? "loading..." : "Login using Google"}
              blue={true}
            />
            <p className="p-login" onClick={() => setLoginForm(!loginForm)}>

              or Don't have an account ? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign up on{" "}
            <span style={{ color: "var(--theme)" }}> Financely.</span>
          </h2>
          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"Your Name"}
            />
            <Input
              type={"email"}
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"example@gmail.com"}
            />
            <Input
              type={"password"}
              label={"password"}
              state={password}
              setState={setPassword}
              placeholder={"example@123"}
            />
            <Input
              type={"password"}
              label={"Confirm Password"}
              state={confirmPass}
              setState={setConfirmPass}
              placeholder={"example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "loading..." : "Signup using email and password"}
              onClick={signupWithEmail}
            />
            <p className="p-login">or</p>

            <Button
              onClick={googleAuth}
              text={loading ? "loading..." : "Signup using Google"}
              blue={true}
            />
            <p className="p-login" onClick={() => setLoginForm(!loginForm)}>
              or have an account already ? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponent;
