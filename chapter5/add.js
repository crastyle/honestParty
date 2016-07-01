/**
 * Created by apple on 16/7/1.
 */
$.fn.addToCart = function(options){
    var args = $.extend({
        cart:'',
        speed:1000,
        before:'',
        success:'',
        replace:'',
        clone:''
    },options || {});

    var t = $(this);

    var _status = true;
    t.on('click',function(){

        if(!_status)return false;
        var _self = $(this), _top = _self.offset().top, _left = _self.offset().left, _targetTop = args.cart.offset().top, _targetLeft = args.cart.offset().left;
        if(!args.clone)
            args.clone = _self.clone();
        if(typeof args.clone != 'object'){
            throw new Error('param Clone must be jQuery element');
        }
        if(args.before && typeof args.before == 'function')  args.before();
        args.clone.css({
            position:'absolute',
            top:_top,
            left:_left,
            width:_self.width()
        }).appendTo($('body'));

        _status = false;
        args.clone.stop().animate({
            top:_targetTop-150,
            left:_left + Math.abs((_left - _targetLeft)*.5),
            opacity:.3
        },args.speed/2,function(){
            args.clone.animate({
                top:_targetTop,
                left:_targetLeft,
                opacity:1
            },args.speed/2,function(){
                _status = true;
                if(args.success && typeof args.success =='function')  args.success();
                args.clone.remove();
            });
        })
    })
}