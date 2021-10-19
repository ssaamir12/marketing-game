function createArrow(config, stage, moon, rocket) {
    let arrow = new DisplayObject(config, stage);
    let BA = new DisplayObject(config.BA, stage);

    const parentInit = arrow.init

    arrow.init = function () {
        parentInit.bind(arrow)()
        this.sprite.x = -config.width / 2
        this.sprite.y = -config.height / 2
        BA.sprite.width = config.width / 2.2
        BA.sprite.height = config.height / 2.2
        BA.sprite.x = this.sprite.x / 2
        BA.sprite.y = this.sprite.y * 0.6
        BA.sprite.zIndex = 99

        const BAfilter = new PIXI.filters.ColorMatrixFilter();
        BAfilter.contrast(1)
        BA.sprite.filters = [BAfilter]

        arrow.container = new PIXI.Container();
        const filter = new PIXI.filters.ColorMatrixFilter();
        filter.brightness(0)
        this.sprite.filters = [filter]
        arrow.container.zIndex = 9

        arrow.container.x = rocket.container.x
        arrow.container.y = rocket.container.y - config.height
        arrow.container.initalpha = 0.5
        arrow.container.alpha = arrow.container.initalpha
        arrow.container.zIndex = 99
        arrow.container.addChild(this.sprite);
        arrow.container.addChild(BA.sprite);

        stage.addChild(arrow.container)

        const maxDistance = this.calculateDistance(arrow.container, moon)

        this.move = function () {
            const deltaY = rocket.container.y - rocket.sprite.height / 2 - (moon.sprite.y + moon.sprite.height / 2)
            const deltaX = (moon.sprite.x + moon.sprite.width / 2) - (rocket.container.x + rocket.sprite.width / 2)

            const newRotation = Math.atan(deltaX / deltaY)
            arrow.container.rotation = newRotation

            let distance = this.calculateDistance(arrow.container, moon)
            filter.brightness(15 * Math.max(0.1 * maxDistance, (maxDistance - distance)) / maxDistance)
            BAfilter.contrast(1 - 15 * Math.max(0.1 * maxDistance, (maxDistance - distance)) / maxDistance)
        }
    }

    arrow.destroy = function () {
        arrow.stage.removeChild(this.container)
    }

    arrow.calculateDistance = function (container, moon) {
        return Math.sqrt((container.y - moon.sprite.y) ** 2 + (container.x - moon.sprite.x) ** 2)
    }

    arrow.statetimeout = 100
    arrow.visible = true
    arrow.makeInvisible = function () {
        if (this.visible) {
            if (this.invisible) {
                clearInterval(this.invisible.interval)
            }
            this.invisible = {}
            this.invisible.timeout = this.statetimeout
            this.invisible.interval = setInterval(() => this.updateInvisible(this), 100)
            this.visible = false
        }
    }

    arrow.updateInvisible = function () {
        if (stage.getStatus() > 0) {
            this.invisible.timeout -= 10
            this.container.alpha = this.container.initalpha - (this.statetimeout - this.invisible.timeout) / this.statetimeout
        }
        if (this.container.alpha <= 0) {
            clearInterval(this.invisible.interval)
        }
    }

    return arrow
}