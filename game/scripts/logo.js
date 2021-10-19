function createBAlogo(config, stage) {
    let logo = new DisplayObject(config, stage)

    const parentInit = logo.init;
    logo.init = function () {
        parentInit.bind(this)()
        this.sprite.alpha = 0.7
    }
    logo.move = function () { }
    logo.sprite.zIndex = 999
    return logo
}