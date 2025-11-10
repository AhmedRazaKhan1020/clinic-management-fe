import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../Header'

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState([])
  const router = useRouter()

    useEffect(() => {
      if(!localStorage.getItem("token")) return router.push("/") 
    }, [router])


  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/appointment/doctor", {
headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.log("Error fetching doctor appointments:", err);
    }
  };
 const getUsers = async () => {
const res = await axios.get("http://localhost:8080/user/", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})
setUser(res.data)
    }
  useEffect(() => {
    fetchAppointments();
    getUsers()
  }, []);

  return (
  <>
  <Header />
<div className="min-h-screen bg-black text-sky-400 p-4 md:p-10 md:ml-64">
  <div className="w-full max-w-5xl">

    <h1 className="text-3xl font-bold mb-8 text-center">YOUR APPOINTMENTS</h1>

    <div className="overflow-x-auto rounded-xl shadow-md bg-neutral p-6">
      <table className="table table-zebra w-full">
<thead>
  <tr className="text-sky-400">
    <th>#</th>
    <th>Patient Name</th>
    <th>Date</th>
    <th>Time</th>
    <th className="text-center">Action</th>
    <th className="text-center">Select</th>
  </tr>
</thead>

<tbody>
  {appointments.map((item, index) => (
    <tr key={item._id}>
      <td>{index + 1}</td>
      <td>{user.find(i => i._id === item.patientId)?.fullName}</td>
      <td>{item.appointmentDate}</td>
      <td>{item.appointmentTime}</td>
      <td className="text-center">
<button
  onClick={() =>
    router.push(`/Case?appointmentId=${item._id}&patientId=${item.patientId}`)
  }
  className="btn btn-sm  text-white hover:text-sky-500 bg-transparent border border-sky-400"
>
  Add Case
</button>
<button
  onClick={() =>
    router.push(`/getCase?appointmentId=${item._id}`)
  }
  className="btn btn-sm  text-white hover:text-sky-500 bg-transparent border border-sky-400 ml-2"
>
  See Case
</button>
      </td>
      <td className="text-center">
<select
  defaultValue={item.status}
  className="select select-sm bg-black text-sky-400 border border-sky-600"
  onChange={async (e) => {
    const newStatus = e.target.value;
    const token = localStorage.getItem("token");

    await axios.put(`http://localhost:8080/appointment/${item._id}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchAppointments(); // reload
  }}
>
  <option value="scheduled">Scheduled</option>
  <option value="completed">Completed</option>
  <option value="canceled">Canceled</option>
</select>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>

  </div>
</div>
    </>
  );
};

export default DoctorDashboard;
