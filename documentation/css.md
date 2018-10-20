# CSS guide

All this in here should be respected at all times unless it is marked otherwise

## main.scss
Includes all shared variables and imports all the `scss` modules. There are general rules that we apply on the whole site which are not BEM compliant.  
There is a comment where BEM should start being used. In most cases you will never have to touch non-BEM rules on a  project.

## BEM
We are following [bem notation](http://getbem.com/)  
Please read about on the link.

## Other rules

### Group similar properties together.
- Always start with display / flex properties
- Then move to position properties 
- Then the rest, but still keep it grouped somehow

**Bad:**
```css
.main-wrapper {
  flex: 0 0 100%;
  order: 15;
  position: static;
  max-width: initial;
  background: transparent;
  padding: 0 1rem;
  height: auto;
  display: block;
  margin-top: 1.5rem;
  &:after {
    display: none;
  }
}
```

**Good:**
```css
.main-wrapper {
 display: block;
 flex: 0 0 100%;
 order: 15;
 position: static;
 padding: 0 1rem;
 margin-top: 1.5rem;
 max-width: initial;
 height: auto;
 background: transparent;
 
 &:after {
   display: none;
 }
}
```

- group `display`, `flex` and `order` so at the glance it is visible how this component layout plays with others 
- group `position`, `padding`, `margin`, `width` and `height` so at the glance it is visible how this component layout looks like internally
- then add background as it is just decorator

### Spacing and arrangement of BEM elements

**Example:**
```css 
.hamburger {
  $block: '.hamburger';
  width: 1.5rem;
  height: 1rem;
  margin-left: 1rem;
  padding: 0;
  min-width: auto;
  background: transparent;
  border: none;
  
  &:focus {
    border: 1px solid transparent !important;
  }
  
  &--open {
    #{$block}__line {
      &:nth-of-type(1), &:nth-of-type(3) {
        opacity: 0;
      }
       
      &:nth-of-type(2) {
        transform: rotate(-45deg);
      }
      
      &:nth-of-type(4) {
        transform: rotate(45deg);
      }
    }
  }

  &__line {
    $height: 2px;
    $margin: 4px;
    display: block;
    height: $height;
    margin-bottom: $margin;
    background: white;
    opacity: 1;
    transition: all ease-in-out 0.15s;
    
    &:nth-of-type(4) {
      position: relative;
      top: -(2*$margin+2*$height);
    }
  }

  @include media-breakpoint-up(lg) {
    display: none;
  }
}
```

**Order of writing elements:**
- Block
  - Block rules
  - Block pseudo elements
  - Block modifiers
    - Block modifier rules
    - Block modifier pseudo elements
  - Block elements
    - Block element rules
    - Block element pseudo elements
    - Block element modifiers
      - Block element modifier rules
      - Block element modifier pseudo elements
  
  - Single media query, inside same rules as above apply
  
 **Related:**
- Newline before selector unless it is already indented
- If block is referenced from within modifier it should be defined as `$block: '.hamburger';` under first rule and used via interpolation `#{$block}__line`
- Semantic naming, avoid `__columns`/`__column` in favor of `__home-links` / `__home-link`
