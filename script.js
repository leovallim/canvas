var canvasWrapper,
    canvas,
    clickX = new Array(),
    clickY = new Array(),
    drag = new Array(),
    color = Array(),
    paint = false,
    tool = 'pencil',
    isPen = 0,
    activeColor = '#2c3e50',
    ctx;

//Criando o elemento dinamicamente
canvasWrapper = document.querySelector('[data-canvas]');
canvas = document.createElement('canvas');
canvas.setAttribute('class', 'canvas');
canvas.setAttribute('height', '800px');
canvas.setAttribute('width', window.innerWidth);
canvasWrapper.appendChild(canvas);
ctx = canvas.getContext('2d');

//Funções de desenho
function addPoint(x, y, c, dragging){
    clickX.push(x);
    clickY.push(y);
    drag.push(dragging);
    color.push(c);
}

function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
    
    for(i = 0; i < clickX.length; i++){
        ctx.strokeStyle = color[i];
        ctx.beginPath();
        if(drag[i] && i){
            
            ctx.moveTo(clickX[i-1], clickY[i-1]);
        }else{
            ctx.moveTo(clickX[i]-1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.stroke();
        
    }
}

//Identificando o click
canvas.addEventListener('mousedown', e =>{
    paint = true;

    if(isPen === 1){
        addPoint( e.offsetX, e.offsetY, activeColor, true);
    }else{
        addPoint( e.offsetX, e.offsetY, activeColor);
    }
    
    if(tool === 'pen') isPen = 1;
    draw();
});
canvas.addEventListener('mouseup', () => {
    paint = false;    
    
     addPoint( e.offsetX, e.offsetY, activeColor);
});
canvas.addEventListener('mousemove', e => {
    if(paint){
        if(tool == 'pencil'){
            addPoint( e.offsetX, e.offsetY, activeColor, true);
            draw();
        }
    }
});

//Funções de controle
document.querySelector('[data-undo]').addEventListener('click', ()=>{
    
    let j = clickX.length;
    let stop = 0;
    for(let k = clickX.length; k >= 0; k--){
        if(drag[k] === true){
            clickX.pop();
            clickY.pop();
            drag.pop();
            color.pop();
        }else{    
            stop++;
        }
        
        if(stop === 2){
            clickX.pop();
            clickY.pop();
            drag.pop();
            color.pop();
            break;
        };
    }

    draw();
});
document.querySelectorAll('[data-tool]').forEach(button =>{
    button.addEventListener('click', (e)=>{
        tool = e.target.closest('button').dataset.tool;
        isEraser = false;
        if(tool === 'pencil') isPen = 0;
    })
});
document.querySelector('[data-eraser]').addEventListener('click', ()=> activeColor = '#ffffff');
document.querySelector('[data-eraser-all]').addEventListener('click', ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    clickY = Array();
    clickX = Array();
    color = Array();
    drag = Array();
});
document.querySelectorAll('[data-color]').forEach(button => {
    button.addEventListener('click', e => {
        activeColor = e.target.dataset.color;
    })
})
