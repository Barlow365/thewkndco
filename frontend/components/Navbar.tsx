import Link from 'next/link'
import Image from 'next/image'
import Button from './Button'
import { useAuth } from './AuthProvider'

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-black/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="WKND_CO logo" width={32} height={32} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">WKND_CO</p>
            <p className="text-xs text-white/60">Concierge • Travel • Access</p>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link href="#trips" className="text-white/70 hover:text-white">
            Trips
          </Link>
          <Link href="#concierge" className="text-white/70 hover:text-white">
            Concierge
          </Link>
          <Link href="#hosts" className="text-white/70 hover:text-white">
            Hosts
          </Link>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-2 text-sm">
          {/* show auth state if available */}
          <AuthArea />
        </div>
      </nav>
    </header>
  )
}

export default Navbar

function AuthArea() {
  const { user, signOut } = useAuth()

  if (!user)
    return (
      <>
        <Link href="/login" className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/80 hover:border-white/40 hover:text-white">Log in</Link>
        <Link href="/signup">
          <Button variant="primary">Get access</Button>
        </Link>
      </>
    )

  return (
    <div className="flex items-center gap-3">
      <Link href="/dashboard" className="text-xs text-white/90 hover:text-white">{user.email ?? 'Account'}</Link>
      <button onClick={() => signOut()} className="text-xs text-white/60 hover:text-white/80">Sign out</button>
    </div>
  )
}
