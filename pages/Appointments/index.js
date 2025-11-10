"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AHeader from '../AHeader'
import { useRouter } from "next/router";
import { SquarePen, Trash } from "lucide-react";


export default function PatientDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [specialization, setSpecialization] = useState([]);
    const [patient, setPatient] = useState([])
    const [apps, setApps] = useState([]);
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [id, setId] = useState("");
    const [editDoctor, seteditDoctor] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editTime, setEditTime] = useState("");
    const [token, setToken] = useState(null);


    const router = useRouter()

    useEffect(() => {
      if(!localStorage.getItem("token")) return router.push("/") 
    }, [router])
    

    const openUpdateModal = (a) => {
        setId(a._id);
        document.getElementById("updateModal").showModal();
    };

    useEffect(() => {
        const t = localStorage.getItem("token");
        setToken(t);
    }, []);

    const loadDoctors = async () => {
        const res = await axios.get(`https://clinic-management-be-production.up.railway.app/doctor/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDoctors(res.data);
        setSpecialization(res.data);
    };

    const loadMyApps = async () => {
        const res = await axios.get(`https://clinic-management-be-production.up.railway.app/appointment/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setApps(res.data);
    };
    const bookApp = async () => {
        if (!doctor || !date || !time) return toast("All fields required");

        await axios.post(
        `https://clinic-management-be-production.up.railway.app/appointment/book`,
        { doctorId: doctor, appointmentDate: date, appointmentTime: time },
        { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Appointment booked");
        loadMyApps();
        document.getElementById("bookModal").close();
    };
    const editBookApp = async () => {
        if (!editDoctor) return toast("All fields required");

        try {
        await axios.put(
        `https://clinic-management-be-production.up.railway.app/appointment/${id}`,
        { doctorId: editDoctor, appointmentDate: editDate, appointmentTime: editTime },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        toast.success("Appointment updated");
        await loadMyApps();
        document.getElementById("updateModal").close();

        setId("");
        seteditDoctor("");
        setEditDate("");
        setEditTime("");
        } catch (err) {
        console.error("Update error:", err);
        toast("Failed to update appointment");
        }
    };
    const deleteApp = async (id) => {
        try {
        const res = await axios.delete(`https://clinic-management-be-production.up.railway.app/appointment/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Appointment Deleted!")
        loadMyApps()
        } catch (error) {
        console.log(error);

        }
    }
    const getPatient = async () => {
        const res = await axios.get("https://clinic-management-be-production.up.railway.app/user/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        setPatient(res.data)
    }
    useEffect(() => {
        loadDoctors();
        loadMyApps();
        getPatient()
    }, [token]);


    return (
      <>
        <AHeader />
        <div className="min-h-screen p-4 md:p-6 bg-black text-sky-300 md:ml-64">

        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Appointments</h1>
        <button
        onClick={() => document.getElementById("bookModal").showModal()}
        className="btn bg-sky-500 "
        >
        Book Appointment
        </button>
        </div>

        {/* My Appointments Table */}
        <div className="bg-neutral-900 p-6 rounded-xl shadow-xl">
        <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
        <thead>
        <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Doctor</th>
        <th>Patient</th>
        <th>Status</th>
        <th className="text-center">Case</th>
        <th className="text-center">Select</th>
        <th><Trash size={17} /></th>
        <th><SquarePen size={17} /></th>
        </tr>
        </thead>
        <tbody>
        {apps.map(a => (
        <tr key={a._id}>
        <td>{a.appointmentDate}</td>
        <td>{a.appointmentTime}</td>
        <td>{specialization.find(i => i._id === a.doctorId)?.specialization}</td>
        <td>{patient.find(i => i._id === a.patientId)?.fullName}</td>
        <td>{a.status}</td>
        <td className="text-center">
        <button
        onClick={() =>
        router.push(`/Case?appointmentId=${a._id}&patientId=${a.patientId}`)
        }
        className="btn btn-sm  text-white hover:text-sky-500 bg-transparent border border-sky-400 md:mt-1 md:mr-1"
        >
        Add
        </button>
        <button
        onClick={() =>
        router.push(`/getCase?appointmentId=${a._id}`)
        }
        className="btn btn-sm  text-white hover:text-sky-500 bg-transparent border border-sky-400 mt-1"
        >
        See
        </button>
        </td>
        <td className="text-center">
        <select
        defaultValue={a.status}
        className="cursor-pointer select select-sm bg-black text-sky-400 border border-sky-600"
        onChange={async (e) => {
        const newStatus = e.target.value;
        const token = localStorage.getItem("token");
        await axios.put(
        `https://clinic-management-be-production.up.railway.app/appointment/${a._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
        );
        loadMyApps();
        }}
        >
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="canceled">Canceled</option>
        </select>
        </td>
        <td>
        <button
        onClick={() =>
        deleteApp(a._id)
        }
        >
        <Trash size={17} className="cursor-pointer text-red-600" />
        </button>
        </td>
        <td>
        <button onClick={() => openUpdateModal(a)}>
        <SquarePen size={17} className="cursor-pointer text-green-600" />
        </button>
        </td>
        </tr>
        ))}
        </tbody>
        </table>
        </div>
        </div>

        {/* Booking Modal */}
        <dialog id="bookModal" className="modal">
        <div className="modal-box bg-neutral-900 text-sky-300">
        <h3 className="font-bold text-lg mb-4">Book Appointment</h3>

        <select
        className="select select-bordered w-full mb-3"
        onChange={(e) => setDoctor(e.target.value)}
        >
        <option value="">Select Doctor</option>
        {doctors.map(d => (
        <option key={d._id} value={d._id}>
        {d.specialization}
        </option>
        ))}
        </select>

        <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
        className="input input-bordered w-full mb-3"
        />

        <input
        type="time"
        onChange={(e) => setTime(e.target.value)}
        className="input input-bordered w-full mb-4"
        />

        <div className="flex justify-end gap-2">
        <button className="btn btn-ghost" onClick={() => document.getElementById("bookModal").close()}>
        Cancel
        </button>
        <button onClick={bookApp} className="btn bg-sky-400">
        Book
        </button>
        </div>
        </div>
        </dialog>

        {/* update Modal */}
        <dialog id="updateModal" className="modal">
        <div className="modal-box bg-neutral-900 text-sky-300">
        <h3 className="font-bold text-lg mb-4">Update Appointment</h3>

        <select
        className="select select-bordered w-full mb-3"
        value={editDoctor}
        onChange={(e) => seteditDoctor(e.target.value)}
        >
        <option value="">Select Doctor</option>
        {doctors.map(d => (
        <option key={d._id} value={d._id}>
        {d.specialization}
        </option>
        ))}
        </select>

        <input
        type="date"
        value={editDate}
        onChange={(e) => setEditDate(e.target.value)}
        className="input input-bordered w-full mb-3"
        />

        <input
        type="time"
        value={editTime}
        onChange={(e) => setEditTime(e.target.value)}
        className="input input-bordered w-full mb-4"
        />

        <div className="flex justify-end gap-2">
        <button className="btn btn-ghost" onClick={() => {
        document.getElementById("updateModal").close();
        // optional: clear states on cancel
        setId(""); seteditDoctor(""); setEditDate(""); setEditTime("");
        }}>
        Cancel
        </button>
        <button onClick={editBookApp} className="btn bg-sky-400">
        Update
        </button>
        </div>
        </div>
        </dialog>
        </div>    
      </>  
    );
}
