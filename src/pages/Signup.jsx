import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../store/authStore'
import AvatarPicker from '../components/AvatarPicker'

function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuthStore()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', avatar: null })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required.')
      return
    }

    const result = signup(formData)
    if (result.success) {
      navigate('/home')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-100 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 w-full max-w-md border border-white my-8"
      >
        <h1 className="text-4xl font-bold text-center text-teal-800 mb-2 tracking-tight">
          Get Started
        </h1>
        <p className="text-center text-stone-500 mb-6 text-sm">
          Create an account to start managing your daily rhythms.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-500 mb-1 ml-1">Your Name</label>
            <input
              type="text"
              placeholder="Alex Mercer"
              className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-teal-400 transition-all text-stone-800 text-sm"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-500 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="alex@example.com"
              className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-teal-400 transition-all text-stone-800 text-sm"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-500 mb-1 ml-1">Password</label>
            <input
              type="password"
              placeholder="Choose a strong password"
              className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-teal-400 transition-all text-stone-800 text-sm"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-stone-500 ml-1">Profile Photo (Optional)</label>
            <AvatarPicker onAvatarSelected={(base64Img) => setFormData({ ...formData, avatar: base64Img })} />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-medium shadow-md shadow-teal-600/10 transition-all mt-2 text-sm"
          >
            Create Account
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm text-stone-600">
          Already have an account?{' '}
          <Link to="/" className="text-teal-700 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Signup