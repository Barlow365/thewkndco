import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-white/50 md:flex-row md:px-6">
        <p>© {new Date().getFullYear()} WKND_CO. All rights reserved.</p>
        <p className="text-[11px]">Built for founders, operators, and friends who travel with intent.</p>
      </div>
    </footer>
  )
}

export default Footer
