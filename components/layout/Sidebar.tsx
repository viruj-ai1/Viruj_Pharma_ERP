import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NAV_LINKS } from '../../constants';
import { Role } from '../../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
}

const LogoIcon = () => (
    <svg className="w-8 h-8 text-primary-600 dark:text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3L5 9.33333V21H19V9.33333L15 3H9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16Z" fill="currentColor" />
    </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isSidebarOpen, setSidebarOpen, isCollapsed, setCollapsed }) => {
  const { user } = useAuth();

  const handleNavigation = (view: string) => {
    setActiveView(view);
    if (window.innerWidth < 768) { // md breakpoint
        setSidebarOpen(false);
    }
  }

  const filteredNavLinks = NAV_LINKS.filter(link => {
      if (!user) return false;
      return link.allowedRoles.includes(user.role)
  });
  
  // All section definitions remain the same
  const prodHeadNavSections = { "Core": ['dashboard'], "Oversight": ['batchOversight', 'stageProgress', 'lineEquipment'], "Management": ['shiftManagement', 'materialYield', 'prodWorkforce'], "Compliance": ['prodDeviationCenter', 'environmentMonitor', 'interDeptComm', 'prodDocuments'], "Analytics": ['prodAnalytics', 'prodAuditTrail'], };
  const prodManagerNavSections = { "Operations": ['dashboard', 'batchControlPanel', 'stageTracking'], "Resources": ['shiftScheduling', 'prodMaterialRequests'], "Events": ['prodEventManager', 'lineReadiness'], "Coordination": ['prodInterDeptActions'], "Team": ['prodDocsChecklists', 'prodTeamCompetency', 'prodReportsManager', 'prodAuditTrailManager'], };
  const prodOperatorNavSections = { "Execution": ['dashboard', 'myBatches', 'batchExecutionWorkspace'], "Tasks": ['prodMaterialIssue', 'prodSamplingQC', 'prodEquipmentLogs', 'prodOfficierChecklists'], "Reporting": ['prodReportDeviation', 'prodDocAccessOfficer'], "Personal": ['prodOfficerNotifications', 'prodAuditTrailOfficer'], };
  const plantHeadNavSections = { "Core": ['dashboard', 'plantApprovals'], "Operations": ['plantProduction', 'plantQuality', 'plantSCM', 'plantWarehouse', 'plantMaintenance'], "Management": ['plantSafety', 'plantWorkforce', 'plantProjects'], "Compliance": ['plantBatchReports', 'plantCompliance', 'plantAuditTrails'], "Settings": ['plantAdmin'] };
  const qaHeadNavSections = { "Core": ['dashboard', 'qaApprovals'], "Management": ['qaRelease', 'batchReview', 'deviations', 'changeControl', 'capa'], "Documentation": ['documentControl', 'stability', 'marketComplaints'], "Oversight": ['audits', 'training', 'em'], "System": ['qaReports', 'qaSettings'] };
  const qaManagerNavSections = { "Core": ['dashboard'], "Operations": ['batchReview', 'preReleaseReview'], "Systems": ['deviations', 'capa', 'changeControl'], "Documentation": ['documentControl', 'docDigitization'], "Monitoring": ['stability', 'em', 'training', 'qaReports'] };
  const qaOperatorNavSections = { "EXECUTION": ['labWorkbench', 'inProcessInspections', 'em_officer'], "EVENTS": ['deviations', 'capaTasks'], "DOCUMENTATION": ['sampleManagement', 'docDigitizationUploader', 'sopsMethods'], "PERSONAL": ['myTasks', 'training_officer', 'notifications', 'auditTrail', 'help'] };
  const qcHeadNavSections = { "Core": ["dashboard"], "Oversight": ["sampleOversight", "testOversight"], "Approvals": ["coaApprovalCenter", "investigationCenter", "stabilityOversight"], "Control": ["instrumentControl", "standardsControl", "documentControlHead"], "Management": ["interDeptEscalations", "qcWorkforce", "qcResourcePlanning", "qcAnalytics"], "Compliance": ["auditTrailsHead"], };
  const qcManagerNavSections = { "Core": ["dashboard", "qcSampleMgmtManager", "qcTestReview", "qcAssignmentCenter"], "Lab Systems": ["qcInstrumentsManager", "qcStabilityManager", "qcStandardsManager"], "Compliance": ["qcInvestigationsManager", "qcDocumentsManager"], "Management": ["qcTeamMatrixManager", "qcPlanningManager"], "Data": ["qcReportsManager", "qcAuditTrailsManager"], };
  const qcOperatorNavSections = { "CORE TASKS": ["dashboard", "sampleAssignment", "testingBench"], "LAB EXECUTION": ["resultEntry", "instrumentsQC", "stabilityTasks", "standardsReagents"], "COMPLIANCE": ["documentAccessQC", "deviationsQC", "trainingMatrixQC", "myAuditLogQC"], };
  const procOfficerNavSections = { "Core": ["dashboard"], "Execution": ["prManagement", "quotationManagement", "poTracking"], "Coordination": ["deliveryTracking", "grnCoordination", "qcInspection"], "Vendor": ["vendorManagementOfficer", "rateAgreements"], "Support": ["invoiceSupport", "expediteRequests", "procNotifications"], "Compliance": ["procAuditTrail"], };
  const warehouseManagerNavSections = { "Core": ["dashboard"],"Inbound": ["inbound", "warehouseQCCoordination"],"Inventory": ["inventoryMgmt", "binBatchMgmt", "stockAdjustment", "cycleCounts"],"Outbound": ["materialIssuance", "dispatchMgmt"],"Handling": ["returnHandling"],"Compliance": ["warehouseComplianceDocs", "warehouseCrossDept", "warehouseNotifications", "warehouseAuditTrail"], };

  const renderLinks = (links: typeof NAV_LINKS) => links.map((link) => {
      let linkName = link.name;
      const isLeadership = [Role.Management, Role.Plant_Head, Role.QA_Head, Role.QA_Manager, Role.QC_Head, Role.QC_Manager].includes(user?.role as Role);
      
      if (link.view === 'myTasks' && isLeadership) {
          linkName = 'Approvals / Inbox';
      }

      let viewKey = link.view;
      if (link.view === 'myTasks' && user?.role === Role.Plant_Head) viewKey = 'plantApprovals';
      if (link.view === 'myTasks' && user?.role === Role.QA_Head) viewKey = 'qaApprovals';

      return (
          <button
              key={link.name + viewKey}
              onClick={() => handleNavigation(viewKey)}
              title={isCollapsed ? linkName : undefined}
              className={`w-full flex items-center px-3 py-2 my-0.5 rounded-md transition-colors duration-200 text-sm group ${
                  activeView === viewKey
                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-medium'
                  : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-text-primary'
              } ${isCollapsed ? 'justify-center' : ''}`}
          >
          <link.icon />
          {!isCollapsed && <span className="ml-3">{linkName}</span>}
          </button>
      );
  });

  const renderSectionedNav = (sections: Record<string, string[]>) => {
    return Object.entries(sections).map(([sectionTitle, viewKeys]) => {
      const sectionLinks = filteredNavLinks.filter(link => viewKeys.includes(link.view));
      if (sectionLinks.length === 0) return null;
      
      const isCoreSection = sectionTitle.toUpperCase().startsWith("CORE");

      return (
        <div key={sectionTitle} className={!isCoreSection ? "mt-4" : ""}>
          {!isCollapsed && !isCoreSection && (
             <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-text-muted uppercase">{sectionTitle}</h3>
          )}
          {renderLinks(sectionLinks)}
        </div>
      );
    });
  };

  const renderSidebarContent = () => {
    if (!user) return null;
    
    const globalMyTasks = filteredNavLinks.find(link => link.view === 'myTasks');
    const globalLinks = globalMyTasks ? renderLinks([globalMyTasks]) : null;

    switch(user.role) {
      case Role.Production_Head: return renderSectionedNav(prodHeadNavSections);
      case Role.Production_Manager: return <> {globalLinks} {renderSectionedNav(prodManagerNavSections)} </>;
      case Role.Production_Operator: return <> {globalLinks} {renderSectionedNav(prodOperatorNavSections)} </>;
      case Role.Plant_Head: return renderSectionedNav(plantHeadNavSections);
      case Role.QA_Head: return renderSectionedNav(qaHeadNavSections);
      case Role.QA_Manager: return <> {globalLinks} {renderSectionedNav(qaManagerNavSections)} </>;
      case Role.QA_Operator: return renderSectionedNav(qaOperatorNavSections);
      case Role.QC_Head: return renderSectionedNav(qcHeadNavSections);
      case Role.QC_Manager: return renderSectionedNav(qcManagerNavSections);
      case Role.QC_Operator: return <> {globalLinks} {renderSectionedNav(qcOperatorNavSections)} </>;
      case Role.Procurement_Officer: return <> {globalLinks} {renderSectionedNav(procOfficerNavSections)} </>;
      case Role.Warehouse_Manager: return <> {globalLinks} {renderSectionedNav(warehouseManagerNavSections)} </>;
      default: return renderLinks(filteredNavLinks);
    }
  }

  return (
    <>
        <div 
            className={`fixed inset-0 z-30 bg-black bg-opacity-30 transition-opacity md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
            onClick={() => setSidebarOpen(false)}
        ></div>
        <div className={`fixed inset-y-0 left-0 z-40 bg-ui-card text-text-primary transition-all duration-300 ease-in-out flex flex-col border-r border-ui-border
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:relative md:translate-x-0 
            ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            <div className={`flex items-center justify-center h-16 border-b border-ui-border flex-shrink-0 ${isCollapsed ? 'px-0' : 'px-4'}`}>
                <div className="flex items-center space-x-3">
                    <LogoIcon />
                    {!isCollapsed && <span className="text-xl font-bold tracking-tight text-text-primary">Achieve</span>}
                </div>
            </div>
            <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                {renderSidebarContent()}
            </nav>
            <div className="border-t border-ui-border p-2 hidden md:block">
                 <button onClick={() => setCollapsed(!isCollapsed)} className="w-full flex items-center justify-center p-2 rounded-md text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800">
                    {isCollapsed 
                    ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg> 
                    : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                    }
                </button>
            </div>
        </div>
    </>
  );
};

export default Sidebar;
