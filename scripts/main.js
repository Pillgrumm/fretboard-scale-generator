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

var matchingSharpAndFlat = [{
    "C#": "Db",
    "D#": "Eb",
    "F#": "Gb",
    "G#": "Ab",
    "A#": "Bb",
}];

var matchingEnharmonic = [{
    "Fb": "E",
    "E#": "F",
    "Cb": "B",
    "B#": "C"
}];

var accidentalState = '';

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
scales['harmonic-minor'] = Array(0, 2, 3, 5, 7, 8, 11);
scales['melodic-minor'] = Array(0, 2, 3, 5, 7, 9, 11);
scales['whole-tone'] = Array(0, 2, 4, 6, 8, 10);
scales['whole-half-diminished'] = Array(0, 2, 3, 5, 6, 8, 9, 11);
scales['half-whole-diminished'] = Array(0, 1, 3, 4, 6, 7, 9, 10);
scales['chromatic'] = Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);


stringTuning = Array();
stringTuning['standard'] = Array('E', 'B', 'G', 'D', 'A', 'E');
stringTuning['half-step-down'] = Array('D#', 'A#', 'F#', 'C#', 'G#', 'D#');
stringTuning['full-step-down'] = Array('D', 'A', 'F', 'C', 'G', 'D');
stringTuning['drop-d'] = Array('E', 'B', 'G', 'D', 'A', 'D');
stringTuning['dadgad'] = Array('D', 'A', 'G', 'D', 'A', 'D');
stringTuning['open-g'] = Array('D', 'B', 'G', 'D', 'G', 'D');
stringTuning['perfect-fourths'] = Array('F', 'C', 'G', 'D', 'A', 'E');
stringTuning['major-thirds'] = Array('C', 'G#', 'E', 'C', 'G#', 'E');

// Tuning Arrays for Testing
// stringTuning['allflats'] = Array('Cb', 'Fb', 'Gb', 'Db', 'A', 'E#');
// stringTuning['allsharps'] = Array('E#', 'B#', 'G#', 'D#', 'A', 'F');



//-----------------FUNCTION DEFINITIONS-----------------//

// function to convert a single flat note to a sharp
function flatToSharp(flatNote, matchingSharpAndFlat) {
    return Object.keys(matchingSharpAndFlat[0]).find(function(key) {
        return matchingSharpAndFlat[0][key] === flatNote;
    });
}

// function to convert a single sharp note to a flat
function sharpToFlat(sharpNote, matchingSharpAndFlat) {
    return matchingSharpAndFlat[0][sharpNote];
}

// function to correct enharmonic equivalents
function correctEnharmonic(accidentalNote, matchingEnharmonic) {
    return matchingEnharmonic[0][accidentalNote];
}

// function to convert an array of notes which may contain flats to sharps where applicable
function arrayFlatToSharp(flatNoteArray, matchingSharpAndFlat) {
    // copy supplied array of notes
    convertedArray = flatNoteArray.slice(0);
    // loop through all notes
    for (var string = 0; string < flatNoteArray.length; string++) {
        // regex test for flats is true
        if (/([A-G])b/.test(flatNoteArray[string]) === true) {
            // convert note to sharp
            convertedNote = flatToSharp(flatNoteArray[string], matchingSharpAndFlat);
            // replace note in array with its converted equivalent
            convertedArray[string] = convertedNote;
        }
    }
    // return complete array with all of the flat to sharp conversions in place
    return convertedArray;
}

// function to convert an array of notes which may contain sharps to flats where applicable
function arraySharpToFlat(sharpNoteArray, matchingSharpAndFlat) {
    // copy supplied array of notes
    convertedArray = sharpNoteArray.slice(0);
    // loop through all notes
    for (var string = 0; string < sharpNoteArray.length; string++) {
        // regex test for sharps is true
        if (/([A-G])#/.test(sharpNoteArray[string]) === true) {
            // convert note to flat
            convertedNote = sharpToFlat(sharpNoteArray[string], matchingSharpAndFlat);
            // replace note in array with its converted equivalent
            convertedArray[string] = convertedNote;
        }
    }
    // return complete array with all of the sharp to flat conversions in place
    return convertedArray;
}

