var baseObj = {

    randomNum: function (min, max) {
        return parseInt(Math.random() * (max - min + 1) + min);
    },
    rectangleCrashExamine: function (obj1, obj2) {
        var obj1Left = obj1.offsetLeft;
        var obj1Width = obj1.offsetLeft + obj1.offsetWidth;
        var obj1Top = obj1.offsetTop;
        var obj1Height = obj1.offsetTop + obj1.offsetHeight;

        var obj2Left = obj2.offsetLeft;
        var obj2Width = obj2.offsetLeft + obj2.offsetWidth;
        var obj2Top = obj2.offsetTop;
        var obj2Height = obj2.offsetTop + obj2.offsetHeight;

        return obj1Width >= obj2Left && !(obj1Top > obj2Height || obj1Height < obj2Top);
    },
    RunBullet : function (bulletArr) {
        if (bulletArr.length) {
            for (var i = 0; i < bulletArr.length; i++)
                if(!(bulletArr[i].divb == null))
                   bulletArr[i].moveBullet();
        }
    },
    RunEnemy: function(enemyArr) {
        if(enemyArr.length)
            for(var i = 0; i < enemyArr.length; i++){
                if(!(enemyArr[i].dive == null))
                    enemyArr[i].moveEnemy();
            }
    },
    IfCrash: function (bulletArr, enemyArr, MainBg) {
        if(bulletArr.length || enemyArr.length){
            for(var i = 0; i < bulletArr.length; i++){
                for(var j = 0; j < enemyArr.length; j++){
                    if(!(bulletArr[i].divb == null || enemyArr[j].dive == null)){
                        if(this.rectangleCrashExamine(bulletArr[i].divb, enemyArr[j].dive)){
                            MainBg.removeChild(bulletArr[i].divb);
                            bulletArr.shift(bulletArr[i]);
                            MainBg.removeChild(enemyArr[j].dive);
                            enemyArr.shift(enemyArr[j]);
                        }
                    }
                }
            }

        }
    },
    IfBullet:function (bulletArr, MainBg) {
        if(bulletArr.length ) {
            for (var i = 0; i < bulletArr.length; i++) {
                if (bulletArr[i].divb.offsetLeft > 1200) {
                    MainBg.removeChild(bulletArr[i].divb);
                    bulletArr.shift(bulletArr[i]);
                }
            }
        }
    },
    IfEnemy: function (enemyArr, MainBg) {
        if(enemyArr.length) {
            for (var j = 0; j < enemyArr.length; j++) {
                if (enemyArr[j].dive.offsetLeft < 0) {
                    MainBg.removeChild(enemyArr[j].dive);
                    bulletArr.shift(enemyArr[j]);
                }
            }
        }
    }
};