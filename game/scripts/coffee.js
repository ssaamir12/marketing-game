function createCoffee(config, stage, index = 0) {
    let coffee = new DisplayObject(config, stage)

    const parentInit = coffee.init;
    coffee.init = function () {
        parentInit.bind(this)()
        this.sprite.x += coffee.sprite.width * 1.3 * index
        this.sprite.alpha = 0
    }
    coffee.move = function () { }

    return coffee
}