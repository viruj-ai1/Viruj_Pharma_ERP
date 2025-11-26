import { User, Role, Department, ProductionBatch, BatchStatus, InventoryItem, Deviation, PurchaseRequisition, PRStatus, PurchaseOrder, PoStatus, Vendor, Document, DocumentType, TaskStatus, TaskPriority, Material, MaterialRequest, Customer, SalesOrder, StockLedgerEntry, InventoryLedgerAction, MaterialRequestStatus, SalesOrderStatus, Task, EscalatedIssue, IssueStatus, IssuePriority, Project, CapexRequest, Plant, Equipment, MaintenanceTask, SafetyIncident, TrainingRecord, ChangeControl, CAPA, StabilityStudy, MarketComplaint, InternalAudit, EnvironmentalMonitoring, QAReleaseStatus, QcStatus, QualitySample, QCInstrument, QCStandard, CoA, CoaStatus, Shift, ProductionStage, SOPStep, RFQ, Quotation, GoodsReceiptNote, RateAgreement, StockAdjustment, CycleCount } from '../types';

export const USERS: User[] = [
  // Production
  { id: 'prod-head-1', name: 'John Smith', email: 'john.smith@pharma.com', role: Role.Production_Head, department: Department.Production, plantId: 'plant-a' },
  { id: 'prod-man-1', name: 'Sarah Johnson', email: 'sarah.johnson@pharma.com', role: Role.Production_Manager, department: Department.Production, plantId: 'plant-a' },
  { id: 'prod-op-1', name: 'Emily Davis', email: 'emily.davis@pharma.com', role: Role.Production_Operator, department: Department.Production, plantId: 'plant-a' },
  { id: 'prod-op-2', name: 'Mike Brown', email: 'mike.brown@pharma.com', role: Role.Production_Operator, department: Department.Production, plantId: 'plant-b' },

  // QA
  { id: 'qa-head-1', name: 'Raj Patel', email: 'raj.patel@pharma.com', role: Role.QA_Head, department: Department.QA, plantId: 'plant-a' },
  { id: 'qa-man-1', name: 'Priya Sharma', email: 'priya.sharma@pharma.com', role: Role.QA_Manager, department: Department.QA, plantId: 'plant-a' },
  { id: 'qa-op-1', name: 'David Lee', email: 'david.lee@pharma.com', role: Role.QA_Operator, department: Department.QA, plantId: 'plant-b' },

  // QC
  { id: 'qc-head-1', name: 'Laura Vance', email: 'laura.vance@pharma.com', role: Role.QC_Head, department: Department.QC, plantId: 'plant-a' },
  { id: 'qc-man-1', name: 'Kevin Malone', email: 'kevin.malone@pharma.com', role: Role.QC_Manager, department: Department.QC, plantId: 'plant-a' },
  { id: 'qc-op-1', name: 'Angela Martin', email: 'angela.martin@pharma.com', role: Role.QC_Operator, department: Department.QC, plantId: 'plant-a' },

  // SCM
  { id: 'scm-proc-1', name: 'Maria Garcia', email: 'maria.garcia@pharma.com', role: Role.Procurement_Officer, department: Department.SCM, plantId: 'plant-a' },
  { id: 'scm-wh-1', name: 'Anil Kumar', email: 'anil.kumar@pharma.com', role: Role.Warehouse_Manager, department: Department.SCM, plantId: 'plant-a' },

  // Sales
  { id: 'sales-1', name: 'Jessica Miller', email: 'jessica.miller@pharma.com', role: Role.Sales_Person, department: Department.Sales },

  // Finance
  { id: 'fin-off-1', name: 'Michael Scott', email: 'michael.scott@pharma.com', role: Role.Finance_Officer, department: Department.Finance },

  // Admin & Leadership
  { id: 'admin-1', name: 'Admin User', email: 'admin@pharma.com', role: Role.System_Admin, department: Department.Admin },
  { id: 'plant-head-1', name: 'Robert Vance', email: 'robert.vance@pharma.com', role: Role.Plant_Head, department: Department.Admin, plantId: 'plant-a' },
  { id: 'mgmt-1', name: 'Jan Levinson', email: 'jan.levinson@pharma.com', role: Role.Management, department: Department.Corporate }
];

export const PLANTS: Plant[] = [
    { id: 'plant-a', name: 'Hyderabad Plant', region: 'APAC', runningLines: 8, oee: 82.5, yield: 98.1, openQaHolds: 5, inventoryValue: 12500000, managerId: 'plant-head-1', lastUpdated: '2023-10-30T10:00:00Z' },
    { id: 'plant-b', name: 'Dublin Plant', region: 'EMEA', runningLines: 6, oee: 89.1, yield: 99.2, openQaHolds: 2, inventoryValue: 9800000, managerId: 'plant-head-1', lastUpdated: '2023-10-30T09:45:00Z' },
    { id: 'plant-c', name: 'New Jersey Plant', region: 'AMER', runningLines: 12, oee: 78.9, yield: 97.5, openQaHolds: 8, inventoryValue: 15200000, managerId: 'plant-head-1', lastUpdated: '2023-10-30T10:15:00Z' }
];

export const MATERIALS: Material[] = [
  { id: 'mat-001', name: 'Phenol', type: 'Raw Material', defaultUnit: 'kg' },
  { id: 'mat-002', name: 'Acetic Anhydride', type: 'Raw Material', defaultUnit: 'L' },
  { id: 'mat-003', name: 'Paracetamol API', type: 'Finished Good', defaultUnit: 'kg' },
  { id: 'mat-004', name: 'Propionic Acid', type: 'Raw Material', defaultUnit: 'L' },
  { id: 'mat-005', name: 'Sodium Hydroxide', type: 'Raw Material', defaultUnit: 'kg' },
  { id: 'mat-006', name: 'Glass Vials (10ml)', type: 'Packaging', defaultUnit: 'units' },
  { id: 'mat-007', name: 'Aspirin API', type: 'Finished Good', defaultUnit: 'kg' },
  { id: 'mat-008', name: 'Blister Pack Foil', type: 'Packaging', defaultUnit: 'units' }
];

