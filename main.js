canvas = document.getElementById('game-canvas');
app_width = document.body.clientWidth*0.5;
app_height = document.body.clientHeight*0.8;

my_x = app_width/2;
my_y = 0;
my_player_texture = new Image();
my_player_texture.src = "textures/2.png"; // change player texture
my_player_texture.onload = function(){
    player_scale = 20;
    my_player_texture.height = my_player_texture.height * player_scale / my_player_texture.width;
my_player_texture.width = player_scale;
};


canvas.height = app_height;
canvas.width = app_width;
setups = {
    'canvas_background':'#d6ff75',
    'dot_base_color':'#fff',
    'dot_hit_color':'#B3F17D',
    'dot_border_color':'black',
    'dot_radius':5,
    'player_radius':6,
    'side_funcs_color':'#f1e27d',
    'passed_func_color':'#f1e27d',
    'center_func_color':'#5380A7',
    'player_color':'white',
    'player_border_color':'black',
    'amount_of_dotted_pixels':7,
    'loose_arc_color':'#FF3333',
    'loose_arc_border_color':'#FF3333',
    'win_arc_color':'#5380A7',
    'win_arc_border_color':'transparent',
    'amount_of_dots':10,
    'func_width':1.2*Math.sqrt(app_width)
}


function random_between(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function float_random_between(min, max) {
    return Math.random() * (max - min) + min;
}

function redraw_canvas(){
    
    //pattern = ctx.createPattern(img, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, app_width, app_height);
    ctx.lineWidth = 4;
    for(i=0;i<amount_of_elems;i++){
        draw_func(i);
    }
    
    draw_dots();

   
    // ctx.beginPath();
    // ctx.arc(my_x,my_y, setups['player_radius']+1,Math.PI*2,false);
    // ctx.fillStyle = setups['player_border_color'];
    // ctx.fill();
    // ctx.beginPath();
    // ctx.arc(my_x,my_y,setups['player_radius'],Math.PI*2,false);
    // ctx.fillStyle = setups['player_color'];
    // ctx.fill();

    ctx.drawImage(my_player_texture, my_x - my_player_texture.width / 2, my_y - my_player_texture.height / 2, my_player_texture.width, my_player_texture.height);
    
}

move_down = false;
move_right = false;
move_left = false;

console.log(10000/(app_width));

if(app_width<=768){
    update_time = 4000/app_width;
}
else if(app_width<=1920){
    update_time = 160/Math.sqrt(app_width);
}
else{
    update_time = 1/Math.sqrt(app_width);
}
setInterval(keyboard_controlls,update_time);
function keyboard_controlls(){
    if(!if_loose && !if_win){
        if(move_down){
            my_y+=1;
        }
        if(move_right){
            my_x+=1;
        }
        if(move_left){
            my_x-=1;
        }
    }
    
    redraw_canvas();
    check_player_pos();
}

document.addEventListener('keypress', (event) => {
    const keyName = event.key;
    if (keyName == "s" || keyName == "S" || keyName == 'ы' || keyName == 'Ы'){
        move_down = true;
    }
    if (keyName == "a" || keyName == "A" || keyName == 'ф' || keyName == 'Ф'){
        move_left = true;
    }
    if (keyName == "d" || keyName == "D" || keyName == 'в' || keyName == 'В'){
        move_right = true;
    }
});

document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    if (keyName == "w" || keyName == "W" || keyName == 'ц' || keyName == 'Ц'){
        move_up = false;
    }
    if (keyName == "s" || keyName == "S" || keyName == 'ы' || keyName == 'Ы'){
        move_down = false;
    }
    if (keyName == "a" || keyName == "A" || keyName == 'ф' || keyName == 'Ф'){
        move_left = false;
    }
    if (keyName == "d" || keyName == "D" || keyName == 'в' || keyName == 'В'){
        move_right = false;
    }
});
function fail_controller(){
    my_x = app_width/2;
    my_y = 0;
    curr_path_part = 0;
    curr_dot = 0;
    for(i=0;i<dots.length;i++){
        dots[i]['color'] = setups['dot_base_color'];
    }
    mistakes+=1;
    elem = document.getElementById('game-canvas');
    elem.style.borderColor = setups['loose_arc_border_color'];
    setTimeout(() => {
        elem.style.borderColor = 'white';
    }, 500);
    
    if(mistakes>=3){
        if_loose = true;
    }
}
if_loose = false;
if_win = false;
curr_path_part = 0;
mistakes = 0;
function check_player_pos(){
    if((curr_path_part<elems.length) && my_y<elems[curr_path_part]['last_y'] && !if_win && !if_loose){
        if(elems[curr_path_part]['func'] == draw_sinus){
            should_x = sinus(elems[curr_path_part]['h'],elems[curr_path_part]['w'],elems[curr_path_part]['k'],my_y - elems[curr_path_part]['y0']);
        }
        else if(elems[curr_path_part]['func'] == draw_sqrt_sinus){
            should_x = sqrt_sinus(elems[curr_path_part]['h'],elems[curr_path_part]['w'],elems[curr_path_part]['k'],my_y - elems[curr_path_part]['y0']);
        }
        else if(elems[curr_path_part]['func'] == draw_line){
            should_x = line(elems[curr_path_part]['h'],my_y - elems[curr_path_part]['y0']);
        }
        should_x+=elems[curr_path_part]['x0'];
        if((my_x<=should_x+setups['func_width'] && my_x>=should_x-setups['func_width']) && (curr_dot == dots.length || !(my_y>(dots[curr_dot]['y0']+setups['dot_radius']+setups['player_radius'])))){
            //console.log('nice')
        }
        else{
            fail_controller();
        }
        
        
    }
    else if(!if_win && my_y>=elems[curr_path_part]['last_y']){
        curr_path_part+=1;
    }
    if(my_y >=app_height){
        winning_actions();
    }
    if(if_loose){
        loosing_actions();
    }
}
win_arc_radius = 0;
function winning_actions(){
    if(win_arc_radius<=Math.sqrt(app_width*app_width + app_height*app_height)/2){
        win_arc_radius+=5;
    }
    if_win = true;
    elem = document.getElementById('game-canvas');
    elem.style.borderColor = setups['win_arc_border_color'];
    ctx.beginPath();
    ctx.fillStyle = setups['win_arc_border_color'];
    ctx.arc(app_width/2,app_height/2,win_arc_radius+2,Math.PI*2,false);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = setups['win_arc_color'];
    ctx.arc(app_width/2,app_height/2,win_arc_radius,Math.PI*2,false);
    ctx.fill();
}
loose_arc_radius = 0;
function loosing_actions(){
    if(loose_arc_radius<=Math.sqrt(app_width*app_width + app_height*app_height)/2){
        loose_arc_radius+=5;
    }
    
    if_win = true;
    elem = document.getElementById('game-canvas');
    elem.style.borderColor = setups['loose_arc_border_color'];
    ctx.beginPath();
    ctx.fillStyle = setups['loose_arc_color'];
    ctx.arc(app_width/2,app_height/2,loose_arc_radius,Math.PI*2,false);
    ctx.fill();
}

