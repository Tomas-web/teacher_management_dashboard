import {UserRefModel} from "./user-ref.model";

export interface HomeworksResponseModel {
  homeworks: Homework[];
}

export interface Homework {
  id: string;
  teacher: UserRefModel;
  student: UserRefModel;
  content: string;
  deadline: string;
  uploads: {
    fileName: string;
    fileType: string;
    fileSize: number;
    downloadUri: string;
    uploadedAt: string;
  }[];
}
