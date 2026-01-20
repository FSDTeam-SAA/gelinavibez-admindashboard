
// "use client"
// import { useState } from "react"

// import "../globals.css";
// import { Sidebar } from "@/components/dashbord/Sidebar";


// export default function Layout({ children }: { children: React.ReactNode }) {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

//   // const handleMenuToggle = () => setIsMobileMenuOpen((prev) => !prev)
//   const handleCloseMenu = () => setIsMobileMenuOpen(false)

//   return (
//     <div className="flex min-h-screen bg-[#F8F9FA] w-full gap-6">
//       <Sidebar isMobileMenuOpen={isMobileMenuOpen} onClose={handleCloseMenu} />
//       <div className="w-full ">
//         {/* <Header onMenuClick={handleMenuToggle} /> */}
//         <main className="">
          
//           {children}</main>
//       </div>
//     </div>
//   )
// }



"use client";
import { useState } from "react";
import "../globals.css";
import { Sidebar } from "@/components/dashbord/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCloseMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={handleCloseMenu}
      />

      {/* MAIN CONTENT */}
      <div className="ml-[386px] max-w-[1400px] mx-auto">
        <main className="min-h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
