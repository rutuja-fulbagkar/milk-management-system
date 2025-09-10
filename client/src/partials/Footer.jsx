import React from 'react'

function Footer() {
  return (
    <footer className="tracking-wide bg-white px-10 pt-10 pb-6 mt-2">
      <div className="flex flex-wrap max-md:flex-col gap-4">
        {/* <ul className="md:flex md:space-x-6 max-md:space-y-2">
        <li>
          <a href='javascript:void(0)' className="hover:text-slate-900 text-slate-600 text-sm font-normal">Terms of Service</a>
        </li>
        <li>
          <a href='javascript:void(0)' className="hover:text-slate-900 text-slate-600 text-sm font-normal">Privacy Policy</a>
        </li>
        <li>
          <a href='javascript:void(0)' className="hover:text-slate-900 text-slate-600 text-sm font-normal">Security</a>
        </li>
      </ul> */}

        <p className="text-slate-600 text-sm md:ml-auto">Copyright © {new Date().getFullYear()} - All right reserved by <span style={{
          fontFamily: 'Arial Black, Gadget,  ui-sans-serif',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          MECHPLUS SOLUTION PVT LTD
        </span>
        </p>

      </div>
    </footer>
  )
}

export default Footer