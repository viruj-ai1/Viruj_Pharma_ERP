import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';

// Dynamically import all views
const viewImports = {
  dashboard: () => import('../../views/Dashboard'),
  myTasks: () => import('../../views/tasks/MyTasksView'),
  documents: () => import('../../views/documents/DocumentsView'),
  
  // Production Officer
  myBatches: () => import('../../views/production/MyBatchesView'),
  batchExecutionWorkspace: () => import('../../views/production/BatchExecutionWorkspaceView'),
  prodMaterialIssue: () => import('../../views/production/ProdMaterialIssueView'),
  prodSamplingQC: () => import('../../views/production/ProdSamplingQCView'),
  prodReportDeviation: () => import('../../views/production/ProdReportDeviationView'),
  prodEquipmentLogs: () => import('../../views/production/ProdEquipmentLogsView'),
  prodOfficierChecklists: () => import('../../views/production/ProdOfficierChecklistsView'),
  prodDocAccessOfficer: () => import('../../views/production/ProdDocAccessOfficerView'),
  prodOfficerNotifications: () => import('../../views/production/ProdOfficerNotificationsView'),
  prodAuditTrailOfficer: () => import('../../views/production/ProdAuditTrailOfficerView'),

  // Production Manager
  batchControlPanel: () => import('../../views/production/BatchManagementView'),
  stageTracking: () => import('../../views/production/StageTrackingView'),
  shiftScheduling: () => import('../../views/production/ShiftSchedulingView'),
  prodMaterialRequests: () => import('../../views/production/ProdMaterialRequestsView'),
  prodEventManager: () => import('../../views/production/ProdEventManagerView'),
  lineReadiness: () => import('../../views/production/LineReadinessView'),
  prodInterDeptActions: () => import('../../views/production/ProdInterDeptActionsView'),
  prodDocsChecklists: () => import('../../views/production/ProdDocsChecklistsView'),
  prodTeamCompetency: () => import('../../views/production/ProdTeamCompetencyView'),
  prodReportsManager: () => import('../../views/production/ProdReportsManagerView'),
  prodAuditTrailManager: () => import('../../views/production/ProdAuditTrailManagerView'),

  // Production Head
  batchOversight: () => import('../../views/production/BatchOversightView'),
  stageProgress: () => import('../../views/production/StageProgressView'),
  lineEquipment: () => import('../../views/production/LineEquipmentView'),
  shiftManagement: () => import('../../views/production/ShiftManagementView'),
  materialYield: () => import('../../views/production/MaterialYieldView'),
  prodDeviationCenter: () => import('../../views/production/ProdDeviationCenterView'),
  environmentMonitor: () => import('../../views/production/EnvironmentMonitorView'),
  interDeptComm: () => import('../../views/production/InterDeptCommView'),
  prodDocuments: () => import('../../views/production/ProdDocumentsView'),
  prodWorkforce: () => import('../../views/production/ProdWorkforceView'),
  prodAnalytics: () => import('../../views/production/ProdAnalyticsView'),
  prodAuditTrail: () => import('../../views/production/ProdAuditTrailView'),

  // QA
  deviations: () => import('../../views/qa/DeviationsView'),
  deviationDetail: () => import('../../views/qa/DeviationDetailView'),
  qaRelease: () => import('../../views/qa/QAReleaseView'),
  batchReview: () => import('../../views/qa/BatchReviewView'),
  preReleaseReview: () => import('../../views/qa/PreReleaseReviewView'),
  changeControl: () => import('../../views/qa/ChangeControlView'),
  capa: () => import('../../views/qa/CAPAView'),
  documentControl: () => import('../../views/qa/DocumentControlView'),
  docDigitization: () => import('../../views/qa/DocDigitizationView'),
  stability: () => import('../../views/qa/StabilityView'),
  marketComplaints: () => import('../../views/qa/MarketComplaintsView'),
  audits: () => import('../../views/qa/AuditsView'),
  training: () => import('../../views/qa/TrainingView'),
  em: () => import('../../views/qa/EMView'),
  qaApprovals: () => import('../../views/qa/QAApprovalsView'),
  qaReports: () => import('../../views/qa/QAReportsView'),
  qaSettings: () => import('../../views/qa/QASettingsView'),

  // QA Officer
  labWorkbench: () => import('../../views/qa_officer/LabWorkbenchView'),
  docDigitizationUploader: () => import('../../views/qa_officer/DocDigitizationUploaderView'),
  inProcessInspections: () => import('../../views/qa_officer/InProcessInspectionsView'),
  em_officer: () => import('../../views/qa_officer/EMView'),
  capaTasks: () => import('../../views/qa_officer/CapaTasksView'),
  sampleManagement: () => import('../../views/qa_officer/SampleManagementView'),
  sopsMethods: () => import('../../views/qa_officer/SopsMethodsView'),
  training_officer: () => import('../../views/qa_officer/TrainingView'),
  notifications: () => import('../../views/qa_officer/NotificationsView'),
  auditTrail: () => import('../../views/qa_officer/AuditTrailView'),
  help: () => import('../../views/qa_officer/HelpView'),

  // SCM - Warehouse
  inbound: () => import('../../views/warehouse/InboundView'),
  warehouseQCCoordination: () => import('../../views/warehouse/WarehouseQCCoordinationView'),
  inventoryMgmt: () => import('../../views/warehouse/InventoryMgmtView'),
  binBatchMgmt: () => import('../../views/warehouse/BinBatchMgmtView'),
  materialIssuance: () => import('../../views/warehouse/MaterialIssuanceView'),
  dispatchMgmt: () => import('../../views/warehouse/DispatchMgmtView'),
  returnHandling: () => import('../../views/warehouse/ReturnHandlingView'),
  stockAdjustment: () => import('../../views/warehouse/StockAdjustmentView'),
  cycleCounts: () => import('../../views/warehouse/CycleCountsView'),
  warehouseComplianceDocs: () => import('../../views/warehouse/WarehouseComplianceDocsView'),
  warehouseCrossDept: () => import('../../views/warehouse/WarehouseCrossDeptView'),
  warehouseNotifications: () => import('../../views/warehouse/WarehouseNotificationsView'),
  warehouseAuditTrail: () => import('../../views/warehouse/WarehouseAuditTrailView'),
  
  // SCM - Procurement
  prManagement: () => import('../../views/scm/MaterialIndentView'),
  quotationManagement: () => import('../../views/scm/QuotationView'),
  poTracking: () => import('../../views/scm/ProcurementView'),
  vendorManagementOfficer: () => import('../../views/scm/VendorManagementOfficerView'),
  deliveryTracking: () => import('../../views/scm/DeliveryTrackingView'),
  grnCoordination: () => import('../../views/scm/GRNCoordinationView'),
  qcInspection: () => import('../../views/scm/QCInspectionView'),
  invoiceSupport: () => import('../../views/scm/InvoiceSupportView'),
  expediteRequests: () => import('../../views/scm/ExpediteRequestsView'),
  rateAgreements: () => import('../../views/scm/RateAgreementView'),
  procNotifications: () => import('../../views/scm/ProcNotificationsView'),
  procAuditTrail: () => import('../../views/scm/ProcAuditTrailView'),

  // Admin
  userManagement: () => import('../../views/admin/UserManagementView'),
  
  // Management
  plants: () => import('../../views/management/PlantsView'),
  quality: () => import('../../views/management/QualityView'),
  finance: () => import('../../views/management/FinanceView'),
  projects: () => import('../../views/management/ProjectsView'),
  scmOverview: () => import('../../views/management/SCMOverviewView'),
  reports: () => import('../../views/management/ReportsView'),

  // Plant Head
  plantProduction: () => import('../../views/plant/PlantProductionView'),
  plantQuality: () => import('../../views/plant/PlantQualityView'),
  plantSCM: () => import('../../views/plant/PlantSCMView'),
  plantWarehouse: () => import('../../views/plant/PlantWarehouseView'),
  plantMaintenance: () => import('../../views/plant/PlantMaintenanceView'),
  plantSafety: () => import('../../views/plant/PlantSafetyView'),
  plantWorkforce: () => import('../../views/plant/PlantWorkforceView'),
  plantCompliance: () => import('../../views/plant/PlantComplianceView'),
  plantProjects: () => import('../../views/plant/PlantProjectsView'),
  plantBatchReports: () => import('../../views/plant/PlantBatchReportsView'),
  plantApprovals: () => import('../../views/plant/PlantApprovalsView'),
  plantAuditTrails: () => import('../../views/plant/PlantAuditTrailsView'),
  plantAdmin: () => import('../../views/plant/PlantAdminView'),
  
  // QC Officer
  sampleAssignment: () => import('../../views/qc/SampleAssignmentView'),
  testingBench: () => import('../../views/qc/TestingBenchView'),
  resultEntry: () => import('../../views/qc/ResultEntryView'),
  instrumentsQC: () => import('../../views/qc/InstrumentsQCView'),
  stabilityTasks: () => import('../../views/qc/StabilityTasksView'),
  standardsReagents: () => import('../../views/qc/StandardsReagentsView'),
  documentAccessQC: () => import('../../views/qc/DocumentAccessQCView'),
  deviationsQC: () => import('../../views/qc/DeviationsQCView'),
  trainingMatrixQC: () => import('../../views/qc/TrainingMatrixQCView'),
  myAuditLogQC: () => import('../../views/qc/MyAuditLogQCView'),

  // QC Manager
  qcSampleMgmtManager: () => import('../../views/qc/QCSampleMgmtManagerView'),
  qcTestReview: () => import('../../views/qc/QCTestReviewView'),
  qcAssignmentCenter: () => import('../../views/qc/QCAssignmentCenterView'),
  qcInstrumentsManager: () => import('../../views/qc/QCInstrumentsManagerView'),
  qcStabilityManager: () => import('../../views/qc/QCStabilityManagerView'),
  qcStandardsManager: () => import('../../views/qc/QCStandardsManagerView'),
  qcInvestigationsManager: () => import('../../views/qc/QCInvestigationsManagerView'),
  qcDocumentsManager: () => import('../../views/qc/QCDocumentsManagerView'),
  qcTeamMatrixManager: () => import('../../views/qc/QCTeamMatrixManagerView'),
  qcPlanningManager: () => import('../../views/qc/QCPlanningManagerView'),
  qcReportsManager: () => import('../../views/qc/QCReportsManagerView'),
  qcAuditTrailsManager: () => import('../../views/qc/QCAuditTrailsManagerView'),

  // QC Head
  sampleOversight: () => import('../../views/qc/SampleOversightView'),
  testOversight: () => import('../../views/qc/TestOversightView'),
  coaApprovalCenter: () => import('../../views/qc/CoaApprovalCenterView'),
  investigationCenter: () => import('../../views/qc/InvestigationCenterView'),
  stabilityOversight: () => import('../../views/qc/StabilityOversightView'),
  instrumentControl: () => import('../../views/qc/InstrumentControlView'),
  standardsControl: () => import('../../views/qc/StandardsControlView'),
  documentControlHead: () => import('../../views/qc/DocumentControlHeadView'),
  interDeptEscalations: () => import('../../views/qc/InterDeptEscalationsView'),
  qcWorkforce: () => import('../../views/qc/QCWorkforceView'),
  qcResourcePlanning: () => import('../../views/qc/QCResourcePlanningView'),
  qcAnalytics: () => import('../../views/qc/QCAnalyticsView'),
  auditTrailsHead: () => import('../../views/qc/AuditTrailsHeadView'),
};

const DashboardLayout: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [viewParams, setViewParams] = useState<any>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavigation = useCallback((view: string, params?: any) => {
    setActiveView(view);
    setViewParams(params);
  }, []);

  const renderActiveComponent = () => {
    const props: any = {
      onNavigate: handleNavigation,
      ...viewParams
    };
    
    const viewImport = viewImports[activeView] || viewImports['dashboard'];
    const Component = React.lazy(viewImport);
    
    return (
      <React.Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Component {...props} />
      </React.Suspense>
    );
  }

  return (
    <div className="flex h-screen bg-ui-background text-text-primary">
      <Sidebar 
        activeView={activeView} 
        setActiveView={handleNavigation} 
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
          isCollapsed={isSidebarCollapsed} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
