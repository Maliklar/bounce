var Component = /** @class */ (function () {
    function Component(tag, container) {
        this.force = { x: 0, y: 0 };
        this.speed = { x: 0, y: 0 };
        this.bounce = 2;
        this.mouse = {
            diffX: 0,
            diffY: 0,
        };
        this.element = document.createElement(tag);
        if (!container)
            this.container = new Container();
        else
            this.container = container;
        this.container.element.appendChild(this.element);
        this.element.style.position = "absolute";
        this.element.style.left = "500px";
        this.element.style.top = "10px";
        this.element.setAttribute("component", "true");
        this.force.y = -this.container.gravity;
        this.loop();
    }
    Component.prototype.loop = function () {
        var _this = this;
        setInterval(function () {
            _this.position = _this.element.getBoundingClientRect();
            _this.speed.y += 0.01;
            var cPoints = _this.collision();
            if (cPoints.bottom)
                _this.speed.y = -(_this.speed.y / _this.bounce);
            if (cPoints.top)
                _this.speed.y = -(_this.speed.y / _this.bounce);
            if (cPoints.left)
                _this.speed.x = -(_this.speed.x / _this.bounce);
            if (cPoints.right)
                _this.speed.x = -(_this.speed.x / _this.bounce);
            // if (this)
            // if (this.position.left >= this.container.position.left) return;
            // if (this.position.right >= this.container.position.right) return;
            // if (this.position.top >= this.container.position.top) return;
            _this.element.style.top = "".concat(_this.position.y + _this.speed.y, "px");
            _this.element.style.left = "".concat(_this.position.x + _this.speed.x, "px");
        });
    };
    Component.prototype.collision = function () {
        var cPoints = { left: false, right: false, bottom: false, top: false };
        var bottom = this.position.bottom + 1;
        for (var i = this.position.left; i < this.position.right; i++) {
            var component_1 = document.elementFromPoint(i, bottom);
            if (component_1 && component_1.getAttribute("component")) {
                cPoints.bottom = true;
                break;
            }
        }
        var top = this.position.top - 1;
        for (var i = this.position.left; i < this.position.right; i++) {
            var component_2 = document.elementFromPoint(i, top);
            if (component_2 && component_2.getAttribute("component")) {
                cPoints.top = true;
                break;
            }
        }
        var left = this.position.left - 1;
        for (var i = this.position.top; i < this.position.bottom; i++) {
            var component_3 = document.elementFromPoint(i, left);
            if (component_3 && component_3.getAttribute("component")) {
                cPoints.left = true;
                break;
            }
        }
        var right = this.position.right + 1;
        for (var i = this.position.top; i < this.position.bottom; i++) {
            var component_4 = document.elementFromPoint(i, right);
            if (component_4 && component_4.getAttribute("component")) {
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
var container = new Container();
var component = new Component("div", container);
var component2 = new Component("div", container);
component2.element.style.top = "500px";
component2.element.style.background = "red";
