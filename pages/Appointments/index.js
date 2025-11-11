"use client"
import React, { useEffect, useState } from "react";
import API from "../Config/api";
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
    const [editDoctor, seteditDoctor] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editTime, setEditTime] = useState("");
    const [id, setId] = useState("")
    const [patientId, setPatientId] = useState("")
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");
    const [caseData, setCaseData] = useState("");
    const [appointmentId, setAppointmentId] = useState("")


    const router = useRouter()

    useEffect(() => {
      if(!localStorage.getItem("token")) return router.push("/") 
    }, [router])
    const openUpdateModal = (a) => {
        setId(a._id);
        document.getElementById("updateModal").showModal();
    };
    const loadDoctors = async () => {
        const res = await API.get(`/doctor/`);
        setDoctors(res.data);
        setSpecialization(res.data);
    };
    const openAddcaseModal = (a) => {
    setId(a._id);
    setPatientId(a.patientId)

    document.getElementById("AddcaseModal").showModal();
    };
  const openGetcaseModal = (a) => {
    setAppointmentId(a._id);

    document.getElementById("GetcaseModal").showModal();
    };
    const loadMyApps = async () => {
        const res = await API.get(`/appointment/`);
        setApps(res.data);
    };
    const bookApp = async () => {
        if (!doctor || !date || !time) return toast("All fields required");

        await API.post(
        `/appointment/book`,
        { doctorId: doctor, appointmentDate: date, appointmentTime: time },
        );

        toast.success("Appointment booked");
        loadMyApps();
        document.getElementById("bookModal").close();
    };
    const editBookApp = async () => {
        if (!editDoctor) return toast("All fields required");

        try {
        await API.put(
        `/appointment/${id}`,
        { doctorId: editDoctor, appointmentDate: editDate, appointmentTime: editTime }
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
        await API.delete(`/appointment/${id}`);
        toast.success("Appointment Deleted!")
        loadMyApps()
        } catch (error) {
        console.log(error);

        }
    }
    const getPatient = async () => {
        const res = await API.get(`/user/`)
        setPatient(res.data)
    }
    const submitCase = async (e) => {
    e.preventDefault();
    if(!diagnosis ||!notes){
    alert("Please fill all fields")
    }
    try {
      await API.post("/case/case", {
        appointmentId: id,
        patientId,
        diagnosis,
        notes
      },);
      toast.success("Case created success!");
      setNotes("");
      setDiagnosis("")
    } catch (err) {
      // console.log(err);
      toast.error("Case create error");
    }
    }
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
    useEffect(() => {
        loadDoctors();
        loadMyApps();
        getPatient()
    }, []);


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
         openAddcaseModal(a)
        }
        className="btn btn-sm  text-white hover:text-sky-500 bg-transparent border border-sky-400 md:mt-1 md:mr-1"
        >
        Add
        </button>
        <button
        onClick={() =>
        openGetcaseModal(a)
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
        await API.put(
        `/appointment/${a._id}`,
        { status: newStatus }
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

         {/* Add Case */}
      <dialog id="AddcaseModal" className="modal">
        <div className="modal-box bg-neutral-900 text-sky-300 border border-sky-30/80">
          <h3 className="font-bold text-lg mb-4">ADD CASE</h3>
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
                className="input input-bordered w-full bg-neutral-900 text-sky-300 border-gray-700"
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
                className="textarea textarea-bordered w-full bg-neutral-900 text-sky-300 border-gray-700"
                required
              ></textarea>
            </div>

            <button type='submit' className="px-6 py-2 rounded-xl bg-sky-800/20 border border-sky-700 hover:bg-sky-700/30 transition-all duration-200">
              ADD
            </button>
            <button className="px-6 py-2 rounded-xl bg-sky-800/20 border border-sky-700 hover:bg-sky-700/30 transition-all duration-200 ml-2" onClick={() => {
              document.getElementById("AddcaseModal").close();
              setId("");
              setPatientId("");
              setNotes("");
              setDiagnosis("")

            }}>
              Cancel
            </button>
          </form>
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
                setPatientId("");
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
