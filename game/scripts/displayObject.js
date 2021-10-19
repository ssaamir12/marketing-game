function DisplayObject(config, stage) {
    this.config = config
    this.sprite = new PIXI.Sprite(config.texture);

    this.stage = stage
    this.enabled = true

    this.move = function () {
        this.sprite.x += Math.cos(this.stage.orientation) * this.speed()
        this.sprite.y += Math.sin(this.stage.orientation) * this.speed()
    }

    this.reset = function () {
        //this.destroy()
    }
    this.resize = function (widthRatio, heightRatio) {
    }
    this.init = function () {
        this.sprite.x = this.config.x;
        this.sprite.y = this.config.y;
        this.sprite.zIndex = this.config.zIndex ? this.config.zIndex : 0

        this.sprite.width = this.config.width
        this.sprite.height = this.config.height

        this.speed = () => this.stage.speed
        this.accelerationFactor = this.config.accelerationFactor
        this.stage.addChild(this.sprite)
    }
    this.destroy = function() {
        this.enabled = false
        this.stage.removeChild(this.sprite)
    }
}
