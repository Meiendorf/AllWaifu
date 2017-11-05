var lines = verbs.split(":");
var verb = [];
    for (var line in lines){
        verb.push(lines[line].split("|"));
    }
var num = 0
function capitalize(s){
    return s && s[0].toUpperCase() + s.slice(1);
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
$(document).ready(function(){
    $("#ques").click(function(){
        num = getRandomInt(0, verb.length);
        $("#que").text(capitalize(verb[num][3]));
        $("#anss").text("");
    });
    $("#answ").click(function(){
        text = verb[num][0]+" | "+verb[num][1]+" | "+verb[num][2]
        $("#anss").text(capitalize(text))
    });
});
