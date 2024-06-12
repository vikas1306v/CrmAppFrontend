import React, { useState } from 'react'
import app from "../../firebase";
import {  getAuth,GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { addUser } from '../redux/slices/UserSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


const SignInPage = () => {
    const navigate=useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);
    const [providerData, setProviderData] = useState({
      email: "",
      name: "",
    });
  

    const submitProviderData = async () => {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await fetch(
        "http://localhost:9090/crmapp/auth/google-auth",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(providerData),
        }
      );
      const data = await response.json();
      dispatch(addUser(data.data))
      if (data.data != null) {
        navigate("/");
      }
    };
    const handleGoogleSignIn = () => {
      setProviderData(null);
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const user = result.user;
          providerData.email=user.email;
          providerData.name=user.displayName;
          submitProviderData();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
        });
    };
  
  
    const handleSignIn = async (e) => {
      e.preventDefault();
     //api calling
      const response= await axios.post('http://localhost:9090/crmapp/auth/authenticate',{
      email: email,
      password: password,
      role:"USER",
      name: "John Doe"
     },{
      headers: {
        'Content-Type': 'application/json', 
      },
    })
      dispatch(addUser(response.data.data))
      navigate("/");
    };
    return (
        <>
         <div className="bg-white rounded-lg" >
      <div className="container flex flex-col mx-auto bg-white " >
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10">
              <form onSubmit={handleSignIn}  
              className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
                <h3 className="mb-3 text-4xl font-extrabold text-grey-900">Sign In</h3>
                <p className="mb-3 text-grey-700">Enter your email and password</p>
                <button
                type='button'
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center w-full py-4  text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-gray-300 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300"
                >
                  <img
                    className="h-5 mr-2"
                    src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                    alt="Google"
                  />
                  Sign in with Google
                </button>
                <div className="flex items-center mt-8">
                  <hr className="h-0 border-b border-solid border-gray-500 grow" />
                  <p className="mx-4 text-grey-600">or</p>
                  <hr className="h-0 border-b border-solid border-gray-500 grow" />
                </div>
                <label htmlFor="email" className="mb-2 text-sm text-start text-gray-900">Email*</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mail@loopple.com"
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                />
                <label htmlFor="password" className="mb-2 text-sm text-start text-grey-900">Password*</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a password"
                  className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                />
                 
                <button
                  type="submit"
                  className="w-full px-6 py-4 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-blue-600 focus:ring-4 focus:ring-blue-100 bg-blue-500"
                >
                  Sign In
                </button>
               
              </form>
            </div>
          </div>
        </div>
      </div>
      
    </div>

        </>
    )
}

export default SignInPage