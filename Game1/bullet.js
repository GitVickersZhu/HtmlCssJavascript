function Bullet(positionType, left, top) {
    this.divb = null;
    this.createDiv = function () {

        var newDiv = document.createElement("div");
        newDiv.style.width = "20px";
        newDiv.style.height = "20px";
        newDiv.style.left = left + 10 + "px";
        newDiv.style.top = top + 10 + "px";
        newDiv.style.position = positionType;
        newDiv.style.background = "black";
        return newDiv;
    };
    this.createBullet = function () {
        this.divb = this.createDiv();
        MainBg.appendChild(this.divb);

    };
    this.moveBullet = function () {
        this.divb.style.left = this.divb.offsetLeft + 40 + "px";
        this.divb.style.top = this.divb.offsetTop + "px";

    };
}
