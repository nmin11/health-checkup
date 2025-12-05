export interface HealthCheckupOverview {
  height: string;
  weight: string;
  waist: string;
  BMI: string;
  vision: string;
  hearing: string;
  bloodPressure: string;
  proteinuria: string;
  hemoglobin: string;
  fastingBloodGlucose: string;
  totalCholesterol: string;
  HDLCholesterol: string;
  triglyceride: string;
  LDLCholesterol: string;
  serumCreatinine: string;
  GFR: string;
  AST: string;
  ALT: string;
  yGPT: string;
  chestXrayResult: string;
  osteoporosis: string;
  checkupDate: string;
  evaluation: string;
}

export interface HealthCheckupReference {
  height: string;
  weight: string;
  waist: string;
  BMI: string;
  vision: string;
  hearing: string;
  bloodPressure: string;
  proteinuria: string;
  hemoglobin: string;
  fastingBloodGlucose: string;
  totalCholesterol: string;
  HDLCholesterol: string;
  triglyceride: string;
  LDLCholesterol: string;
  serumCreatinine: string;
  GFR: string;
  AST: string;
  ALT: string;
  yGPT: string;
  chestXrayResult: string;
  osteoporosis: string;
  refType: string;
}

export interface CheckupResult {
  caseType: number;
  checkupType: string;
  checkupDate: string;
  organizationName: string;
  checkupFindings: string;
  pdfData: string;
  questionnaire: string[];
  infantsCheckupList: string[];
  infantsDentalList: string[];
}

export interface HealthCheckupData {
  patientName: string;
  overviewList: HealthCheckupOverview[];
  referenceList: HealthCheckupReference[];
  resultList: CheckupResult[];
}
