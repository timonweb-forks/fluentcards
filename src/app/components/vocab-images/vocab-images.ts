import {Component, Input, Output, EventEmitter, ElementRef, HostListener} from '@angular/core';

import {ImageSearchService} from '../../services/image-search';
import {Loader} from '../loader/loader';

@Component({
  selector: 'vocab-images',
  pipes: [],
  providers: [],
  directives: [ Loader ],
  styleUrls: [ './vocab-images.css' ],
  templateUrl: './vocab-images.html'
})
export class VocabImages {
    @Input() word: string;
    @Output() onResult: EventEmitter<{}> = new EventEmitter();

    images: any[];
    errorMessage: string;
    isLoading: boolean;
    private clickListener: any;
    private keyupListener: any;

    constructor(
        private imageSearchService: ImageSearchService,
        private element: ElementRef
    ) {}

    private close() {
        this.onResult.next({
            image: null
        });
    }

    @HostListener('document:keyup', [ '$event.code' ])
    onKeyup(code) {
        if (code == 'Escape') {
            this.close();
        }
    }

    @HostListener('document:click', [ '$event.target' ])
    onClick(target) {
        if (!this.isLoading && !this.element.nativeElement.contains(target)) {
            this.close();
        }
    }

    ngOnInit() {
        this.isLoading = true;

        this.imageSearchService.getImages(this.word)
            .subscribe(
                (data) => this.images = data,
                (errMessage) => this.errorMessage = errMessage,
                () => this.isLoading = false
            );
    }

    selectImage(item) {
        this.onResult.next({
            image: item
        });
    }

}