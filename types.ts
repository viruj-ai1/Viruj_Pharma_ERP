
export enum Department {
  QA = "Quality Assurance",
  QC = "Quality Control",
  SCM = "Supply Chain Management",
  Production = "Production",
  Admin = "Administration",
  Sales = "Sales",
  Corporate = "Corporate",
  Finance = "Finance",
  Security = "Security"
}

export enum Role {
  // Production
  Production_Head = "Production Head",
  Production_Manager = "Production Manager",
  Production_Operator = "Production Operator",
  
  // QA
  QA_Head = "QA Head",
  QA_Manager = "QA Manager",
  QA_Operator = "QA Operator",

  // QC
  QC_Head = "QC Head",
  QC_Manager = "QC Manager",
  QC_Operator = "QC Operator",

  // SCM
  Procurement_Officer = "Procurement Officer",
  Warehouse_Manager = "Warehouse Manager",

  // Finance
  Finance_Officer = "Finance Officer",
  
  // Admin & Leadership
  System_Admin = "System Admin",
  Plant_Head = "Plant Head",
  Management = "Management",

  // Security
  Security_Officer = "Security Officer",

  // Sales
  Sales_Person = "Sales Person"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  plantId?: string; // Add plantId to user
}

export interface Plant {
  id: string;
  name: string;
  region: string;
  runningLines: number;
  oee: number;
  yield: number;
  openQaHolds: number;
  inventoryValue: number;
  managerId: string;
  lastUpdated: string;
}

export interface Material {
  id: string;
  name: string;
  type: 'Raw Material' | 'Finished Good' | 'Packaging';
  defaultUnit: 'kg' | 'L' | 'units';
}

export enum BatchStatus {
  Planned = "Planned",
  InProgress = "In Progress",
  QCReview = "QC Review",
  Completed = "Completed",
  OnHold = "On Hold",
  Delayed = "Delayed",
  Blocked = "Blocked",
}

export enum QAReleaseStatus {
    Pending = "Pending",
    Hold = "Hold",
    Released = "Released",
    Rejected = "Rejected"
}

export interface BMRStep {
    name: string;
    status: 'Verified' | 'Clarification' | 'Missing' | 'Pending';
}

export interface SOPStep {
    id: string;
    name: string;
    type: 'dataEntry' | 'qcSample' | 'confirmation' | 'timer';
    status: 'Pending' | 'In Progress' | 'Completed' | 'Requires Approval' | 'Rejected';
    instructions: string;
    value?: string | number;
    requiresESig: boolean;
}

export interface ProductionStage {
    name: string;
    status: 'Not Started' | 'Running' | 'QA Hold' | 'QC Hold' | 'Completed';
    officerId?: string;
    progress: number; // 0-100
    steps: SOPStep[];
}

export interface ProductionBatch {
  id: string;
  productName: string;
  batchNumber: string;
  status: BatchStatus;
  startDate: string;
  endDate: string | null;
  quantity: number;
  unit: 'kg' | 'L';
  assignedTo?: string; // Manager's user ID
  officerId?: string; // Officer's user ID
  plantId: string;
  qaReleaseStatus: QAReleaseStatus;
  bmrStatus: 'Complete' | 'Incomplete';
  finalYield: number;
  qaOfficerId?: string;
  bmrSteps?: BMRStep[];
  stages: ProductionStage[];
  qcDependenceStatus: 'Pending QC' | 'Passed QC' | 'Failed QC' | 'N/A';
  holdReason?: string;
}

export interface InventoryItem {
  id: string;
  materialId: string;
  name: string;
  type: 'Raw Material' | 'Finished Good';
  quantity: number;
  unit: 'kg' | 'L' | 'units';
  location: string;
  expiryDate: string;
  plantId: string;
  qcStatus: 'Pending' | 'Approved' | 'Rejected' | 'Quarantine';
  binLocation: string;
  reservedQty: number;
}

export interface Deviation {
    id: string;
    title: string;
    batchNumber: string;
    description: string;
    status: 'Open' | 'Investigation' | 'Pending Manager Review' | 'Pending Final Approval' | 'Closed' | 'Rejected';
    openedBy: string; // User's name or ID
    dateOpened: string;
    assignedTo?: string; // QA Operator's user ID
    investigationSummary?: string;
    rootCause?: string;
    capa?: string; // Corrective and Preventive Actions
    managerReviewedBy?: string; // QA Manager's user ID
    approvedBy?: string; // QA Head's user ID
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    plant: string; // Plant Name
    plantId: string;
    sourceDept: Department;
}

