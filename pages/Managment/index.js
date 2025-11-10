"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AHeader from '../AHeader'
import { useRouter } from "next/navigation"
import { FolderPlus, SquarePen, Trash } from "lucide-react";

const index = () => {

const [id, setId] = useState("");
const [user, setUser] = useState([])
const [doctors, setDoctors] = useState([])
const [editPassword, setEditPassword] = useState("")
const [Email, setEmail] = useState("")
const [Name, setName] = useState("")
const [Password, setPassword] = useState("")
const [Phone, setPhone] = useState("")
const [role, setRole] = useState("");
const [doctorId, setDoctorId] = useState("")
const [Specialization, setSpecialization] = useState("")
const [AvalibleDays, setAvalibleDays] = useState("")
const [AvalibleTime, setAvalibleTime] = useState("")

 const router = useRouter()

useEffect(() => {
  if(!localStorage.getItem("token")) return router.push("/") 
}, [router])

const openUpdateModal = (a) => {
setId(a._id);
document.getElementById("updateModal").showModal();
};

const openAddModal = (a) => {
setId(a._id);
document.getElementById("AddModal").showModal();

};

const openEditModal = (a) => {
setDoctorId(a._id);
document.getElementById("EditModal").showModal();
};

const getUsers = async () => {
const res = await axios.get("http://localhost:8080/user/", {
headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})
setUser(res.data)
}
const getDoctors = async () => {
const res = await axios.get("http://localhost:8080/doctor/", {
headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})
setDoctors(res.data)
}
useEffect(() => {
getUsers()
getDoctors()
}, [])

const editUser = async () => {
if (!role ||!editPassword) return toast("All fields required");

try {
await axios.put(
`http://localhost:8080/user/${id}`,
{  password: editPassword, role },
{ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
);

toast.success("User updated!");
await getUsers();
document.getElementById("updateModal").close();

setId("");
setEditPassword("");
setRole("")
} catch (err) {
console.error("Update error:", err);
toast("Failed to update appointment");
}
};
const User = async () => {
if (!Name || !Email || !Password || !Phone) return toast("All fields required");

try {
const res = await axios.post(
"http://localhost:8080/user/register",
{
fullName: Name,
password: Password,
phone: Phone,
email: Email,
role: "doctor",
},
{
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`
}
}
);

toast.success(res.data.message ||"User added!");
await getUsers();
document.getElementById("userModal").close();


setEmail("");
setName("");
setPassword("");
setPhone("")
} catch (err) {
console.error("User error:", err);
toast("Failed to User appointment");
}
};
const deleteUser = async (id) => {
try {
await axios.delete(`http://localhost:8080/user/${id}`, {
headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
toast.success("User Deleted!")
getUsers()
} catch (error) {
console.log(error);

}
}
const deleteDoctor = async (id) => {
try {
await axios.delete(`http://localhost:8080/doctor/${id}`, {
headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
toast.success("Doctor Deleted!")
getDoctors()
} catch (error) {
console.log(error);

}
}
const Doctor = async () => {
if (!Specialization || !AvalibleDays || !AvalibleTime) return toast("All fields required");

try {
const res = await axios.post(
"http://localhost:8080/doctor/register",
{
userId:id,
avalibleDays:AvalibleDays,
avalibleTime:AvalibleTime,
specialization:Specialization
},
{
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`
}
}
);
toast.success(res.data.message ||"Doctor added!");
await getDoctors();
document.getElementById("AddModal").close();
} catch (error) {
console.error("Doctor error:", error);
toast.error("Failed to Doctor Register");
}
};
const editDoctor = async () => {
if (!Specialization || !AvalibleDays || !AvalibleTime) return toast("All fields required");

try {
const res = await axios.put(
`http://localhost:8080/doctor/${doctorId}`,
{
avalibleDays:AvalibleDays,
avalibleTime:AvalibleTime,
specialization:Specialization
},
{
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`
}
}
);
toast.success(res.data.message ||"Doctor Updated!");
await getDoctors();
document.getElementById("EditModal").close();
} catch (error) {
console.error("Doctor error:", error);
toast.error("Failed to Doctor Updated");
}
};
return (
<>
<AHeader />
<div className="p-4 md:p-6 md:ml-64">
<div className="min-h-screen bg-black text-sky-300 p-4 md:p-10">
<div className="flex justify-between items-center mb-8">
<h1 className="text-3xl font-bold">All Users</h1>
<button
onClick={() => document.getElementById("userModal").showModal()}
className="btn bg-sky-500 "
>
Add User
</button>
</div>

{/* My User Table */}
<div className="bg-neutral-900 p-6 rounded-xl shadow-xl">

<div className="overflow-x-auto">
<table className="table table-zebra w-full">
<thead>
<tr>
<th>Name</th>
<th>Role</th>
<th>Phone</th>
<th>Email</th>
<th><FolderPlus size={17} /></th>
<th><Trash size={17} /></th>
<th><SquarePen size={17} /></th>
</tr>
</thead>
<tbody>
{user.map(a => (
<tr key={a._id}>
<td>{a.fullName}</td>
<td>{a.role}</td>
<td>0{a.phone}</td>
<td>{a.email}</td>
{(a.role==='doctor')?(<td>
<button className=" bg-transparent border-none text-center"
onClick={() => openAddModal(a)}
>
   <FolderPlus size={17} className="cursor-pointer text-blue-600" />
</button>
</td>):(<td></td>)}
<td>
<button
onClick={() =>
deleteUser(a._id)
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

<div className="flex justify-between items-center mb-8 mt-8">
<h1 className="text-3xl font-bold">All Doctors</h1>

</div>

{/*Doctor Table */}
<div className="bg-neutral-900 p-6 rounded-xl shadow-xl mt-5">

<div className="overflow-x-auto">
<table className="table table-zebra w-full">
<thead>
<tr>
<th>Name</th>
<th>Specialization</th>
<th>Time</th>
<th>Day</th>
<th><Trash size={17} /></th>
<th><SquarePen size={17} /></th>
</tr>
</thead>
<tbody>
{doctors.map(a => (
<tr key={a._id}>
<td>{user.find(i => i._id === a.userId)?.fullName}</td>
<td>{a.specialization}</td>
<td>{a.avalibleTime}</td>
<td>{a.avalibleDays}</td>
<td>
<button
onClick={() =>
deleteDoctor(a._id)
}
>
<Trash size={17} className="cursor-pointer text-red-600" />
</button>
</td>
<td>
<button onClick={() => openEditModal(a)}>
<SquarePen size={17} className="cursor-pointer text-green-600" />
</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>


{/* update Modal */}
<dialog id="updateModal" className="modal">
<div className="modal-box bg-neutral-900 text-sky-300">
<h3 className="font-bold text-lg mb-4">Update User</h3>
<input
type="text"
placeholder="Enter Role"
value={role}
onChange={(e) => setRole(e.target.value)}
className="input input-bordered w-full mb-4"
/>
<input
type="password"
placeholder="Enter Password"
value={editPassword}
onChange={(e) => setEditPassword(e.target.value)}
className="input input-bordered w-full mb-4"
/>

<div className="flex justify-end gap-2">
<button className="btn btn-ghost" onClick={() => {
document.getElementById("updateModal").close();
// optional: clear states on cancel
setId(""); setEditName(""); setEditEmail(""); setEditPhone(""); setEditPassword(""); setRole("");
}}>
Cancel
</button>
<button onClick={editUser} className="btn btn-primary">
Update
</button>
</div>
</div>
</dialog>
{/* user Modal */}
<dialog id="userModal" className="modal">
<div className="modal-box bg-neutral-900 text-sky-300">
<h3 className="font-bold text-lg mb-4">Add User</h3>

<input
type="text"
placeholder="Enter Full Name"
value={Name}
onChange={(e) => setName(e.target.value)}
className="input input-bordered w-full mb-3"
/>

<input
type="email"
placeholder="Enter Email"
value={Email}
onChange={(e) => setEmail(e.target.value)}
className="input input-bordered w-full mb-3"
/>

<input
type="Number"
placeholder="Enter Number"
value={Phone}
onChange={(e) => setPhone(e.target.value)}
className="input input-bordered w-full mb-4"
/>
<input
type="password"
placeholder="Enter Password"
value={Password}
onChange={(e) => setPassword(e.target.value)}
className="input input-bordered w-full mb-4"
/>

<div className="flex justify-end gap-2">
<button className="btn btn-ghost" onClick={() => {
document.getElementById("userModal").close();
// optional: clear states on cancel
setName(""); setEmail(""); setPhone(""); setPassword("");
}}>
Cancel
</button>
<button onClick={User} className="btn bg-sky-400">
Register
</button>
</div>
</div>
</dialog>
 {/* addDoctor Modal */}
<dialog id="AddModal" className="modal">
<div className="modal-box bg-neutral-900 text-sky-300">
<h3 className="font-bold text-lg mb-4">Add Doctor</h3>

<input
type="text"
placeholder="Enter Specialization"
value={Specialization}
onChange={(e) => setSpecialization(e.target.value)}
className="input input-bordered w-full mb-3"
/>

<input
type="time"
placeholder="Enter Avalible Time"
value={AvalibleTime}
onChange={(e) => setAvalibleTime(e.target.value)}
className="input input-bordered w-full mb-4"
/>
<input
type="text"
placeholder="Enter Avalible Days"
value={AvalibleDays}
onChange={(e) => setAvalibleDays(e.target.value)}
className="input input-bordered w-full mb-4"
/>

<div className="flex justify-end gap-2">
<button className="btn btn-ghost" onClick={() => {
document.getElementById("AddModal").close();
setSpecialization(""); setAvalibleDays(""); setAvalibleTime("");setId("")
}}>
Cancel
</button>
<button onClick={Doctor} className="btn bg-sky-400">
Add Doctor
</button>
</div>
</div>
</dialog>
{/* EditDoctor Modal */}
<dialog id="EditModal" className="modal">
<div className="modal-box bg-neutral-900 text-sky-300">
<h3 className="font-bold text-lg mb-4">Update Doctor</h3>

<input
type="text"
placeholder="Enter Specialization"
value={Specialization}
onChange={(e) => setSpecialization(e.target.value)}
className="input input-bordered w-full mb-3"
/>

<input
type="time"
placeholder="Enter Avalible Time"
value={AvalibleTime}
onChange={(e) => setAvalibleTime(e.target.value)}
className="input input-bordered w-full mb-4"
/>
<input
type="text"
placeholder="Enter Avalible Days"
value={AvalibleDays}
onChange={(e) => setAvalibleDays(e.target.value)}
className="input input-bordered w-full mb-4"
/>

<div className="flex justify-end gap-2">
<button className="btn btn-ghost" onClick={() => {
document.getElementById("EditModal").close();
setSpecialization(""); setAvalibleDays(""); setAvalibleTime("");setDoctorId("")
}}>
Cancel
</button>
<button onClick={editDoctor} className="btn bg-sky-400">
Update Doctor
</button>
</div>
</div>
</dialog>
</div>
</div>
</>
)
}
export default index