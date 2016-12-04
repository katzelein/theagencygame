$(function(){
        $.when($(".console").typed({
            strings: ["First <br> sentence."],
            typeSpeed: 30
        })).done(function(){
        $(".console1").delay(10000).typed({
            strings: ["Second sentence."],
            typeSpeed: 0
        })
    })
    });

// function first(){
//         $(".console").typed({
//             strings: ["First sentence."],
//             typeSpeed: 0
//         });
//     }();

// $(function(){
//         $(".console1").typed({
//             strings: ["Second sentence."],
//             typeSpeed: 0
//         });
//     });

// $(function(){
// 		$(".console1").css("display", "inherit");
//         $(".console1").typed({
//             strings: ["konquer -r /world"],
//             typeSpeed: 30, // typing speed
//             backDelay: 750, // pause before backspacing
//             loop: false, // loop on or off (true or false)
//             loopCount: false, // number of loops, false = infinite
// 	})
//     })

// $(setTimeout(function(){
//         $(".console").typed({
//             strings: ["apt-get install konquer"],
//             typeSpeed: 30, // typing speed
//             backDelay: 750, // pause before backspacing
//             loop: false, // loop on or off (true or false)
//             loopCount: false, // number of loops, false = infinite
//             callback: function(){ } // call function after typing is done
//         });
//     }, 0));

// function first(){
//     var srcText = $("#src1").text()//.trim();
//          i = 0;
//      result = srcText[i];
//      console.log("IN FIRST")
//      console.log("SOURCE TEXT: " ,srcText[i])
//     setInterval(function() {
//         if(i == srcText.length-1) {
//             clearInterval(this);
//             return;
//         };
//         i++;
//         console.log("SOURCE TEXT: " ,srcText[i])
//         result += srcText[i];
//         $("#target1").text(result);

//     }, 150); // the period between every character and next one, in milliseonds.
// }


// $.when($(function(){
//         $(".console").typed({
//             strings: ["First sentence."],
//             typeSpeed: 0
//         })
//     })
// ).done(
// function(){
//     $(".console1").typed({
//             strings: ["Second sentence."],
//             typeSpeed: 0
//         })
//     }
// );

// function Typer(callback){
//         $(".console").typed({
//             strings: ["First sentence."],
//             typeSpeed: 0
//         });
// }


// $(Typer(function{

// }));


// $.when( Typer() ).done(function() {
//        playBGM();
// });

