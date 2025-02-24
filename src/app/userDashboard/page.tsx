"use client";
import CollectionsPage from "../components/CollectionsPage";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <CollectionsPage />
    </ProtectedRoute>
  );
}
