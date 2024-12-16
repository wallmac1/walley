import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInViewport]',
  standalone: true
})
export class InViewportDirective {
  private observer: IntersectionObserver;

  @HostBinding('class.visible') isVisible = false;
  @HostBinding('class.hidden') isHidden = true;

  constructor(private el: ElementRef) {
    // Inizializza l'IntersectionObserver
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.isHidden = false; // Rimuove la classe hidden quando visibile
        } else {
          this.isVisible = false;
          this.isHidden = true; // Aggiunge la classe hidden quando fuori dalla viewport
        }
      });
    });
  }

  ngOnInit(): void {
    // Inizia l'osservazione dell'elemento
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    // Disconnetti l'osservatore quando la direttiva viene distrutta
    this.observer.disconnect();
  }

}
