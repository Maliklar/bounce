var Component = /** @class */ (function () {
    function Component(tag, container) {
        this.force = { x: 0, y: 0 };
        this.speed = { x: 0, y: 0 };
        this.element = document.createElement(tag);
        if (!container)
            this.container = new Container();
        else
            this.container = container;
        this.container.element.appendChild(this.element);
        this.element.style.position = "absolute";
        this.element.style.left = "500px";
        this.element.style.top = "10px";
        this.force.y = -this.container.gravity;
        this.loop();
    }
    Component.prototype.loop = function () {
        var _this = this;
        setInterval(function () {
            _this.position = _this.element.getBoundingClientRect();
            _this.speed.y += 0.01;
            if (_this.position.bottom > _this.container.position.bottom) {
                _this.speed.y = _this.speed.y / 1.1;
                _this.speed.y = -_this.speed.y;
                _this.element.style.top = "".concat(_this.position.y + _this.speed.y, "px");
                return;
            }
            console.log(_this.speed.y);
            // if (this)
            // if (this.position.left >= this.container.position.left) return;
            // if (this.position.right >= this.container.position.right) return;
            // if (this.position.top >= this.container.position.top) return;
            _this.element.style.top = "".concat(_this.position.y + _this.speed.y, "px");
            _this.element.style.left = "".concat(_this.position.x + _this.speed.x, "px");
        });
    };
    return Component;
}());
var CurrentMouse = /** @class */ (function () {
    function CurrentMouse() {
        this.down = false;
        this.downPos = { x: 0, y: 0 };
        this.x = 0;
        this.y = 0;
    }
    return CurrentMouse;
}());
var Container = /** @class */ (function () {
    function Container(tag) {
        this.mouse = new CurrentMouse();
        this.gravity = 3;
        if (!tag)
            this.element = document.body;
        else
            this.element = document.createElement(tag);
        this.position = this.element.getBoundingClientRect();
        this.startEvents();
    }
    Container.prototype.startEvents = function () {
        var _this = this;
        this.element.onmousemove = function (e) {
            _this.mouse.x = e.clientX;
            _this.mouse.y = e.clientY;
        };
        this.element.onmousedown = function (e) {
            _this.mouse.down = true;
        };
        this.element.onmouseup = function (e) {
            _this.mouse.down = false;
            _this.mouse.downPos.x = e.clientX;
            _this.mouse.downPos.y = e.clientY;
        };
    };
    return Container;
}());
var component = new Component("div");
