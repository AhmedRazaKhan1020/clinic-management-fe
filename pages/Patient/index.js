"use client"
import React, { useEffect, useState } from "react";
import API from "../Config/api";
import toast from "react-hot-toast";
import PHeader from '../PHeader'
import { CircleCheck, CircleX } from "lucide-react";
import { useRouter } from "next/router";


export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [apps, setApps] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [caseData, setCaseData] = useState("");
  const [appointmentId, setAppointmentId] = useState("")

  const router = useRouter()
  
  const openGetcaseModal = (a) => {
    setAppointmentId(a._id);

    document.getElementById("GetcaseModal").showModal();
  };
      useEffect(() => {
        if(!localStorage.getItem("token")) return router.push("/") 
      }, [router])

  const loadDoctors = async () => {
    const res = await API.get(`/doctor/`);
    setDoctors(res.data);
  };

  const loadMyApps = async () => {
    const res = await API.get(`/appointment/app`);
    setApps(res.data);
  };

  useEffect(() => {
    loadDoctors();
    loadMyApps();
  }, []);

  const bookApp = async () => {
    if (!doctor || !date || !time) return toast("All fields required");

    await API.post(`/appointment/book`,
      { doctorId: doctor, appointmentDate: date, appointmentTime: time }
    );
    toast.success("Appointment booked");
    loadMyApps();
    document.getElementById("bookModal").close();
  };
    useEffect(() => {
    const getCase = async () => {
      try {
        const { data } = await API.get(`/case/${appointmentId}`)
        setCaseData(data)
      } catch (error) {
        console.log(error)
        // toast.error("case not found")
      }
    }

    getCase()
  }, [appointmentId])

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
                          openGetcaseModal(a)
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
                            await API.put(`/appointment/${a._id}`,
                            { status: newStatus }
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
              <button className="px-6 py-2 rounded-xl bg-sky-800/20 border border-sky-700 hover:bg-sky-700/30 transition-all duration-200" onClick={() => document.getElementById("bookModal").close()}>
                Cancel
              </button>
              <button onClick={bookApp} className="px-6 py-2 rounded-xl bg-sky-800/20 border border-sky-700 hover:bg-sky-700/30 transition-all duration-200">
                Book
              </button>
            </div>
          </div>
        </dialog>

          {/* See Case */}
      <dialog id="GetcaseModal" className="modal">
        <div className="modal-box bg-neutral-900 text-sky-300 rounded-2xl shadow-xl p-8 border border-sky-800/30">
          {/* Header */}
          <h1 className="text-3xl font-extrabold mb-6 text-center border-b border-sky-800/30 pb-3">
            Case Details
          </h1>

          {/* Content */}
          <div className="space-y-4 text-lg">
            <div className="flex justify-between items-start border-b border-sky-800/30">
              <b className="text-sky-300 w-32">Patient:</b>
              <p className="text-white flex-1 text-right">{caseData.patientId || "N/A"}</p>
            </div>

            <div className="flex justify-between items-start border-b border-sky-800/30">
              <b className="text-sky-300 w-32">Diagnosis:</b>
              <p className="text-white flex-1 text-right">{caseData.diagnosis || "N/A"}</p>
            </div>

            <div className="flex justify-between items-start border-b border-sky-800/30">
              <b className="text-sky-300 w-32">Notes:</b>
              <p className="text-white flex-1 text-right">{caseData.notes || "N/A"}</p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-8 flex justify-center">
            <button
              className="px-6 py-2 rounded-xl bg-sky-800/20 border border-sky-700 hover:bg-sky-700/30 transition-all duration-200"
              onClick={() => {
                document.getElementById("GetcaseModal").close();
                setAppointmentId("");
                setCaseData("");
              }}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
      </div>
    </>
  );
}
