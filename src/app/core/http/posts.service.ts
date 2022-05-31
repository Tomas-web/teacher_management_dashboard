import {Injectable} from "@angular/core";
import {HttpClientWrapperService} from "./http-client-wrapper.service";
import {Observable} from "rxjs";
import {PostResponseModel, PostsModel} from "../models/posts.model";

@Injectable({providedIn: 'root'})
export class PostsService {
  constructor(private http: HttpClientWrapperService) {
  }

  public getPosts(
    pageNum: number,
    lowestPrice: number,
    highestPrice: number,
    sortBy?: string,
    rating?: number,
    speciality?: string,
    q?: string): Observable<PostsModel> {
    let url = `/posts?page=${pageNum}&lowest_price=${lowestPrice}&highest_price=${highestPrice}`;

    if (!!sortBy) {
      url += `&sort_by=${sortBy}`;
    }

    if (!!rating) {
      url += `&rating=${rating}`;
    }

    if (!!speciality) {
      url += `&speciality=${speciality}`;
    }

    if (!!q) {
      url += `&q=${q}`;
    }

    return this.http.get(url);
  }

  public createPost(title: string, about: string): Observable<any> {
    return this.http.post(`/posts`, {title, content: about});
  }

  public getPost(postId: string): Observable<PostResponseModel> {
    return this.http.get(`/posts/${postId}`);
  }

  public deletePost(postId: string): Observable<any> {
    return this.http.delete(`/posts/${postId}`);
  }

  public incrementPostViews(postId: string): Observable<any> {
    return this.http.post(`/posts/${postId}/views`, {});
  }
}
