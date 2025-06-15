import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { MessageSquare,Eye,EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { signup, isSigningUp } = useAuthStore()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })


  const validateForm = () => {
    if(!formData.fullName.trim()) return toast.error("Full Name is required")
    if(!formData.email.trim()) return toast.error("Email is required")
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = validateForm()
    if(success===true) signup(formData);
  }

  return (
    <div className='flex h-screen justify-center items-center'>
      <div className='flex flex-col gap-3 items-center justify-center w-[500px] max-h-md rounded-md p-3'>
        <MessageSquare className="size-6 text-primary" />
        <h1 className='font-bold text-2xl'>Create Account</h1>
        <p className='text-base text-gray-400'>Get Started with your free Account</p>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-3 w-[400px]'>
            <label>Full Name</label>
            <input className='w-full input input-bordered pr-10 focus:outline-none' value = {formData.fullName} onChange={(e)=>{setFormData({...formData,fullName:e.target.value})}}></input>
            <label>Email</label>
            <input className='input input-bordered w-full pr-10 focus:outline-none' value = {formData.email} onChange={(e)=>{setFormData({...formData,email:e.target.value})}}></input>
            <label>Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="input input-bordered w-full pr-10 focus:outline-none"
                value = {formData.password} onChange={(e)=>{setFormData({...formData,password:e.target.value})}}
                />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10"
                onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {/* <button type='submit' className='text-black bg-gray-500 rounded-md w-full py-2 mt-2 hover:bg-gray-600'>Create Account</button> */}
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupPage