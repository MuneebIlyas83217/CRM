import React from 'react'
import { useState } from 'react'
import Api from './Api.js'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate=useNavigate();
    const [form, setform] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        role: 'admin'
    })
    const [showPassword, setShowPassword] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("before")
        try {
            const res = await Api.post("/auth/register", form)
            console.log("after")

            alert("User registered successfully!");

            setform({
                name: '',
                email: '',
                phone: '',
                address: '',
                password: '',
                role: 'admin'
            })
        } catch (error) {
            console.error("Registration error:", error)
            alert(error.response?.data?.message || "Registration failed. Please try again.")
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setform((prev) => ({
            ...prev, [name]: value
        }

        ))
    }


    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
            <div className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Register User</h2>
                <p className="text-xs text-slate-400 mt-1">Enter profile details for new client registration.</p>
            </div>
            <div className="border-b border-slate-100 mb-6"></div>
            <form onSubmit={handleSubmit} className="space-y-4.5">

                <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Name</label>
                    <input
                        type='text'
                        name='name'
                        required
                        value={form.name}
                        placeholder='Enter Your Name'
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                        type='email'
                        name='email'
                        required
                        value={form.email}
                        placeholder='Example@gmail.com'
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                        type='text'
                        name='phone'
                        value={form.phone}
                        placeholder='Enter Your Phone Number'
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                    <input
                        type='text'
                        name='address'
                        value={form.address}
                        placeholder='Enter Your Address'
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Role</label>
                    <select
                        name='role'
                        required
                        value={form.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200 cursor-pointer"
                    >
                        <option value="admin">Admin </option>
                        <option value="manager">Manager </option>
                        <option value="accountant">Accountant </option>
                        <option value="customer">Customer </option>
                    </select>
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            required
                            value={form.password}
                            placeholder='Create a Password'
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all duration-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            )}
                        </button>
                    </div>
                </div>
                <button type='submit' className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0">
                    Register User
                </button>




            </form>


                
            </div>
        </div>
    )
}
export default Register