export const VENDORS: Vendor[] = [
  { id: 'v-001', name: 'ChemPro Inc.', contactPerson: 'Laura Williams', email: 'laura.w@chempro.com', phone: '555-0101', address: '123 Chemical Dr, Chemistryville, USA', rating: 5, suppliedMaterialIds: ['mat-001', 'mat-004'] },
  { id: 'v-002', name: 'Global Chemicals', contactPerson: 'Robert Brown', email: 'r.brown@globalchem.com', phone: '555-0102', address: '456 Industrial Ave, Factory Town, USA', rating: 4, suppliedMaterialIds: ['mat-002', 'mat-005'] },
  { id: 'v-003', name: 'PharmaSupply Co.', contactPerson: 'Linda Jones', email: 'linda.j@pharmasupply.com', phone: '555-0103', address: '789 Supply St, Port City, USA', rating: 4, suppliedMaterialIds: ['mat-001', 'mat-005', 'mat-006'] },
  { id: 'v-004', name: 'Pharma Suppliers Ltd', contactPerson: 'Jane Doe', email: 'jane.d@pharma-suppliers.com', phone: '555-0104', address: '12 Supply Rd, Tradetown, USA', rating: 5, suppliedMaterialIds: ['mat-003'] },
  { id: 'v-005', name: 'Pack Solutions Inc', contactPerson: 'Peter Jones', email: 'peter.j@packsol.com', phone: '555-0105', address: '34 Packaging Way, Boxville, USA', rating: 4, suppliedMaterialIds: ['mat-008'] }
];

const mockSOPSteps: SOPStep[] = [
    { id: 'step-1', name: 'Dispense Raw Material', type: 'dataEntry', status: 'Completed', instructions: 'Weigh and dispense 500kg of Phenol (Lot: RM-PHEN-056).', requiresESig: true },
    { id: 'step-2', name: 'Charge Reactor', type: 'confirmation', status: 'Completed', instructions: 'Charge dispensed Phenol into Reactor R-101.', requiresESig: true },
    { id: 'step-3', name: 'Start Reaction', type: 'timer', status: 'In Progress', instructions: 'Start mixing at 120 RPM and heat to 85°C. Hold for 4 hours.', requiresESig: true },
    { id: 'step-4', name: 'In-Process Sample', type: 'qcSample', status: 'Pending', instructions: 'Take a 10ml sample for reaction completion check.', requiresESig: false },
    { id: 'step-5', name: 'Cool Down', type: 'dataEntry', status: 'Pending', instructions: 'Cool reactor to 25°C.', requiresESig: true },
];

