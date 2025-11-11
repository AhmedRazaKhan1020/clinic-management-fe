import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import API from '../Config/api'

const index = () => {
    const [fullName, setFullName]=useState("")
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [phone, setPhone]=useState("")
    const [error, setError]=useState("")
    const router = useRouter()

    const handleRegister = async (e)=>{
        e.preventDefault();
        
    if (!email || !password || !phone || !fullName) {
      setError("All fields are required");
      toast.error("All fields are required");
      return;
    }

    setError(null);

    try {
      const response = await API.post("/user/register",
        { email, password, phone, fullName });

      const data = await response.data;

      if (response.ok) {
        console.log("Register successful:", data);
        localStorage.setItem("token", data.token);
        toast.success("Register successful!");
        router.push("/Login");
      } else {
        setError(data.message || "Register failed");
        toast.error(data.message || "Register failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
}

  return (
    <div className="min-h-screen flex">
      {/* left panel */}
      <div className="w-full md:w-[40%] bg-black flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-white mb-8">
            Welcome  to Clinic!
          </h2>
        <form onSubmit={handleRegister}>
          <label className="block text-sm text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e)=>{setFullName(e.target.value)}}
            placeholder="Ahmed"
            className="w-full border border-[#373A40] bg-[#25262B] text-white rounded-md px-3 py-2 mb-4"
          />

          <label className="block text-sm text-gray-300 mb-1">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            placeholder="hello@gmail.com"
            className="w-full border border-[#373A40] bg-[#25262B] text-white rounded-md px-3 py-2 mb-4"
          />

          <label className="block text-sm text-gray-300 mb-1">Phone Number</label>
          <input
            type="number"
            value={phone}
            onChange={(e)=>{setPhone(e.target.value)}}
            placeholder="+9231*******1"
            className="w-full border border-[#373A40] bg-[#25262B] text-white rounded-md px-3 py-2 mb-4"
          />

          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            placeholder="Your password"
            className="w-full border border-[#373A40] bg-[#25262B] text-white rounded-md px-3 py-2 mb-4"
          />

          <div className="flex items-center gap-2 my-4">
            <span className="text-sm text-red-600">{error}</span>
          </div>

          <button className="w-full bg-sky-500 text-white py-2 rounded-md cursor-pointer" type='submit'>
            Register
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/Login" className="text-sky-500 font-medium ">Login</Link>
          </p>
          </form>
        </div>

      </div>

      {/* right image */}
      <div className="hidden md:block w-[60%]">
        <img
          src="https://img.freepik.com/free-psd/interior-modern-emergency-room-with-empty-nurses-station-generative-ai_587448-2137.jpg?t=st=1762259406~exp=1762263006~hmac=e8d04f52a19cf2108fdffef242e3dea2f4ccb1fa5b860239561d35b7c30e7b61&w=1060"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default index