"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import PHeader from '../PHeader'
import { CircleCheck, CircleX } from "lucide-react";
import { useRouter } from "next/router";

const API = "https://clinic-management-be-production.up.railway.app/";

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [apps, setApps] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [token, setToken] = useState(null);

  const router = useRouter()
  
      useEffect(() => {
        if(!localStorage.getItem("token")) return router.push("/") 
      }, [router])

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  const loadDoctors = async () => {
    const res = await axios.get(`https://clinic-management-be-production.up.railway.app/doctor/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setDoctors(res.data);
  };

  const loadMyApps = async () => {
    const res = await axios.get(`https://clinic-management-be-production.up.railway.app/appointment/app`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setApps(res.data);
  };

  useEffect(() => {
    loadDoctors();
    loadMyApps();
  }, [token]);

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

  return (
    <>
      <PHeader />
      <div className="min-h-screen bg-black text-sky-400 p-4 md:p-10 md:ml-64">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <button
            onClick={() => document.getElementById("bookModal").showModal()}
            className="btn bg-sky-500 "
          >
            Book Appointment
          </button>
        </div>

        {/* My Appointments Table */}
        <div className="bg-neutral-900 p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4">My Appointments</h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th className="text-center">Case</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a._id}>
                    <td>{a.appointmentDate}</td>
                    <td>{a.appointmentTime}</td>
                    <td>{doctors.find(i => i._id === a.doctorId)?.specialization}
                    </td>
                    <td>{a.status}</td>
                    <td className="text-center">
                      <button
                        onClick={() =>
                          router.push(`/getCase?appointmentId=${a._id}`)
                        }
                        className="btn btn-sm bg-sky-600 text-white hover:bg-sky-500"
                      >
                        See Case
                      </button>
                    </td>
                    {(a.status === 'completed' || a.status === 'canceled') ? (
                      a.status === 'completed' ? (
                        <CircleCheck className="mt-3 ml-7 text-center text-green-600" />
                      ) : (
                        <CircleX className="mt-3 ml-7 text-center text-red-600" />
                      )
                    ) : (
                      <td className="text-center">
                        <select
                          defaultValue={a.status}
                          className="select select-sm bg-black text-sky-400 border border-sky-600"
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
                          <option value="">Select</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </td>
                    )}
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
              <button onClick={bookApp} className="btn btn-primary">
                Book
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}