export let PRODUCTION_BATCHES: ProductionBatch[] = [
  { id: 'b001', productName: 'Paracetamol API', batchNumber: 'AP-PARA-001', status: BatchStatus.Completed, startDate: '2023-10-01', endDate: '2023-10-05', quantity: 500, unit: 'kg', assignedTo: 'prod-man-1', officerId: 'prod-op-1', plantId: 'plant-a', qaReleaseStatus: QAReleaseStatus.Released, bmrStatus: 'Complete', finalYield: 98.5, qaOfficerId: 'qa-op-1', qcDependenceStatus: 'Passed QC', bmrSteps: [
    { name: 'Step 1: Raw Material Dispensing', status: 'Verified' },
    { name: 'Step 2: Reactor Charging', status: 'Verified' },
    { name: 'Step 3: Reaction Monitoring', status: 'Verified' },
    { name: 'Step 4: Filtration', status: 'Verified' },
    { name: 'Step 5: Drying', status: 'Verified' }
  ], stages: [
    { name: 'Dispensing', status: 'Completed', officerId: 'prod-op-1', progress: 100, steps: mockSOPSteps.map(s => ({...s, status: 'Completed'})) },
    { name: 'Reaction', status: 'Completed', officerId: 'prod-op-1', progress: 100, steps: [] },
    { name: 'Filtration', status: 'Completed', officerId: 'prod-op-1', progress: 100, steps: [] },
    { name: 'Drying', status: 'Completed', officerId: 'prod-op-1', progress: 100, steps: [] },
  ]},
  { id: 'b002', productName: 'Ibuprofen API', batchNumber: 'AP-IBU-001', status: BatchStatus.QCReview, startDate: '2023-10-10', endDate: null, quantity: 250, unit: 'kg', assignedTo: 'prod-man-1', officerId: 'prod-op-2', plantId: 'plant-b', qaReleaseStatus: QAReleaseStatus.Pending, bmrStatus: 'Complete', finalYield: 99.1, qaOfficerId: 'qa-op-1', qcDependenceStatus: 'Pending QC', bmrSteps: [
    { name: 'Step 1: Dispensing', status: 'Verified' },
    { name: 'Step 2: Reaction', status: 'Verified' },
    { name: 'Step 3: Crystallization', status: 'Clarification' },
    { name: 'Step 4: Centrifuging', status: 'Pending' },
    { name: 'Step 5: Drying', status: 'Pending' }
  ], stages: [
    { name: 'Dispensing', status: 'Completed', officerId: 'prod-op-2', progress: 100, steps: [] },
    { name: 'Reaction', status: 'Completed', officerId: 'prod-op-2', progress: 100, steps: [] },
    { name: 'QC Hold', status: 'QA Hold', officerId: 'prod-op-2', progress: 90, steps: [] },
  ]},
  { id: 'b003', productName: 'Metformin API', batchNumber: 'AP-MET-001', status: BatchStatus.InProgress, startDate: '2023-10-15', endDate: null, quantity: 750, unit: 'kg', assignedTo: 'prod-man-1', officerId: 'prod-op-1', plantId: 'plant-a', qaReleaseStatus: QAReleaseStatus.Pending, bmrStatus: 'Incomplete', finalYield: 0, qaOfficerId: 'qa-op-1', qcDependenceStatus: 'N/A', bmrSteps: [
    { name: 'Step 1: Dispensing', status: 'Verified' },
    { name: 'Step 2: Reaction', status: 'Missing' },
    { name: 'Step 3: Filtration', status: 'Pending' },
    { name: 'Step 4: Drying', status: 'Pending' }
  ], stages: [
    { name: 'Dispensing', status: 'Completed', officerId: 'prod-op-1', progress: 100, steps: mockSOPSteps.map(s => ({...s, status: 'Completed'})) },
    { name: 'Reaction', status: 'Running', officerId: 'prod-op-1', progress: 45, steps: mockSOPSteps },
    { name: 'Filtration', status: 'Not Started', progress: 0, steps: [] },
    { name: 'Drying', status: 'Not Started', progress: 0, steps: [] },
  ]},
  { id: 'b004', productName: 'Paracetamol API', batchNumber: 'AP-PARA-002', status: BatchStatus.Delayed, startDate: '2023-10-20', endDate: null, quantity: 500, unit: 'kg', assignedTo: 'prod-man-1', officerId: 'prod-op-1', plantId: 'plant-a', qaReleaseStatus: QAReleaseStatus.Pending, bmrStatus: 'Incomplete', finalYield: 0, qcDependenceStatus: 'N/A', bmrSteps: [
    { name: 'Step 1: Dispensing', status: 'Pending' },
    { name: 'Step 2: Reaction', status: 'Pending' },
    { name: 'Step 3: Filtration', status: 'Pending' },
    { name: 'Step 4: Drying', status: 'Pending' }
  ], stages: [
    { name: 'Dispensing', status: 'Running', officerId: 'prod-op-1', progress: 10, steps: [] },
    { name: 'Reaction', status: 'Not Started', progress: 0, steps: [] },
  ]},
  { id: 'b005', productName: 'Aspirin API', batchNumber: 'AP-ASP-001', status: BatchStatus.OnHold, startDate: '2023-09-25', endDate: null, quantity: 300, unit: 'kg', assignedTo: 'prod-man-1', officerId: 'prod-op-2', plantId: 'plant-b', qaReleaseStatus: QAReleaseStatus.Hold, bmrStatus: 'Complete', finalYield: 97.2, holdReason: 'QA Hold: Linked to Deviation d002', qcDependenceStatus: 'Passed QC', bmrSteps: [
    { name: 'Step 1: Dispensing', status: 'Verified' },
    { name: 'Step 2: Acetylation', status: 'Verified' },
    { name: 'Step 3: Hydrolysis', status: 'Verified' },
    { name: 'Step 4: Crystallization', status: 'Verified' },
    { name: 'Step 5: Drying', status: 'Verified' }
  ], stages: [
    { name: 'Dispensing', status: 'Completed', officerId: 'prod-op-2', progress: 100, steps: [] },
    { name: 'Acetylation', status: 'Completed', officerId: 'prod-op-2', progress: 100, steps: [] },
    { name: 'Drying', status: 'QA Hold', officerId: 'prod-op-2', progress: 80, steps: [] },
  ]}
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'i001', materialId: 'mat-001', name: 'Phenol', type: 'Raw Material', quantity: 2500, unit: 'kg', location: 'A1-01', expiryDate: '2024-12-31', plantId: 'plant-a', qcStatus: 'Approved', binLocation: 'R1-S2-B3', reservedQty: 500 },
  { id: 'i002', materialId: 'mat-002', name: 'Acetic Anhydride', type: 'Raw Material', quantity: 1500, unit: 'L', location: 'A1-02', expiryDate: '2025-06-30', plantId: 'plant-a', qcStatus: 'Approved', binLocation: 'R1-S2-B4', reservedQty: 0 },
  { id: 'i003', materialId: 'mat-003', name: 'Paracetamol API', type: 'Finished Good', quantity: 480, unit: 'kg', location: 'FG-01', expiryDate: '2026-10-01', plantId: 'plant-a', qcStatus: 'Approved', binLocation: 'FG-Z1-R1', reservedQty: 100 },
  { id: 'i004', materialId: 'mat-004', name: 'Propionic Acid', type: 'Raw Material', quantity: 800, unit: 'L', location: 'A2-01', expiryDate: '2024-09-30', plantId: 'plant-b', qcStatus: 'Approved', binLocation: 'R3-S1-B1', reservedQty: 0 },
  { id: 'i005', materialId: 'mat-005', name: 'Sodium Hydroxide', type: 'Raw Material', quantity: 5000, unit: 'kg', location: 'B1-05', expiryDate: '2023-11-20', plantId: 'plant-a', qcStatus: 'Approved', binLocation: 'R5-S4-B1', reservedQty: 2000 },
  { id: 'i007', materialId: 'mat-007', name: 'Aspirin API', type: 'Finished Good', quantity: 250, unit: 'kg', location: 'FG-02', expiryDate: '2025-09-01', plantId: 'plant-b', qcStatus: 'Approved', binLocation: 'FG-Z2-R2', reservedQty: 0 },
  { id: 'i008', materialId: 'mat-006', name: 'Glass Vials (10ml)', type: 'Raw Material', quantity: 0, unit: 'units', location: 'C3-04', expiryDate: '2025-11-30', plantId: 'plant-a', qcStatus: 'Approved', binLocation: 'P1-S1-B1', reservedQty: 0 },
  { id: 'i009', materialId: 'mat-003', name: 'Paracetamol API (Lot B)', type: 'Finished Good', quantity: 0, unit: 'kg', location: 'FG-03', expiryDate: '2024-05-01', plantId: 'plant-a', qcStatus: 'Approved', binLocation: 'FG-Z1-R2', reservedQty: 0 },
  { id: 'i010', materialId: 'mat-001', name: 'Phenol (New Lot)', type: 'Raw Material', quantity: 1000, unit: 'kg', location: 'QR-01', expiryDate: '2025-10-31', plantId: 'plant-a', qcStatus: 'Pending', binLocation: 'Q-Zone', reservedQty: 0 },
];

