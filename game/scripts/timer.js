function createTimer(config, stage) {
    const initTime = 90
    const target = formatTime(initTime)
    let texture = new PIXI.Text(target[2], style)
    texture.x = config.x
    texture.y = config.y
    texture.zIndex = 9

    let timer = {texture : texture, config : config, stage: stage}
    
    timer.recalculateTimeLeft = function() {
        if (stage.getStatus() > 0) {
            timer.timeLeft-=1
            texture.text = formatTime(timer.timeLeft)[2]
            if (timer.timeLeft <= 0) {
                stage.timeout()
            } 
        }
    }
    
    timer.reduceTime = function() {
        timer.timeLeft -= 10
    }
    timer.move = function() {
    }

    timer.init = function() {
        this.stage.addChild(this.texture)
        timer.interval = setInterval(this.recalculateTimeLeft, 1000)
        timer.timeLeft = initTime
    }

    timer.destroy = function() {
        this.stage.removeChild(this.texture)
        clearInterval(timer.interval)
    }

    return timer
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return [min, secs, format(min) + ":" + format(secs)]
}

function format(a) {
    if (a < 10) {
        return "0" + a
    } else {
        return a
    }
}

const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: 'round',
    });