import { useState } from 'react'
import SignIn from './SignIn/SignIn'
import SignUp from './SignUp/SignUp'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')

  return (
    <div>
      {activeTab === 'signin' ? (
        <SignIn setActiveTab={setActiveTab} />
      ) : (
        <SignUp setActiveTab={setActiveTab} />
      )}
    </div>
  )
}