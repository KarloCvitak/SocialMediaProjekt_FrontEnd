import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { UserService } from '../user.service';
import { PostService } from '../post.service';
import { AuthService } from '../auth.service';
import { LikeService } from "../like.service";
import {CommentService} from "../comment.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  users: any[] = [];
  posts: any[] = [];
  likes: any[] = [];
  showPostCreate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService,
    public authService: AuthService,
    private likeService: LikeService,
    private router: Router,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(response => {
      if (response && response.users) {
        this.users = response.users;
      } else {
        console.error('Invalid response:', response);
      }
    });

    const user_id = this.authService.getCurrentUserId();
    this.loadUserInfo(user_id);
    this.loadUserPosts(user_id);
    this.loadLikes();
  }

  loadUserInfo(user_id: any) {
    this.userService.getProfile(user_id).subscribe(
      (response) => {
        this.user = response.user;
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );
  }

  loadUserPosts(userId: any) {
    this.postService.getUserPosts(userId).subscribe(
      (response) => {
        this.posts = response.post[0];
        this.sortPostsByDate();
      },
      (error) => {
        console.error('Error fetching user posts', error);
      }
    );
  }

  loadLikes() {
    this.likeService.getLikes().subscribe(response => {
      if (response && response.likes) {
        this.likes = response.likes[0];
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


  sortPostsByDate() {
    this.posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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

  editPost(post: any) {
    post.isEditing = true;
    post.editContent = post.content;  // Store current content in editContent
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
        this.loadUserPosts(userId);
      },
      (error) => {
        console.error('Error creating post', error);
      }
    );
  }

  likePost(post: any) {
    const user_id = this.authService.getCurrentUserId();

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

  viewPostDetail(postId: number) {
    this.router.navigate(['/post', postId]);
  }

}
