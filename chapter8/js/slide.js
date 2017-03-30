/**
 * Created by wuenyu on 2016/11/2.
 */

$.fn.showMenu = function () {
    var that = $(this)
    var isTouchstart = false
    var initX = 0
    var moveTarget = null
    var moveX = 0
    that.each(function (i,n) {
        var hideMenu = $(n).find(".hide-button")
        hideMenu.css("right",0 - hideMenu.width())
    })


    that.on("touchstart" ,function (e) {

        isTouchstart = true
        initX = e.touches[0]["pageX"]
        moveTarget = $(this)
        that.not(moveTarget).css("transform","translateX(0px)")

    },false)

    that.on("touchmove" ,function (e) {

        if(isTouchstart) {
            moveX = e.touches[0]["pageX"]
            if(initX - moveX > 0) {
                var distance = moveX - initX
                moveTarget.css("transform",`translateX(${distance}px)`)
            }
            var currentMenuWidth = moveTarget.find(".hide-button").width()
            if(initX - moveX >= currentMenuWidth) {
                isTouchstart = false
                moveTarget.css("transform",`translateX(-${currentMenuWidth}px)`)
            }
        }

    })

    that.on("touchend" ,function (e) {

        var target = e.target
        isTouchstart = false
        if(target.nodeName.toLowerCase()=="li") {
            var currentMenuWidth = moveTarget.find(".hide-button").width()
            console.log(initX,moveX)
            if(initX - moveX >= 50 && moveX) {

                moveTarget.css("transform",`translateX(-${currentMenuWidth}px)`)
            }else {
                moveTarget.css("transform",`translateX(0px)`)
            }
            moveX = 0
            initX = 0
        }



    })
}