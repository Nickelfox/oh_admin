import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[hiddenInnovationImagePreloader]'
})
export class ImagePreloaderDirective {

  imageSettled = false;
  link = '';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef<HTMLImageElement>) {
  }


  // tslint:disable-next-line:typedef
  @HostListener('load') onLoad() {
    if (this.imageSettled) {
      return;
    }
    this.setImage();
  }

  // tslint:disable-next-line:typedef
  @HostListener('error') onError() {
    this.renderer.setAttribute(this.el.nativeElement, 'src', 'https://dummyimage.com/300x300/F3F7FC/0F0532&text=++No+Image++');
  }

  setImage(): void {
    this.imageSettled = true;
    this.renderer.setAttribute(
      this.el.nativeElement,
      'src', this.link
    );
  }

  setPreloader(): void {
    this.renderer.setAttribute(
      this.el.nativeElement,
      'src', 'assets/img-preloader.gif'
    );
  }

  ngAfterViewInit(): void {
    this.link = this.el.nativeElement.src;
    this.setPreloader();
  }

}
