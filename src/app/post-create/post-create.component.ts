import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { GiphyService } from '../giphy.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  gifQuery: string = '';
  gifs: any[] = [];
  showGifSearch: boolean = false;
  selectedGif: any = null;

  @Output() postCreated = new EventEmitter<{ content: string, gifUrl: string | null }>();
  @ViewChild('postContentDiv', { static: false }) postContentDiv!: ElementRef;

  constructor(private giphyService: GiphyService) {}

  toggleGifSearch() {
    this.showGifSearch = !this.showGifSearch;
    if (this.showGifSearch) {
      this.gifQuery = ''; // Clear the GIF search query when showing the modal
      this.gifs = []; // Clear previous search results
    }
  }

  searchGifs() {
    if (!this.gifQuery.trim()) {
      this.gifQuery = 'funny'; // Default query if empty
    }
    console.log('Searching for GIFs with query:', this.gifQuery);

    this.giphyService.searchGifs(this.gifQuery).subscribe(
      (response) => {
        console.log(response);
        if (response.data.length > 0) {
          this.gifs = response.data;
        } else {
          console.warn('No GIFs found for query:', this.gifQuery);
          this.gifs = [];
        }
      },
      (error) => {
        console.error('Error fetching GIFs', error);
      }
    );
  }

  selectGif(gif: any) {
    this.selectedGif = gif;
    this.insertGifIntoContent(gif.images.fixed_height.url);
    this.toggleGifSearch();
  }

  insertGifIntoContent(gifUrl: string) {
    const postContentElement = this.postContentDiv.nativeElement;
    const gifImg = `<img src="${gifUrl}" alt="GIF" />`;
    const range = document.createRange();
    const sel = window.getSelection();

    if (sel && sel.rangeCount > 0) {
      const lastChild = postContentElement.lastChild;
      if (lastChild) {
        range.setStartAfter(lastChild);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        const imgNode = document.createElement('img');
        imgNode.src = gifUrl;
        imgNode.alt = 'GIF';

        const lineBreak = document.createElement('br');
        sel.getRangeAt(0).insertNode(lineBreak);
        sel.getRangeAt(0).insertNode(imgNode);
      } else {
        postContentElement.innerHTML += gifImg;
      }
    } else {
      postContentElement.innerHTML += gifImg;
    }
  }

  createPost() {
    const postContentHtml = this.postContentDiv.nativeElement.innerHTML;
    this.postCreated.emit({
      content: postContentHtml,
      gifUrl: this.selectedGif ? this.selectedGif.images.fixed_height.url : null
    });
    // Reset variables
    this.postContentDiv.nativeElement.innerHTML = '';
    this.selectedGif = null;
  }
}
