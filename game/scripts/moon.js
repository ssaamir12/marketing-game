function createMoon(config, stage, rocket) {
    const moon = new DisplayObject(config, stage);  

    moon.sprite.zIndex = 99
    const filter = new PIXI.filters.ColorMatrixFilter();
    
    moon.sprite.filters = [filter]

    const parentMove = moon.move

    moon.delta = 0.05
    moon.count = moon.delta
    moon.move = function() {
        parentMove.bind(this)()
        if (this.sprite.y > (rocket.realPosition({x:0, y:0}).y + rocket.sprite.width)) {
            stage.loseGame()
        }
        filter.saturate(Math.cos(moon.count))
        filter.technicolor(true)
        filter.sepia(true)
        moon.count += moon.delta
    }

    return moon
}