export enum PRStatus {
  Pending = "Pending",
  Pending_Plant_Head_Approval = "Pending Plant Head Approval",
  Pending_Management_Approval = "Pending Management Approval",
  Proposal_Revision_Needed = "Proposal Revision Needed",
  Approved_for_PO = "Approved for PO Creation",
  PO_Created = "PO Created",
  Rejected = "Rejected",
  RFQ_Created = "RFQ Created", // New status
  Closed = "Closed" // New status
}

export interface PurchaseRequisition {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: 'kg' | 'L' | 'units';
  status: PRStatus;
  raisedBy: string; // User ID from any department
  requesterDept: Department;
  dateRaised: string;
  plantId: string;
  
  proposalPreparedBy?: string;
  proposalPreparedOn?: string;
  proposalVendorId?: string;
  proposalPrice?: number;
  proposalDeliveryDate?: string;
  proposalNotes?: string;
  
  plantHeadApprovedBy?: string;
  plantHeadApprovedOn?: string;
  managementApprovedBy?: string;
  managementApprovedOn?: string;
  revisionFeedback?: string;

  poNumber?: string | null;
}

export enum PoStatus {
  Draft = "Draft",
  Pending_Finance_Approval = "Pending Finance Approval",
  Pending_Management_Approval = "Pending Management Approval",
  Rejected = "Rejected",
  Approved = "Approved",
  Sent = "Sent to Supplier",
  Dispatched = "Dispatched",
  Delivered = "Delivered",
  Received = "Received",
  Partially_Received = "Partially Received",
  QCHold = "QC Hold",
  GRNPending = "GRN Pending",
  Completed = "Completed"
}


export interface PurchaseOrder {
  id: string;
  poNumber: string;
  indentId?: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: 'kg' | 'L' | 'units';
  vendorId: string;
  status: PoStatus;
  dateCreated: string;
  expectedDeliveryDate: string;
  dateReceived?: string;
  receivedBy?: string; // User ID
  totalAmount: number;
  createdBy: string; // User ID
  justificationNotes?: string;
  financeApprovedBy?: string;
  financeApprovedOn?: string;
  managementApprovedBy?: string;
  managementApprovedOn?: string;
  plantId: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number; // 1-5
  suppliedMaterialIds: string[];
}

export enum DocumentType {
  Indent = "Material Indent",
  PurchaseOrder = "Purchase Order",
  CoA = "Certificate of Analysis",
  MaterialRequest = "Material Request Slip",
  DispatchNote = "Dispatch Note",
  BMR = "Batch Manufacturing Record",
  SOP = "Standard Operating Procedure",
  DeviationReport = "Deviation Report",
  ControlledForm = "Controlled Form",
  Specification = "Specification",
  QCReport = "QC Report",
}

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  date: string;
  referenceId: string; // e.g., Indent ID or PO Number
  isTemplate?: boolean;
  ownerId?: string; // User ID of the document creator/owner
  plantId: string;
  version: string;
  status?: 'Pending Approval' | 'Approved' | 'Rejected';
}

export enum TaskStatus {
    Pending = "pending",
    InProgress = "in progress",
    Completed = "completed"
}

export enum TaskPriority {
    Low = "low",
    Medium = "medium",
    High = "high",
    Critical = "critical"
}

// Unified model for all tasks, including user-created To-Dos.
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedBy: string; // User ID
  assignedTo: string; // User ID
}


export enum MaterialRequestStatus {
    Pending_Manager_Approval = "Pending Manager Approval",
    Pending_Head_Approval = "Pending Head Approval",
    Pending_Warehouse_Verification = "Pending Warehouse Verification",
    Pending_Plant_Head_Approval = "Pending Plant Head Approval",
    Ready_for_Issuance = "Ready for Issuance",
    Issued = "Issued",
    Rejected = "Rejected"
}

export interface MaterialRequest {
    id: string;
    materialId: string;
    materialName: string;
    quantity: number;
    unit: 'kg' | 'L' | 'units';
    batchNumber: string;
    requestedBy: string; // Production user ID
    dateRequested: string;
    status: MaterialRequestStatus;
    managerApprovedBy?: string;
    managerApprovedOn?: string;
    headApprovedBy?: string;
    headApprovedOn?: string;
    warehouseVerifiedBy?: string;
    warehouseVerifiedOn?: string;
    plantHeadApprovedBy?: string;
    plantHeadApprovedOn?: string;
    plantId: string;
}

