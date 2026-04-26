export interface NewStudentClass {
  fullname: string;
  email: string;
  phone: string;
  gender: string;
  DOB: string;
  identificationNumber: string;
  classroomId: number;
}
export interface NewStudent {
  studentName: string;
  studentGender: string;
  studentDOB: string;
  studentPhone: string;
  studentEmail: string;
  classId: string;
}

export interface Option {
  id: string;
  label: string;
  text: string;
  laDapAn?: boolean;
}

export interface Question {
  id: string;
  questionNumber?: number;
  text: string;
  options: Option[];
}

export interface ExamContentPopupProps {
  open: boolean;
  onClose: () => void;
  examContent: { questions?: Question[] } | null;
}
