import React, { useEffect, useState } from 'react';
import API from '../Config/api';
import { useRouter } from 'next/router';
import Header from '../Header'
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState([])
  const [id, setId] = useState("")
  const [patientId, setPatientId] = useState("")
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [caseData, setCaseData] = useState("");
  const [appointmentId, setAppointmentId] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem("token")) return router.push("/")
  }, [router])

  const openAddcaseModal = (item) => {
    setId(item._id);
    setPatientId(item.patientId)

    document.getElementById("AddcaseModal").showModal();
  };
  const openGetcaseModal = (item) => {
    setAppointmentId(item._id);

    document.getElementById("GetcaseModal").showModal();
  };

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointment/doctor");
      setAppointments(res.data);
    } catch (err) {
      console.log("Error fetching doctor appointments:", err);
    }
  };
  const getUsers = async () => {
    const res = await API.get("/user/")
    setUser(res.data)
  }
  const submitCase = async (e) => {
    e.preventDefault();

    try {
      await API.post("/case/case", {
        appointmentId: id,
        patientId,
        diagnosis,
        notes
      },);

      toast.success("Case created success!");
      // router.push("/Doctor");
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
                          openAddcaseModal(item)
                        }
                        className="btn btn-smtext-white hover:text-sky-500 bg-transparent border border-sky-400"
                      >
                        Add Case
                      </button>
                      <button
                        onClick={() =>
                          openGetcaseModal(item)
                        }
                        className="btn btn-smtext-white hover:text-sky-500 bg-transparent border border-sky-400 ml-2"
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

                          await API.put(`/appointment/${item._id}`,
                            { status: newStatus },
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

    </>
  );
};

export default DoctorDashboard;
