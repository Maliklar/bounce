var gravityButton = document.getElementById("gravity-button");
gravityButton === null || gravityButton === void 0 ? void 0 : gravityButton.onclick = function () {
    var script = document.createElement("script");
    script.src = "./gravity-location.js";
    document.body.appendChild(script);
};
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
            var sX = _this.element.getAttribute("speedX") || 0;
            var sY = _this.element.getAttribute("speedY") || 0;
            if (sY)
                _this.speed.y += +sY;
            if (sX)
                _this.speed.x += +sX;
            if (cPoints.bottom)
                _this.speed.y = -(_this.speed.y / _this.bounce);
            if (cPoints.top)
                _this.speed.y = -(_this.speed.y / _this.bounce);
            if (cPoints.left)
                _this.speed.x = -(_this.speed.x / _this.bounce);
            if (cPoints.right)
                _this.speed.x = -(_this.speed.x / _this.bounce);
            _this.element.style.top = "".concat(_this.position.y + _this.speed.y, "px");
            _this.element.style.left = "".concat(_this.position.x + _this.speed.x, "px");
            _this.element.removeAttribute("speedX");
            _this.element.removeAttribute("speedY");
        });
    };
    Component.prototype.collision = function () {
        var cPoints = { left: false, right: false, bottom: false, top: false };
        var bottom = this.position.bottom + 1;
        for (var i = this.position.left; i < this.position.right; i++) {
            var component = document.elementFromPoint(i, bottom);
            if (component && component.getAttribute("component")) {
                var rec = component.getBoundingClientRect();
                if (this.position.bottom + this.speed.y >= rec.top) {
                    component.setAttribute("speedY", (this.speed.y / 2).toString());
                    cPoints.bottom = true;
                    break;
                }
            }
        }
        var top = this.position.top - 1;
        for (var i = this.position.left; i < this.position.right; i++) {
            var component = document.elementFromPoint(i, top);
            if (component && component.getAttribute("component")) {
                var rec = component.getBoundingClientRect();
                if (this.position.top + this.speed.y <= rec.bottom) {
                    component.setAttribute("speedY", (this.speed.y / 2).toString());
                    cPoints.top = true;
                    break;
                }
            }
        }
        var left = this.position.left - 1;
        for (var i = this.position.top; i < this.position.bottom; i++) {
            var component = document.elementFromPoint(left, i);
            if (component && component.getAttribute("component")) {
                var rec = component.getBoundingClientRect();
                if (this.position.left + this.speed.x <= rec.right) {
                    component.setAttribute("speedX", (this.speed.x / 2).toString());
                    cPoints.left = true;
                    break;
                }
            }
        }
        var right = this.position.right + 1;
        for (var i = this.position.top; i < this.position.bottom; i++) {
            var component = document.elementFromPoint(right, i);
            if (component && component.getAttribute("component")) {
                var rec = component.getBoundingClientRect();
                if (this.position.right + this.speed.x >= rec.left) {
                    component.setAttribute("speedX", (this.speed.x / 2).toString());
                    cPoints.right = true;
                    break;
                }
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
        this.mouseElementDiff = { x: 0, y: 0 };
        this.mQueue = [];
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
            _this.mQueue.push({ mouseX: _this.mouse.x, mouseY: _this.mouse.y });
            if (!_this.mouseElement || !_this.mouse.down)
                return;
            _this.mouseElement.style.left = "".concat(_this.mouse.x - _this.mouseElementDiff.x, "px");
            _this.mouseElement.style.top = "".concat(_this.mouse.y - _this.mouseElementDiff.y, "px");
        };
        this.element.onmousedown = function (e) {
            _this.mouse.down = true;
            _this.mouseElement = null;
            _this.mQueue = [];
            var component = document.elementFromPoint(e.clientX, e.clientY);
            if (component && component.getAttribute("component")) {
                var rec = component.getBoundingClientRect();
                _this.mouseElementDiff.x = e.clientX - rec.x;
                _this.mouseElementDiff.y = e.clientY - rec.y;
                _this.mouseElement = component;
            }
        };
        this.element.onmouseup = function (e) {
            _this.mouse.downPos.x = e.clientX;
            _this.mouse.downPos.y = e.clientY;
            _this.mouse.down = false;
            if (!_this.mouseElement)
                return;
            var ySum = 0;
            var xSum = 0;
            for (var i = Math.round(_this.mQueue.length / 2); i < _this.mQueue.length; i++) {
                ySum += _this.mQueue[i].mouseY - _this.mQueue[i - 1].mouseY;
                xSum += _this.mQueue[i].mouseX - _this.mQueue[i - 1].mouseX;
            }
            var yAvg = ySum / _this.mQueue.length;
            var xAvg = xSum / _this.mQueue.length;
            _this.mouseElement.setAttribute("speedX", xAvg.toString());
            _this.mouseElement.setAttribute("speedY", yAvg.toString());
            _this.mQueue = [];
        };
    };
    return Container;
}());
var container = new Container();
// const component = new Component("div", container);
// const component2 = new Component("div", container);
// const component3 = new Component("div", container);
// component3.element.style.left = "1000px";
// component3.element.style.background = "blue";
// component2.element.style.left = "800px";
// component2.element.style.background = "red";
for (var i = 0; i < 3; i++) {
    var component = new Component("div", container);
    component.element.style.left = "".concat((i + 1) * 100, "px");
    component.element.style.background = "rgb(".concat(Math.random() * 255, ", ").concat(Math.random() * 255, ", ").concat(Math.random() * 255, ")");
}
