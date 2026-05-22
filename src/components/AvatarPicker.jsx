import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

function AvatarPicker({ 
  onAvatarSelected, 
  initialImage = null,
  name,
  email
}) {

  const [rawImage, setRawImage] = useState(initialImage)
  const [selectedSize, setSelectedSize] = useState('medium')

  const fileInputRef = useRef(null)

  const sizeClasses = {
    small: 'w-8 h-8 sm:w-10 sm:h-10',
    medium: 'w-12 h-12 sm:w-14 sm:h-14',
    large: 'w-16 h-16 sm:w-20 sm:h-20'
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')

        const MAX_WIDTH = 400

        let width = img.width
        let height = img.height

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width)
          width = MAX_WIDTH
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')

        ctx.drawImage(img, 0, 0, width, height)

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75)

        setRawImage(compressedDataUrl)

        onAvatarSelected(compressedDataUrl)
      }

      img.src = event.target.result
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4 bg-stone-50/50 p-4 rounded-2xl border border-stone-200/60">

      <div className="flex flex-col sm:flex-row items-center gap-4">

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => fileInputRef.current.click()}
          className="bg-white px-4 py-2 border border-stone-200 shadow-xs rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all"
        >
          {rawImage ? '🔄 Change Photo' : '📷 Upload Photo'}
        </motion.button>

        {/* Size Selection */}
        {rawImage && (
          <div className="flex bg-stone-200/60 p-1 rounded-xl items-center gap-1">

            {['small', 'medium', 'large'].map((size) => (

              <motion.button
                key={size}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedSize(size)}
                className={`text-xs capitalize px-3 py-1.5 font-semibold rounded-lg transition-all ${
                  selectedSize === size
                    ? 'bg-white text-stone-800 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {size}
              </motion.button>

            ))}

          </div>
        )}

      </div>

      {/* Preview Card */}
      {rawImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-stone-100 p-4 rounded-xl flex items-center shadow-xs gap-4"
        >

          {/* Avatar */}
          <div
            className={`${sizeClasses[selectedSize]} rounded-full overflow-hidden bg-stone-100 border-2 border-emerald-500/20 flex-shrink-0 transition-all duration-300`}
          >
            <img
              src={rawImage}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="overflow-hidden min-w-0">

            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-0.5">
              Live Preview Card
            </p>

            <p className="font-semibold text-stone-800 text-sm truncate">
              {name || 'Display Name'}
            </p>

            <p className="text-xs text-stone-400 truncate">
              {email || 'user@domain.com'}
            </p>

          </div>

        </motion.div>
      )}

    </div>
  )
}

export default AvatarPicker