function createBk(texture, width, height, stage) {
    let far = new PIXI.TilingSprite(texture, width, height);
    far.position.x = 0;
    far.position.y = 0;
    far.tilePosition.x = 0;
    far.tilePosition.y = 0;

    far.move = function () {
        this.tilePosition.x += Math.cos(stage.orientation) * stage.speed;
        this.tilePosition.y += Math.sin(stage.orientation) * stage.speed;
    }

    return far;
}