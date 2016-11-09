var H5animation = {};
//获取鼠标相对DOM元素的偏移量
H5animation.CaptureMouse = function (el) {
    var mouse = {x: 0, y: 0};
    el.addEventListener("mousemove", function(e){
        var x, y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= el.offsetLeft;
        y -= el.offsetTop;
        mouse.x = x;
        mouse.y = y;
    }, false);
    return mouse;
}
//获取手指相对DOM元素的偏移量
H5animation.CaptureTouch = function (el) {
    var touch = {x: null, y: null, isPressed: false};
    el.addEventListener("touchstart", function (e) {
        touch.isPressed = true;
        GetOffset(e);
    }, false);
    el.addEventListener("touchend", function (e) {
        touch.isPressed = false;
        touch.x = null;
        touch.y = null;
    }, false);
    el.addEventListener("touchmove", GetOffset, false);
    function GetOffset(e){
        var x, y;
        var touch_event = e.targetTouches[0];

        if (touch_event.pageX || touch_event.pageY) {
            x = touch_event.pageX;
            y = touch_event.pageY;
        } else {
            x = touch_event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = touch_event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= el.offsetLeft;
        y -= el.offsetTop;
        touch.x = x;
        touch.y = y;
    }
    return touch;
}
//两点间距离公式
H5animation.GetDistance = function (x1, y1, x2, y2){
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dist = Math.sqrt(dx * dx + dy * dy);
    return dist;
}
//
H5animation.ContainsPoint = function (rect, x, y) {
    return !(x < rect.x || x > rect.x + rect.width || y < rect.y || y > rect.y + rect.height);
}
//角度转弧度
function DegreeToRadian(degree){
    return degree * Math.PI / 180;
}
//弧度转角度
function RadianToDegree(radian){
    return radian * 180 / Math.PI;
}
/*以上H5animation为独立模块*/




//monthSelect
var monthSelect = function (opts) {
    var me = this;
    this.devicePixelRatio = window.devicePixelRatio;
    this.canvas = opts.canvas;
    this.canvas2d = this.canvas.getContext("2d");
    this.canvas.wrap = this;
    this.canvas.width = opts.width * this.devicePixelRatio;
    this.canvas.height = opts.height * this.devicePixelRatio;
    this.canvas.style.width = opts.width + "px";
    this.canvas.style.height = opts.height + "px";
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.calibration = {};
    this.columnVisible = opts.columnVisible;
    this.columnCount = opts.columnCount;
    this.chosenIndex = opts.chosenIndex;

    this.onselect = opts.onselect || (function () {});
    this.dataFormat = opts.dataFormat || (function (index) {return index;});
    

    this.touch = H5animation.CaptureTouch(this.canvas);
    this.canvas.addEventListener('touchstart', function(e){
        var monthSelect = this.wrap;
        monthSelect.adjustDistance = 0;
        monthSelect.touchStartX = monthSelect.touch.x;
    }, false);
    this.canvas.addEventListener('touchmove', function(e){
        var monthSelect = this.wrap;
        monthSelect.touchMoveDistance = (monthSelect.touch.x - monthSelect.touchStartX) * monthSelect.devicePixelRatio;
        monthSelect.offset -= monthSelect.touchMoveDistance;
        monthSelect.touchStartX = monthSelect.touch.x;
    }, false);
    this.canvas.addEventListener('touchend', function(e){
        var monthSelect = this.wrap;
               
        //计算调整距离
        var adjustIndex = Math.floor(monthSelect.offset / monthSelect.columnWidth) + (monthSelect.touchMoveDistance>0?0:1);
        if (adjustIndex <= - Math.floor(monthSelect.columnVisible / 2)) {
            adjustIndex = - Math.floor(monthSelect.columnVisible / 2)
        } else if (adjustIndex >= monthSelect.columnCount - Math.ceil(monthSelect.columnVisible / 2)) {
            adjustIndex = me.columnCount - Math.ceil(monthSelect.columnVisible / 2);
        }
        monthSelect.onselect(adjustIndex + Math.floor(monthSelect.columnVisible / 2))
        monthSelect.adjustDistance = adjustIndex * monthSelect.columnWidth - monthSelect.offset;
    }, false);
    
    

    this.init();
};
monthSelect.prototype.init = function () {
    
    this.adjustDistance = 0;
    this.touchMoveDistance = 10;

    this.calibration.lineHeight = this.height / 16;
    this.columnWidth = this.width / this.columnVisible;

    this.offset = (this.chosenIndex - Math.floor(this.columnVisible / 2)) * this.columnWidth;
};
monthSelect.prototype.clearChart = function () {
    //清屏
    this.canvas2d.clearRect(0,0,this.canvas.width,this.canvas.height);
};
monthSelect.prototype.getPosXByindex = function (index) {
    //根据x轴index获取x值
    return index * this.columnWidth + 0.5 * this.columnWidth;
};
monthSelect.prototype.drawCalibration = function () {
    //画X轴刻度
    this.canvas2d.beginPath();
    this.canvas2d.lineWidth = "1";
    this.canvas2d.font = (this.height / 6) + "px Arial";
    this.canvas2d.fillStyle = "#A2ACB2";
    this.canvas2d.strokeStyle = "#cccccc";
    this.canvas2d.textAlign = "center";
    this.canvas2d.textBaseline = "middle";

    
    //画x轴
    this.canvas2d.moveTo(this.getPosXByindex(-this.columnVisible), this.height / 2);
    this.canvas2d.lineTo(this.getPosXByindex(this.columnCount + this.columnVisible), this.height / 2);
    //画刻度线及值
    for (var i = -this.columnVisible; i < this.columnCount + this.columnVisible; i++) {
        var startX = this.getPosXByindex(i);
        for (var j = 0; j < 10; j++) {
            var lineHeight = this.calibration.lineHeight;
            if (j == 0) {
                lineHeight *= 2;
                if (i >= 0 && i <= this.columnCount - 1) {
                    this.canvas2d.fillText(this.dataFormat(i) ,startX - this.offset, this.height / 1.5);
                }
            }
            this.canvas2d.moveTo(startX + j * this.columnWidth / 10 - this.offset, this.height / 2);
            this.canvas2d.lineTo(startX + j * this.columnWidth / 10 - this.offset, this.height / 2 - lineHeight);
        }
    }
    
    this.canvas2d.stroke();
};
monthSelect.prototype.drawCurrentValue = function () {
    this.canvas2d.beginPath();
    this.canvas2d.lineWidth = "1";
    this.canvas2d.strokeStyle = "#ff0000";

    this.canvas2d.moveTo(this.width / 2, this.height / 2);
    this.canvas2d.lineTo(this.width / 2, this.height / 2 - this.calibration.lineHeight * 3);
    this.canvas2d.stroke();
};
monthSelect.prototype.adjustPosition = function () {
    var speed = this.adjustDistance / 10;
    this.offset += speed;
    this.adjustDistance -= speed;
    if (Math.abs(this.adjustDistance)<1 && !this.touch.isPressed) {
        this.adjustDistance = 0;
        this.offset = Math.round(this.offset / this.columnWidth) * this.columnWidth;
    }
};
monthSelect.prototype.distroy = function () {
    clearInterval(this.timer);
};
monthSelect.prototype.render = function () {
    mychart.init();
    clearInterval(this.timer);
    this.timer = setInterval(function(monthSelect){
        monthSelect.clearChart();
        monthSelect.drawCalibration();
        monthSelect.drawCurrentValue();
        monthSelect.adjustPosition();
    }, 1000/60, this);
};
window.monthSelect = monthSelect;