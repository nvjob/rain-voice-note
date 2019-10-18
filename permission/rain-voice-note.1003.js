/*!
 * Rain Voice Note 1.0.0.3 - https://nvjob.github.io/dlog/rain-voice-note.html
 * (c) 2016-2019 #NVJOB Nicholas Veselov - https://nvjob.github.io
 * GNU General Public License v3.0
 */
 
var langs = [
    ['English', ['en-US']],
    ['Pусский', ['ru-RU']]
];

for (var i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
}

select_language.selectedIndex = 0;
select_dialect.selectedIndex = 0;
select_dialect.style.display = 'none';

updateCountry();

function updateCountry() {
    for (var i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    var list = langs[select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    rainvn_mic_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = function() {
        recognizing = true;
        mic_button_img.src = 'rainvn_load.gif';
    };

    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        mic_button_img.src = 'rainvn_mic_button.png';
        if (!final_transcript) {
            return;
        }
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById('rainvn_text_final'));
            window.getSelection().addRange(range);
        }
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_transcript = capitalize(final_transcript);
        rainvn_text_final.innerHTML = linebreak(final_transcript);
        rainvn_text_interim.innerHTML = linebreak(interim_transcript);
        if (final_transcript || interim_transcript) {
            showButtons('inline-block');
        }
    };
}

function upgrade() {
    rainvn_mic_button.style.visibility = 'hidden';
}

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}
var first_char = /\S/;

function capitalize(s) {
    return s.replace(first_char, function(m) {
        return m.toUpperCase();
    });
}

function rainvnMicButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = select_dialect.value;
    recognition.start();
    ignore_onend = false;
    rainvn_text_final.innerHTML = '';
    rainvn_text_interim.innerHTML = '';
    mic_button_img.src = 'rainvn_mic_button.png';
    showButtons('none');
    start_timestamp = event.timeStamp;
}

var current_style;

function showButtons(style) {
    if (style == current_style) {
        return;
    }
    current_style = style;
    copy_button.style.display = style;
    email_button.style.display = style;
    copy_info.style.display = 'none';
    email_info.style.display = 'none';
}