function create_dots(){
    path_part = 0;
    space_between_dots = app_height/(setups['amount_of_dots'] + 1);
    n = 1;
    for(x=0;x<app_height;x++){
         if(x<=elems[path_part]['last_y']){
            if(x>n*space_between_dots){
                if(elems[path_part]['func'] == draw_line){
                    dots.push({
                        'y0':x,
                        'x0':line(elems[path_part]['h'],x - elems[path_part]['y0']) + elems[path_part]['x0'],
                        'color':setups['dot_base_color']
                    });
                }
                else if(elems[path_part]['func'] == draw_sinus){
                    dots.push({
                        'y0':x,
                        'x0':sinus(elems[path_part]['h'],elems[path_part]['w'],elems[path_part]['k'],x - elems[path_part]['y0']) + elems[path_part]['x0'],
                        'color':setups['dot_base_color']
                    });
                }
                else if(elems[path_part]['func'] == draw_sqrt_sinus){
                    dots.push({
                        'y0':x,
                        'x0':sqrt_sinus(elems[path_part]['h'],elems[path_part]['w'],elems[path_part]['k'],x - elems[path_part]['y0']) + elems[path_part]['x0'],
                        'color':setups['dot_base_color']
                    });
                }
                n+=1;
            }
         }
         else{
             path_part+=1;
         }
    }
}
function draw_dots(){
    hit_dots();
    for(i=0;i<dots.length;i++){
        ctx.beginPath();
        ctx.fillStyle = setups['dot_border_color'];
        ctx.arc(dots[i]['x0'],dots[i]['y0'],setups['dot_radius']+1,Math.PI*2,false);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = dots[i]['color'];
        ctx.arc(dots[i]['x0'],dots[i]['y0'],setups['dot_radius'],Math.PI*2,false)
        ctx.fill();
    }
}
curr_dot = 0;
function hit_dots(){
    if(curr_dot<=dots.length-1 && Math.sqrt((Math.pow((my_x-dots[curr_dot]['x0']),2) + Math.pow((my_y-dots[curr_dot]['y0']),2)))<=setups['dot_radius']+ setups['player_radius']){
        dots[curr_dot]['color'] = setups['dot_hit_color']
        curr_dot+=1;
    }
}
//MATH FUNCS --------------------------
function line(h,x){
    return h*x;
}

