$(function(){
        $(".target1").typed({
            strings: ["First sentence."],
            typeSpeed: 0
        });
    })();

$(function(){
        $(".target2").typed({
            strings: ["Second sentence."],
            typeSpeed: 0
        });
    });

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

// var one = $(function(){
//     var srcText = $("#src1").text()//.trim();
//    		i = 0;
//     	result = srcText[i];
//     	console.log("SOURCE TEXT: " ,srcText[i])
//     setInterval(function() {
//         if(i == srcText.length-1) {
//             clearInterval(this);
//             return;
//         };
//         i++;
//         console.log("SOURCE TEXT: " ,srcText[i])
//         result += srcText[i].replace("\n", "<br />");
//         result = result.replace("\n", "<br />")
//         $("#target1").text(result);

//     }, 150); // the period between every character and next one, in milliseonds.
// });

// var two = $(function(){
//     var srcText2 = $("#src2").text()//.trim();
//    		x = 0;
//     	result2 = srcText2[x];
//     setInterval(function() {
//         if(x == srcText2.length-1) {
//             clearInterval(this);
//             return;
//         };
//         i++;
//         result2 += srcText2[x];
//         $("#target2").text(result2);

//     }, 150); // the period between every character and next one, in milliseonds.
// });



// function first(){
//     var srcText = $("#src1").text()//.trim();
//    		i = 0;
//     	result = srcText[i];
//     	console.log("IN FIRST")
//     	console.log("SOURCE TEXT: " ,srcText[i])
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

// function second(){
//     var srcText = $("#src2").text()//.trim();
//    		i = 0;
//     	result = srcText[i];
//     	console.log("IN SECOND")
//     setInterval(function() {
//         if(i == srcText.length-1) {
//             clearInterval(this);
//             return;
//         };
//         i++;
//         result += srcText[i];
//         $("#target2").text(result);

//     }, 150); // the period between every character and next one, in milliseonds.
}


// $.when(one()).done(function(){
// 	two()
// });

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


// $(document).ready(function(){
// 	$.when(first()).done(function(){second});

// })









