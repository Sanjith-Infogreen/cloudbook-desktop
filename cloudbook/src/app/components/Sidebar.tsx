'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation';  

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false)
  const [masterMenuOpen, setMasterMenuOpen] = useState(false)
  const [tripMenuOpen, setTripMenuOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Auto-expand menus based on current path
  useEffect(() => {
    if (pathname.includes('/desktop/modules/vehicle') || pathname.includes('/desktop/modules/contact') || pathname.includes('/desktop/modules/options')) {
      setMasterMenuOpen(true)
    }
    if (pathname.includes('/desktop/modules/trip-sheet') || pathname.includes('/desktop/modules/expense') ) {
      setTripMenuOpen(true)
    }
  }, [pathname])

  const handleMasterMenuClick = () => {
    setMasterMenuOpen(!masterMenuOpen)
  }

  const handleTripMenuClick = () => {
    setTripMenuOpen(!tripMenuOpen)
  }

  // Check if a path is active
  const isActive = (path: string) => {
    return pathname === path
  }

  // Check if a menu section is active
  const isSectionActive = (paths: string[]) => {
    return paths.some(path => pathname.includes(path))
  }

  // Desktop Sidebar (wider)
  if (!isMobile) {
    return (
      <div className="w-[200px] bg-[#212934] shadow-md relative h-full">
        <div className="px-0 pt-2 pb-0 flex justify-center">
        <Image
        src="/images/logo.png" // Path relative to the public directory
        alt="InfoGreen Logo"
        width={100} // Specify the intrinsic width of the image in pixels
        height={40} // Specify the intrinsic height of the image in pixels
      />

        </div>

        <nav className="py-0">
          <ul>
            <li
              className={`px-4 py-2 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                masterMenuOpen || isSectionActive(['/desktop/modules/vehicle', '/desktop/modules/contact','/desktop/modules/options']) 
                  ? 'text-white ' 
                  : 'text-[#b0b3b7]'
              }`}
              onClick={handleMasterMenuClick}
            >
              <div className="flex items-center">
                <i className={`ri-dashboard-line mr-3 text-lg ${
                  masterMenuOpen || isSectionActive(['/desktop/modules/vehicle', '/desktop/modules/contact','/desktop/modules/options']) ? 'text-white' : ''
                }`}></i>
                <span>Master</span>
              </div>
              <i
                className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${
                  masterMenuOpen ? 'rotate-180' : ''
                }`}
              ></i>
            </li>

            {masterMenuOpen && (
              <ul className="text-[#b0b3b7]">
                <li
                  className={`py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                    isActive('/desktop/modules/contact/list') || isActive('/desktop/modules/contact/new') 
                      ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                      : 'text-[#b0b3b7] border-l-transparent'
                  }`}
                >
                  <span 
                    onClick={() => router.push('/desktop/modules/contact/list')}
                    className={`${isActive('/desktop/modules/contact/list') ? 'text-white' : ''}`}
                  >
                    Contact
                  </span>
                  <i 
                    onClick={() => router.push('/desktop/modules/contact/new')} 
                    className={`ri-add-fill text-lg ${isActive('/desktop/modules/contact/new') ? 'text-white' : ''}`}
                  ></i>
                </li>

                <li
                  className={`py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                    isActive('/desktop/modules/options')
                      ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                      : 'text-[#b0b3b7] border-l-transparent'
                  }`}
                >
                  <span 
                    onClick={() => router.push('/desktop/modules/options')}
                    className={`${isActive('/desktop/modules/options') ? 'text-white' : ''}`}
                  >
                    Options
                  </span>
                </li>
              </ul>
            )}

            
            <li
              onClick={() => router.push('/desktop/modules/complaint')}
              className={`px-4 py-2 border-l-5  hover:bg-[#191f26] hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                isActive('/desktop/modules/complaint') 
                  ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                  : 'text-[#b0b3b7] border-l-transparent'
              }`}
            >
              <div className="flex items-center">
                <i className={`ri-file-edit-line mr-3 text-lg ${
                  isActive('/desktop/modules/complaint') ? 'text-white' : ''
                }`}></i>
                <span>Complaint List</span>
              </div>
            </li>


            <li
              onClick={() => router.push('/desktop/modules/service')}
              className={`px-4 py-2 border-l-5  hover:bg-[#191f26] hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                isActive('/desktop/modules/service') 
                  ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                  : 'text-[#b0b3b7] border-l-transparent'
              }`}
            >
              <div className="flex items-center">
                <i className={`ri-tools-fill mr-3 text-lg ${
                  isActive('/desktop/modules/service') ? 'text-white' : ''
                }`}></i>
                <span>Service List</span>
              </div>
            </li>



            <li
              onClick={() => router.push('/desktop/modules/report/new')}
              className={`px-4 py-2 border-l-5  hover:bg-[#191f26] hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                isActive('/desktop/modules/report/new') 
                  ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                  : 'text-[#b0b3b7] border-l-transparent'
              }`}
            >
              <div className="flex items-center">
                <i className={`ri-file-chart-line mr-3 text-lg ${
                  isActive('/desktop/modules/report/new') ? 'text-white' : ''
                }`}></i>
                <span>Report</span>
              </div>
            </li>

            <li
              onClick={() => router.push('/desktop/modules/profile')}
              className={`px-4 py-2 border-l-5  hover:bg-[#191f26] hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                isActive('/desktop/modules/profile') 
                  ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                  : 'text-[#b0b3b7] border-l-transparent'
              }`}
            >
              <div className="flex items-center">
                <i className={`ri-user-line mr-3 text-lg ${
                  isActive('/desktop/modules/profile') ? 'text-white' : ''
                }`}></i>
                <span>Profile Setting</span>
              </div>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-t-[#b0b3b7] py-2 pl-2 pr-4 flex items-center">
          <div className="mr-2">
            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
              <img src="/images/profile-pic.png" alt="User Image" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="text-[#b0b3b7]">
            <div className="font-semibold">Emily Clark</div>
            <div className="text-xs">Admin</div>
          </div>
          <div className="ml-auto">
            <i className="ri-expand-up-down-fill text-[#b0b3b7] text-lg cursor-pointer"></i>
          </div>
        </div>
      </div>
    )
  }

  // Tablet/Mobile Sidebar (compact)
  return (
    <div className="w-[60px] bg-[#212934] shadow-md relative h-full">
      <div className="px-0 py-1.5 flex justify-center">
        <img src="/images/tab-logo.png" alt="InfoGreen Logo" className="h-9" />
      </div>

      <nav className="py-0">
        <ul>
          <li
            className={`relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5 hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
              isSectionActive(['/desktop/modules/vehicle', '/desktop/modules/contact','/desktop/modules/options']) 
                ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                : 'text-[#b0b3b7]  border-l-transparent'
            }`}
            onMouseEnter={() => setHoveredMenu('master')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="flex items-center">
              <i className={`ri-dashboard-line text-lg ${
                isSectionActive(['/desktop/modules/vehicle', '/desktop/modules/contact','/desktop/modules/options']) ? 'text-white' : ''
              }`}></i>
            </div>

            {hoveredMenu === 'master' && (
              <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white">
                <ul>
                 
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/desktop/modules/contact/new') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/desktop/modules/contact/new')}
                  >
                    <i className="ri-add-line text-[16px]"></i> New Contact
                  </li>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/desktop/modules/contact/list') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/desktop/modules/contact/list')}
                  >
                    <i className="ri-list-unordered text-[16px]"></i> Contact List
                  </li>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/desktop/modules/options') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff]' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/desktop/modules/options')}
                  >
                    <i className="ri-list-unordered text-[16px]"></i> Options
                  </li>
                </ul>
              </div>
            )}
          </li>




           <li
            className={`relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
              isActive('/desktop/modules/complaint') 
                ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                : 'text-[#b0b3b7] border-l-transparent'
            }`}
            onMouseEnter={() => setHoveredMenu('complaint')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="flex items-center">
              <i className={`ri-file-edit-line text-lg ${
                isActive('/desktop/modules/complaint') ? 'text-white' : ''
              }`}></i>
            </div>

            {hoveredMenu === 'complaint' && (
              <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white text-sm">
                <ul>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/desktop/modules/complaint') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff] ' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/desktop/modules/complaint')}
                  >
                    <i className="ri-file-edit-line text-[16px]"></i> Complaint List
                  </li>
                </ul>
              </div>
            )}
          </li>


          <li
            className={`relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
              isActive('/desktop/modules/service') 
                ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                : 'text-[#b0b3b7] border-l-transparent'
            }`}
            onMouseEnter={() => setHoveredMenu('service')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="flex items-center">
              <i className={`ri-tools-fill text-lg ${
                isActive('/desktop/modules/service') ? 'text-white' : ''
              }`}></i>
            </div>

            {hoveredMenu === 'service' && (
              <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white text-sm">
                <ul>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/desktop/modules/service') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff] ' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/desktop/modules/service')}
                  >
                    <i className="ri-tools-fill text-[16px]"></i> Service List
                  </li>
                </ul>
              </div>
            )}
          </li>


          <li
            className={`relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
              isActive('/desktop/modules/report/new') 
                ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                : 'text-[#b0b3b7] border-l-transparent'
            }`}
            onMouseEnter={() => setHoveredMenu('report')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="flex items-center">
              <i className={`ri-file-chart-line text-lg ${
                isActive('/desktop/modules/report/new') ? 'text-white' : ''
              }`}></i>
            </div>

            {hoveredMenu === 'report' && (
              <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white text-sm">
                <ul>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/desktop/modules/report/new') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff] ' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/desktop/modules/report/new')}
                  >
                    <i className="ri-list-unordered text-[16px]"></i> Report
                  </li>
                </ul>
              </div>
            )}
          </li>



          <li
            className={`relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
              isActive('/desktop/modules/profile') 
                ? 'bg-[#191f26] border-l-[#1aed59] text-white' 
                : 'text-[#b0b3b7] border-l-transparent'
            }`}
            onMouseEnter={() => setHoveredMenu('profile')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="flex items-center">
              <i className={`ri-user-line text-lg ${
                isActive('/desktop/modules/profile') ? 'text-white' : ''
              }`}></i>
            </div>

            {hoveredMenu === 'profile' && (
              <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white text-sm">
                <ul>
                  <li 
                    className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                      isActive('/desktop/modules/profile') ? 'bg-[#103d5a] border-[#1aed59] text-[#fff] ' : 'border-l-transparent'
                    }`}
                    onClick={() => router.push('/desktop/modules/profile')}
                  >
                    <i className="ri-user-line text-[16px]"></i> Profile setting
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full border-t border-t-[#b0b3b7] py-2 pl-2 pr-4 flex items-center">
        <div className="mr-2">
          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
            <img src="/images/profile-pic.png" alt="User Image" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  )
}