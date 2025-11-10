"use client"
import { useEffect, useState } from "react"
import {useSearchParams } from "next/navigation"
import axios from "axios"
import Header from '../Header'
import PHeader from '../PHeader'
import AHeader from '../AHeader'
import toast from "react-hot-toast"
import { useRouter } from "next/router"

export default function CasePage() {
  const params = useSearchParams()
  const appointmentId = params.get("appointmentId")

  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  // const [user, setUser] = useState("")

   const router = useRouter()
  
      useEffect(() => {
        if(!localStorage.getItem("token")) return router.push("/") 
      }, [router])

  // useEffect(() => {
  //   const loadMe = async() => {
  //     const res = await axios.get("http://localhost:8080/user/me",{
  //       headers:{Authorization:`Bearer ${localStorage.getItem("token")}` }
  //     })
  //     setUser(res.data.user)
  //     console.log(res.data.user)
  //   }

  //   loadMe()
  // },[])

  useEffect(() => {
    if(!appointmentId) return;
    const getCase = async () => {
      try {
        const {data} = await axios.get(`http://localhost:8080/case/${appointmentId}`, {
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        setCaseData(data)
      } catch (error) {
        console.log(error)
        toast.error("case not found")
      }
      setLoading(false)
    }

 getCase()
  }, [appointmentId])

  // if(user) return(
  //   <>
  //   {(user.role === 'patient'||user.role === 'admin')?(<PHeader/>||<AHeader/>):(<Header/>)}
  //   </>
  // )
  if(loading) return <div className="bg-transparent text-center mt-10 text-white">Loading...</div>

  if(!caseData) return <div className="bg-transparent text-center mt-10 text-red-500">No case found</div>

  return (
    <>
    <div className="min-h-screen ml-64  flex justify-center items-center bg-black text-sky-300 p-6">
      <div className="w-full max-w-xl bg-neutral rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Case Details</h1>

        <p className="text-white "><b className="text-sky-300 ">Diagnosis:</b> {caseData.diagnosis}</p>
        <p className="text-white"><b className="text-sky-300 ">Notes:</b> {caseData.notes}</p>
        <p className="text-white"><b className="text-sky-300 ">Appointment:</b> {caseData.appointmentId}</p>
        <p className="text-white"><b className="text-sky-300 ">Patient:</b> {caseData.patientId}</p>
      </div>
    </div>
    </>
  )
}
