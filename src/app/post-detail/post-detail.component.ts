// post-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service';
import { CommentService } from '../comment.service';
import { AuthService } from '../auth.service';
import {UserService} from "../user.service";
import {LikeService} from "../like.service";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  thisPost: any = {};
  comments: any[] = [];
  newCommentContent: string = '';
  postRouteId: any;
  users: any[] = [];
  likes: any[] = [];



  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private userService: UserService,
    private likeService: LikeService
  ) { }

  ngOnInit() {



    this.userService.getUsers().subscribe(response => {
      if (response && response.users) {
        this.users = response.users;
        console.log(this.users);

      } else {
        console.error('Invalid response:', response);
      }
    });


     this.loadLikes();
    const postRouteId = this.route.snapshot.paramMap.get('id');
    console.log('Post ID:', postRouteId); // Logging post ID
    if (postRouteId) {
      this.loadPost(postRouteId);
      this.loadComments(postRouteId);
    }
  }

  likePost(post: any) {
    const user_id = this.authService.getCurrentUserId();
    console.log(user_id);

    if (!user_id) {
      console.error('User ID not available');
      return;
    }

    const like = {
      post_id: post.id,
      user_id: user_id
    };

    const existingLike = this.likes.find(l => l.post_id === post.id && l.user_id === user_id);

    if (existingLike) {
      // Unlike the post
      this.likeService.removeLike(existingLike.id).subscribe(
        () => {
          this.likes = this.likes.filter(l => l !== existingLike);
          const postToUpdate = this.thisPost;
          if (postToUpdate) {
            postToUpdate.likes--;
          }
          this.loadLikes();
        },
        error => {
          console.error('Error unliking post', error);
        }
      );
    } else {
      // Like the post
      this.likeService.addLike(like).subscribe(
        newLike => {
          this.likes.push(newLike);
          const postToUpdate = this.thisPost;
          if (postToUpdate) {
            postToUpdate.likes++;
          }
          this.loadLikes();
        },
        error => {
          console.error('Error liking post', error);
        }
      );
    }
  }


  loadPost(postId: any) {
    console.log('Loading post with ID:', postId); // Logging before the request
    this.postService.getPost(postId).subscribe(
      response => {
        console.log('Post loaded:', response); // Logging the response
        this.thisPost = response.post[0];
      },
      error => console.error('Error loading post', error)
    );
  }

  loadComments(postId: any) {
    console.log('Loading comments for post with ID:', postId); // Logging before the request
    this.commentService.getComments(postId).subscribe(
      response => {
        console.log('Comments loaded:', response); // Logging the response
        this.comments = response.comment;
      },
      error => console.error('Error loading comments', error)
    );
  }

  getUsername(user_id: any): string {
    const user = this.users.find(user => user.id === user_id);
    return user ? user.username : 'Unknown';
  }


  addComment() {
    const postId = this.route.snapshot.paramMap.get('id');
    const userId = this.authService.getCurrentUserId();
    const content = this.newCommentContent;

    const comment = {
      post_id: postId,
      user_id: userId,
      content: content
    };

    console.log('Adding comment:', comment); // Logging the comment being added
    this.commentService.createComment(comment).subscribe(
      response => {
        console.log('Comment added:', response); // Logging the response
        this.comments.push(response);
        this.newCommentContent = '';
        this.loadComments(postId);
      },
      error => console.error('Error adding comment', error)
    );
  }

  deleteComment(commentId: number) {
    console.log('Deleting comment with ID:', commentId); // Logging before the request
    this.commentService.deleteComment(commentId).subscribe(
      response => {
        console.log('Comment deleted:', response); // Logging the response
        this.comments = this.comments.filter(comment => comment.id !== commentId);
      },
      error => console.error('Error deleting comment', error)
    );
  }


  loadLikes(){
    this.likeService.getLikes().subscribe(response => {
      if (response && response.likes) {
        this.likes = response.likes[0];
        console.log(this.likes[0]);

      } else {
        console.error('Invalid response:', response);
      }
    });
  }



  getLikes(post_id: any): string {
    const likes = this.likes.filter(like => like.post_id === post_id);
    const likedUsers = likes.slice(0, 3).map(like => {
      const likedUser = this.users.find(user => user.id === like.user_id);
      return likedUser ? likedUser.username : 'Unknown';
    });

    let displayText = likedUsers.join(', ');
    if(likes.length === 0) {
      displayText +=' no likes :(';
    } else if (likes.length === 1){
      displayText +=' likes this';
    } else if (likes.length <= 3 && likes.length > 1){
      displayText +=' like this';
    } else {
      displayText += ` and ${likes.length - 3} more like this`;
    }

    return displayText;
  }


}
