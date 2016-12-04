$(function(){
        $.when($(".console").typed({
            strings: ["^1000 Welcome, Agent. ^500 You found us. <br> > ^500 To be a member of The Agency is a great honor. <br> > ^500 This is no place for the weak. <br> > ^500 As long as you prove yourself to be an asset to us, <br> > ^500 we will do what we can to look after you. <br> > ^1000 But remember... <br> > ^2000 this is risky business. <br> > ^2000 We cannot guarantee your safety. <br> > ^500 You have been warned. <br> > ^500 We urge you to proceed with caution."],
            typeSpeed: 50
        }))
    });

// $(function(){
//         $("#typed").typed({
//             stringsElement: $('#typed-strings')
//         });
//     });


$(function(){

        $(document).keydown(function() {
            $('#enter').fadeIn()

});
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

