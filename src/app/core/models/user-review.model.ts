export interface UserReviewModel {
  id: string;
  reviewer: ReviewerModel;
  value: number;
  comment: string;
  createdAt: string;
}

export interface ReviewerModel {
  id: string;
  name: string;
  avatarUrl: string;
}
