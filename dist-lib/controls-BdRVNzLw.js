import { m as A, t as F } from "./index-sn_YDAOD.js";
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */
class m {
  constructor(t, e, i, s, n = "div") {
    this.parent = t, this.object = e, this.property = i, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(n), this.domElement.classList.add("lil-controller"), this.domElement.classList.add(s), this.$name = document.createElement("div"), this.$name.classList.add("lil-name"), m.nextNameID = m.nextNameID || 0, this.$name.id = `lil-gui-name-${++m.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("lil-widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (a) => a.stopPropagation()), this.domElement.addEventListener("keyup", (a) => a.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(i);
  }
  /**
   * Sets the name of the controller and its label in the GUI.
   * @param {string} name
   * @returns {this}
   */
  name(t) {
    return this._name = t, this.$name.textContent = t, this;
  }
  /**
   * Pass a function to be called whenever the value is modified by this controller.
   * The function receives the new value as its first parameter. The value of `this` will be the
   * controller.
   *
   * For function controllers, the `onChange` callback will be fired on click, after the function
   * executes.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onChange( function( v ) {
   * 	console.log( 'The value is now ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onChange(t) {
    return this._onChange = t, this;
  }
  /**
   * Calls the onChange methods of this controller and its parent GUI.
   * @protected
   */
  _callOnChange() {
    this.parent._callOnChange(this), this._onChange !== void 0 && this._onChange.call(this, this.getValue()), this._changed = !0;
  }
  /**
   * Pass a function to be called after this controller has been modified and loses focus.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onFinishChange( function( v ) {
   * 	console.log( 'Changes complete: ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onFinishChange(t) {
    return this._onFinishChange = t, this;
  }
  /**
   * Should be called by Controller when its widgets lose focus.
   * @protected
   */
  _callOnFinishChange() {
    this._changed && (this.parent._callOnFinishChange(this), this._onFinishChange !== void 0 && this._onFinishChange.call(this, this.getValue())), this._changed = !1;
  }
  /**
   * Sets the controller back to its initial value.
   * @returns {this}
   */
  reset() {
    return this.setValue(this.initialValue), this._callOnFinishChange(), this;
  }
  /**
   * Enables this controller.
   * @param {boolean} enabled
   * @returns {this}
   * @example
   * controller.enable();
   * controller.enable( false ); // disable
   * controller.enable( controller._disabled ); // toggle
   */
  enable(t = !0) {
    return this.disable(!t);
  }
  /**
   * Disables this controller.
   * @param {boolean} disabled
   * @returns {this}
   * @example
   * controller.disable();
   * controller.disable( false ); // enable
   * controller.disable( !controller._disabled ); // toggle
   */
  disable(t = !0) {
    return t === this._disabled ? this : (this._disabled = t, this.domElement.classList.toggle("lil-disabled", t), this.$disable.toggleAttribute("disabled", t), this);
  }
  /**
   * Shows the Controller after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * controller.show();
   * controller.show( false ); // hide
   * controller.show( controller._hidden ); // toggle
   */
  show(t = !0) {
    return this._hidden = !t, this.domElement.style.display = this._hidden ? "none" : "", this;
  }
  /**
   * Hides the Controller.
   * @returns {this}
   */
  hide() {
    return this.show(!1);
  }
  /**
   * Changes this controller into a dropdown of options.
   *
   * Calling this method on an option controller will simply update the options. However, if this
   * controller was not already an option controller, old references to this controller are
   * destroyed, and a new controller is added to the end of the GUI.
   * @example
   * // safe usage
   *
   * gui.add( obj, 'prop1' ).options( [ 'a', 'b', 'c' ] );
   * gui.add( obj, 'prop2' ).options( { Big: 10, Small: 1 } );
   * gui.add( obj, 'prop3' );
   *
   * // danger
   *
   * const ctrl1 = gui.add( obj, 'prop1' );
   * gui.add( obj, 'prop2' );
   *
   * // calling options out of order adds a new controller to the end...
   * const ctrl2 = ctrl1.options( [ 'a', 'b', 'c' ] );
   *
   * // ...and ctrl1 now references a controller that doesn't exist
   * assert( ctrl2 !== ctrl1 )
   * @param {object|Array} options
   * @returns {Controller}
   */
  options(t) {
    const e = this.parent.add(this.object, this.property, t);
    return e.name(this._name), this.destroy(), e;
  }
  /**
   * Sets the minimum value. Only works on number controllers.
   * @param {number} min
   * @returns {this}
   */
  min(t) {
    return this;
  }
  /**
   * Sets the maximum value. Only works on number controllers.
   * @param {number} max
   * @returns {this}
   */
  max(t) {
    return this;
  }
  /**
   * Values set by this controller will be rounded to multiples of `step`. Only works on number
   * controllers.
   * @param {number} step
   * @returns {this}
   */
  step(t) {
    return this;
  }
  /**
   * Rounds the displayed value to a fixed number of decimals, without affecting the actual value
   * like `step()`. Only works on number controllers.
   * @example
   * gui.add( object, 'property' ).listen().decimals( 4 );
   * @param {number} decimals
   * @returns {this}
   */
  decimals(t) {
    return this;
  }
  /**
   * Calls `updateDisplay()` every animation frame. Pass `false` to stop listening.
   * @param {boolean} listen
   * @returns {this}
   */
  listen(t = !0) {
    return this._listening = t, this._listenCallbackID !== void 0 && (cancelAnimationFrame(this._listenCallbackID), this._listenCallbackID = void 0), this._listening && this._listenCallback(), this;
  }
  _listenCallback() {
    this._listenCallbackID = requestAnimationFrame(this._listenCallback);
    const t = this.save();
    t !== this._listenPrevValue && this.updateDisplay(), this._listenPrevValue = t;
  }
  /**
   * Returns `object[ property ]`.
   * @returns {any}
   */
  getValue() {
    return this.object[this.property];
  }
  /**
   * Sets the value of `object[ property ]`, invokes any `onChange` handlers and updates the display.
   * @param {any} value
   * @returns {this}
   */
  setValue(t) {
    return this.getValue() !== t && (this.object[this.property] = t, this._callOnChange(), this.updateDisplay()), this;
  }
  /**
   * Updates the display to keep it in sync with the current value. Useful for updating your
   * controllers when their values have been modified outside of the GUI.
   * @returns {this}
   */
  updateDisplay() {
    return this;
  }
  load(t) {
    return this.setValue(t), this._callOnFinishChange(), this;
  }
  save() {
    return this.getValue();
  }
  /**
   * Destroys this controller and removes it from the parent GUI.
   */
  destroy() {
    this.listen(!1), this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.controllers.splice(this.parent.controllers.indexOf(this), 1), this.parent.$children.removeChild(this.domElement);
  }
}
class O extends m {
  constructor(t, e, i) {
    super(t, e, i, "lil-boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function S(l) {
  let t, e;
  return (t = l.match(/(#|0x)?([a-f0-9]{6})/i)) ? e = t[2] : (t = l.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? e = parseInt(t[1]).toString(16).padStart(2, 0) + parseInt(t[2]).toString(16).padStart(2, 0) + parseInt(t[3]).toString(16).padStart(2, 0) : (t = l.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (e = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), e ? "#" + e : !1;
}
const k = {
  isPrimitive: !0,
  match: (l) => typeof l == "string",
  fromHexString: S,
  toHexString: S
}, b = {
  isPrimitive: !0,
  match: (l) => typeof l == "number",
  fromHexString: (l) => parseInt(l.substring(1), 16),
  toHexString: (l) => "#" + l.toString(16).padStart(6, 0)
}, I = {
  isPrimitive: !1,
  match: (l) => Array.isArray(l) || ArrayBuffer.isView(l),
  fromHexString(l, t, e = 1) {
    const i = b.fromHexString(l);
    t[0] = (i >> 16 & 255) / 255 * e, t[1] = (i >> 8 & 255) / 255 * e, t[2] = (i & 255) / 255 * e;
  },
  toHexString([l, t, e], i = 1) {
    i = 255 / i;
    const s = l * i << 16 ^ t * i << 8 ^ e * i << 0;
    return b.toHexString(s);
  }
}, R = {
  isPrimitive: !1,
  match: (l) => Object(l) === l,
  fromHexString(l, t, e = 1) {
    const i = b.fromHexString(l);
    t.r = (i >> 16 & 255) / 255 * e, t.g = (i >> 8 & 255) / 255 * e, t.b = (i & 255) / 255 * e;
  },
  toHexString({ r: l, g: t, b: e }, i = 1) {
    i = 255 / i;
    const s = l * i << 16 ^ t * i << 8 ^ e * i << 0;
    return b.toHexString(s);
  }
}, V = [k, b, I, R];
function D(l) {
  return V.find((t) => t.match(l));
}
class M extends m {
  constructor(t, e, i, s) {
    super(t, e, i, "lil-color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("lil-display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = D(this.initialValue), this._rgbScale = s, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const n = S(this.$text.value);
      n && this._setValueFromHexString(n);
    }), this.$text.addEventListener("focus", () => {
      this._textFocused = !0, this.$text.select();
    }), this.$text.addEventListener("blur", () => {
      this._textFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    }), this.$disable = this.$text, this.updateDisplay();
  }
  reset() {
    return this._setValueFromHexString(this._initialValueHexString), this;
  }
  _setValueFromHexString(t) {
    if (this._format.isPrimitive) {
      const e = this._format.fromHexString(t);
      this.setValue(e);
    } else
      this._format.fromHexString(t, this.getValue(), this._rgbScale), this._callOnChange(), this.updateDisplay();
  }
  save() {
    return this._format.toHexString(this.getValue(), this._rgbScale);
  }
  load(t) {
    return this._setValueFromHexString(t), this._callOnFinishChange(), this;
  }
  updateDisplay() {
    return this.$input.value = this._format.toHexString(this.getValue(), this._rgbScale), this._textFocused || (this.$text.value = this.$input.value.substring(1)), this.$display.style.backgroundColor = this.$input.value, this;
  }
}
class _ extends m {
  constructor(t, e, i) {
    super(t, e, i, "lil-function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (s) => {
      s.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class H extends m {
  constructor(t, e, i, s, n, a) {
    super(t, e, i, "lil-number"), this._initInput(), this.min(s), this.max(n);
    const h = a !== void 0;
    this.step(h ? a : this._getImplicitStep(), h), this.updateDisplay();
  }
  decimals(t) {
    return this._decimals = t, this.updateDisplay(), this;
  }
  min(t) {
    return this._min = t, this._onUpdateMinMax(), this;
  }
  max(t) {
    return this._max = t, this._onUpdateMinMax(), this;
  }
  step(t, e = !0) {
    return this._step = t, this._stepExplicit = e, this;
  }
  updateDisplay() {
    const t = this.getValue();
    if (this._hasSlider) {
      let e = (t - this._min) / (this._max - this._min);
      e = Math.max(0, Math.min(e, 1)), this.$fill.style.width = e * 100 + "%";
    }
    return this._inputFocused || (this.$input.value = this._decimals === void 0 ? t : t.toFixed(this._decimals)), this;
  }
  _initInput() {
    this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("aria-labelledby", this.$name.id), window.matchMedia("(pointer: coarse)").matches && (this.$input.setAttribute("type", "number"), this.$input.setAttribute("step", "any")), this.$widget.appendChild(this.$input), this.$disable = this.$input;
    const e = () => {
      let o = parseFloat(this.$input.value);
      isNaN(o) || (this._stepExplicit && (o = this._snap(o)), this.setValue(this._clamp(o)));
    }, i = (o) => {
      const d = parseFloat(this.$input.value);
      isNaN(d) || (this._snapClampSetValue(d + o), this.$input.value = this.getValue());
    }, s = (o) => {
      o.key === "Enter" && this.$input.blur(), o.code === "ArrowUp" && (o.preventDefault(), i(this._step * this._arrowKeyMultiplier(o))), o.code === "ArrowDown" && (o.preventDefault(), i(this._step * this._arrowKeyMultiplier(o) * -1));
    }, n = (o) => {
      this._inputFocused && (o.preventDefault(), i(this._step * this._normalizeMouseWheel(o)));
    };
    let a = !1, h, c, g, p, u;
    const f = 5, w = (o) => {
      h = o.clientX, c = g = o.clientY, a = !0, p = this.getValue(), u = 0, window.addEventListener("mousemove", v), window.addEventListener("mouseup", C);
    }, v = (o) => {
      if (a) {
        const d = o.clientX - h, y = o.clientY - c;
        Math.abs(y) > f ? (o.preventDefault(), this.$input.blur(), a = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(d) > f && C();
      }
      if (!a) {
        const d = o.clientY - g;
        u -= d * this._step * this._arrowKeyMultiplier(o), p + u > this._max ? u = this._max - p : p + u < this._min && (u = this._min - p), this._snapClampSetValue(p + u);
      }
      g = o.clientY;
    }, C = () => {
      this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", v), window.removeEventListener("mouseup", C);
    }, x = () => {
      this._inputFocused = !0;
    }, r = () => {
      this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    };
    this.$input.addEventListener("input", e), this.$input.addEventListener("keydown", s), this.$input.addEventListener("wheel", n, { passive: !1 }), this.$input.addEventListener("mousedown", w), this.$input.addEventListener("focus", x), this.$input.addEventListener("blur", r);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("lil-slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("lil-fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("lil-has-slider");
    const t = (r, o, d, y, $) => (r - o) / (d - o) * ($ - y) + y, e = (r) => {
      const o = this.$slider.getBoundingClientRect();
      let d = t(r, o.left, o.right, this._min, this._max);
      this._snapClampSetValue(d);
    }, i = (r) => {
      this._setDraggingStyle(!0), e(r.clientX), window.addEventListener("mousemove", s), window.addEventListener("mouseup", n);
    }, s = (r) => {
      e(r.clientX);
    }, n = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", s), window.removeEventListener("mouseup", n);
    };
    let a = !1, h, c;
    const g = (r) => {
      r.preventDefault(), this._setDraggingStyle(!0), e(r.touches[0].clientX), a = !1;
    }, p = (r) => {
      r.touches.length > 1 || (this._hasScrollBar ? (h = r.touches[0].clientX, c = r.touches[0].clientY, a = !0) : g(r), window.addEventListener("touchmove", u, { passive: !1 }), window.addEventListener("touchend", f));
    }, u = (r) => {
      if (a) {
        const o = r.touches[0].clientX - h, d = r.touches[0].clientY - c;
        Math.abs(o) > Math.abs(d) ? g(r) : (window.removeEventListener("touchmove", u), window.removeEventListener("touchend", f));
      } else
        r.preventDefault(), e(r.touches[0].clientX);
    }, f = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", u), window.removeEventListener("touchend", f);
    }, w = this._callOnFinishChange.bind(this), v = 400;
    let C;
    const x = (r) => {
      if (Math.abs(r.deltaX) < Math.abs(r.deltaY) && this._hasScrollBar) return;
      r.preventDefault();
      const d = this._normalizeMouseWheel(r) * this._step;
      this._snapClampSetValue(this.getValue() + d), this.$input.value = this.getValue(), clearTimeout(C), C = setTimeout(w, v);
    };
    this.$slider.addEventListener("mousedown", i), this.$slider.addEventListener("touchstart", p, { passive: !1 }), this.$slider.addEventListener("wheel", x, { passive: !1 });
  }
  _setDraggingStyle(t, e = "horizontal") {
    this.$slider && this.$slider.classList.toggle("lil-active", t), document.body.classList.toggle("lil-dragging", t), document.body.classList.toggle(`lil-${e}`, t);
  }
  _getImplicitStep() {
    return this._hasMin && this._hasMax ? (this._max - this._min) / 1e3 : 0.1;
  }
  _onUpdateMinMax() {
    !this._hasSlider && this._hasMin && this._hasMax && (this._stepExplicit || this.step(this._getImplicitStep(), !1), this._initSlider(), this.updateDisplay());
  }
  _normalizeMouseWheel(t) {
    let { deltaX: e, deltaY: i } = t;
    return Math.floor(t.deltaY) !== t.deltaY && t.wheelDelta && (e = 0, i = -t.wheelDelta / 120, i *= this._stepExplicit ? 1 : 10), e + -i;
  }
  _arrowKeyMultiplier(t) {
    let e = this._stepExplicit ? 1 : 10;
    return t.shiftKey ? e *= 10 : t.altKey && (e /= 10), e;
  }
  _snap(t) {
    let e = 0;
    return this._hasMin ? e = this._min : this._hasMax && (e = this._max), t -= e, t = Math.round(t / this._step) * this._step, t += e, t = parseFloat(t.toPrecision(15)), t;
  }
  _clamp(t) {
    return t < this._min && (t = this._min), t > this._max && (t = this._max), t;
  }
  _snapClampSetValue(t) {
    this.setValue(this._clamp(this._snap(t)));
  }
  get _hasScrollBar() {
    const t = this.parent.root.$children;
    return t.scrollHeight > t.clientHeight;
  }
  get _hasMin() {
    return this._min !== void 0;
  }
  get _hasMax() {
    return this._max !== void 0;
  }
}
class U extends m {
  constructor(t, e, i, s) {
    super(t, e, i, "lil-option"), this.$select = document.createElement("select"), this.$select.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("lil-display"), this.$select.addEventListener("change", () => {
      this.setValue(this._values[this.$select.selectedIndex]), this._callOnFinishChange();
    }), this.$select.addEventListener("focus", () => {
      this.$display.classList.add("lil-focus");
    }), this.$select.addEventListener("blur", () => {
      this.$display.classList.remove("lil-focus");
    }), this.$widget.appendChild(this.$select), this.$widget.appendChild(this.$display), this.$disable = this.$select, this.options(s);
  }
  options(t) {
    return this._values = Array.isArray(t) ? t : Object.values(t), this._names = Array.isArray(t) ? t : Object.keys(t), this.$select.replaceChildren(), this._names.forEach((e) => {
      const i = document.createElement("option");
      i.textContent = e, this.$select.appendChild(i);
    }), this.updateDisplay(), this;
  }
  updateDisplay() {
    const t = this.getValue(), e = this._values.indexOf(t);
    return this.$select.selectedIndex = e, this.$display.textContent = e === -1 ? t : this._names[e], this;
  }
}
class z extends m {
  constructor(t, e, i) {
    super(t, e, i, "lil-string"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("spellcheck", "false"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$input.addEventListener("input", () => {
      this.setValue(this.$input.value);
    }), this.$input.addEventListener("keydown", (s) => {
      s.code === "Enter" && this.$input.blur();
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$widget.appendChild(this.$input), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.value = this.getValue(), this;
  }
}
var P = `.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;
function G(l) {
  const t = document.createElement("style");
  t.innerHTML = l;
  const e = document.querySelector("head link[rel=stylesheet], head style");
  e ? document.head.insertBefore(t, e) : document.head.appendChild(t);
}
let L = !1;
class E {
  /**
   * Creates a panel that holds controllers.
   * @example
   * new GUI();
   * new GUI( { container: document.getElementById( 'custom' ) } );
   *
   * @param {object} [options]
   * @param {boolean} [options.autoPlace=true]
   * Adds the GUI to `document.body` and fixes it to the top right of the page.
   *
   * @param {Node} [options.container]
   * Adds the GUI to this DOM element. Overrides `autoPlace`.
   *
   * @param {number} [options.width=245]
   * Width of the GUI in pixels, usually set when name labels become too long. Note that you can make
   * name labels wider in CSS with `.lil‑gui { ‑‑name‑width: 55% }`.
   *
   * @param {string} [options.title=Controls]
   * Name to display in the title bar.
   *
   * @param {boolean} [options.closeFolders=false]
   * Pass `true` to close all folders in this GUI by default.
   *
   * @param {boolean} [options.injectStyles=true]
   * Injects the default stylesheet into the page if this is the first GUI.
   * Pass `false` to use your own stylesheet.
   *
   * @param {number} [options.touchStyles=true]
   * Makes controllers larger on touch devices. Pass `false` to disable touch styles.
   *
   * @param {GUI} [options.parent]
   * Adds this GUI as a child in another GUI. Usually this is done for you by `addFolder()`.
   */
  constructor({
    parent: t,
    autoPlace: e = t === void 0,
    container: i,
    width: s,
    title: n = "Controls",
    closeFolders: a = !1,
    injectStyles: h = !0,
    touchStyles: c = !0
  } = {}) {
    if (this.parent = t, this.root = t ? t.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("lil-title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("lil-children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(n), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("lil-root"), c && this.domElement.classList.add("lil-allow-touch-styles"), !L && h && (G(P), L = !0), i ? i.appendChild(this.domElement) : e && (this.domElement.classList.add("lil-auto-place", "autoPlace"), document.body.appendChild(this.domElement)), s && this.domElement.style.setProperty("--width", s + "px"), this._closeFolders = a;
  }
  /**
   * Adds a controller to the GUI, inferring controller type using the `typeof` operator.
   * @example
   * gui.add( object, 'property' );
   * gui.add( object, 'number', 0, 100, 1 );
   * gui.add( object, 'options', [ 1, 2, 3 ] );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number|object|Array} [$1] Minimum value for number controllers, or the set of
   * selectable values for a dropdown.
   * @param {number} [max] Maximum value for number controllers.
   * @param {number} [step] Step value for number controllers.
   * @returns {Controller}
   */
  add(t, e, i, s, n) {
    if (Object(i) === i)
      return new U(this, t, e, i);
    const a = t[e];
    switch (typeof a) {
      case "number":
        return new H(this, t, e, i, s, n);
      case "boolean":
        return new O(this, t, e);
      case "string":
        return new z(this, t, e);
      case "function":
        return new _(this, t, e);
    }
    console.error(`gui.add failed
	property:`, e, `
	object:`, t, `
	value:`, a);
  }
  /**
   * Adds a color controller to the GUI.
   * @example
   * params = {
   * 	cssColor: '#ff00ff',
   * 	rgbColor: { r: 0, g: 0.2, b: 0.4 },
   * 	customRange: [ 0, 127, 255 ],
   * };
   *
   * gui.addColor( params, 'cssColor' );
   * gui.addColor( params, 'rgbColor' );
   * gui.addColor( params, 'customRange', 255 );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number} rgbScale Maximum value for a color channel when using an RGB color. You may
   * need to set this to 255 if your colors are too bright.
   * @returns {Controller}
   */
  addColor(t, e, i = 1) {
    return new M(this, t, e, i);
  }
  /**
   * Adds a folder to the GUI, which is just another GUI. This method returns
   * the nested GUI so you can add controllers to it.
   * @example
   * const folder = gui.addFolder( 'Position' );
   * folder.add( position, 'x' );
   * folder.add( position, 'y' );
   * folder.add( position, 'z' );
   *
   * @param {string} title Name to display in the folder's title bar.
   * @returns {GUI}
   */
  addFolder(t) {
    const e = new E({ parent: this, title: t });
    return this.root._closeFolders && e.close(), e;
  }
  /**
   * Recalls values that were saved with `gui.save()`.
   * @param {object} obj
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  load(t, e = !0) {
    return t.controllers && this.controllers.forEach((i) => {
      i instanceof _ || i._name in t.controllers && i.load(t.controllers[i._name]);
    }), e && t.folders && this.folders.forEach((i) => {
      i._title in t.folders && i.load(t.folders[i._title]);
    }), this;
  }
  /**
   * Returns an object mapping controller names to values. The object can be passed to `gui.load()` to
   * recall these values.
   * @example
   * {
   * 	controllers: {
   * 		prop1: 1,
   * 		prop2: 'value',
   * 		...
   * 	},
   * 	folders: {
   * 		folderName1: { controllers, folders },
   * 		folderName2: { controllers, folders }
   * 		...
   * 	}
   * }
   *
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {object}
   */
  save(t = !0) {
    const e = {
      controllers: {},
      folders: {}
    };
    return this.controllers.forEach((i) => {
      if (!(i instanceof _)) {
        if (i._name in e.controllers)
          throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);
        e.controllers[i._name] = i.save();
      }
    }), t && this.folders.forEach((i) => {
      if (i._title in e.folders)
        throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);
      e.folders[i._title] = i.save();
    }), e;
  }
  /**
   * Opens a GUI or folder. GUI and folders are open by default.
   * @param {boolean} open Pass false to close.
   * @returns {this}
   * @example
   * gui.open(); // open
   * gui.open( false ); // close
   * gui.open( gui._closed ); // toggle
   */
  open(t = !0) {
    return this._setClosed(!t), this.$title.setAttribute("aria-expanded", !this._closed), this.domElement.classList.toggle("lil-closed", this._closed), this;
  }
  /**
   * Closes the GUI.
   * @returns {this}
   */
  close() {
    return this.open(!1);
  }
  _setClosed(t) {
    this._closed !== t && (this._closed = t, this._callOnOpenClose(this));
  }
  /**
   * Shows the GUI after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * gui.show();
   * gui.show( false ); // hide
   * gui.show( gui._hidden ); // toggle
   */
  show(t = !0) {
    return this._hidden = !t, this.domElement.style.display = this._hidden ? "none" : "", this;
  }
  /**
   * Hides the GUI.
   * @returns {this}
   */
  hide() {
    return this.show(!1);
  }
  openAnimated(t = !0) {
    return this._setClosed(!t), this.$title.setAttribute("aria-expanded", !this._closed), requestAnimationFrame(() => {
      const e = this.$children.clientHeight;
      this.$children.style.height = e + "px", this.domElement.classList.add("lil-transition");
      const i = (n) => {
        n.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("lil-transition"), this.$children.removeEventListener("transitionend", i));
      };
      this.$children.addEventListener("transitionend", i);
      const s = t ? this.$children.scrollHeight : 0;
      this.domElement.classList.toggle("lil-closed", !t), requestAnimationFrame(() => {
        this.$children.style.height = s + "px";
      });
    }), this;
  }
  /**
   * Change the title of this GUI.
   * @param {string} title
   * @returns {this}
   */
  title(t) {
    return this._title = t, this.$title.textContent = t, this;
  }
  /**
   * Resets all controllers to their initial values.
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  reset(t = !0) {
    return (t ? this.controllersRecursive() : this.controllers).forEach((i) => i.reset()), this;
  }
  /**
   * Pass a function to be called whenever a controller in this GUI changes.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onChange(t) {
    return this._onChange = t, this;
  }
  _callOnChange(t) {
    this.parent && this.parent._callOnChange(t), this._onChange !== void 0 && this._onChange.call(this, {
      object: t.object,
      property: t.property,
      value: t.getValue(),
      controller: t
    });
  }
  /**
   * Pass a function to be called whenever a controller in this GUI has finished changing.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onFinishChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onFinishChange(t) {
    return this._onFinishChange = t, this;
  }
  _callOnFinishChange(t) {
    this.parent && this.parent._callOnFinishChange(t), this._onFinishChange !== void 0 && this._onFinishChange.call(this, {
      object: t.object,
      property: t.property,
      value: t.getValue(),
      controller: t
    });
  }
  /**
   * Pass a function to be called when this GUI or its descendants are opened or closed.
   * @param {function(GUI)} callback
   * @returns {this}
   * @example
   * gui.onOpenClose( changedGUI => {
   * 	console.log( changedGUI._closed );
   * } );
   */
  onOpenClose(t) {
    return this._onOpenClose = t, this;
  }
  _callOnOpenClose(t) {
    this.parent && this.parent._callOnOpenClose(t), this._onOpenClose !== void 0 && this._onOpenClose.call(this, t);
  }
  /**
   * Destroys all DOM elements and event listeners associated with this GUI.
   */
  destroy() {
    this.parent && (this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.folders.splice(this.parent.folders.indexOf(this), 1)), this.domElement.parentElement && this.domElement.parentElement.removeChild(this.domElement), Array.from(this.children).forEach((t) => t.destroy());
  }
  /**
   * Returns an array of controllers contained by this GUI and its descendents.
   * @returns {Controller[]}
   */
  controllersRecursive() {
    let t = Array.from(this.controllers);
    return this.folders.forEach((e) => {
      t = t.concat(e.controllersRecursive());
    }), t;
  }
  /**
   * Returns an array of folders contained by this GUI and its descendents.
   * @returns {GUI[]}
   */
  foldersRecursive() {
    let t = Array.from(this.folders);
    return this.folders.forEach((e) => {
      t = t.concat(e.foldersRecursive());
    }), t;
  }
}
class j {
  constructor(t, e, i, s = {}) {
    this.scene = t, this.renderer = e, this.globeGroup = i, this.handlers = s, this.gui = new E(), this.gui.title("Globe Settings"), this.settings = {
      // Appearance & Colors
      highlightColor: "#ffffff",
      defaultColor: "#000000",
      outlineColor: "#ffffff",
      outlineOpacity: 1,
      baseSphereColor: "#00050a",
      baseSphereOpacity: 1,
      globalOpacity: 1,
      gridColor: "#ffffff",
      backgroundColor: "#0a0a0f",
      transparentBackground: !1,
      haloColor: "#4040ff",
      ambientColor: "#101020",
      dirLightColor: "#ffffff",
      rimLightColor: "#4444ff",
      ambientEnabled: !0,
      dirLightEnabled: !0,
      rimLightEnabled: !0,
      fillLightEnabled: !0,
      fillLightSkyColor: "#000000",
      fillLightGroundColor: "#111133",
      // Lighting Intensities
      ambientIntensity: 0.5,
      dirLightIntensity: 1.2,
      rimLightIntensity: 2,
      fillLightIntensity: 0.5,
      // Atmosphere
      showHalo: !0,
      haloIntensity: 0.7,
      haloPower: 15,
      // Grid
      showGrid: !0,
      gridOpacity: 0.35,
      gridSpacing: 20,
      gridRadius: 1.001,
      gridSegmentSize: 1,
      // Data
      geoJsonResolution: "110m",
      progressiveLoading: !0,
      batchSize: 20,
      // Performance
      qualityPreset: "high",
      rendererPixelRatioMax: 2,
      sphereSegments: 128,
      countryFillDetail: 1,
      outlineDetail: 1,
      // Layout
      globeScale: 1,
      showCameraOutline: !1,
      cameraOutlineColor: "#ffffff",
      cameraOutlineWidth: 0.02,
      cameraOutlineRadiusFactor: 1,
      // Interaction
      autoRotate: !1,
      autoRotateSpeed: 1,
      inertia: !0,
      inertiaFriction: 0.95,
      lockRotationX: !1,
      // Selection
      countrySearch: "",
      selectedCodes: ["DEU", "FRA", "ESP"],
      clearAllSelected: () => this.clearAllSelected(),
      exportConfig: () => this.exportConfig(),
      importConfig: () => this.importConfig()
    }, this.countryList = [], this.configImportInput = this.createConfigImportInput(), this.setupGUI();
  }
  setupGUI() {
    const t = this.gui.addFolder("Countries");
    t.addColor(this.settings, "highlightColor").name("Visited Color").onChange(() => this.reloadCountries()), t.addColor(this.settings, "defaultColor").name("Base Country Color").onChange(() => this.reloadCountries()), t.addColor(this.settings, "outlineColor").name("Outline Color").onChange(() => this.reloadCountries()), t.add(this.settings, "outlineOpacity", 0, 1, 0.05).name("Outline Opacity").onChange(() => this.reloadCountries());
    const e = this.gui.addFolder("Scene");
    e.addColor(this.settings, "baseSphereColor").name("Sphere Color").onChange(() => this.updateSceneVisuals()), e.add(this.settings, "baseSphereOpacity", 0, 1, 0.05).name("Sphere Opacity").onChange(() => this.updateSceneVisuals()), e.add(this.settings, "globalOpacity", 0, 1, 0.05).name("Global Opacity").onChange(() => this.updateSceneVisuals()), e.addColor(this.settings, "backgroundColor").name("Background").onChange(() => this.updateSceneVisuals()), e.add(this.settings, "transparentBackground").name("Transparent BG").onChange(() => this.updateSceneVisuals());
    const i = this.gui.addFolder("Grid");
    i.add(this.settings, "showGrid").name("Show Grid").onChange(() => this.reloadGrid()), i.addColor(this.settings, "gridColor").name("Grid Color").onChange(() => this.reloadGrid()), i.add(this.settings, "gridOpacity", 0, 1, 0.05).name("Grid Opacity").onChange(() => this.reloadGrid()), i.add(this.settings, "gridSpacing", 5, 45, 5).name("Spacing").onChange(() => this.reloadGrid()), i.add(this.settings, "gridRadius", 1, 1.02, 1e-3).name("Height").onChange(() => this.reloadGrid()), i.add(this.settings, "gridSegmentSize", 1, 10, 1).name("Segment Size").onChange(() => this.reloadGrid());
    const s = this.gui.addFolder("Atmosphere");
    s.addColor(this.settings, "haloColor").name("Color").onChange(() => this.updateEffects()), s.add(this.settings, "showHalo").name("Visible").onChange(() => this.updateEffects()), s.add(this.settings, "haloIntensity", 0, 1).name("Glow").onChange(() => this.updateEffects()), s.add(this.settings, "haloPower", 1, 50).name("Falloff").onChange(() => this.updateEffects());
    const n = this.gui.addFolder("Lights");
    n.addColor(this.settings, "ambientColor").name("Ambient Color").onChange(() => this.updateLighting()), n.add(this.settings, "ambientIntensity", 0, 2).name("Ambient Intensity").onChange(() => this.updateLighting()), n.add(this.settings, "ambientEnabled").name("Ambient On").onChange(() => this.updateLighting()), n.addColor(this.settings, "dirLightColor").name("Main Color").onChange(() => this.updateLighting()), n.add(this.settings, "dirLightIntensity", 0, 5).name("Main Intensity").onChange(() => this.updateLighting()), n.add(this.settings, "dirLightEnabled").name("Main On").onChange(() => this.updateLighting()), n.addColor(this.settings, "rimLightColor").name("Rim Color").onChange(() => this.updateLighting()), n.add(this.settings, "rimLightIntensity", 0, 10).name("Rim Intensity").onChange(() => this.updateLighting()), n.add(this.settings, "rimLightEnabled").name("Rim On").onChange(() => this.updateLighting()), n.addColor(this.settings, "fillLightSkyColor").name("Fill Sky Color").onChange(() => this.updateLighting()), n.addColor(this.settings, "fillLightGroundColor").name("Fill Ground Color").onChange(() => this.updateLighting()), n.add(this.settings, "fillLightIntensity", 0, 3).name("Fill Intensity").onChange(() => this.updateLighting()), n.add(this.settings, "fillLightEnabled").name("Fill On").onChange(() => this.updateLighting()), this.selectionFolder = this.gui.addFolder("Country Selection"), this.countrySearchController = this.selectionFolder.add(this.settings, "countrySearch").name("Search").onChange((u) => this.updateSearchSuggestions(u)), this.suggestionsFolder = this.selectionFolder.addFolder("Suggestions"), this.selectedListFolder = this.selectionFolder.addFolder("Selected List"), this.selectionFolder.add(this.settings, "clearAllSelected").name("Clear All"), this.refreshSelectedListUI();
    const a = this.gui.addFolder("Data");
    a.add(this.settings, "progressiveLoading").name("Progressive").onChange(() => this.reloadCountries()), a.add(this.settings, "batchSize", 5, 100, 5).name("Batch Size").onChange(() => this.reloadCountries());
    const h = this.gui.addFolder("Performance");
    h.add(this.settings, "qualityPreset", ["low", "medium", "high"]).name("Quality Preset").onChange(() => this.updatePerformance()), h.add(this.settings, "rendererPixelRatioMax", 0.5, 3, 0.1).name("Pixel Ratio Max").onChange(() => this.updatePerformance()), h.add(this.settings, "sphereSegments", 16, 256, 16).name("Sphere Segments").onChange(() => this.updatePerformance()), h.add(this.settings, "countryFillDetail", 0.5, 3, 0.1).name("Fill Detail").onChange(() => this.updatePerformance()), h.add(this.settings, "outlineDetail", 0.5, 3, 0.1).name("Outline Detail").onChange(() => this.updatePerformance());
    const c = this.gui.addFolder("Layout");
    c.add(this.settings, "globeScale", 0.25, 4, 0.01).name("Globe Scale").onChange(() => this.updateSceneVisuals()), c.add(this.settings, "showCameraOutline").name("Screen Ring").onChange(() => this.updateSceneVisuals()), c.addColor(this.settings, "cameraOutlineColor").name("Screen Ring Color").onChange(() => this.updateSceneVisuals()), c.add(this.settings, "cameraOutlineWidth", 1e-3, 0.2, 1e-3).name("Screen Ring Width").onChange(() => this.updateSceneVisuals()), c.add(this.settings, "cameraOutlineRadiusFactor", 0.5, 2, 0.01).name("Screen Ring Size").onChange(() => this.updateSceneVisuals());
    const g = this.gui.addFolder("Interaction");
    g.add(this.settings, "autoRotate").name("Auto Rotate").onChange(() => this.updateRotation()), g.add(this.settings, "autoRotateSpeed", 0, 5, 0.1).name("Speed").onChange(() => this.updateRotation()), g.add(this.settings, "inertia").name("Inertia").onChange(() => this.updateRotation()), g.add(this.settings, "inertiaFriction", 0.8, 0.999, 1e-3).name("Friction").onChange(() => this.updateRotation()), g.add(this.settings, "lockRotationX").name("Lock X Axis").onChange(() => this.updateRotation());
    const p = this.gui.addFolder("Config");
    p.add(this.settings, "exportConfig").name("Export JSON"), p.add(this.settings, "importConfig").name("Import JSON");
  }
  updateRotation() {
    this.handlers.onUpdateRotationSettings && this.handlers.onUpdateRotationSettings(this.settings);
  }
  updatePerformance() {
    this.handlers.onUpdatePerformance && this.handlers.onUpdatePerformance(this.settings);
  }
  updateSceneVisuals() {
    this.handlers.onUpdateSceneVisuals && this.handlers.onUpdateSceneVisuals(this.settings);
  }
  applySettings(t) {
    const e = A(t), i = [...e.highlightCodes];
    Object.assign(this.settings, {
      highlightColor: e.highlightColor,
      defaultColor: e.defaultColor,
      outlineColor: e.outlineColor,
      outlineOpacity: e.outlineOpacity,
      baseSphereColor: e.baseSphereColor,
      baseSphereOpacity: e.baseSphereOpacity,
      globalOpacity: e.globalOpacity,
      gridColor: e.gridColor,
      backgroundColor: e.backgroundColor,
      transparentBackground: e.transparentBackground,
      haloColor: e.haloColor,
      ambientColor: e.ambientColor,
      dirLightColor: e.dirLightColor,
      rimLightColor: e.rimLightColor,
      ambientEnabled: e.ambientEnabled,
      dirLightEnabled: e.dirLightEnabled,
      rimLightEnabled: e.rimLightEnabled,
      fillLightEnabled: e.fillLightEnabled,
      fillLightSkyColor: e.fillLightSkyColor,
      fillLightGroundColor: e.fillLightGroundColor,
      ambientIntensity: e.ambientIntensity,
      dirLightIntensity: e.dirLightIntensity,
      rimLightIntensity: e.rimLightIntensity,
      fillLightIntensity: e.fillLightIntensity,
      showHalo: e.showHalo,
      haloIntensity: e.haloIntensity,
      haloPower: e.haloPower,
      showGrid: e.showGrid,
      gridOpacity: e.gridOpacity,
      gridSpacing: e.gridSpacing,
      gridRadius: e.gridRadius,
      gridSegmentSize: e.gridSegmentSize,
      geoJsonResolution: e.geoJsonResolution,
      progressiveLoading: e.progressiveLoading,
      batchSize: e.batchSize,
      qualityPreset: e.qualityPreset,
      rendererPixelRatioMax: e.rendererPixelRatioMax,
      sphereSegments: e.sphereSegments,
      countryFillDetail: e.countryFillDetail,
      outlineDetail: e.outlineDetail,
      globeScale: e.globeScale,
      showCameraOutline: e.showCameraOutline,
      cameraOutlineColor: e.cameraOutlineColor,
      cameraOutlineWidth: e.cameraOutlineWidth,
      cameraOutlineRadiusFactor: e.cameraOutlineRadiusFactor,
      autoRotate: e.autoRotate,
      autoRotateSpeed: e.autoRotateSpeed,
      inertia: e.inertia,
      inertiaFriction: e.inertiaFriction,
      lockRotationX: e.lockRotationX,
      selectedCodes: i
    }), this.gui.controllersRecursive().forEach((s) => s.updateDisplay()), this.refreshSelectedListUI(), this.updateSearchSuggestions(this.settings.countrySearch);
  }
  setGeojsonData(t) {
    this.geojsonData = t, this.countryList = t.features.map((e) => ({
      name: e.properties.NAME,
      code: e.properties.ADM0_A3 || e.properties.ISO_A3 || e.properties.SOV_A3
    })).sort((e, i) => e.name.localeCompare(i.name)), this.countryList = this.countryList.filter((e, i, s) => s.findIndex((n) => n.code === e.code) === i), this.updateSearchSuggestions(this.settings.countrySearch), this.refreshSelectedListUI();
  }
  updateSearchSuggestions(t) {
    if (!this.suggestionsFolder) return;
    if ([...this.suggestionsFolder.controllers].forEach((s) => s.destroy()), !t || t.length < 2) {
      this.suggestionsFolder.close();
      return;
    }
    const i = this.countryList.filter(
      (s) => s.name.toLowerCase().includes(t.toLowerCase()) || s.code.toLowerCase().includes(t.toLowerCase())
    ).slice(0, 10);
    i.forEach((s) => {
      const n = {};
      n[`Add ${s.name}`] = () => {
        this.addCountry(s.code), this.settings.countrySearch = "", this.countrySearchController && this.countrySearchController.updateDisplay(), this.updateSearchSuggestions("");
      }, this.suggestionsFolder.add(n, `Add ${s.name}`);
    }), i.length > 0 ? this.suggestionsFolder.open() : this.suggestionsFolder.close();
  }
  addCountry(t) {
    this.settings.selectedCodes.includes(t) || (this.settings.selectedCodes.push(t), this.notifySelectionChange(), this.refreshSelectedListUI());
  }
  removeCountry(t) {
    const e = this.settings.selectedCodes.indexOf(t);
    e > -1 && (this.settings.selectedCodes.splice(e, 1), this.notifySelectionChange(), this.refreshSelectedListUI());
  }
  clearAllSelected() {
    this.settings.selectedCodes = [], this.notifySelectionChange(), this.refreshSelectedListUI();
  }
  updateLighting() {
    this.handlers.onUpdateLighting && this.handlers.onUpdateLighting(this.settings);
  }
  updateEffects() {
    this.handlers.onUpdateEffects && this.handlers.onUpdateEffects(this.settings);
  }
  notifySelectionChange() {
    this.handlers.onUpdateSelectedCountries && this.handlers.onUpdateSelectedCountries({
      selectedCountries: this.settings.selectedCodes
    });
  }
  refreshSelectedListUI() {
    if (!this.selectedListFolder) return;
    [...this.selectedListFolder.controllers].forEach((i) => i.destroy()), [...this.selectedListFolder.folders].forEach((i) => i.destroy()), this.settings.selectedCodes.forEach((i) => {
      const s = this.countryList.find((h) => h.code === i), n = s ? s.name : i, a = {};
      a[`Remove ${n}`] = () => this.removeCountry(i), this.selectedListFolder.add(a, `Remove ${n}`);
    }), this.settings.selectedCodes.length > 0 && this.selectedListFolder.open();
  }
  reloadCountries() {
    this.handlers.onReloadCountries && this.handlers.onReloadCountries({
      resolution: this.settings.geoJsonResolution,
      progressiveLoading: this.settings.progressiveLoading,
      batchSize: this.settings.batchSize,
      highlightColor: this.settings.highlightColor,
      defaultColor: this.settings.defaultColor,
      outlineColor: this.settings.outlineColor,
      outlineOpacity: this.settings.outlineOpacity,
      selectedCountries: this.settings.selectedCodes
    });
  }
  reloadGrid() {
    this.handlers.onReloadGrid && this.handlers.onReloadGrid({
      showGrid: this.settings.showGrid,
      gridColor: this.settings.gridColor,
      gridSpacing: this.settings.gridSpacing,
      gridRadius: this.settings.gridRadius,
      gridSegmentSize: this.settings.gridSegmentSize,
      gridOpacity: this.settings.gridOpacity
    });
  }
  exportConfig() {
    const t = this.handlers.onRequestRuntimeState ? this.handlers.onRequestRuntimeState() : { rotationX: 0, rotationY: 0 }, e = F({
      ...this.settings,
      ...t,
      highlightCodes: [...this.settings.selectedCodes]
    }), i = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), s = URL.createObjectURL(i), n = document.createElement("a");
    n.href = s, n.download = "globe-config.json", document.body.appendChild(n), n.click(), document.body.removeChild(n), URL.revokeObjectURL(s);
  }
  importConfig() {
    this.configImportInput.value = "", this.configImportInput.click();
  }
  createConfigImportInput() {
    const t = document.createElement("input");
    return t.type = "file", t.accept = "application/json,.json", t.style.display = "none", t.addEventListener("change", async (e) => {
      const i = e.target.files && e.target.files[0];
      if (i)
        try {
          const s = await i.text(), n = JSON.parse(s);
          this.handlers.onImportConfig && this.handlers.onImportConfig(n);
        } catch (s) {
          console.error("Failed to import config:", s);
        }
    }), document.body.appendChild(t), t;
  }
  destroy() {
    this.gui.destroy(), this.configImportInput && this.configImportInput.parentNode && this.configImportInput.parentNode.removeChild(this.configImportInput);
  }
  getSettings() {
    return this.settings;
  }
}
export {
  j as DebugControls
};
