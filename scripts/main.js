//-----------------GLOBAL VARIABLES-----------------//

var notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
];

var matchingArray = [{
    "C#": "Db",
    "D#": "Eb",
    "F#": "Gb",
    "G#": "Ab",
    "A#": "Bb"
}];

scales = Array();
scales['major'] = Array(0, 2, 4, 5, 7, 9, 11);
scales['minor'] = Array(0, 2, 3, 5, 7, 8, 10);
scales['major-pentatonic'] = Array(0, 2, 4, 7, 9);
scales['minor-pentatonic'] = Array(0, 3, 5, 7, 10);
scales['ionian'] = Array(0, 2, 4, 5, 7, 9, 11);
scales['dorian'] = Array(0, 2, 3, 5, 7, 9, 10);
scales['phrygian'] = Array(0, 1, 3, 5, 7, 8, 10);
scales['lydian'] = Array(0, 2, 4, 6, 7, 9, 11);
scales['mixolydian'] = Array(0, 2, 4, 5, 7, 9, 10);
scales['aeolian'] = Array(0, 2, 3, 5, 7, 8, 10);
scales['locrian'] = Array(0, 1, 3, 5, 6, 8, 10);
scales['whole-tone'] = Array(0, 2, 4, 6, 8, 10);

stringTuning = Array();
stringTuning['standard'] = Array('E', 'B', 'G', 'D', 'A', 'E');
stringTuning['drop-d'] = Array('E', 'B', 'G', 'D', 'A', 'D');
stringTuning['dadgad'] = Array('D', 'A', 'G', 'D', 'A', 'D');
stringTuning['open-g'] = Array('D', 'B', 'G', 'D', 'G', 'D');
stringTuning['perfect-fourths'] = Array('F', 'C', 'G', 'D', 'A', 'E');
stringTuning['major-thirds'] = Array('C', 'G#', 'E', 'C', 'G#', 'E');

//-----------------FUNCTION DEFINITIONS-----------------//

function flatToSharp(flatNote, matchingArray) {
    return (Object.keys(matchingArray[0]).find(key => matchingArray[0][key] === flatNote));
}

function sharpToFlat(sharpNote, matchingArray) {
    return matchingArray[0][sharpNote];
}

function getStringNoteNames(stringRootNote, notes) {
    var notesRearrange = notes.slice(0);
    var noteIndex = notesRearrange.indexOf(stringRootNote.toString());
    var newNoteSet = (notesRearrange.splice(noteIndex, (notesRearrange.length - noteIndex))).concat(notesRearrange.splice(0, noteIndex))
    var completeNoteSet = newNoteSet.concat(newNoteSet);
    completeNoteSet.push(completeNoteSet[0]);
    return completeNoteSet;
}

// Needs sharp to flat conversion
function displayOnFretboard(scaleRootNote, stringRootNote, stringNumber, scalePattern, notes) {
    var workingNoteSet = getStringNoteNames(stringRootNote, notes);
    var workingScalePattern = scalePattern.slice(0);
    var noteAdd = workingNoteSet.indexOf(scaleRootNote.toString());
    for (var a = 0; a < workingScalePattern.length; a++) {
        workingScalePattern[a] += noteAdd;
        if (workingScalePattern[a] >= 12) {
            workingScalePattern[a] -= 12;
        }
    }
    workingScalePattern.sort(function(a, b) {
        return a - b;
    });
    var patternAboveTwelve = workingScalePattern.slice(0);
    for (var b = 0; b < patternAboveTwelve.length; b++) {
        patternAboveTwelve[b] += 12;
    }
    var fullFretNumbers = workingScalePattern.concat(patternAboveTwelve);
    for (var c = 0; c < fullFretNumbers.length; c++) {
        if (fullFretNumbers[c] === 12) {
            fullFretNumbers.push(24);
        }
    }
    var fretDisplayHtml = '';
    for (var fretCounter = 0; fretCounter < fullFretNumbers.length; fretCounter++) {
        var highlightRoot = '';
        if ((fullFretNumbers[fretCounter] === noteAdd) || (fullFretNumbers[fretCounter] === noteAdd + 12) || (fullFretNumbers[fretCounter] === noteAdd + 24)) {
            highlightRoot = 'scale-root-note';
        }
        fretDisplayHtml += '<div class="note-marker string-' + stringNumber + ' fret-' + fullFretNumbers[fretCounter] + ' ' + highlightRoot + '"><span>' + workingNoteSet[fullFretNumbers[fretCounter]] + '</span></div>';
    }
    return fretDisplayHtml;
}

function displayLoopAllStrings(selectedKey, selectedScale, selectedTuning, notes) {
    var allStringsResult = '';
    for (var stringCounter = 0; stringCounter < selectedTuning.length; stringCounter++) {
        var stringName = ((selectedTuning[stringCounter]).toString());
        allStringsResult += displayOnFretboard(selectedKey, stringName, (stringCounter + 1), selectedScale, notes);
    }
    return allStringsResult;
}

function displayCurrentTuning(selectedTuning) {
    var tuningDisplayHtml = '';
    for (var stringCounter = 0; stringCounter < selectedTuning.length; stringCounter++) {
        tuningDisplayHtml += '<div class="tuning-note-marker string-' + (stringCounter + 1) + '"><span>' + ((stringCounter + 1) + (selectedTuning[stringCounter])) + '</span></div>';
    }
    return tuningDisplayHtml;
}

function toggleCustomTuning(tuningDropdownValue) {
    console.log('inside toggle function');
    if (tuningDropdownValue === "custom") {
        $(".custom-tuning-select").show();
    } else {
        $(".custom-tuning-select").hide();
    }
}

//-----------------CALLING FUNCTIONS-----------------//

$('#showNotesOnFretboard').on('click', function() {
    // reset output to avoid build up of incorrect notes
    var allStringsOutput = '';
    // harvest key, scale, and tuning values from user input
    var selectedKey = $("#keySelect").val();
    var selectedScale = $("#scaleSelect").val();
    // conditional check to see whether a predefined or custom user supplied tuning is being used
    if ($("#tuningSelect").val() === 'custom') {
        var customInputTuning = $("input[name='userTuningInputValue']").val();
        // use regex to pares user tuning value into array
        var customTuning = customInputTuning.match(/([A-G](b|#)?)/g).reverse();
        var outputTuning = customTuning;
    } else {
        var predefinedInputTuning = $("#tuningSelect").val();
        var predefinedTuning = stringTuning[predefinedInputTuning];
        var outputTuning = predefinedTuning;
    }

    // conditional check that all necessary pieces of information are supplied
    if ((selectedKey === 'select') || (selectedScale === 'select')) {
        alert('Please select both a key and scale.');
    }

    // Run displayOnFretboard for all 6 strings given user selected tuning, scale, and key
    var allStringsOutput = displayLoopAllStrings(selectedKey, scales[selectedScale], outputTuning, notes);
    // append HTML of notes to fretboard
    $('.notes-display').html(allStringsOutput);
    // fill tuning HTML template with values from selected tuning
    var tuningOutput = displayCurrentTuning(outputTuning);
    // append HTML of selected tuning to display current tuning
    $('.tuning').html(tuningOutput);
});

$(".custom-tuning-select").hide();
$("#tuningSelect").change(function() {
    var tuningDropdownValue = $("#tuningSelect").val();
    toggleCustomTuning(tuningDropdownValue);
});



// console.log(flatToSharp('Bb', matchingArray));
// console.log(sharpToFlat('G#', matchingArray));
