function createPauseButton(config, stage, game) {
    const pause = new DisplayObject(config, stage);  

    pause.move = function() {}

    const container = new PIXI.Container(0, 0)
    const graphics = new PIXI.Graphics()
    graphics.beginFill(0xffffff);
    graphics.lineStyle(10, 0xFFBD01, 1);
    graphics.drawCircle(config.width/2, config.height/2, config.width/2)
    graphics.endFill();
    graphics.zIndex = 0
    container.addChild(graphics)
    pause.sprite.width = config.width * 0.9
    pause.sprite.height = config.height * 0.9
    container.addChild(pause.sprite)
    container.alpha = 0.7
    container.zIndex = 9
    
    container.interactive = true

    pause.init = function () {
        stage.addChild(container)
        pause.enabled = true
    }
    container.on('pointerdown', function () {
        if (stage.getStatus() > 0)
            game.pauseGame()
    })

    pause.destroy = function() {
        stage.removeChild(container)
    }

    return pause
}