function createPlanetPopup(config, app) {
    const container = new PIXI.Container()

    container.x = config.x
    container.y = config.y

    container.alpha = 0.7

    const background = new PIXI.Graphics()
    background.beginFill(0xffffff);
    background.lineStyle(10, 0xFFBD01, 1);
    background.drawRoundedRect(0, 0, config.width, config.height, 0)
    background.endFill();
    background.zIndex = 0
    container.addChild(background)
    container.zIndex = 99

    let i = 0
    app.planetsPrototypes.forEach(element => {
        const diameter = config.width / 8
        createPlanetLabel(container, element.texture, element.key, app.styles.text, {
            width: diameter,
            height: diameter,
            x: config.width * 0.1,
            y: config.height * 0.1 + diameter * 1.3 * i,
            separation: 3
        })
        i+=1;
    });

    container.init = function () {
        app.stage.addChild(container)
    }

    container.destroy = function () {
        app.stage.removeChild(container)
    }

    return container
}