export interface Customer {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
}

export enum SalesOrderStatus {
    Pending_Plant_Head_Approval = "Pending Plant Head Approval",
    Pending_Management_Approval = "Pending Management Approval",
    Ready_for_Dispatch = "Ready for Dispatch",
    Dispatched = "Dispatched",
    Delivered = "Delivered",
    Rejected = "Rejected"
}

export interface SalesOrder {
    id: string;
    customerId: string;
    salesPersonId: string;
    date: string;
    status: SalesOrderStatus;
    items: {
        materialId: string;
        materialName: string;
        quantity: number;
        unit: 'kg' | 'units';
    }[];
    plantHeadApprovedBy?: string;
    plantHeadApprovedOn?: string;
    managementApprovedBy?: string;
    managementApprovedOn?: string;
    plantId: string;
}

export enum InventoryLedgerAction {
    Received = "Received from Vendor",
    Issued = "Issued to Production",
    Dispatched = "Dispatched to Customer",
    Adjustment = "Stock Adjustment"
}

export interface StockLedgerEntry {
    id: string;
    materialId: string;
    date: string;

    action: InventoryLedgerAction;
    quantityChange: number; // Can be positive or negative
    balance: number;
    referenceId: string; // PO Number, Batch Number, Sales Order ID, etc.
}

export enum IssuePriority {
    High = "High",
    Critical = "Critical"
}

export enum IssueStatus {
    Open = "Open",
    Under_Review = "Under Review",
    Resolved = "Resolved"
}

export interface EscalatedIssue {
    id: string;
    title: string;
    description: string;
    priority: IssuePriority;
    status: IssueStatus;
    plant: string;
    date: string;
}

export interface Project { // Renamed from CorporateInitiative for clarity and expansion
  id: string;
  title: string;
  owner: string; // User ID
  status: 'On Track' | 'At Risk' | 'Off Track' | 'Completed';
  budget: number;
  percentComplete: number;
  nextMilestone: string;
  nextMilestoneDate: string;
  plantId: string;
}

export interface CapexRequest {
  id: string;
  title: string;
  plant: string;
  amount: number;
  stage: 'Pending' | 'Approved' | 'Rejected';
  roi: number; // in percent
  requestedBy: string; // User ID
  decisionDate: string;
  npv: number;
  payback: string; // e.g., "2.5 years"
  plantId: string;
}

// New Types for Plant Head Portal
export interface Equipment {
    id: string;
    name: string;
    status: 'Idle' | 'Running' | 'Cleaning' | 'Sanitization' | 'Breakdown' | 'Under QA Hold';
    cleaningStatus?: 'Clean' | 'Dirty' | 'Pending Verification';
    readiness?: 'Ready' | 'Not Ready';
    lastCalibration: string;
    nextPMDate: string;
    plantId: string;
    cleaningHistory: { date: string, cleanedBy: string }[];
}

export interface MaintenanceTask {
    id: string;
    equipmentId: string;
    task: string;
    type: 'Preventive' | 'Breakdown';
    status: 'Pending' | 'In Progress' | 'Completed';
    dueDate: string;
    plantId: string;
}

export interface SafetyIncident {
    id: string;
    title: string;
    date: string;
    severity: 'Low' | 'Medium' | 'High';
    status: 'Open' | 'Closed';
    plantId: string;
}

export interface TrainingRecord {
    id: string;
    userId: string;
    training: string; // e.g., 'SOP-001 Training'
    status: 'Completed' | 'Overdue';
    completionDate: string;
    plantId: string;
}

// --- NEW QA MODULE TYPES ---
export interface ChangeControl {
    id: string;
    title: string;
    type: 'Process' | 'Equipment' | 'SOP' | 'BMR';
    status: 'Open' | 'Impact Assessment' | 'Pending Approval' | 'Approved' | 'Closed';
    raisedBy: string;
    dateRaised: string;
    plantId: string;
}

export interface CAPA {
    id: string;
    title: string;
    source: string; // Deviation ID, Audit Finding ID, etc.
    status: 'Open' | 'Investigation' | 'Action Plan' | 'Effectiveness Check' | 'Closed';
    owner: string;
    dueDate: string;
    plantId: string;
}

export interface StabilityStudy {
    id: string;
    productName: string;
    batchNumber: string;
    studyType: 'Accelerated' | 'Long-term' | 'Intermediate';
    status: 'Ongoing' | 'Completed' | 'Delayed';
    startDate: string;
    plantId: string;
}

