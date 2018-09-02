var sample1 = new Howl({
    src: ['sounds/bass.wav'],
    preload:true
});
var sample2 = new Howl({
    src: ['sounds/hat.wav'],
    preload:true
});
var sample3 = new Howl({
    src: ['sounds/snare.wav'],
    preload:true
});
var sample4 = new Howl({
    src: ['sounds/snare2.wav'],
    preload:true
});
var playingSamples = [];
var loop = [];

var testTimer;
var timeCounter=0;

//number of bars
var fullBar = 3;
var timer = new Timer();
var bpm = 120;
var Ibpm; //interval timing

var positionInBar = 0;
var positionInLoop = 0;
var currentlyPlaying = false;
var currentlyMuted = false;

var barHtml = "<div class='bar'><div class='beat'><div class='note'></div><div class='note'></div><div class='note'></div><div class='note'></div><div class='position'><div class='dot'></div></div></div><div class='beat'><div class='note'></div><div class='note'></div><div class='note'></div><div class='note'></div><div class='position'><div class='dot'></div></div></div><div class='beat'><div class='note'></div><div class='note'></div><div class='note'></div><div class='note'></div><div class='position'><div class='dot'></div></div></div><div class='beat'><div class='note'></div><div class='note'></div><div class='note'></div><div class='note'></div><div class='position'><div class='dot'></div></div></div></div>"

var beatHtml = "<div class='beat' id='channelVolume'></div>";
var addBarHtml = "<div id='addBar'><div>XXX</div></div>";

$(document).ready(function(){
    createChannelVolumeControls();
    Ibpm = 60000/bpm;

    $('body').on('click','#addBar', function(){
        $('#channelVolume').remove()
        $(this).parent().append(barHtml);
        $(this).remove();
        fullBar++;
        calculateLoop(fullBar);
        $('#containter').append(addBarHtml);
        createChannelVolumeControls();
    })

    $('body').on("click",'.note', function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
        }
        else{
            $(this).addClass('selected');
        }
        if(currentlyPlaying){
            calculateLoop(fullBar);
        }
    });

    $('#play').on("click", function(){
        calculateLoop(fullBar);
        currentlyPlaying = true;
        console.log(loop);
        
        //500 = 120bpm
        testTimer = setInterval(function(){
            //represents total number of intervals
            timeCounter++;
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
            determinePosition();

            
        }, Ibpm);

    })

    $('#pause').on('click', function(){
        stopSamples();
        clearInterval(testTimer);
        console.log(secondsToHms(elapsedTime()/1000));
    })

    $('#stop').on('click',function(){
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
            Howler.mute(true);
            currentlyMuted = true;
        }
        else{
            Howler.mute(false);
            currentlyMuted = false;
        }
    })

    $('#bpm_slider').on('change', function(){
        bpm = sliderBPM($(this).val());
        timeBetweenBeats = (600/bpm);
        console.log(bpm);
        console.log(timeBetweenBeats);
    })
    $('#volume_slider').on('change', function(){
        Howler.volume($(this).val());
    })
    $('body').on('change', '.individualVolume', function(){
        var controlId = $(this).attr('id');
        var volumeValue = $('#'+controlId+' input').val();
        var sampleId = controlId.split('indiv')[1];
        console.log(volumeValue);
        sampleFromIndivId(sampleId).volume(volumeValue);
    })

    timer.addEventListener('secondsUpdated', function (e) {
        $('#hours').html(timer.getTimeValues().hours);
        $('#minutes').html(':'+timer.getTimeValues().minutes+':');
        $('#seconds').html(timer.getTimeValues().seconds);
    })
});

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
        var playing1 = sample1.play();
        playingSamples.push(playing1);
    }
    if(noteCode == 2){
        var playing2 = sample2.play();
        playingSamples.push(playing2);
    }
    if(noteCode == 3){
        var playing3 = sample3.play();
        playingSamples.push(playing3);
    }
    if(noteCode == 4){
        var playing3 = sample1.play();
        playingSamples.push(playing4);
    }
    
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
function createChannelVolumeControls(){
    $('div.bar:nth-child('+ fullBar +')').append(beatHtml);

    for(i=1; i <=4; i++){
        var channelVolumeHtml ='<div class="individualVolume" id="indiv'+i+'"><input type="number" min="0.0" max="1.0" step="0.1" val="1.0"></div>';
        $('#channelVolume').append(channelVolumeHtml);
    }
    
}
//returns the total amount of milliseconds that have elapsed since starting.
function elapsedTime(){
    var totalElapsedTimer = timeCounter*Ibpm;
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
    return hDisplay + mDisplay + sDisplay; 
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

