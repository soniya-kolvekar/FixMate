import TechnicianProfileForm from '../../../components/technician/TechnicianProfileForm';
import ProtectedRoute from '../../../components/ProtectedRoute';
export default function TechnicianProfilePage() {
  return (
    <ProtectedRoute allowedRole="technician">
      <div className="min-h-screen bg-slate-100 py-10 px-4">
        <TechnicianProfileForm />
      </div>
    </ProtectedRoute>
  );
}