function Enemy(rand) {
    this.dive = null;
    this.createDiv = function () {
        var newDiv = document.createElement("div");
        newDiv.style.width = "20px";
        newDiv.style.height = "20px";
        newDiv.style.left = 1200 + "px";
        newDiv.style.top = rand  + "px";
        newDiv.style.position = "absolute";
        newDiv.style.background = "red";
        return newDiv;
    };
    this.createEnemy = function () {
        this.dive = this.createDiv();
        MainBg.appendChild(this.dive);
    };
    this.moveEnemy = function () {
        this.dive.style.left = this.dive.offsetLeft - 10 + "px";
        this.dive.style.top = this.dive.offsetTop + "px";

    };


}
function CreateEnemy(enemyArr) {
    this.rand = baseObj.randomNum(0, 500);
    var e = new Enemy(this.rand);
    enemyArr.push(e);
    e.createEnemy();
}