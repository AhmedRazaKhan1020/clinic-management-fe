

"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { ClipboardClock, Hospital, LayoutDashboard, UsersRound, Menu, X, User } from "lucide-react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

export default function Sidebar() {
  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
      useEffect(() => {
        if(!localStorage.getItem("token")) return router.push("/") 
      }, [router])

  const links = [
    { link: "/doctorD", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { link: "/Doctor", icon: <ClipboardClock size={20} />, label: "Appointments" },
  ]

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get("http://localhost:8080/user/me",{headers:{Authorization:`Bearer ${token}`}})
    .then(res=>setUser(res.data.user))
  }, []);

  return (
    <>
      {/* top bar for mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-neutral-900  border-b border-neutral-700  text-sky-300">
        <div className="flex items-center gap-2">
          <Hospital size={30} className="text-sky-400" />
          <span className="font-bold text-2xl">Docify</span>
        </div>
        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* overlay */}
      {open && <div className="lg:hidden fixed inset-0 bg-neutral-900 " onClick={()=>setOpen(false)} />}

      {/* sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-screen bg-neutral-900 border-r border-neutral-700  text-sky-300 flex flex-col py-6 px-4 z-50 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* close btn mobile */}
        <button className="lg:hidden mb-6 self-end" onClick={()=>setOpen(false)}>
          <X size={25} />
        </button>

        <div className="hidden lg:flex items-center gap-2 mb-8 justify-center">
          <Hospital size={35} className="text-sky-400" />
          <span className="font-bold text-2xl">Docify</span>
        </div>

        <nav className="flex flex-col gap-4 flex-1">
          {links.map((item) => (
            <Link key={item.label} href={item.link}>
              <div className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition 
                ${pathname === item.link ? "bg-sky-600 text-white" : "hover:bg-sky-700/40"}`}>
                {item.icon}
                <span className="text-lg">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        <button
          onClick={() => document.getElementById("profileModal").showModal()}
          className="mt-auto px-4 py-3 bg-sky-600 hover:bg-sky-500 rounded-lg flex items-center gap-3"
        >
          <User size={20} /> Profile
        </button>
      </aside>

      {/* Profile Modal */}
      <dialog id="profileModal" className="modal">
        <div className="modal-box bg-[#0d1215] border border-white/15 rounded-2xl shadow-2xl text-sky-200 px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-2xl font-bold text-sky-400">Profile Summary</h3>
            <button className="btn btn-sm btn-circle" onClick={() => document.getElementById('profileModal').close()}>
              ✕
            </button>
          </div>

          <div className="space-y-3 mb-7">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="opacity-60">Name</span>
              <span className="font-semibold text-white">{user.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="opacity-60">Email</span>
              <span className="font-semibold text-white">{user.email}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="opacity-60">Phone</span>
              <span className="font-semibold text-white">{user.phone}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              className="px-6 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium"
              onClick={() =>{
                localStorage.removeItem("token");
                router.push("/");
              }}
            >
              Logout
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium"
              onClick={() => document.getElementById('profileModal').close()}
            >
              Ok Got it
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

