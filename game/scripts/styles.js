const h1 = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'],
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
    align: "center"
})
const h2 = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'],
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 540,
    lineJoin: 'round',
})

const text = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'],
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 840,
    lineJoin: 'round',
    align: "center"
})

const bigtext = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'],
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 540,
    lineJoin: 'round',
    align: "center"
})

const styles = { "h1": h1, "h2": h2, "text": text, "bigtext": bigtext }

function getStyles(app) {
    styles.h2.wordWrapWidth = app.renderer.width * 0.8
    styles.text.wordWrapWidth = app.renderer.width * 0.9
    styles.bigtext.wordWrapWidth = app.renderer.width * 0.9
    return styles
}