export interface MarketComplaint {
    id: string;
    productName: string;
    batchNumber: string;
    complaint: string;
    dateReceived: string;
    status: 'Open' | 'Investigating' | 'Closed';
    plantId: string;
}

export interface InternalAudit {
    id: string;
    title: string;
    date: string;
    status: 'Scheduled' | 'In Progress' | 'Completed';
    findings: number;
    plantId: string;
}

export interface EnvironmentalMonitoring {
    id: string;
    room: string;
    date: string;
    result: 'In Spec' | 'Out of Spec';
    organism: string | null;
    plantId: string;
}

// --- NEW QC MODULE TYPES ---
export enum QcStatus {
    Pending = "Pending",
    InProgress = "In Progress",
    Passed = "Passed",
    Failed = "Failed",
    Submitted = "Submitted", // Submitted for officer
    SubmittedForReview = "Submitted for Review",
    Approved = "Approved",
    Rejected = "Rejected"
}

export interface Test {
    name: string;
    method: 'HPLC' | 'GC' | 'Titration' | 'Microbiology';
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Returned' | 'Submitted for Review' | 'Approved' | 'Rejected';
    instrumentId?: string;
    submittedOn?: string;
    reviewedBy?: string; // manager's user ID
    managerNotes?: string;
}

export interface QualitySample {
    id: string;
    productName: string;
    batchNumber: string;
    status: QcStatus;
    sampleDate: string;
    analystId?: string;
    dueDate: string;
    sampleType: 'RM' | 'PM' | 'In-process' | 'FG' | 'Stability';
    tests: Test[];
    priority?: 'High' | 'Medium' | 'Low' | 'Critical';
}

export interface QCInstrument {
    id: string;
    name: string;
    type: string;
    status: 'Ready' | 'In Use' | 'Calibration Due' | 'Out-of-Service';
}

export interface QCStandard {
    id: string;
    name: string;
    type: 'Reference' | 'Working';
    validity: string;
    quantity: number;
    unit: 'mg' | 'g';
}

export enum CoaStatus {
    Draft = "Draft",
    PendingManagerReview = "Pending Manager Review",
    PendingHeadApproval = "Pending Head Approval",
    Released = "Released",
    Rejected = "Rejected"
}

export interface CoA {
    id: string;
    batchNumber: string;
    productName: string;
    status: CoaStatus;
    preparedBy: string; // Officer ID
    reviewedBy?: string; // Manager ID
    approvedBy?: string; // Head ID
    releaseDate?: string;
}

// --- NEW PRODUCTION HEAD TYPES ---
export interface Shift {
    id: string;
    name: 'Morning' | 'Evening' | 'Night';
    date: string;
    managerId: string;
    operatorIds: string[];
    plantId: string;
}

// --- NEW PROCUREMENT OFFICER TYPES ---
export interface RFQ {
    id: string;
    prId: string;
    materialName: string;
    quantity: number;
    vendorIds: string[];
    creationDate: string;
    status: 'Sent' | 'Awaiting Quotes' | 'Comparison Ready' | 'Closed';
}

export interface Quotation {
    id: string;
    rfqId: string;
    vendorId: string;
    price: number;
    deliveryTime: number; // in days
    submissionDate: string;
}

export interface GoodsReceiptNote {
    id: string;
    poId: string;
    receivedDate: string;
    status: 'Pending QC' | 'Completed' | 'Rejected';
    items: { materialId: string, quantityReceived: number, quantityAccepted: number, quantityRejected: number }[];
}

export interface RateAgreement {
    id: string;
    vendorId: string;
    materialId: string;
    rate: number;
    validFrom: string;
    validTo: string;
}

// --- NEW WAREHOUSE MANAGER TYPES ---
export interface StockAdjustment {
    id: string;
    materialId: string;
    batchNumber: string;
    reason: 'Damage' | 'Shortage' | 'Excess' | 'Reconciliation';
    quantityChange: number;
    date: string;
    status: 'Pending Approval' | 'Approved';
}

export interface CycleCount {
    id: string;
    date: string;
    bins: string[];
    status: 'In Progress' | 'Pending Verification' | 'Completed';
    variances: number;
}


// Keeping MaterialIndent as an alias for now for backward compatibility in some views
export type MaterialIndent = PurchaseRequisition;
export const IndentStatus = PRStatus;