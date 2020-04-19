import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {

    @HostBinding('class.open') private isMouseOver = false;

    constructor() {
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.isMouseOver = true;
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.isMouseOver = false;
    }

}
