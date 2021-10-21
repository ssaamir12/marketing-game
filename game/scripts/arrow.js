function createArrow(config, stage, moon, rocket, app) {
    let arrow = new DisplayObject(config, stage);
    let BA = new DisplayObject(config.BA, stage);

    const parentInit = arrow.init

    const progressBar1 = new PIXI.Graphics();
    const progressBar2 = new PIXI.Graphics();
    const progressBar3 = new PIXI.Graphics();
    const progressBar4 = new PIXI.Graphics();
    const progressBar5 = new PIXI.Graphics();
    const progressBar6 = new PIXI.Graphics();
    const progressBar7 = new PIXI.Graphics();
    const progressBar8 = new PIXI.Graphics();
    const progressBar9 = new PIXI.Graphics();
    const progressBar10 = new PIXI.Graphics();

    initProgressBar()

    const progressBarBkg = new PIXI.Graphics();
    progressBarBkg.lineStyle(2, 0xFFFFFF, 1);
    progressBarBkg.drawRect(0, 0, 300, 20);
    progressBarBkg.x = config.progress.x
    progressBarBkg.y = config.progress.y
    progressBarBkg.zIndex = 9


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
        addProgressBar()
        stage.addChild(progressBarBkg)

        const maxDistance = this.calculateDistance(arrow.container, moon)

        this.move = function () {
            const deltaY = rocket.container.y - rocket.sprite.height / 2 - (moon.sprite.y + moon.sprite.height / 2)
            const deltaX = (moon.sprite.x + moon.sprite.width / 2) - (rocket.container.x + rocket.sprite.width / 2)

            const newRotation = Math.atan(deltaX / deltaY)
            arrow.container.rotation = newRotation

            let distance = this.calculateDistance(arrow.container, moon)
            filter.brightness(15 * Math.max(0.1 * maxDistance, (maxDistance - distance)) / maxDistance)
            BAfilter.contrast(1 - 15 * Math.max(0.1 * maxDistance, (maxDistance - distance)) / maxDistance)

             
            const aPercentage = Math.round((( 1 - distance / maxDistance) * 100) + 0.02) // Added 0.02 for value adjustment
            let progressValue = (aPercentage * 3)
            let progress = progressValue/3
          
            if (progress <= 10)
                {
                    progressBar1.lineStyle(2, 0xFFFFFF, 1);
                    progressBar1.beginFill(0x33FF36);
                    progressBar1.drawRect(0, 0, progressValue, 20);
                    progressBar1.endFill();
                    
                }
                else if (progress > 10 && progress <= 20 )
                {
                    progressBar2.lineStyle(2, 0xFFFFFF, 1);
                    progressBar2.beginFill(0x33FF36);
                    progressBar2.drawRect(0, 0, progressValue, 20);
                    progressBar2.endFill();
                
                }
                else if  (progress > 20 && progress <= 30 )
                {
                    progressBar3.beginFill(0x33FF36);
                    progressBar3.drawRect(0, 0, progressValue, 20);
                    progressBar3.endFill();
                
                }
                else if  (progress > 30 && progress <= 40 )
                {
                    progressBar4.beginFill(0x33FF36);
                    progressBar4.drawRect(0, 0, progressValue, 20);
                    progressBar4.endFill();
                
                }
                else if  (progress > 40 && progress <= 50 )
                {
                    progressBar5.beginFill(0x33FF36);
                    progressBar5.drawRect(0, 0, progressValue, 20);
                    progressBar5.endFill();
                
                }
                else if  (progress > 50 && progress <= 60 )
                {
                    progressBar6.beginFill(0x33FF36);
                    progressBar6.drawRect(0, 0, progressValue, 20);
                    progressBar6.endFill();
                
                }
                else if  (progress > 60 && progress <= 70 )
                {
                    progressBar7.beginFill(0x33FF36);
                    progressBar7.drawRect(0, 0, progressValue, 20);
                    progressBar7.endFill();
            
                }
                else if  (progress > 70 && progress <= 80 )
                {
                    progressBar8.beginFill(0x33FF36);
                    progressBar8.drawRect(0, 0, progressValue, 20);
                    progressBar8.endFill();
                
                }
                else if  (progress > 80 && progress <= 90 )
                {
                    progressBar9.beginFill(0x33FF36);
                    progressBar9.drawRect(0, 0, progressValue, 20);
                    progressBar9.endFill();
                
                }
                else 
                {
                    progressBar10.beginFill(0x33FF36);
                    progressBar10.drawRect(0, 0, progressValue, 20);
                    progressBar10.endFill();
                
                }
            }

        
    }

    arrow.destroy = function () {
        arrow.stage.removeChild(this.container)
        destroyProgressBar()
        stage.removeChild(progressBarBkg)
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

    function initProgressBar() {

        
        progressBar1.x = config.progress.x
        progressBar1.y = config.progress.y
        progressBar1.zIndex = 9

        progressBar2.x = config.progress.x 
        progressBar2.y = config.progress.y
        progressBar2.zIndex = 9

        progressBar3.x = config.progress.x 
        progressBar3.y = config.progress.y
        progressBar3.zIndex = 9

        progressBar4.x = config.progress.x 
        progressBar4.y = config.progress.y
        progressBar4.zIndex = 9

        progressBar5.x = config.progress.x 
        progressBar5.y = config.progress.y
        progressBar5.zIndex = 9

        progressBar6.x = config.progress.x 
        progressBar6.y = config.progress.y
        progressBar6.zIndex = 9

        progressBar7.x = config.progress.x 
        progressBar7.y = config.progress.y
        progressBar7.zIndex = 9

        progressBar8.x = config.progress.x 
        progressBar8.y = config.progress.y
        progressBar8.zIndex = 9

        progressBar9.x = config.progress.x 
        progressBar9.y = config.progress.y
        progressBar9.zIndex = 9

        progressBar10.x = config.progress.x 
        progressBar10.y = config.progress.y
        progressBar10.zIndex = 9
        
    }

    function addProgressBar (){
        stage.addChild(progressBar1)
        stage.addChild(progressBar2)
        stage.addChild(progressBar3)
        stage.addChild(progressBar4)
        stage.addChild(progressBar5)
        stage.addChild(progressBar6)
        stage.addChild(progressBar7)
        stage.addChild(progressBar8)
        stage.addChild(progressBar9)
        stage.addChild(progressBar10)
    }
    
    function destroyProgressBar()
    {
        stage.removeChild(progressBar1)
        stage.removeChild(progressBar2)
        stage.removeChild(progressBar3)
        stage.removeChild(progressBar4)
        stage.removeChild(progressBar5)
        stage.removeChild(progressBar6)
        stage.removeChild(progressBar7)
        stage.removeChild(progressBar8)
        stage.removeChild(progressBar9)
        stage.removeChild(progressBar10)
    }

    return arrow
}