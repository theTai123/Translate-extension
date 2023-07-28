var body = document.querySelector('body');
var btn = document.createElement('button');
var div = document.createElement('div');
var btnCreate = false;
var btnClick = false;
var divCreate = false;
var divTouch = false;

var text = '';
var transtext = '';
var url = 'http://localhost:8080/'
var inputLang = 'vi'; 

const lang = {
    "Tiếng Anh":"en",
    "Tiếng Pháp":"fr",
    "Tiếng Trung(Phồn thể)":"zh-tw",
    "Tiếng Trung(Giản thể)":"zh",
    "Tiếng Nhật":"ja",
    "Tiếng Việt":"vi"
}

btn.addEventListener('click',()=>{
    Translate();
    body.removeChild(btn);
    btnCreate = false;
    btnClick = true;
});
btn.setAttribute('class','some-btn');
btn.style.position = 'absolute';
btn.innerText = 'Dịch';

div.addEventListener('mouseover',()=>{
    divTouch = true;
});
div.addEventListener('mouseout',()=>{
    divTouch = false;
});
div.setAttribute('class','trans-div');
div.style.position = 'absolute';

var select = document.createElement('select');
var language = Object.keys(lang);
select.setAttribute('class','select');
select.onchange = (e)=>{
    inputLang = e.target.value;
    translang.innerText = language.find(key => lang[key] === inputLang);
    GetData(transtext, inputLang);
};
language.forEach((e)=>{
    var option = document.createElement('option');
    option.setAttribute('value',lang[e]);
    option.innerText = e;
    if(e == 'Tiếng Việt'){
        option.setAttribute('selected','selected');
    }
    select.appendChild(option);
});

var input = document.createElement('p');
input.setAttribute('class','input-text');
var translang = document.createElement('h4')
translang.setAttribute('class','trans-lang');
translang.innerText = 'Tiếng Việt';
var output = document.createElement('p');
output.setAttribute('class','output-text');

div.appendChild(select);
div.appendChild(input);
div.appendChild(translang);
div.appendChild(output);

const Translate = ()=>{
    transtext = text;
    let position = window.getSelection().getRangeAt(0).getBoundingClientRect();
    let pageY = window.pageYOffset || document.documentElement.scrollTop;
    div.style.left =`${position.x - (300-position.width)/2}px`;
    div.style.top =`${position.y + position.height + pageY + 15}px`;
    input.innerText = transtext;
    body.appendChild(div);
    setTimeout(()=>{div.style.opacity = '1'}, 10);
    divCreate = true;

    GetData(transtext,inputLang);
}

function Button(e) {
    setTimeout(()=>{
        text = window.getSelection().toString();
        if(text && text.length <= 1000 && !btnCreate && !btnClick && !divCreate) {
            btnCreate = true;
            btn.style.left =`${e.pageX - 20}px`;
            btn.style.top =`${e.pageY - 30}px`;
            body.appendChild(btn);
        }
        else if(!text && btnCreate) {
            body.removeChild(btn);
            btnCreate = false;
        }
    },10)
}

document.addEventListener('mouseup', (e)=>{ Button(e)});
document.addEventListener('mousedown', (e)=>{
    if(divCreate && !divTouch){
        div.style.opacity = '0';
        setTimeout(()=>{body.removeChild(div)},600);
        divCreate = false;
    }
    btnClick = false;
    Button(e)
});

async function GetData(text, lang) {
    let data = {
        text:text,
        lang:lang
    }
    let res = await fetch(url,{
        "method":"POST",
        "headers":{
            "Content-Type": "application/json"
        },
        "body":JSON.stringify(data)
    });
    let result = await res.json();
    output.innerText = result.result;
}