function create_random_line(){
    h = float_random_between(-1/2,1/2);
    height = random_between(100,app_height/(2*amount_of_elems));
    if(elems.length == amount_of_elems - 1){
        height = app_height - (elems[elems.length-1]['height'] + elems[elems.length-1]['y0']);
    }
    if(elems.length == 0){
        x0 = app_width/2;
        y0 = 0;
    }else{
        y0 = elems[elems.length-1]['last_y'];
        x0 = elems[elems.length-1]['last_x'];
    }
    
    elems.push({
        'h':h,
        'height':height,
        'x0':x0,
        'y0':y0,
        'func':draw_line,
        'last_x':line(h,height) + x0,
        'last_y': height + y0
    });
    
}
function draw_line(num,offside,color = setups['center_func_color']){
    x0 = elems[num]['x0'];
    y0 = elems[num]['y0'];
    h = elems[num]['h'];
    height = elems[num]['height'];
    
    curr_pixels = 0;
    pixels_amount = setups['amount_of_dotted_pixels'];
    
    for(x = 0;x<height;x++){
        curr_pixels+=1;
        if(curr_pixels>pixels_amount && curr_pixels<=2*pixels_amount || offside == 0){
            
            if(offside == 0 && my_y>(x+elems[num]['y0'])){
                ctx.strokeStyle = setups['passed_func_color'];
            }
            else{
                ctx.strokeStyle = color;
            }
            ctx.beginPath();
            ctx.lineTo(x0+line(h,x) + offside,y0 + x);
            
            ctx.stroke();

        }
        else{
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(x0+line(h,x) + offside,y0 + x);
            ctx.stroke();
        }
        if(curr_pixels == 2*pixels_amount){
            curr_pixels = 0;
        }
        
    }  
}


function sinus(h,w,k,x){
    return Math.pow(-1,k)*h*Math.sin(x/w);
}
function create_random_sinus(){
    periods = random_between(1,3);
    w = random_between(40,60);
    k = random_between(1,2);
    h = random_between(10,20);
    if(app_width<=768){
        h = random_between(15,25);
        w = random_between(50,60);
    }
    if(elems.length == amount_of_elems - 1){
        w = (app_height - (elems[elems.length-1]['height'] + elems[elems.length-1]['y0']))/(periods*Math.PI);
        h = random_between(1,1);
    }
    if(elems.length == 0){
        x0 = app_width/2;
        y0 = 0;
    }else{
        y0 = elems[elems.length-1]['last_y'];
        x0 = elems[elems.length-1]['last_x'];
    }
    elems.push({
        'h':h,
        'w':w,
        'k':k,
        'periods':periods,
        'x0':x0,
        'y0':y0,
        'func':draw_sinus,
        'height':w*periods*Math.PI,
        'last_y': w*periods*Math.PI + y0,
        'last_x': sinus(h,w,k,w*periods*Math.PI) + x0
    });
    
}
function draw_sinus(num,offside,color = setups['center_func_color']){
    
    x0 = elems[num]['x0'];
    y0 = elems[num]['y0'];
    h = elems[num]['h'];
    w = elems[num]['w'];
    k = elems[num]['k'];
    periods = elems[num]['periods'];
    height = elems[num]['last_y'] - elems[num]['y0'];
    
    curr_pixels = 0;
    pixels_amount = setups['amount_of_dotted_pixels'];
    for(x = 0;x<height;x++){
        curr_pixels+=1
        if(curr_pixels>pixels_amount && curr_pixels<=2*pixels_amount || offside == 0){
            ctx.beginPath();
            if(offside == 0 && my_y>(x+elems[num]['y0'])){
                ctx.strokeStyle = setups['passed_func_color'];
            }
            else{
                ctx.strokeStyle = color;
            }
            
            ctx.lineTo(x0+sinus(h,w,k,x) + offside,y0 + x);
            ctx.stroke();
        }
        else{
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(x0+sinus(h,w,k,x) + offside,y0 + x);
            ctx.stroke();
        }
        if(curr_pixels == 2*pixels_amount){
            curr_pixels = 0;
        }
        
    }  
   
    
    //last_x = x0+sinus(h,w,k,x)
    //last_y = y0 + x
    
    
}



