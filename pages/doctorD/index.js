"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Header from '../Header'
import { useRouter } from "next/router";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState("")
  const [patient, setPatient] = useState([])

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

    loadMe()
  },[])

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/appointment/doctor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.log("Error fetching appointments:", err);
    }
  };
  const getUsers = async () => {
          const res = await axios.get("http://localhost:8080/user/", {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          })
          setPatient(res.data)
      }

  useEffect(() => {
    fetchAppointments();
    getUsers()
  }, []);

  let booked = appointments.filter(i=>i.status==="scheduled").length
  let completed = appointments.filter(i=>i.status==="completed").length
  let canceled = appointments.filter(i=>i.status==="canceled").length

const pieData = {
  labels: ["Panding" , "Completed"],
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
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-neutral-950 text-sky-400 px-4 sm:px-6 lg:ml-64 py-8">

  {/* HEADER */}
    <h1 className="text-3xl sm:text-4xl font-bold text-center">
      Welcome, <span className="text-white">Dr.{user.fullName}</span> 👋
    </h1>
    <p className="text-center mt-2 text-gray-400 text-sm sm:text-base">
      Manage your clinic, track appointments and update cases easily.
    </p>
  
    {/* Card */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-1">
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 text-center">
        <h2 className="text-3xl font-bold text-white">{appointments.length}</h2>
        <p className="mt-2 text-sm">Total Appointments</p>
      </div>
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 text-center">
        <h2 className="text-3xl font-bold text-white">{completed}</h2>
        <p className="mt-2 text-sm">Completed Appointments</p>
      </div>
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 text-center">
        <h2 className="text-3xl font-bold text-white">{booked}</h2>
        <p className="mt-2 text-sm">Pending Appointments</p>
      </div>
    </div>
  
    {/* chart + images / para */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700">
        <h2 className="font-semibold mb-3 text-center">Case Status</h2>
        <Pie data={pieData} />
      </div>
  
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700">
        <img src="https://images.pexels.com/photos/4586991/pexels-photo-4586991.jpeg" className="rounded mb-3 w-full h-40 object-cover" />
        <p className="text-sm text-gray-300">
          Always be kind with patients. A good doctor not only treats but also understands patient emotions.
        </p>
      </div>
  
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700">
        <img src="https://images.pexels.com/photos/6129682/pexels-photo-6129682.jpeg" className="rounded mb-3 w-full h-40 object-cover" />
        <p className="text-sm text-gray-300">
          Keep your records updated. Better case history gives you more clarity and trust.
        </p>
      </div>
    </div>

  {/* table */}
  <h2 className="text-xl font-semibold mt-14 mb-3">Today Appointments</h2>
  <div className="overflow-x-auto rounded-xl shadow bg-neutral-900 p-6 border border-neutral-700">
    <table className="table table-zebra w-full text-sm sm:text-base">
      <thead>
        <tr className="text-sky-400">
          <th>#</th>
          <th>Patient Name</th>
          <th>Date</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((item, index) => (
          <tr key={item._id}>
            <td>{index + 1}</td>
            <td>{patient.find(i => i._id === item.patientId)?.fullName}</td>
            <td>{item.appointmentDate}</td>
            <td>{item.appointmentTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </>
  );
}
