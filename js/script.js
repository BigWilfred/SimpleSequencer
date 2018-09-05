var sample1 = new Howl({
    src: ['sounds/1.wav'],
    preload:true
});
var sample2 = new Howl({
    src: ['sounds/2.wav'],
    preload:true
});
var sample3 = new Howl({
    src: ['sounds/3.wav'],
    preload:true
});
var sample4 = new Howl({
    src: ['sounds/4.wav'],
    preload:true
});
var playingSamples = [];
var loop = [];

var testTimer;
var timeCounter=0;

//number of bars
var fullBar = 4;
var bpm = 120;
var Ibpm; //interval timing

var positionInBar = 0;
var positionInLoop = 0;
var targetCounter = 1;
var currentlyPlaying = false;
var currentlyMuted = false;

var barHtml = "<div class='bar'><div class='beat'><div class='note'></div><div class='note'></div><div class='note'></div><div class='note'></div><div class='position'><div class='dot'></div></div></div><div class='beat'><div class='note'></div><div class='note'></div><div class='note'></div><div class='note'></div><div class='position'><div class='dot'></div></div></div><div class='beat'><div class='note'></div><div class='note'></div><div class='note'></div><div class='note'></div><div class='position'><div class='dot'></div></div></div><div class='beat'><div class='note'></div><div class='note'></div><div class='note'></div><div class='note'></div><div class='position'><div class='dot'></div></div></div></div>"

var beatHtml = "<div class='beat' id='channelVolume'></div>";
var addBarHtml = "<div id='addBar'><div><img src='img/plus.svg'></div></div>";

$(document).ready(function(){
    createChannelVolumeControls();
    Ibpm = 60000/bpm;

    //sets the starting value of the volume sliders
    $('#volume_slider').val(1.0);
    $('.individualVolume input').val(1.0);


    $('body').on('click','#addBar', function(){


        $('#sequenceContainer .bar:last-of-type').css('padding-right','0');
        fullBar++;
        calculateLoop(fullBar);
        $('#sequenceContainer').append(barHtml);

        $('#sequenceContainer').css('justify-content', 'left');
        $('#sequenceContainer .bar:last-of-type').css('padding-right','3vw');

        if(!currentlyPlaying){
            //scroll to the new bar
            $('#sequenceContainer .bar:last-of-type').velocity("scroll", { axis: "x" });
        }
        
    })

    $('body').on("click",'.note', function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');

        }
        else{
            $(this).addClass('selected');
            if(!currentlyPlaying){
                playSample(getClickedNote(this));
            }
            
        }
        if(currentlyPlaying){
            calculateLoop(fullBar);
        }
        
    });

    $('#play').on("click", function(){
        $('#play img').attr('src','img/pause.svg');
        if(!currentlyPlaying){
            playLoop();
        }
        else{
            $('#play img').attr('src','img/play.svg');
            stopSamples();
            clearInterval(testTimer);
            currentlyPlaying=false;
        }
    })

    $('#stop').on('click',function(){
        $('div#time').html('0:0:0');
        $('#play img').attr('src','img/play.svg');
        currentlyPlaying = false;
        loop=[];
        positionInBar = 0;
        positionInLoop = 0;
        $('.dot').removeClass('active');
        stopSamples();
        clearInterval(testTimer);
        timeCounter = 0;
        $('#hours').html('0');
        $('#minutes').html(':0:');
        $('#seconds').html('0');
    })

    $('body').on('click', '#clear', function(){
        $('.selected').removeClass('selected');
        calculateLoop(fullBar);
    })

    $('body').on('click', '#mute', function(){
        if(!currentlyMuted){
            $('#mute img').attr('src','test');
            Howler.mute(true);
            currentlyMuted = true;
        }
        else{
            $('#mute img').attr('src','img/speaker.svg');
            Howler.mute(false);
            currentlyMuted = false;
        }
    })

    $('#bpm input').on('change', function(){
        bpm = $(this).val();
        timeBetweenBeats = (600/bpm);
        console.log(bpm);
        Ibpm =60000/bpm;
        clearInterval(testTimer);
        playLoop();
    })
    $('#volume_slider').on('change', function(){
        Howler.volume($(this).val());
    })
    $('body').on('change', '.individualVolume', function(){
        var controlId = $(this).attr('id');
        var volumeValue = $('#sequencerControls #'+controlId+' input').val();
        var sampleId = controlId.split('indiv')[1];

        console.log(volumeValue);
        sampleFromIndivId(sampleId).volume(volumeValue);
    })

});

