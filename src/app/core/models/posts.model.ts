export interface PostsModel {
  posts: PostModel[];
  totalPages: number;
}

export interface PostResponseModel {
  post: PostModel;
}

export interface PostModel {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  speciality: string;
  author: PostAuthorModel;
  createdAt: string;
}

export interface PostAuthorModel {
  id: string;
  name: string;
  avatarUrl: string;
}
