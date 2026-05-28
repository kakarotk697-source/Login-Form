import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../store/authStore'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [formData,     setFormData]     = useState({ email: '', password: '' })
  const [errors,       setErrors]       = useState({ email: '', password: '', form: '' })
  const [touched,      setTouched]      = useState({ email: false, password: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (field, value) => {
    let msg = ''
    if (field === 'email') {
      if (!value.trim()) {
        msg = 'Email or username cannot be blank.'
      } else if (value.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        msg = 'Please enter a valid format (e.g., name@domain.com).'
      }
    }
    if (field === 'password') {
      if (!value)          msg = 'Password field is required.'
      else if (value.length < 6) msg = 'Must be at least 6 characters.'
    }
    setErrors((prev) => ({ ...prev, [field]: msg, form: '' }))
    return msg
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) validate(name, value)
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    validate(name, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })

    const emailErr    = validate('email',    formData.email)
    const passwordErr = validate('password', formData.password)
    if (emailErr || passwordErr) return

    setIsSubmitting(true)
    const result = await login(formData.email, formData.password)
    setIsSubmitting(false)

    if (result.success) {
      navigate('/home')
    } else {
      setErrors((prev) => ({
        ...prev,
        form: result.message || 'Email/username or password did not match any records.',
      }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl p-8 w-full max-w-md border border-white"
      >
        <h1 className="text-4xl font-bold text-center text-emerald-800 mb-1 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-center text-stone-500 mb-6 text-sm">
          Enter your credentials to manage your tasks.
        </p>

        <AnimatePresence>
          {errors.form && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-100 text-center"
            >
              🛑 {errors.form}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-stone-500 mb-1.5 ml-1 tracking-wider">
              Email or Username
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              placeholder="emily.johnson@x.dummyjson.com"
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3.5 rounded-xl bg-stone-50/50 border outline-none transition-all text-sm text-stone-800 ${
                touched.email && errors.email
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/10'
                  : 'border-stone-200 focus:ring-2 focus:ring-emerald-400'
              }`}
            />
            <AnimatePresence>
              {touched.email && errors.email && (
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs font-medium text-red-500 mt-1 ml-1 block"
                >
                  {errors.email}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-stone-500 mb-1.5 ml-1 tracking-wider">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="••••••••"
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3.5 rounded-xl bg-stone-50/50 border outline-none transition-all text-sm text-stone-800 ${
                touched.password && errors.password
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/10'
                  : 'border-stone-200 focus:ring-2 focus:ring-emerald-400'
              }`}
            />
            <AnimatePresence>
              {touched.password && errors.password && (
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs font-medium text-red-500 mt-1 ml-1 block"
                >
                  {errors.password}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold shadow-sm transition-all active:scale-[0.99] mt-4 text-sm disabled:opacity-70 disabled:cursor-wait"
          >
            {isSubmitting ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-stone-600">
          New around here?{' '}
          <Link to="/signup" className="text-emerald-600 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login