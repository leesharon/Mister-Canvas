let gElCanvas
let gCtx
let gIsDrag = false
let gPrevPos
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    loadUserSettings()
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    resizeCanvas()
    addListeners()
    setColors()
}

// function renderCanvas() {
//     gCtx.fillStyle = "white"
//     gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
// }

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        const center = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
        createCircle(center)
        renderCanvas()
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!gPrevPos) gPrevPos = pos
    
    drawShape(pos.x, pos.y, undefined)
    gPrevPos = pos
    gIsDrag = true
}

function onMove(ev) {
    // const circle = getCircle();
    if (!gIsDrag) return
    const pos = getEvPos(ev)
    drawShape(pos.x, pos.y)
    gPrevPos = pos
    // const dx = pos.x - gStartPos.x
    // const dy = pos.y - gStartPos.y
    // moveCircle(dx, dy)
    // gStartPos = pos
    // renderCanvas()
}

function onUp() {
    gIsDrag = false
    // document.body.style.cursor = 'grab'
    gPrevPos = null
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    // ['touchstart', 'touchmove', 'touchend']
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function drawShape(x, y) {
    let size = calculateShapeSize(x, y)
    const color = document.querySelector('#draw-color').value
    const shape = document.querySelector('#shape').value
    if (shape === 'circle') drawArc(x, y, size, color)
    if (shape === 'square') drawRect(x, y, size, color)
    if (shape === 'triangle') drawTriangle(x, y, size, color)
}

function drawArc(x, y, size = 60, color = 'blue') {
    gCtx.beginPath()
    gCtx.lineWidth = 0.5
    gCtx.arc(x, y, size, 0, 2 * Math.PI)
    gCtx.strokeStyle = color
    gCtx.stroke()
    gCtx.closePath()
}

function drawRect(x, y, size = 60, color = 'blue') {
    gCtx.beginPath();
    gCtx.rect(x, y, size, size);
    gCtx.strokeStyle = color;
    gCtx.stroke();
    gCtx.closePath();
}

function drawTriangle(x, y, size = 30, color = 'blue') {
    gCtx.beginPath();
    gCtx.lineWidth = 0.5;
    gCtx.moveTo(x, y);
    gCtx.lineTo(x+size, y+size*2);
    gCtx.lineTo(x-size, y+size*2);
    gCtx.lineTo(x, y);
    gCtx.strokeStyle = color;
    gCtx.stroke();
    gCtx.closePath();
}

function calculateShapeSize(x, y) {
    const dx = Math.abs(x - gPrevPos.x)
    const dy = Math.abs(y - gPrevPos.y)
    let size = (dx + dy) * 0.7
    return size
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    // You may clear part of the canvas
    // gCtx.clearRect(0, 0, gElCanvas.width / 2, gElCanvas.height / 2);
}

function setColors() {
    const userSettings = getUserSettings()
    document.querySelector('.bg-color-input').value = userSettings.bgColor
    document.querySelector('.color-input').value = userSettings.color
    onBgColorChange(userSettings.bgColor)
    onColorChange(userSettings.color)
}

function onBgColorChange(color) {
    document.body.style.backgroundColor = color
    document.querySelector('canvas').style.backgroundColor = color
    setBgColor(color)
}

function onColorChange(color) {
    setColor(color)
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-canvas';
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    // document.querySelector('.share-container').innerHTML = ''

    var reader = new FileReader()

    reader.onload = (event) => {
        var img = new Image()
        img.src = event.target.result
        img.onload = onImageReady.bind(null, img)
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}