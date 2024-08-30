class Component {
  element: HTMLElement;
  container: Container;
  position: DOMRect;
  force = { x: 0, y: 0 };
  speed = { x: 0, y: 0 };
  constructor(tag: string, container?: Container) {
    this.element = document.createElement(tag);
    if (!container) this.container = new Container();
    else this.container = container;
    this.container.element.appendChild(this.element);
    this.element.style.position = "absolute";
    this.element.style.left = "500px";
    this.element.style.top = "10px";
    this.force.y = -this.container.gravity;

    this.loop();
  }

  loop() {
    setInterval(() => {
      this.position = this.element.getBoundingClientRect();

      this.speed.y += 0.01;
      if (this.position.bottom > this.container.position.bottom) {
        this.speed.y = this.speed.y / 1.1;
        this.speed.y = -this.speed.y;
        this.element.style.top = `${this.position.y + this.speed.y}px`;

        return;
      }
      console.log(this.speed.y);
      // if (this)
      // if (this.position.left >= this.container.position.left) return;
      // if (this.position.right >= this.container.position.right) return;
      // if (this.position.top >= this.container.position.top) return;

      this.element.style.top = `${this.position.y + this.speed.y}px`;
      this.element.style.left = `${this.position.x + this.speed.x}px`;
    });
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
    };
    this.element.onmousedown = (e) => {
      this.mouse.down = true;
    };
    this.element.onmouseup = (e) => {
      this.mouse.down = false;
      this.mouse.downPos.x = e.clientX;
      this.mouse.downPos.y = e.clientY;
    };
  }
}

const component = new Component("div");
