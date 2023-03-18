// prevents the user from entering bad characters in input that could break the python code :(
$('input').on('keypress', function (e) {
  if(e.keyCode==13){return true};
  if (e.which < 46 && e.which == 47 && e.which!=32 && e.which != 33|| 
    (e.which > 57 && e.which < 63 && e.which == 64) || 
    (e.which > 90 && e.which < 97) ||
    e.which > 122) {
    e.preventDefault();
}
// console.log(e.keyCode)
});

var wordArrayJson=[];
// makes a li for available words in signFiles

function test_list()
{
    
    let ul = document.querySelector(".test_list");
    fetch('static/js/sigmlFiles.json')
    .then(response => response.json())
     .then((data)=>
     {
         data.forEach((e)=>
         {
            // let word = e.name;
            let tempjson = {word:e.name};
            wordArrayJson.push(tempjson);
             let li=document.createElement("li");
            //  li.appendChild(document.createTextNode(e.name));
            li.innerHTML=`<a href="#player" onclick="setSiGMLURL('SignFiles/${e.name}.sigml');" > ${e.name}</a>`
            ul.appendChild(li);
            // console.log(e.name);
         });
     });

}
test_list();

// word array for playing words
var wordArray=[];
var pauseArray=[];

// stops a tag from redirecting
$('a').click(function(event){
    event.preventDefault();
  });

// stops submit button from submitting the form 
let form =  document.getElementById('form');
form.addEventListener('submit', function(event) {
    event.preventDefault();
});


let sub =  document.getElementById('submit');
  sub.addEventListener('click',()=>
  {

    let input =  document.getElementById('text').value;
    console.log("INPUT is ",input);
    display_curr_word("Summarizing and processing...")
    // ajax request to get the response from flask in json and play the words
      $.ajax({
          url:'/',
          type:'POST',
          data:{text:input},
          success: function(res)
          {
            convert_json_to_arr(res);
            play_each_word();
            display_isl_text(res);
          },
          error: function(xhr)
          {
            console.log(xhr);
          }
      });
  });

  // displays isl text 
function display_isl_text(words)
  {
      let p = document.getElementById("isl_text");
      p.innerHTML="→";
      Object.keys(words).forEach(function(key) 
      {
        if(key !== "0"){
          if(pauseArray.includes(Number(key))){
            p.innerHTML += "<br>"
            p.innerHTML += "→"
          }
          p.innerHTML+= words[key]+" ";
        }
      });
  }
// displays currently playing word/letter
  function display_curr_word(word)
  {
      let p = document.querySelector(".curr_word_playing");
      p.innerHTML=word;
      p.style="color:Red; font-size:24px;font-decoration:bold;";
  }

  // displays error message if some error is there
  function display_err_message()
  {
   
    let p = document.querySelector(".curr_word_playing");
    p.innerHTML="Some error occurred (Probably Sigml file of the word/letter is not proper)";
    p.style="color:Red; font-size:24px;font-decoration:bold;";
  }

// converts the returned  json to array
function convert_json_to_arr(words)
{
    wordArray=[];
    console.log("wordArray",words);
    Object.keys(words).forEach(function(key) {
        if(key === "0"){
          pauseArray=words[key];
        }
        else{
          wordArray.push(words[key]);
        }
    });
    console.log("wordArray",wordArray);
}

function sleep(ms, f)
{
    return(
        setTimeout(f, ms)
    )
}
// plays each word
function play_each_word(){
  totalWords = wordArray.length;
  i = 0;
  var int = setInterval(function () {
      if(i == totalWords) {
          if(playerAvailableToPlay) {
              clearInterval(int);
              finalHint = $("#inputText").val();
              $("#textHint").html(finalHint);
              document.querySelector("#submit").disabled=false;
          }
          else{
            display_err_message();
            document.querySelector("#submit").disabled=false;
          }
      } else if(playerAvailableToPlay) {
              playerAvailableToPlay = false;
              
              startPlayer("SignFiles/" + wordArray[i]+".sigml");
              display_curr_word(wordArray[i]);
              console.log("CURRENTLY PLAYING",wordArray[i]);
              document.querySelector("#submit").disabled=true;
              i++;
            //   playerAvailableToPlay=true;
          }
         else {
            let errtext = $(".statusExtra").val(); 
            console.log("ERROR:- ", "Some error occurred (Probably Sigml file of the word/letter is not proper)");
            display_err_message();
            if(errtext.indexOf("invalid") != -1) {
                playerAvailableToPlay=true;
                document.querySelector("#submit").disabled=false;
            }
         }
  }, 1000);
};


// sets the avatarLoaded to true 
var loadingTout = setInterval(function() {
    if(tuavatarLoaded) {
        // $("#loading").hide();
        clearInterval(loadingTout);
        console.log("Avatar loaded successfully !");
    }
}, 1500);

