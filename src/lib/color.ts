import convert from "color-convert";

export function getRandom(start: number, end: number) {
  return Math.floor(Math.random() * end) + start;
}

export namespace Color {
  export class RGB {
    constructor(
      public r: number,
      public g: number,
      public b: number,
    ) {}

    toCSS() {
      return `rgb(${this.r ?? 0}, ${this.g ?? 0}, ${this.b ?? 0})`;
    }

    toHEX() {
      return `#${convert.rgb.hex(this.r, this.g, this.b)}`;
    }

    toHSL() {
      const hsl = convert.rgb.hsl(this.r, this.g, this.b);
      return new HSL(hsl[0], hsl[1], hsl[2]);
    }

    toRGBA() {
      return new RGBA(this.r, this.g, this.b, 1);
    }

    static getRandom() {
      return new RGB(getRandom(0, 255), getRandom(0, 255), getRandom(0, 255));
    }
  }

  export class RGBA {
    constructor(
      public r: number,
      public g: number,
      public b: number,
      public a: number,
    ) {}

    toCSS() {
      return `rgba(${this.r ?? 0}, ${this.g ?? 0}, ${this.b ?? 0}, ${
        this.a ?? 0
      })`;
    }

    toHSLA() {
      const hsl = convert.rgb.hsl(this.r, this.g, this.b);
      return new HSLA(hsl[0], hsl[1], hsl[2], this.a);
    }

    reduceToRGB() {
      return new RGB(this.r, this.g, this.b);
    }

    reduceToHSL() {
      return this.reduceToRGB().toHSL();
    }
  }

  export class HSLA {
    constructor(
      public h: number,
      public s: number,
      public l: number,
      public a: number,
    ) {}

    toRGBA() {
      const rgb = convert.hsl.rgb(this.h, this.s, this.l);
      return new RGBA(rgb[0], rgb[1], rgb[2], this.a);
    }

    toCSS() {
      return `hsla(${this.h}deg, ${this.s}%, ${this.l}%, ${this.a})`;
    }

    reduceToRGB() {
      return this.reduceToHSL().toRGB();
    }

    reduceToHSL() {
      return new HSL(this.h, this.s, this.l);
    }
  }

  export enum HSLParam {
    HUE,
    SATURATION,
    LIGHTNESS,
  }

  export class HSL {
    constructor(
      public h: number,
      public s: number,
      public l: number,
    ) {}

    getParam(param: HSLParam) {
      switch (param) {
        case HSLParam.HUE:
          return this.h;
        case HSLParam.SATURATION:
          return this.s;
        case HSLParam.LIGHTNESS:
          return this.l;
      }
    }

    setParam(param: HSLParam, value: number) {
      switch (param) {
        case HSLParam.HUE:
          this.h = value;
          break;
        case HSLParam.SATURATION:
          this.s = value;
          break;
        case HSLParam.LIGHTNESS:
          this.l = value;
          break;
      }
      return this;
    }

    static getMaxValue(param: HSLParam) {
      switch (param) {
        case HSLParam.HUE:
          return 360;
        case HSLParam.SATURATION:
          return 100;
        case HSLParam.LIGHTNESS:
          return 100;
      }
    }

    toRGB(): RGB {
      const rgb = convert.hsl.rgb(this.h, this.s, this.l);
      return new RGB(rgb[0], rgb[1], rgb[2]);
    }

    toHEX() {
      return `#${convert.hsl.hex(this.h, this.s, this.l)}`;
    }

    toCSS() {
      return `hsl(${this.h}deg, ${this.s}%, ${this.l}%)`;
    }

    toHSLA() {
      return new HSLA(this.h, this.s, this.l, 1);
    }

    toRGBA() {
      return this.toRGB().toRGBA();
    }
  }
}
