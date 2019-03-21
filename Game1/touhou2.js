var role = {
    moveTimer:null,
    div:document.createElement("div"),
    ShowRemoi:function(parentObj) {
        this.div.style.width = "50px";
        this.div.style.height = "50px";
        this.div.style.backgroundImage = "url(remoi1.jpg)";
        // this.div.style.backgroundRepeat = "no-repeat";
        this.div.style.left = "10%";
        this.div.style.top = "50%";
        parentObj.appendChild(this.div);
        this.div.style.position = "absolute";

    },
    ChangeBgImg:function(judge){
        if(judge === 1){
            this.div.style.backgroundImage = "url(remoi2.jpg)";
        }
        else {
            this.div.style.backgroundImage = "url(remoi1.jpg)";
        }
    },
    moveSpeed: 10,
    moveDirection: 0,
    isAttack: false,
    MoveRemoi: function (ev) {
        ev = ev || window.event;
        role.moveDirection = ev.keyCode;
        if(!role.moveTimer) {
            role.moveTimer = setInterval(move,40);
        }
        function move() {
            switch (role.moveDirection) {
                case 37:
                    role.div.style.left = role.div.offsetLeft - role.moveSpeed + "px";
                    break;
                case 38:
                    role.div.style.top = role.div.offsetTop - role.moveSpeed + "px";
                    break;
                case 39:
                    role.div.style.left = role.div.offsetLeft + role.moveSpeed + "px";
                    break;
                case 40:
                    role.div.style.top = role.div.offsetTop + role.moveSpeed + "px";
                    break;
                default:
                    role.div.style.left = role.div.offsetLeft + "px";
                    role.div.style.top = role.div.offsetTop + "px";

            }
        }
    }
};