function playLoop(){
    calculateLoop(fullBar);
    console.log(loop);
    currentlyPlaying = true;
    testTimer = setInterval(function(){
        //check to see if window 

        //represents total number of intervals
        timeCounter++;
        $('div#time').html(secondsToHms(elapsedTime()));
        stopSamples();

        for(j=0; j < loop[positionInLoop][positionInBar].length; j++){
            playSample(loop[positionInLoop][positionInBar][j]);
        }
        var currentBeat = parseInt(positionInBar)+1;
        var currentBar = parseInt(positionInLoop)+1;
        if(positionInBar ==0 && positionInLoop == 0){
            $('.dot').removeClass('active');
        }
        $('div.bar:nth-child('+ currentBar +') > div:nth-child('+ currentBeat+') > div:nth-child(5) > div:nth-child(1)').addClass('active');

        scrollScreen();

        determinePosition();
    }, Ibpm);
}

function calculateBarNotes(barNumber){
    var bar =[];
    for(j=1;j<=4;j++){
        var beatSound =[];
        for(i=1; i<=4; i++){
            if($('div.bar:nth-child('+ barNumber +') > div.beat:nth-child('+ j +') > div:nth-child('+ i +')').hasClass('selected')){
                beatSound.push(i);
            }
        }
        bar.push(beatSound);
    }

    loop.push(bar);
}

function calculateLoop(totalBars){
    loop = [];

    for(k=1; k <= totalBars; k++){  
        calculateBarNotes(k.toString());
    }
}
function playSample(noteCode){
    
    if(noteCode == 1){
        sample1.play();
    }
    if(noteCode == 2){
        sample2.play();
    }
    if(noteCode == 3){
        sample3.play();
    }
    if(noteCode == 4){
        sample4.play();
    }
    
}
function getClickedNote(selector){
    if($(selector).is(':first-child')) return 1;
    if($(selector).is(':nth-child(2)')) return 2;
    if($(selector).is(':nth-child(3)')) return 3;
    if($(selector).is(':nth-child(4)')) return 4;
}
function stopSamples(){
    sample1.stop();
    sample2.stop();
    sample3.stop();
    sample4.stop();
}
function determinePosition(){
    //still within the same bar
    if(positionInBar !=3){
        positionInBar++;
    }
    //about to go to next bar
    else{
        positionInBar=0;
        if(positionInLoop != (fullBar-1)){
            positionInLoop++;
        }
        else{
            
            positionInLoop=0;
        }
        
    }
}

function scrollScreen(){
    var limit = fullBar*4;
    if((timeCounter-1) % limit == 0){
        $('#sequenceContainer').velocity("scroll", { axis: "x" });
    }
    //move towards the right as the loop is playing
    if(positionInLoop > 1 && fullBar >4){
        $('#sequenceContainer .bar:nth-of-type('+ (positionInLoop - 1) +') .beat:nth-of-type('+(positionInBar+1)+')').velocity("scroll", { axis: "x" });
    }
}

function createChannelVolumeControls(){
    $('div.bar:nth-child('+ fullBar +')').append(beatHtml);

    for(i=1; i <=4; i++){
        var channelVolumeHtml ='<div class="individualVolume" id="indiv'+i+'"><input type="number" min="0.0" max="1.0" step="0.1" val="1.0"></div>';
        $('#channelVolume').append(channelVolumeHtml);
    }
    $('#channelVolume').append("<div class='position'><div class='dot'></div></div>");
}
//returns the total amount of seconds that have elapsed since starting.
function elapsedTime(){
    var totalElapsedTimer = timeCounter*Ibpm/1000;
    return totalElapsedTimer;
}
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    //return hDisplay + mDisplay + sDisplay; 
    var display = h+":"+m+":"+s;
    return display;
}
function sliderBPM(value){
    if(value == 4) return 600;
    if(value == 3) return 300;
    if(value == 2) return 120;
    if(value == 1) return 60;
}
function sampleFromIndivId(id){
    if(id ==1) return sample1;
    if(id ==2) return sample2;
    if(id ==3) return sample3;
    if(id ==4) return sample4;
}

