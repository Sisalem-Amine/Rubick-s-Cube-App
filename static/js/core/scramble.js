let oll = [];
let pll = [];

fetch('/static/json/oll.json')
  .then(res => res.json())
  .then(data => oll = data);

fetch('/static/json/pll.json')
  .then(res => res.json())
  .then(data => pll = data);

function scramble(length, type)
{
    let axies = ['x','y','z'];
    let moves = ['R','L','U','D','F','B'];
    let modifiers = ['',"'",'2'];
    let last_axis = '';
    let scramble = '';

    if(type == "standard"){
        for(let i = 0; i < length; i++){
            let axis = Math.floor(Math.random() * 3);
            let move = '';
            
            if(i == 0){
                move = moves[axis * 2 + Math.floor(Math.random() * 2)] + modifiers[Math.floor(Math.random() * 3)];
                last_axis = axies[axis];
                scramble += move;
            }
            else{
                while(last_axis == axies[axis]){
                axis =  Math.floor(Math.random() * 3);
                }
                move = moves[axis * 2 + Math.floor(Math.random() * 2)] + modifiers[Math.floor(Math.random() * 3)];
                last_axis = axies[axis];
                scramble += ' ' + move;
            }
        }
    }
    else if(type == 'practiseOLL'){
        scramble = oll[Math.floor(Math.random() * oll.length)];
    }
    else if(type == 'practisePLL'){
        scramble = pll[Math.floor(Math.random() * pll.length)];
    }
    else{
        scramble = "Select scramble type";
    }

    return scramble;
}

export function updateUI(type, target)
{
    let lenght;
    let mode;

    switch(type){
        case '3x3':
            lenght = 20;
            mode = 'standard';
            break;
        case '2x2':
            lenght = Math.floor(Math.random() * 3) + 9;
            mode = 'standard';
            break;
        case 'oll':
            mode = 'practiseOLL';
            break;
        case 'pll':
            mode = 'practisePLL';
            break;
        default :
            mode = 'nonStandard';
    }

    let scrambleString = scramble(lenght, mode);
    target.textContent = scrambleString;
}