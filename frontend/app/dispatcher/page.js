'use client';

import React from 'react';

// Dispatcher Custom Hook & Modular Components
import useDispatcherState from '../../components/dispatcher/useDispatcherState';
import DispatcherHeader from '../../components/dispatcher/DispatcherHeader';
import DashboardTab from '../../components/dispatcher/DashboardTab';
import ServiceRequestsTab from '../../components/dispatcher/ServiceRequestsTab';
import TechniciansRosterTab from '../../components/dispatcher/TechniciansRosterTab';
import LiveMapTab from '../../components/dispatcher/LiveMapTab';
import AuditLogsTab from '../../components/dispatcher/AuditLogsTab';
import AssignTechnicianModal from '../../components/dispatcher/AssignTechnicianModal';
import NewDispatchModal from '../../components/dispatcher/NewDispatchModal';
import ExpandedMapModal from '../../components/dispatcher/ExpandedMapModal';

export default function DispatcherDashboard() {
  const state = useDispatcherState();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col antialiased">
      
      {/* Header Bar */}
      <DispatcherHeader
        searchQuery={state.searchQuery}
        setSearchQuery={state.setSearchQuery}
        dispatcherStatus={state.dispatcherStatus}
        setDispatcherStatus={state.setDispatcherStatus}
        showStatusDropdown={state.showStatusDropdown}
        setShowStatusDropdown={state.setShowStatusDropdown}
        onOpenNewRequest={() => state.setIsNewRequestOpen(true)}
        showToast={state.showToast}
        staggeredMenuItems={state.staggeredMenuItems}
        socialItems={state.socialItems}
      />

      {/* Main Dashboard Body */}
      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">
        {state.activeTab === 'dashboard' && (
          <DashboardTab
            totalRequestsCount={state.totalRequestsCount}
            activeJobsCount={state.activeJobsCount}
            pendingEmergenciesCount={state.pendingEmergenciesCount}
            dispatches={state.dispatches}
            technicians={state.technicians}
            filteredActivities={state.filteredActivities}
            handleOpenAssign={state.handleOpenAssign}
            setIsMapExpanded={state.setIsMapExpanded}
            showToast={state.showToast}
          />
        )}

        {state.activeTab === 'requests' && (
          <ServiceRequestsTab
            unassignedRequestsCount={state.unassignedRequestsCount}
            inProgressRequestsCount={state.inProgressRequestsCount}
            completedRequestsCount={state.completedRequestsCount}
            selectedServiceType={state.selectedServiceType}
            handleServiceTypeChange={state.handleServiceTypeChange}
            selectedStatus={state.selectedStatus}
            handleStatusChange={state.handleStatusChange}
            filteredRequests={state.filteredRequests}
            paginatedRequests={state.paginatedRequests}
            currentPage={state.currentPage}
            setCurrentPage={state.setCurrentPage}
            totalPages={state.totalPages}
            handleExportCSV={state.handleExportCSV}
            handleOpenAssignFromTable={state.handleOpenAssignFromTable}
            handleStartJob={state.handleStartJob}
            handleCompleteJob={state.handleCompleteJob}
            showToast={state.showToast}
          />
        )}

        {state.activeTab === 'technicians' && (
          <TechniciansRosterTab
            filteredTechnicians={state.filteredTechnicians}
            showToast={state.showToast}
          />
        )}

        {state.activeTab === 'map' && (
          <LiveMapTab
            dispatches={state.dispatches}
            liveTechnicians={state.liveTechnicians}
            selectedTechForStatus={state.selectedTechForStatus}
            setSelectedTechForStatus={state.setSelectedTechForStatus}
            handleTechStatusChange={state.handleTechStatusChange}
            handleOpenAssign={state.handleOpenAssign}
          />
        )}

        {state.activeTab === 'logs' && (
          <AuditLogsTab
            logs={state.logs}
            setLogs={state.setLogs}
            showToast={state.showToast}
          />
        )}
      </main>

      {/* Toast Notification */}
      {state.toast && (
        <div className="fixed bottom-6 right-6 z-[3000] bg-[#0A2540] text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-bottom duration-300">
          <span>ℹ️</span>
          <span>{state.toast}</span>
        </div>
      )}

      {/* Modals */}
      <AssignTechnicianModal
        assigningDispatch={state.assigningDispatch}
        setAssigningDispatch={state.setAssigningDispatch}
        technicians={state.technicians}
        handleConfirmAssignment={state.handleConfirmAssignment}
      />

      <NewDispatchModal
        isNewRequestOpen={state.isNewRequestOpen}
        setIsNewRequestOpen={state.setIsNewRequestOpen}
        newRequestData={state.newRequestData}
        setNewRequestData={state.setNewRequestData}
        handleCreateRequest={state.handleCreateRequest}
      />

      <ExpandedMapModal
        isMapExpanded={state.isMapExpanded}
        setIsMapExpanded={state.setIsMapExpanded}
        dispatches={state.dispatches}
        handleOpenAssign={state.handleOpenAssign}
        showToast={state.showToast}
      />

    </div>
  );
}