function sqrt_sinus(h,w,k,x){
    return Math.pow(-1,k)*h*Math.sin(x/w)*Math.sqrt(x);
}
function create_random_sqrt_sinus(){
    periods = random_between(1,3);
    w = random_between(60,80);
    k = random_between(1,2);
    h = random_between(4,5);
    if(app_width<=768){
        h = random_between(6,6);
        w = random_between(50,60);
    }
    if(elems.length == amount_of_elems - 1){
        w = (app_height - (elems[elems.length-1]['height'] + elems[elems.length-1]['y0']))/(periods*Math.PI);
        h = random_between(1,2);
    }
    if(elems.length == 0){
        x0 = app_width/2;
        y0 = 0;
    }else{
        y0 = elems[elems.length-1]['last_y'];
        x0 = elems[elems.length-1]['last_x'];
    }
    elems.push({
        'h':h,
        'w':w,
        'k':k,
        'periods':periods,
        'x0':x0,
        'y0':y0,
        'func':draw_sqrt_sinus,
        'height':w*periods*Math.PI,
        'last_y': w*periods*Math.PI + y0,
        'last_x': sqrt_sinus(h,w,k,w*periods*Math.PI) + x0
    });
   
}
function draw_sqrt_sinus(num,offside,color = setups['center_func_color']){
    
    x0 = elems[num]['x0'];
    y0 = elems[num]['y0'];
    h = elems[num]['h'];
    w = elems[num]['w'];
    k = elems[num]['k'];
    periods = elems[num]['periods'];
    height = elems[num]['last_y'] - elems[num]['y0'];
    
    curr_pixels = 0;
    pixels_amount = setups['amount_of_dotted_pixels'];
    for(x = 0;x<height;x++){
        curr_pixels+=1;
        if(curr_pixels>pixels_amount && curr_pixels<=2*pixels_amount || offside == 0){
            ctx.beginPath();
            if(offside == 0 && my_y>(x+elems[num]['y0'])){
                ctx.strokeStyle = setups['passed_func_color'];
            }
            else{
                ctx.strokeStyle = color;
            }
            ctx.lineTo(x0+sqrt_sinus(h,w,k,x) + offside,y0 + x);
            ctx.stroke();
        }
        else{
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(x0+sqrt_sinus(h,w,k,x) + offside,y0 + x);
            ctx.stroke();
        }
        if(curr_pixels == 2*pixels_amount){
            curr_pixels = 0;
        }
        
    }   
}

function draw_func(num){
    if (elems[num]['func'] == draw_sinus){
        ctx.lineWidth = 3;
        draw_sinus(num,0);
        ctx.lineWidth = 5;
        draw_sinus(num,-setups['func_width'],setups['side_funcs_color']);
        draw_sinus(num,setups['func_width'],setups['side_funcs_color']);
    }
    else if (elems[num]['func'] == draw_line){
        ctx.lineWidth = 3;
        draw_line(num,0);
        ctx.lineWidth = 5;
        draw_line(num,-setups['func_width'],setups['side_funcs_color']);
        draw_line(num,setups['func_width'],setups['side_funcs_color']);
    }
    else if (elems[num]['func'] == draw_sqrt_sinus){
        ctx.lineWidth = 3;
        draw_sqrt_sinus(num,0);
        ctx.lineWidth = 5;
        draw_sqrt_sinus(num,-setups['func_width'],setups['side_funcs_color']);
        draw_sqrt_sinus(num,setups['func_width'],setups['side_funcs_color']);
    }
}


//--------------------------------------



if(canvas.getContext){
    textures = [
        'textures/texture_1.png',
        'textures/texture_2.png',
        'textures/texture_3.png'
    ];
    ctx = canvas.getContext('2d');
    img = new Image();
    img.src = textures[random_between(0,2)];
    
    img.onload = function() {      
        pattern = ctx.createPattern(img, "repeat");
        //ctx.fillStyle = pattern;
        //ctx.fillRect(0, 0, app_width, app_height);
    };
   
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    elems = [];
    dots = [];
    funcs = [
        create_random_sinus,
        create_random_sqrt_sinus,
        create_random_line
        
       
    ]
    amount_of_elems = 3;
    was_line = false;
    for(i=0;i<amount_of_elems;i++){
        random_func = funcs[random_between(0,funcs.length-1)]
        if (i == 1){
            random_func = create_random_sqrt_sinus;
            random_func();
        }
        else if(random_func == create_random_line && !was_line){
            was_line = true;
            random_func();
        }else{
            was_line = false;
            funcs[random_between(0,funcs.length-2)]();
        }
        
    }

    create_dots()
    /*ctx.beginPath()
    ctx.moveTo(50,50)
    ctx.lineTo(1000,1000);
    ctx.stroke()*/
    
   
}



