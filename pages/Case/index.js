"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
// import Header from '../Header'
// import PHeader from '../PHeader'
// import AHeader from '../AHeader'
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function CasePage() {
  const router = useRouter();
  const params = useSearchParams();

  const appointmentId = params.get("appointmentId");
  const patientId = params.get("patientId");

  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  //  const [user, setUser] = useState("")

  // useEffect(() => {
  //   const token = localStorage.getItem("token")

  //   const loadMe = async() => {
  //     const res = await axios.get("https://clinic-management-be-production.up.railway.app/user/me",{
  //       headers:{Authorization:`Bearer ${token}` }
  //     })
  //     setUser(res.data.user)
  //   }

  //   loadMe()
  // },[])


    useEffect(() => {
      if(!localStorage.getItem("token")) return router.push("/") 
    }, [router])

  const submitCase = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://clinic-management-be-production.up.railway.app/case/case", {
        appointmentId,
        patientId,
        diagnosis,
        notes
      }, {
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success("Case created success!");
      // router.push("/Doctor");
      setNotes("");
      setDiagnosis("")
    } catch (err) {
      // console.log(err);
      toast.error("Case create error");
    }
  }

  return (
    <>
    {/* {(user.role === 'patient'||user.role === 'admin')?(<PHeader/>||<AHeader/>):(<Header/>)} */}
    <div className="min-h-screen ml-64 p-6 flex justify-center items-center bg-black text-sky-300 ">
  <div className="w-full max-w-xl bg-neutral rounded-xl shadow-lg p-8">
    <h1 className="text-3xl font-bold mb-6 text-center">Add Case</h1>

    <form onSubmit={submitCase}>

      <div className="form-control mb-5">
        <label className="label">
          <span className="label-text text-sky-300">Diagnosis</span>
        </label>
        <input
          type="text"
          value={diagnosis}
          placeholder="Enter Diagnosis"
          onChange={(e) => setDiagnosis(e.target.value)}
          className="input input-bordered w-full bg-black text-sky-300 border-gray-700"
          required
        />
      </div>

      <div className="form-control mb-5">
        <label className="label">
          <span className="label-text text-sky-300">Notes</span>
        </label>
        <textarea
          rows={5}
          value={notes}
          placeholder="Enter Notes"
          onChange={(e) => setNotes(e.target.value)}
          className="textarea textarea-bordered w-full bg-black text-sky-300 border-gray-700"
          required
        ></textarea>
      </div>

      <button className="btn w-full bg-sky-600 hover:bg-sky-500 text-white">
        Create Case
      </button>

    </form>
  </div>
</div>
</>
  )
}
