import { useState } from 'react';
import { EyeOff,Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const {login} = useAuthStore()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = ()=>{
    if(!formData.email.trim()) return toast.error("Email is required")
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  }

  const handleSubmit = (e)=>{
    e.preventDefault()
    const success = validateForm()
    console.log(formData);
    if(success===true){
      login(formData);
    }
  }

  return (
    <div className='flex justify-center items-center w-full h-screen'>
        <form onSubmit={handleSubmit}>
      <div className='flex flex-col w-[400px] gap-3'>
        <h1 className='text-center text-2xl font-bold mb-4'>LogIn to the Account</h1>

        <label>Email</label>
        <input
          type='text'
          name='email'
          placeholder='you@emample.com'
          className='input input-bordered focus:outline-none w-full'
          value={formData.email}
          onChange={handleChange}
          />

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
          <button type='submit' className='btn btn-primary text-center border py-2'>Login</button>
          <p className='text-center mt-3'>
            Haven't signed up yet?{' '}
            <Link to="/signup" className="underline text-blue-500 cursor-pointer">
              Create Account
            </Link>
          </p>
        </div>
          </form>
    </div>
  );
}