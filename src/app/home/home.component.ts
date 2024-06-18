import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { LikeService } from "../like.service";
import { AuthService } from "../auth.service";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import { CommentService } from "../comment.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  token = this.authService.getToken();
  users: any[] = [];
  likes: any[] = [];
  showPostCreate: boolean = false;

  constructor(
    private postService: PostService,
    private likeService: LikeService,
    public authService: AuthService,
    private userService: UserService,
    private router: Router,
    private commentService: CommentService
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
    this.loadPosts();
  }

  viewPostDetail(postId: number) {
    this.router.navigate(['/post', postId]);
  }

  loadPosts() {
    this.postService.getPosts().subscribe(response => {
      if (response && response.posts) {
        this.posts = response.posts[0];
        this.sortPostsByDate();
        console.log(this.posts);
        console.log(response.posts);
      } else {
        console.error('Invalid response:', response);
      }
    });
  }

  sortPostsByDate() {
    this.posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  loadLikes() {
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
    if (likes.length === 0) {
      displayText += ' no likes :(';
    } else if (likes.length === 1) {
      displayText += ' likes this';
    } else if (likes.length <= 3 && likes.length > 1) {
      displayText += ' like this';
    } else {
      displayText += ` and ${likes.length - 3} more like this`;
    }

    return displayText;
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
          const postToUpdate = this.posts.find(p => p.id === post.id);
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
          const postToUpdate = this.posts.find(p => p.id === post.id);
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

  getUsername(user_id: any): string {
    const user = this.users.find(user => user.id === user_id);
    return user ? user.username : 'Unknown';
  }

  addPost(postData: { content: string, gifUrl: string | null }) {
    const userId = this.authService.getCurrentUserId();
    const newPost = {
      user_id: userId,
      content: postData.content,
      gif_url: postData.gifUrl
    };

    this.postService.createPost(newPost).subscribe(
      (response) => {
        this.posts.unshift(response);
        this.showPostCreate = false;
        this.loadPosts();
      },
      (error) => {
        console.error('Error creating post', error);
      }
    );
  }

  editPost(post: any) {
    post.isEditing = true;
    post.editContent = post.content;
  }

  updatePost(post: any) {
    this.postService.updatePost(post.id, post.editContent).subscribe(
      (response) => {
        post.content = post.editContent;
        post.isEditing = false;
      },
      (error) => {
        console.error('Error updating post', error);
      }
    );
  }

  cancelEdit(post: any) {
    post.isEditing = false;
  }

  deletePost(postId: number) {
    this.commentService.removeCommentsFromAPost(postId).subscribe();
    this.likeService.removeLikeFromAPost(postId).subscribe(
      () => {
        this.postService.deletePost(postId).subscribe(
          () => {
            this.posts = this.posts.filter(post => post.id !== postId);
          },
          (error) => {
            console.error('Error deleting post', error);
          }
        );
      },
      (error) => {
        console.error('Error removing likes for post', error);
      }
    );
  }

  onEditContentInput(post: any, content: string) {
    post.editContent = content;
  }
}
