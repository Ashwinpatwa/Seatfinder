export interface StudentSeat {
  enrollmentId: string;
  room: string;
  seat: string;
  block: string;
  floor: string;
  date: string;
  time: string;
  program?: string;
}

export interface RoomInfo {
  room: string;
  block: string;
  programs: string[];
  totalStudents: number;
}
