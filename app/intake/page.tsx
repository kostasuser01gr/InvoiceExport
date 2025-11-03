import { Suspense } from 'react'
import IntakeForm from './IntakeForm'

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <IntakeForm />
    </Suspense>
  )
}