export let DEVIATIONS: Deviation[] = [
    {id: 'd001', title: 'Temperature excursion in Reactor 2', batchNumber: 'AP-MET-001', description: '...', status: 'Investigation', openedBy: 'Priya Sharma', dateOpened: '2023-10-15', assignedTo: 'qa-op-1', investigationSummary: '...', rootCause: '', capa: '', severity: 'High', plant: 'Hyderabad Plant', plantId: 'plant-a', sourceDept: Department.Production },
    {id: 'd002', title: 'Incorrect raw material lot used', batchNumber: 'AP-ASP-001', description: '...', status: 'Closed', openedBy: 'Priya Sharma', dateOpened: '2023-09-26', assignedTo: 'qa-op-1', investigationSummary: '...', rootCause: '...', capa: '...', managerReviewedBy: 'qa-man-1', approvedBy: 'qa-head-1', severity: 'Critical', plant: 'Dublin Plant', plantId: 'plant-b', sourceDept: Department.SCM },
    {id: 'd003', title: 'OOS result in Assay test', batchNumber: 'AP-IBU-001', description: 'Assay result was 97.5% (Spec: 98.0-102.0%). Investigation initiated.', status: 'Open', openedBy: 'Angela Martin', dateOpened: '2023-10-13', severity: 'High', plant: 'Dublin Plant', plantId: 'plant-b', sourceDept: Department.QC },
    {id: 'd004', title: 'Packaging line stoppage', batchNumber: 'AP-PARA-001', description: '...', status: 'Open', openedBy: 'Sarah Johnson', dateOpened: '2023-10-28', severity: 'Low', plant: 'Hyderabad Plant', plantId: 'plant-a', sourceDept: Department.Production },
    {id: 'd005', title: 'Documentation error in BMR', batchNumber: 'AP-PARA-001', description: '...', status: 'Pending Final Approval', openedBy: 'David Lee', dateOpened: '2023-10-06', assignedTo: 'qa-op-1', investigationSummary: '...', rootCause: '...', capa: '...', managerReviewedBy: 'qa-man-1', severity: 'Low', plant: 'New Jersey Plant', plantId: 'plant-c', sourceDept: Department.QA }
];

export let PURCHASE_REQUISITIONS: PurchaseRequisition[] = [
    {id: 'ind-001', materialId: 'mat-001', materialName: 'Phenol', quantity: 1000, unit: 'kg', status: PRStatus.Pending, raisedBy: 'scm-wh-1', dateRaised: '2023-10-18', plantId: 'plant-a', requesterDept: Department.SCM },
    {id: 'ind-002', materialId: 'mat-004', materialName: 'Propionic Acid', quantity: 500, unit: 'L', status: PRStatus.PO_Created, raisedBy: 'prod-man-1', dateRaised: '2023-10-15', poNumber: 'PO-2023-056', proposalVendorId: 'v-001', proposalPrice: 15000, plantHeadApprovedBy: 'plant-head-1', managementApprovedBy: 'mgmt-1', plantId: 'plant-b', requesterDept: Department.Production },
    {id: 'ind-003', materialId: 'mat-006', materialName: 'Glass Vials (10ml)', quantity: 5000, unit: 'units', status: PRStatus.Rejected, raisedBy: 'qc-man-1', dateRaised: '2023-10-14', plantId: 'plant-a', requesterDept: Department.QC},
    {id: 'ind-004', materialId: 'mat-005', materialName: 'Sodium Hydroxide', quantity: 2000, unit: 'kg', status: PRStatus.Pending_Plant_Head_Approval, raisedBy: 'scm-wh-1', dateRaised: '2023-10-19', proposalPreparedBy: 'scm-proc-1', proposalVendorId: 'v-002', proposalPrice: 40000, proposalDeliveryDate: '2023-11-15', proposalNotes: '...', plantId: 'plant-a', requesterDept: Department.SCM}
];
export const MATERIAL_INDENTS = PURCHASE_REQUISITIONS;

export let PURCHASE_ORDERS: PurchaseOrder[] = [
    {id: 'po-001', poNumber: 'PO-2024-001', indentId: 'ind-002', materialId: 'mat-003', materialName: 'Paracetamol API', quantity: 500, unit: 'kg', vendorId: 'v-004', status: PoStatus.Received, dateCreated: '2024-01-10', expectedDeliveryDate: '2024-01-20', dateReceived: '2024-01-19', receivedBy: 'scm-wh-1', totalAmount: 125000, createdBy: 'prod-head-1', plantId: 'plant-a'},
    {id: 'po-002', poNumber: 'PO-2024-012', indentId: 'ind-007', materialId: 'mat-008', materialName: 'Blister Pack Foil', quantity: 10000, unit: 'units', vendorId: 'v-005', status: PoStatus.Approved, dateCreated: '2024-01-15', expectedDeliveryDate: '2024-01-25', totalAmount: 50000, createdBy: 'scm-proc-1', financeApprovedBy: 'fin-off-1', managementApprovedBy: 'mgmt-1', plantId: 'plant-a'},
    {id: 'po-003', poNumber: 'PO-2024-013', indentId: 'ind-005', materialId: 'mat-002', materialName: 'Acetic Anhydride', quantity: 800, unit: 'L', vendorId: 'v-002', status: PoStatus.Pending_Finance_Approval, dateCreated: '2024-01-18', expectedDeliveryDate: '2024-02-10', totalAmount: 29000, createdBy: 'scm-proc-1', justificationNotes: '...', plantId: 'plant-a'},
    {id: 'po-004', poNumber: 'PO-2024-014', materialId: 'mat-005', materialName: 'Sodium Hydroxide', quantity: 1000, unit: 'kg', vendorId: 'v-003', status: PoStatus.Pending_Management_Approval, dateCreated: '2024-01-20', expectedDeliveryDate: '2024-02-15', totalAmount: 22000, createdBy: 'scm-proc-1', justificationNotes: '...', financeApprovedBy: 'fin-off-1', financeApprovedOn: '2024-01-21', plantId: 'plant-a'}
];

