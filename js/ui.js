var sequencerControlsOut = false;

$(document).ready(function(){
    $('body').on('click', '#opener', function(){
        if(!sequencerControlsOut){
            $('#sequencerControls > div:nth-of-type(2)').css('display', 'flex');
            $('#specificControls').css('display', 'flex');
            $('#sequencerControls').velocity({width:'8vw'});
            sequencerControlsOut = true;
        }
        else{
            $('#sequencerControls > div:nth-of-type(2)').css('display', 'none');
            $('#specificControls').css('display', 'none');
            $('#sequencerControls').velocity({width:'1.5vw'});
            sequencerControlsOut = false;
        }
    })
})
