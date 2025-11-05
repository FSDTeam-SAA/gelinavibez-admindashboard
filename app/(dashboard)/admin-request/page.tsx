import { Header } from "@/components/Shared/Header";
import AdminRequestPage from "./_components/Adminrequestpage";

// Main Page Component
export default function AdminRequest() {
  return (
    <div className="">
        <Header tittle="Admin Requests" />
      <AdminRequestPage />
    </div>
  )
}