export let INITIAL_USER_TASKS: Task[] = [
    {id: 'todo-1', title: 'Follow up with ChemPro Inc. on Q3 performance report', description: "User-added to-do item.", dueDate: '2023-11-15', status: TaskStatus.Pending, priority: TaskPriority.Medium, assignedBy: 'scm-proc-1', assignedTo: 'scm-proc-1'},
    {id: 'todo-2', title: 'Prepare vendor audit schedule for 2024', description: "User-added to-do item.", dueDate: '2023-11-20', status: TaskStatus.Pending, priority: TaskPriority.Medium, assignedBy: 'scm-proc-1', assignedTo: 'scm-proc-1'},
    {id: 'todo-3', title: 'Review and sign off on SOP-GEN-001 update', description: "User-added to-do item.", dueDate: '2023-11-10', status: TaskStatus.Completed, priority: TaskPriority.High, assignedBy: 'qa-head-1', assignedTo: 'qa-head-1'}
];

export let MATERIAL_REQUESTS: MaterialRequest[] = [
    { id: 'mr-001', materialId: 'mat-001', materialName: 'Phenol', quantity: 200, unit: 'kg', batchNumber: 'AP-MET-001', requestedBy: 'prod-op-1', dateRequested: '2023-10-15', status: MaterialRequestStatus.Pending_Manager_Approval, plantId: 'plant-a' },
    { id: 'mr-002', materialId: 'mat-002', materialName: 'Acetic Anhydride', quantity: 150, unit: 'L', batchNumber: 'AP-MET-001', requestedBy: 'prod-op-1', dateRequested: '2023-10-16', status: MaterialRequestStatus.Pending_Head_Approval, managerApprovedBy: 'prod-man-1', managerApprovedOn: '2023-10-16', plantId: 'plant-a' },
    { id: 'mr-003', materialId: 'mat-004', materialName: 'Propionic Acid', quantity: 50, unit: 'L', batchNumber: 'AP-IBU-001', requestedBy: 'prod-op-2', dateRequested: '2023-10-11', status: MaterialRequestStatus.Issued, plantId: 'plant-b' }
];

export const CUSTOMERS: Customer[] = [
    { id: 'cust-001', name: 'Global Health Distributors', contactPerson: 'Sarah Chen', email: 'schen@ghd.com' },
    { id: 'cust-002', name: 'MediSupply Inc.', contactPerson: 'David Rodriguez', email: 'david.r@medisupply.com' }
];

export let SALES_ORDERS: SalesOrder[] = [
    { id: 'so-001', customerId: 'cust-001', salesPersonId: 'sales-1', date: '2023-10-20', status: SalesOrderStatus.Pending_Plant_Head_Approval, items: [{ materialId: 'mat-003', materialName: 'Paracetamol API', quantity: 100, unit: 'kg' }], plantId: 'plant-a' },
    { id: 'so-002', customerId: 'cust-002', salesPersonId: 'sales-1', date: '2023-10-22', status: SalesOrderStatus.Dispatched, items: [{ materialId: 'mat-007', materialName: 'Aspirin API', quantity: 50, unit: 'kg' }], plantId: 'plant-b' }
];

export const STOCK_LEDGER: StockLedgerEntry[] = [
    { id: 'sl-001', materialId: 'mat-001', date: '2023-10-01', action: InventoryLedgerAction.Received, quantityChange: 3000, balance: 3000, referenceId: 'PO-2023-050' },
    { id: 'sl-002', materialId: 'mat-001', date: '2023-10-15', action: InventoryLedgerAction.Issued, quantityChange: -500, balance: 2500, referenceId: 'AP-PARA-001' }
];

export const ESCALATED_ISSUES: EscalatedIssue[] = [
    { id: 'issue-001', title: 'Major Quality Hold on Paracetamol API', description: '...', priority: IssuePriority.Critical, status: IssueStatus.Open, plant: 'Main Plant', date: '2023-10-28' },
    { id: 'issue-002', title: 'Unexpected Downtime in Reactor 3', description: '...', priority: IssuePriority.High, status: IssueStatus.Under_Review, plant: 'Main Plant', date: '2023-10-27' }
];

export let PROJECTS: Project[] = [
    { id: 'ci-001', title: 'Q4 2023 Cost Reduction Campaign', owner: 'plant-head-1', status: 'On Track', budget: 50000, percentComplete: 60, nextMilestone: 'Final Report', nextMilestoneDate: '2023-12-31', plantId: 'plant-a' },
    { id: 'ci-002', title: 'Prepare for Annual GxP Compliance Audit', owner: 'qa-head-1', status: 'At Risk', budget: 25000, percentComplete: 30, nextMilestone: 'Internal Mock Audit', nextMilestoneDate: '2023-11-30', plantId: 'plant-b' }
];

export const CAPEX_REQUESTS: CapexRequest[] = [
    { id: 'capex-002', title: 'Reactor 4 Capacity Expansion', plant: 'Dublin Plant', amount: 1200000, stage: 'Pending', roi: 40, requestedBy: 'plant-head-1', decisionDate: '2023-11-10', npv: 450000, payback: '2.5 years', plantId: 'plant-b' }
];


