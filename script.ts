class Component {
  element: HTMLElement;
  container: Container;
  position: DOMRect;
  force = { x: 0, y: 0 };
  speed = { x: 0, y: 0 };
  bounce = 2;
  mouse = {
    diffX: 0,
    diffY: 0,
  };
  constructor(tag: string, container?: Container) {
    this.element = document.createElement(tag);
    if (!container) this.container = new Container();
    else this.container = container;
    this.container.element.appendChild(this.element);
    this.element.style.position = "absolute";
    this.element.style.left = "500px";
    this.element.style.top = "10px";
    this.element.setAttribute("component", "true");
    this.force.y = -this.container.gravity;

    this.loop();
  }

  loop() {
    setInterval(() => {
      this.position = this.element.getBoundingClientRect();

      this.speed.y += 0.01;

      const cPoints = this.collision();
      if (cPoints.bottom) this.speed.y = -(this.speed.y / this.bounce);
      if (cPoints.top) this.speed.y = -(this.speed.y / this.bounce);
      if (cPoints.left) this.speed.x = -(this.speed.x / this.bounce);
      if (cPoints.right) this.speed.x = -(this.speed.x / this.bounce);

      this.element.style.top = `${this.position.y + this.speed.y}px`;
      this.element.style.left = `${this.position.x + this.speed.x}px`;
    });
  }

  private collision() {
    const cPoints = { left: false, right: false, bottom: false, top: false };
    const bottom = this.position.bottom + 1;
    for (let i = this.position.left; i < this.position.right; i++) {
      const component = document.elementFromPoint(i, bottom);
      if (component && component.getAttribute("component")) {
        cPoints.bottom = true;
        break;
      }
    }

    const top = this.position.top - 1;
    for (let i = this.position.left; i < this.position.right; i++) {
      const component = document.elementFromPoint(i, top);
      if (component && component.getAttribute("component")) {
        cPoints.top = true;
        break;
      }
    }

    const left = this.position.left - 1;
    for (let i = this.position.top; i < this.position.bottom; i++) {
      const component = document.elementFromPoint(i, left);
      if (component && component.getAttribute("component")) {
        cPoints.left = true;
        break;
      }
    }

    const right = this.position.right + 1;
    for (let i = this.position.top; i < this.position.bottom; i++) {
      const component = document.elementFromPoint(i, right);
      if (component && component.getAttribute("component")) {
        cPoints.right = true;
        break;
      }
    }

    if (this.position.bottom + this.speed.y > this.container.position.bottom)
      cPoints.bottom = true;

    if (this.position.top + this.speed.y < this.container.position.top)
      cPoints.top = true;

    if (this.position.left + this.speed.x < this.container.position.left)
      cPoints.left = true;

    if (this.position.right + this.speed.x > this.container.position.right)
      cPoints.right = true;

    return cPoints;
  }
}

class CurrentMouse {
  down = false;
  downPos = { x: 0, y: 0 };
  x = 0;
  y = 0;
}
class Container {
  public element: HTMLElement;
  public mouse = new CurrentMouse();
  public gravity = 3;
  public position: DOMRect;
  public mouseElement: HTMLElement;
  public mouseElementDiff = { x: 0, y: 0 };

  constructor(tag?: string) {
    if (!tag) this.element = document.body;
    else this.element = document.createElement(tag);
    this.position = this.element.getBoundingClientRect();
    this.startEvents();
  }

  private startEvents() {
    this.element.onmousemove = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (!this.mouseElement || !this.mouse.down) return;
      this.mouseElement.style.left = `${
        this.mouse.x - this.mouseElementDiff.x
      }px`;
      this.mouseElement.style.top = `${
        this.mouse.y - this.mouseElementDiff.y
      }px`;
    };
    this.element.onmousedown = (e) => {
      this.mouse.down = true;
      const component = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement;
      if (component) {
        const rec = component.getBoundingClientRect();
        this.mouseElementDiff.x = e.clientX - rec.x;
        this.mouseElementDiff.y = e.clientY - rec.y;
        this.mouseElement = component;
      }
    };
    this.element.onmouseup = (e) => {
      this.mouse.down = false;
      this.mouse.downPos.x = e.clientX;
      this.mouse.downPos.y = e.clientY;
    };
  }
}

const container = new Container();
const component = new Component("div", container);
const component2 = new Component("div", container);
component2.element.style.top = "500px";
component2.element.style.background = "red";
