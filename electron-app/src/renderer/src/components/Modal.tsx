import React, { useRef } from 'react'
import { Text } from '@/components/ui'

interface ModalProps {
  isOpen: boolean
}

export const Modal = ({ isOpen }: ModalProps) => {
  const modalRef = useRef(null)
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div ref={modalRef} className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <p id="modalTitle" className="text-slate-800"></p>

        <div className="mt-4">
          <p className="text-pretty text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu
            consectetur. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  )
}