const nameToIdMap = USERS.reduce((acc, user) => { acc[user.name] = user.id; return acc; }, {} as Record<string, string>);

export let DOCUMENTS: Document[] = [
  ...PURCHASE_REQUISITIONS.map((indent, i) => ({ id: `doc-ind-${i}`, type: DocumentType.Indent, title: `Material Indent for ${indent.materialName}`, date: indent.dateRaised, referenceId: indent.id, ownerId: indent.raisedBy, plantId: indent.plantId, version: '1.0' })),
  ...PURCHASE_ORDERS.map((po, i) => ({ id: `doc-po-${i}`, type: DocumentType.PurchaseOrder, title: `Purchase Order for ${po.materialName}`, date: po.dateCreated, referenceId: po.poNumber, ownerId: po.createdBy, plantId: po.plantId, version: '1.0' })),
  ...DEVIATIONS.map((dev, i) => ({ id: `doc-dev-${i}`, type: DocumentType.DeviationReport, title: `Deviation Report: ${dev.title}`, date: dev.dateOpened, referenceId: dev.id, ownerId: dev.assignedTo || nameToIdMap[dev.openedBy], plantId: dev.plantId, version: '1.0' })),
  ...MATERIAL_REQUESTS.map((req, i) => ({ id: `doc-mr-${i}`, type: DocumentType.MaterialRequest, title: `Material Request Slip for ${req.materialName}`, date: req.dateRequested, referenceId: req.id, ownerId: req.requestedBy, plantId: req.plantId, version: '1.0' })),
  { id: 'doc-sop-001', type: DocumentType.SOP, title: 'SOP-GEN-001: Gowning Procedure', date: '2023-01-01', referenceId: 'SOP-GEN-001', ownerId: 'qa-head-1', plantId: 'plant-a', version: '2.1', status: 'Approved' },
  { id: 'doc-sop-002', type: DocumentType.SOP, title: 'SOP-QC-005: HPLC Operation', date: '2023-02-15', referenceId: 'SOP-QC-005', ownerId: 'qa-head-1', plantId: 'plant-b', version: '1.3', status: 'Pending Approval' },
  { id: 'doc-sop-003', type: DocumentType.SOP, title: 'SOP-PROD-002: Reactor Operation', date: '2023-03-01', referenceId: 'SOP-PROD-002', ownerId: 'prod-head-1', plantId: 'plant-a', version: '1.0', status: 'Pending Approval' },
  { id: 'doc-form-001', type: DocumentType.ControlledForm, title: 'Incident Report Form', date: '2023-01-10', referenceId: 'FORM-QA-001', isTemplate: true, ownerId: 'qa-head-1', plantId: 'plant-a', version: '1.0', status: 'Approved' },
  { id: 'doc-bmr-001', type: DocumentType.BMR, title: 'BMR Template - Paracetamol API', date: '2023-01-01', referenceId: 'BMR-PARA-TPL-v1', isTemplate: true, ownerId: 'qa-head-1', plantId: 'plant-a', version: '1.0', status: 'Approved' },
  { id: 'doc-bmr-002', type: DocumentType.BMR, title: 'BMR - Ibuprofen API', date: '2023-05-20', referenceId: 'BMR-IBU-TPL-v2', isTemplate: true, ownerId: 'prod-head-1', plantId: 'plant-a', version: '2.0', status: 'Pending Approval' },
  { id: 'doc-spec-001', type: DocumentType.Specification, title: 'Spec - Paracetamol API', date: '2023-01-01', referenceId: 'SPEC-PARA-v3', ownerId: 'qa-head-1', plantId: 'plant-a', version: '3.0', status: 'Approved' }
];

// New data for Plant Head Portal
export const EQUIPMENT: Equipment[] = [
    { id: 'eq-001', name: 'Reactor R-101', status: 'Running', cleaningStatus: 'Clean', readiness: 'Ready', lastCalibration: '2023-10-01', nextPMDate: '2024-01-15', plantId: 'plant-a', cleaningHistory: [{date: '2023-10-30', cleanedBy: 'Emily Davis'}]},
    { id: 'eq-002', name: 'HPLC-05', status: 'Idle', cleaningStatus: 'Clean', readiness: 'Ready', lastCalibration: '2023-08-15', nextPMDate: '2023-11-10', plantId: 'plant-a', cleaningHistory: []},
    { id: 'eq-003', name: 'Granulator G-201', status: 'Breakdown', cleaningStatus: 'Dirty', readiness: 'Not Ready', lastCalibration: '2023-09-20', nextPMDate: '2023-12-20', plantId: 'plant-b', cleaningHistory: []},
    { id: 'eq-004', name: 'Blender B-102', status: 'Cleaning', cleaningStatus: 'Pending Verification', readiness: 'Not Ready', lastCalibration: '2023-10-05', nextPMDate: '2024-01-05', plantId: 'plant-a', cleaningHistory: []}
];
export const MAINTENANCE_TASKS: MaintenanceTask[] = [
    { id: 'mt-001', equipmentId: 'eq-002', task: 'Replace column and calibrate', type: 'Preventive', status: 'Pending', dueDate: '2023-11-10', plantId: 'plant-a'},
    { id: 'mt-002', equipmentId: 'eq-003', task: 'Repair motor assembly', type: 'Breakdown', status: 'In Progress', dueDate: '2023-10-31', plantId: 'plant-b'}
];
export const SAFETY_INCIDENTS: SafetyIncident[] = [
    { id: 'si-001', title: 'Minor chemical spill in Dispensing', date: '2023-10-15', severity: 'Low', status: 'Closed', plantId: 'plant-a'},
    { id: 'si-002', title: 'Near-miss event at Warehouse Bay 3', date: '2023-10-28', severity: 'Medium', status: 'Open', plantId: 'plant-b'}
];
export const TRAINING_RECORDS: TrainingRecord[] = [
    { id: 'tr-001', userId: 'prod-op-1', training: 'SOP-PROD-005', status: 'Completed', completionDate: '2023-09-01', plantId: 'plant-a'},
    { id: 'tr-002', userId: 'prod-op-2', training: 'SOP-PROD-005', status: 'Overdue', completionDate: '', plantId: 'plant-b'}
];