// function to convert an array of notes which may contain undesirable enharmonic equivalents where applicable
function arrayCorrectEnharmonic(enharmonicArray, matchingEnharmonic) {
    // copy supplied array of notes
    convertedArray = enharmonicArray.slice(0);
    // loop through all notes
    for (var string = 0; string < enharmonicArray.length; string++) {
        // regex test for enharmonics is true
        if (/(Fb|E#|B#|Cb)/.test(enharmonicArray[string]) === true) {
            // convert note to proper enharmonic equivalent
            convertedNote = correctEnharmonic(enharmonicArray[string], matchingEnharmonic);
            // replace note in array with its converted equivalent
            convertedArray[string] = convertedNote;
        }
    }
    // return complete array with all of enharmonic conversions in place
    return convertedArray;
}

// function to get string note names in order given a certain string tuning
function getStringNoteNames(stringRootNote, notes, accidentalState) {
    // copy the notes array
    var notesRearrange = notes.slice(0);
    // find where the string root appears in the copied notes array
    var noteIndex = notesRearrange.indexOf(stringRootNote.toString());
    // rearrange the note set by splicing from the index to the end and from the beginning to the index, and concatenate the two together
    var newNoteSet = (notesRearrange.splice(noteIndex, (notesRearrange.length - noteIndex))).concat(notesRearrange.splice(0, noteIndex));
    // double the note set by concatenating to itself
    var completeNoteSet = newNoteSet.concat(newNoteSet);
    // push the first note to the end to represent the 24th fret
    completeNoteSet.push(completeNoteSet[0]);
    // checks for flat accidental state
    if (accidentalState === 'flat') {
        // converts complete note set to flats where applicable, and returns the complete sequence of notes for the entire string
        return arraySharpToFlat(completeNoteSet, matchingSharpAndFlat);
    } else {
        // return the completed sequence of notes for the entire string
        return completeNoteSet;
    }
}

function displayOnFretboard(scaleRootNote, stringRootNote, stringNumber, scalePattern, notes, accidentalState) {
    // checks for flat accidental state
    if (accidentalState === 'flat') {
        if (/([A-G])(b|#)/.test(scaleRootNote) === true) {
            // converts scale root note to flat
            scaleRootNote = sharpToFlat(scaleRootNote, matchingSharpAndFlat);
        }
    }
    // get note names for each fret given the tuning of the string
    var workingNoteSet = getStringNoteNames(stringRootNote, notes, accidentalState);
    // copy scale pattern
    var workingScalePattern = scalePattern.slice(0);
    // find fret number of key root note on string
    var noteAdd = workingNoteSet.indexOf(scaleRootNote.toString());
    // for every note in the scale pattern add noteAdd so the pattern begins on the key root note
    for (var a = 0; a < workingScalePattern.length; a++) {
        workingScalePattern[a] += noteAdd;
        // if scale pattern starting from key root goes over twelfth fret, subtract 12 frets
        if (workingScalePattern[a] >= 12) {
            workingScalePattern[a] -= 12;
        }
    }
    // sorts working scale pattern in order from smallest fret numbers to largest
    workingScalePattern.sort(function(a, b) {
        return a - b;
    });
    // copy workingScalePattern for frets above twelve
    var patternAboveTwelve = workingScalePattern.slice(0);
    // for every fret add 12 frets to represent second octave
    for (var b = 0; b < patternAboveTwelve.length; b++) {
        patternAboveTwelve[b] += 12;
    }
    // add the frets above 12 to get the full fret numbers up to fret 23
    var fullFretNumbers = workingScalePattern.concat(patternAboveTwelve);
    // if we detect the 12th fret exists in the array push the 24th fret to the end of the array
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

function displayLoopAllStrings(selectedKey, selectedScale, selectedTuning, notes, accidentalState) {
    var allStringsResult = '';
    for (var stringCounter = 0; stringCounter < selectedTuning.length; stringCounter++) {
        var stringName = ((selectedTuning[stringCounter]).toString());
        allStringsResult += displayOnFretboard(selectedKey, stringName, (stringCounter + 1), selectedScale, notes, accidentalState);
    }
    return allStringsResult;
}

function displayCurrentTuning(selectedTuning, accidentalState) {
    if (accidentalState === 'flat') {
        selectedTuning = arraySharpToFlat(selectedTuning, matchingSharpAndFlat);
    }
    var tuningDisplayHtml = '';
    for (var stringCounter = 0; stringCounter < selectedTuning.length; stringCounter++) {
        tuningDisplayHtml += '<div class="tuning-note-marker string-' + (stringCounter + 1) + '"><span>' + ((stringCounter + 1) + (selectedTuning[stringCounter])) + '</span></div>';
    }
    return tuningDisplayHtml;
}

function toggleCustomTuning(tuningDropdownValue) {
    if (tuningDropdownValue === "custom") {
        $(".custom-tuning-select").show();
    } else {
        $(".custom-tuning-select").hide();
    }
}

// function to be triggered upon user click or enter keypress, processes final fretboard output
function eventListenerTrigger() {
    // reset output to avoid cumulative build up of incorrect notes on fretboard
    var allStringsOutput = '';
    // harvest key, scale values from user input
    var selectedKey = $("#keySelect").val();
    var selectedScale = $("#scaleSelect").val();
    // conditional check that key and scale are not supplied
    if ((selectedKey === 'select') || (selectedScale === 'select')) {
        alert('Please select both a key and scale.');
    }
    // if key and scale are supplied
    else {
        // harvest current state of accidental switch
        if ($("#accidentalSwitch").is(':checked')) {
            var accidentalState = 'flat';
        } else {
            var accidentalState = 'sharp';
        }
        // conditional check for whether a custom user supplied tuning is being used
        if ($("#tuningSelect").val() === 'custom') {
            // harvest custom user supplied tuning
            var customInputTuning = $("input[name='userTuningInputValue']").val();
            // regex validation of user supplied tuning string fails
            if (/^([A-G](b|#)?){6}$/.test(customInputTuning) === false) {
                alert('Please make sure the tuning follows these rules: 6 notes, no spaces. Uppercase A-G. b = flat. # = sharp.');
            }
            // regex validation of user supplied tuning succeeds
            else {
                // use regex to parse user tuning value into array and reverse for proper order
                var customTuningArray = customInputTuning.match(/([A-G](b|#)?)/g).reverse();
                // correct any user supplied enharmonic equivalents
                var correctedTuning = arrayCorrectEnharmonic(customTuningArray, matchingEnharmonic);
                // define output tuning by converting tuning array to sharps
                var outputTuning = (arrayFlatToSharp(correctedTuning, matchingSharpAndFlat));
                // Run displayOnFretboard for all 6 strings given user selected tuning, scale, and key
                var allStringsOutput = displayLoopAllStrings(selectedKey, scales[selectedScale], outputTuning, notes, accidentalState);
                // append HTML of notes to fretboard
                $('.notes-display').html(allStringsOutput);
                // fill tuning HTML template with values from selected tuning
                var tuningOutput = displayCurrentTuning(outputTuning, accidentalState);
                // append HTML of selected tuning to display current tuning
                $('.tuning').html(tuningOutput);
            }
        }
        // if predefined tuning is selected
        else {
            // harvest the user selected predefined tuning value
            var predefinedInputTuning = $("#tuningSelect").val();
            // match to existing tuning array
            var predefinedTuning = stringTuning[predefinedInputTuning];
            // define output tuning
            var outputTuning = predefinedTuning;
            // Run displayOnFretboard for all 6 strings given user selected tuning, scale, and key
            var allStringsOutput = displayLoopAllStrings(selectedKey, scales[selectedScale], outputTuning, notes, accidentalState);
            // append HTML of notes to fretboard
            $('.notes-display').html(allStringsOutput);
            // fill tuning HTML template with values from selected tuning
            var tuningOutput = displayCurrentTuning(outputTuning, accidentalState);
            // append HTML of selected tuning to display current tuning
            $('.tuning').html(tuningOutput);
        }
    }
}


//-----------------CALLING FUNCTIONS-----------------//


// On click of "Show Scale" button
$('#showNotesOnFretboard').on('click', function() {
    // trigger final display output function
    eventListenerTrigger();
});

// On keypress of enter key
$(document).on('keypress', function(key) {
    //keyCode == 13 is the ENTER key
    if (key.keyCode == 13) {
        // if enter key is struck, do not submit form
        key.preventDefault();
        // trigger final display output function
        eventListenerTrigger();
    }
});

// hides custom tuning select upon initial page load
$(".custom-tuning-select").hide();
// looks for changes in tuning selection dropdown and runs custom tuning toggle function with selection as parameter upon change
$("#tuningSelect").change(function() {
    var tuningDropdownValue = $("#tuningSelect").val();
    toggleCustomTuning(tuningDropdownValue);
});
