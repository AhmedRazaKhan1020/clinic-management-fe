"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Pie } from "react-chartjs-2";
import PHeader from '../PHeader'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useRouter } from "next/router";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PatientHome() {
  const [user, setUser] = useState("")
  const [apps, setApps] = useState([])

   const router = useRouter()
  
      useEffect(() => {
        if(!localStorage.getItem("token")) return router.push("/") 
      }, [router])

  useEffect(() => {
    const token = localStorage.getItem("token")

    const loadMe = async() => {
      const res = await axios.get("http://localhost:8080/user/me",{
        headers:{Authorization:`Bearer ${token}` }
      })
      setUser(res.data.user)
    }

    const loadApps = async() => {
      const res = await axios.get("http://localhost:8080/appointment/app",{
        headers:{Authorization:`Bearer ${localStorage.getItem("token")}` }
      })
      setApps(res.data)
    }

    loadMe()
    loadApps()
  },[])


  const total = apps.length
  let booked = apps.filter(i=>i.status==="scheduled").length
  let completed = apps.filter(i=>i.status==="completed").length
  let canceled = apps.filter(i=>i.status==="canceled").length

  const pieData = {
  labels: ["Pending", "Completed"],
  datasets: [
    {
      data: [booked, completed],
      backgroundColor: [
        "rgba(255, 99, 132, 0.7)",   // red
        "rgba(54, 162, 235, 0.7)",  // blue
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
      ],
      borderWidth: 2,
    },
  ],
}

  return(
    <>
    <PHeader/>
    <div className="min-h-screen bg-black text-sky-400 p-4 md:p-10 md:ml-64">
  {/* TOP */}
  <div className="bg-neutral-900 border border-white/10 p-7 rounded-2xl max-w-2xl mx-auto mb-20 text-center">
    <h1 className="text-4xl font-extrabold mb-2 text-sky-400">
      Welcome,{user.fullName} 👋
    </h1>
    <p className="opacity-70 text-sm">
      Manage your patients — track appointments & maintain cases professionally.
    </p>
  </div>

  {/* 3 STATS CARDS */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto mb-14">
    <div className="bg-neutral-900 border border-white/10 p-5 rounded-xl text-center">
      <p className="text-3xl font-bold text-white">{apps.length}</p>
      <p className="opacity-60 text-sm">Total Appointments</p>
    </div>
    <div className="bg-neutral-900 border border-white/10 p-5 rounded-xl text-center">
      <p className="text-3xl font-bold text-green-300">{completed}</p>
      <p className="opacity-60 text-sm">Completed Cases</p>
    </div>
    <div className="bg-neutral-900 border border-white/10 p-5 rounded-xl text-center">
      <p className="text-3xl font-bold text-red-300">{booked}</p>
      <p className="opacity-60 text-sm">Pending</p>
    </div>
    <div className="bg-neutral-900 border border-white/10 p-5 rounded-xl text-center">
      <p className="text-3xl font-bold text-red-300">{canceled}</p>
      <p className="opacity-60 text-sm">Canceled</p>
    </div>
  </div>

  {/* PIE */}
  <div className="flex flex-col items-center mb-12">
   <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 w-100 h-110">
             <h2 className="font-semibold mb-3 text-center">Case Status</h2>
             <Pie data={pieData} />
           </div>
  </div>

  {/* 2 IMAGES + TEXT */}
  <div className="grid grid-cols-2 gap-5 max-w-xl mx-auto mb-14">
    <img className="rounded-xl shadow-md" src="https://img.freepik.com/free-photo/doctor-listening-concerns-old-man_482257-114909.jpg?ga=GA1.1.784161447.1762259353&semt=ais_hybrid&w=740&q=80" />
    <img className="rounded-xl shadow-md" src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528" />
  </div>

  <p className="text-center max-w-2xl mx-auto opacity-70 leading-7 text-[15px] mb-20">
    “A good doctor treats the disease. The great doctor treats the patient.”
    <br/><br/>
    Stay consistent with record keeping, every detail matters for your patient future.
  </p>

</div>
</>
  )
}