// --- NEW QA MOCK DATA ---
export const CHANGE_CONTROLS: ChangeControl[] = [
  {id: 'CC-001', title: 'Update BMR for Paracetamol', type: 'BMR', status: 'Pending Approval', raisedBy: 'prod-man-1', dateRaised: '2023-10-20', plantId: 'plant-a'},
  {id: 'CC-002', title: 'New HPLC Column Qualification', type: 'Equipment', status: 'Open', raisedBy: 'qa-man-1', dateRaised: '2023-10-22', plantId: 'plant-b'}
];
export const CAPAS: CAPA[] = [
  {id: 'CAPA-001', title: 'Retrain operators on material handling', source: 'd002', status: 'Closed', owner: 'qa-man-1', dueDate: '2023-10-15', plantId: 'plant-b'},
  {id: 'CAPA-002', title: 'Implement new calibration checklist', source: 'd003', status: 'Effectiveness Check', owner: 'qa-man-1', dueDate: '2023-11-30', plantId: 'plant-c'}
];
export const STABILITY_STUDIES: StabilityStudy[] = [
    {id: 'ST-001', productName: 'Paracetamol API', batchNumber: 'AP-PARA-001', studyType: 'Long-term', status: 'Ongoing', startDate: '2023-10-10', plantId: 'plant-a'}
];
export const MARKET_COMPLAINTS: MarketComplaint[] = [
    {id: 'MC-001', productName: 'Aspirin Tablets', batchNumber: 'ASP-TAB-101', complaint: 'Tablets are discolored.', dateReceived: '2023-10-25', status: 'Investigating', plantId: 'plant-b'}
];
export const INTERNAL_AUDITS: InternalAudit[] = [
    {id: 'IA-001', title: 'Q3 Internal Audit - Production', date: '2023-09-15', status: 'Completed', findings: 3, plantId: 'plant-a'}
];
export const EM_SAMPLES: EnvironmentalMonitoring[] = [
    {id: 'EM-001', room: 'Sterile Area - Room 101', date: '2023-10-28', result: 'Out of Spec', organism: 'Aspergillus', plantId: 'plant-a'}
];

export const QC_SAMPLES: QualitySample[] = [
    { id: 'samp-001', productName: 'Paracetamol API', batchNumber: 'AP-PARA-001', status: QcStatus.Passed, sampleDate: '2023-10-04', analystId: 'qc-op-1', dueDate: '2023-10-07', sampleType: 'FG', priority: 'Medium', tests: [{ name: 'Assay', method: 'HPLC', status: 'Approved', reviewedBy: 'qc-man-1' }, { name: 'Related Substances', method: 'HPLC', status: 'Approved', reviewedBy: 'qc-man-1' }] },
    { id: 'samp-002', productName: 'Ibuprofen API', batchNumber: 'AP-IBU-001', status: QcStatus.InProgress, sampleDate: '2023-10-12', analystId: 'qc-op-1', dueDate: '2023-10-15', sampleType: 'FG', priority: 'High', tests: [{ name: 'Assay', method: 'HPLC', status: 'Submitted for Review', submittedOn: '2023-10-14' }, { name: 'Water Content', method: 'Titration', status: 'Not Started' }] },
    { id: 'samp-003', productName: 'Metformin API', batchNumber: 'AP-MET-001', status: QcStatus.Pending, sampleDate: '2023-10-16', dueDate: '2023-10-19', sampleType: 'In-process', priority: 'Medium', tests: [{ name: 'pH', method: 'Titration', status: 'Not Started' }] },
    { id: 'samp-004', productName: 'Aspirin API', batchNumber: 'AP-ASP-001', status: QcStatus.Failed, sampleDate: '2023-09-28', analystId: 'qc-op-1', dueDate: '2023-10-01', sampleType: 'FG', priority: 'Critical', tests: [{ name: 'Assay', method: 'HPLC', status: 'Rejected', reviewedBy: 'qc-man-1', managerNotes: 'Peak shape is not acceptable. Re-run standard.' }] },
    { id: 'samp-005', productName: 'Phenol', batchNumber: 'RM-PHEN-056', status: QcStatus.InProgress, sampleDate: '2023-10-29', analystId: 'qc-op-1', dueDate: '2023-11-02', sampleType: 'RM', priority: 'Medium', tests: [{ name: 'Identification', method: 'HPLC', status: 'Submitted for Review', submittedOn: '2023-10-31' }, { name: 'Purity', method: 'GC', status: 'In Progress' }] },
    { id: 'samp-006', productName: 'Paracetamol API', batchNumber: 'ST-PARA-001', status: QcStatus.Pending, sampleDate: '2023-11-01', dueDate: '2023-11-05', sampleType: 'Stability', priority: 'Low', tests: [{ name: 'Assay', method: 'HPLC', status: 'Not Started' }] }
];

export const QC_INSTRUMENTS: QCInstrument[] = [
    { id: 'INST-001', name: 'HPLC-01', type: 'HPLC', status: 'Ready' },
    { id: 'INST-002', name: 'GC-03', type: 'Gas Chromatograph', status: 'In Use' },
    { id: 'INST-003', name: 'TITRATOR-02', type: 'Auto-titrator', status: 'Calibration Due' },
];

export const QC_STANDARDS: QCStandard[] = [
    { id: 'STD-001', name: 'Paracetamol RS', type: 'Reference', validity: '2024-12-31', quantity: 500, unit: 'mg' },
    { id: 'STD-002', name: 'Ibuprofen WS', type: 'Working', validity: '2024-06-30', quantity: 2, unit: 'g' },
];

export let COAS: CoA[] = [
    { id: 'COA-001', batchNumber: 'AP-PARA-001', productName: 'Paracetamol API', status: CoaStatus.Released, preparedBy: 'qc-op-1', reviewedBy: 'qc-man-1', approvedBy: 'qc-head-1', releaseDate: '2023-10-06'},
    { id: 'COA-002', batchNumber: 'AP-IBU-001', productName: 'Ibuprofen API', status: CoaStatus.PendingHeadApproval, preparedBy: 'qc-op-1', reviewedBy: 'qc-man-1' },
    { id: 'COA-003', batchNumber: 'AP-MET-001', productName: 'Metformin API', status: CoaStatus.PendingManagerReview, preparedBy: 'qc-op-1' },
];

export const QC_AUDIT_LOG = [
    { id: 'log-1', timestamp: '2023-11-02 10:15:45', user: 'Angela Martin', module: 'Testing Bench', action: 'Submitted result for Assay on samp-002.', details: 'Result: 99.5%', severity: 'Info' },
    { id: 'log-2', timestamp: '2023-11-02 11:30:10', user: 'Kevin Malone', module: 'Test Review', action: 'Approved Assay test for samp-002.', details: 'Notes: "Looks good."', severity: 'Info' },
    { id: 'log-3', timestamp: '2023-11-02 11:32:05', user: 'Kevin Malone', module: 'Test Review', action: 'Rejected Water Content test for samp-002.', details: 'Notes: "Calculation error found. Please re-verify."', severity: 'Warning' },
    { id: 'log-4', timestamp: '2023-11-02 14:05:00', user: 'Laura Vance', module: 'COA Approval', action: 'Approved COA for AP-PARA-001.', details: 'E-signature captured.', severity: 'Critical' },
    { id: 'log-5', timestamp: '2023-11-02 15:00:15', user: 'Laura Vance', module: 'Instrument Control', action: 'Declared TITRATOR-02 Out-of-Service.', details: 'Reason: Annual PM due.', severity: 'Major' },
];

export const SHIFTS: Shift[] = [
    { id: 'shift-1', name: 'Morning', date: '2023-11-03', managerId: 'prod-man-1', operatorIds: ['prod-op-1'], plantId: 'plant-a' },
    { id: 'shift-2', name: 'Evening', date: '2023-11-03', managerId: 'prod-man-1', operatorIds: [], plantId: 'plant-a' },
    { id: 'shift-3', name: 'Morning', date: '2023-11-03', managerId: 'prod-man-1', operatorIds: ['prod-op-2'], plantId: 'plant-b' },
];

export const PRODUCTION_AUDIT_LOG = [
    { id: 'pa-log-1', timestamp: '2023-11-02 08:00:00', user: 'Emily Davis', module: 'Batch Execution', action: 'Started stage: Reaction for AP-MET-001', details: 'Equipment: R-101' },
    { id: 'pa-log-2', timestamp: '2023-11-02 08:15:00', user: 'Emily Davis', module: 'EBR', action: 'Logged temperature: 85°C for AP-MET-001', details: 'Within spec (80-90°C)' },
    { id: 'pa-log-3', timestamp: '2023-11-02 09:30:00', user: 'John Smith', module: 'Batch Oversight', action: 'Approved stage closure: Dispensing for AP-MET-001', details: 'E-signature captured' },
    { id: 'pa-log-4', timestamp: '2023-11-02 10:00:00', user: 'John Smith', module: 'Equipment Mgmt', action: 'Approved Blender B-102 for use', details: 'Cleaning verified' },
];

export const RFQS: RFQ[] = [
    { id: 'RFQ-001', prId: 'ind-001', materialName: 'Phenol', quantity: 1000, vendorIds: ['v-001', 'v-003'], creationDate: '2023-10-19', status: 'Awaiting Quotes' }
];

export const QUOTATIONS: Quotation[] = [
    { id: 'Q-001', rfqId: 'RFQ-001', vendorId: 'v-001', price: 48000, deliveryTime: 15, submissionDate: '2023-10-21' },
    { id: 'Q-002', rfqId: 'RFQ-001', vendorId: 'v-003', price: 47500, deliveryTime: 20, submissionDate: '2023-10-22' }
];

export const GRNS: GoodsReceiptNote[] = [
    { id: 'GRN-001', poId: 'po-001', receivedDate: '2024-01-19', status: 'Pending QC', items: [{ materialId: 'mat-003', quantityReceived: 500, quantityAccepted: 0, quantityRejected: 0 }] },
];
export const RATE_AGREEMENTS: RateAgreement[] = [
    { id: 'RA-001', vendorId: 'v-001', materialId: 'mat-001', rate: 48.5, validFrom: '2023-01-01', validTo: '2023-12-31' }
];
export const PROC_AUDIT_LOG = [
    { id: 'proc-log-1', timestamp: '2023-10-19 11:00:00', user: 'Maria Garcia', module: 'RFQ', action: 'Created RFQ-001 from PR ind-001', details: 'Sent to 2 vendors' }
];

export const STOCK_ADJUSTMENTS: StockAdjustment[] = [
    { id: 'SA-001', materialId: 'mat-001', batchNumber: 'RM-PHEN-056', reason: 'Damage', quantityChange: -10, date: '2023-11-01', status: 'Pending Approval' }
];
export const CYCLE_COUNTS: CycleCount[] = [
    { id: 'CC-2023-11-01', date: '2023-11-01', bins: ['A1-01', 'A1-02'], status: 'Pending Verification', variances: 1 }
];
export const WAREHOUSE_AUDIT_LOG = [
    { id: 'wh-log-1', timestamp: '2024-01-19 14:00:00', user: 'Anil Kumar', module: 'Inbound', action: 'Created GRN-001 for PO-2024-001', details: 'Received 500 kg of Paracetamol API' }
];