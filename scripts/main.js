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

var boardOrientation = 'rightHand';

var isVertical = '';

scales = [];
scales['major'] = [0, 2, 4, 5, 7, 9, 11];
scales['minor'] = [0, 2, 3, 5, 7, 8, 10];
scales['major-pentatonic'] = [0, 2, 4, 7, 9];
scales['minor-pentatonic'] = [0, 3, 5, 7, 10];
scales['ionian'] = [0, 2, 4, 5, 7, 9, 11];
scales['dorian'] = [0, 2, 3, 5, 7, 9, 10];
scales['phrygian'] = [0, 1, 3, 5, 7, 8, 10];
scales['lydian'] = [0, 2, 4, 6, 7, 9, 11];
scales['mixolydian'] = [0, 2, 4, 5, 7, 9, 10];
scales['aeolian'] = [0, 2, 3, 5, 7, 8, 10];
scales['locrian'] = [0, 1, 3, 5, 6, 8, 10];
scales['harmonic-minor'] = [0, 2, 3, 5, 7, 8, 11];
scales['melodic-minor'] = [0, 2, 3, 5, 7, 9, 11];
scales['whole-tone'] = [0, 2, 4, 6, 8, 10];
scales['whole-half-diminished'] = [0, 2, 3, 5, 6, 8, 9, 11];
scales['half-whole-diminished'] = [0, 1, 3, 4, 6, 7, 9, 10];
scales['chromatic'] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

stringTuning = [];
stringTuning['standard'] = ['E', 'B', 'G', 'D', 'A', 'E'];
stringTuning['half-step-down'] = ['D#', 'A#', 'F#', 'C#', 'G#', 'D#'];
stringTuning['full-step-down'] = ['D', 'A', 'F', 'C', 'G', 'D'];
stringTuning['drop-d'] = ['E', 'B', 'G', 'D', 'A', 'D'];
stringTuning['dadgad'] = ['D', 'A', 'G', 'D', 'A', 'D'];
stringTuning['open-g'] = ['D', 'B', 'G', 'D', 'G', 'D'];
stringTuning['perfect-fourths'] = ['F', 'C', 'G', 'D', 'A', 'E'];
stringTuning['major-thirds'] = ['C', 'G#', 'E', 'C', 'G#', 'E'];

//-----------------FUNCTION DEFINITIONS-----------------//

function checkSize() {
    if ($(".fretboard-rh").css("height") === "1350px") {
        isVertical = true;
        if (boardOrientation === 'leftHand') {
            $('.neck-container-lh').hide();
            $('.neck-container-lh-vert').show();
        }
    } else {
        isVertical = false;
        if (boardOrientation === 'leftHand') {
            $('.neck-container-lh-vert').hide();
            $('.neck-container-lh').show();
        }
    }
}

function switchToLeftHand() {
    boardOrientation = 'leftHand';
}

function switchToRightHand() {
    boardOrientation = 'rightHand';
}

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

// function to harvest key and scale inputs
function getKeyAndScale() {
    // harvest key, scale values from user input
    var selectedKey = $("#keySelect").val();
    var selectedScale = $("#scaleSelect").val();
    return {
        selectedKey: selectedKey,
        selectedScale: selectedScale,
    };
}

function validateKeyAndScale(selectedKey, selectedScale) {
    // conditional check that key and scale are not supplied
    if ((selectedKey === 'select') || (selectedScale === 'select')) {
        // conditional check that key is not supplied
        if (selectedKey === 'select') {
            displayError('Please select a key', 2000, 'keySelectError');
        }
        // conditional check that scale is not supplied
        if (selectedScale === 'select') {
            displayError('Please select a scale', 2000, 'scaleSelectError');
        }
        var missingKeyOrScale = true;
    } else {
        var missingKeyOrScale = false;
    }
    return missingKeyOrScale;
}

function getTuning() {
    // harvest the user selected predefined tuning value
    return $("#tuningSelect").val();
}

// function to harvest current state of accidental switch
function getAccidentalState() {
    if ($("#accidentalSwitch").val() === 'flat') {
        return 'flat';
    } else {
        return 'sharp';
    }
}

// function to convert an array of notes which may contain flats to sharps where applicable
function arrayFlatToSharp(flatNoteArray, matchingSharpAndFlat) {
    // copy supplied array of notes
    var convertedArray = flatNoteArray.slice(0);
    // loop through all notes
    for (var string = 0, arrayLength = flatNoteArray.length; string < arrayLength; string++) {
        // regex test for flats is true
        if (/([A-G])b/.test(flatNoteArray[string]) === true) {
            // convert note to sharp and replace note in array with its converted equivalent
            convertedArray[string] = flatToSharp(flatNoteArray[string], matchingSharpAndFlat);
        }
    }
    // return complete array with all of the flat to sharp conversions in place
    return convertedArray;
}

// function to convert an array of notes which may contain sharps to flats where applicable
function arraySharpToFlat(sharpNoteArray, matchingSharpAndFlat) {
    // copy supplied array of notes
    var convertedArray = sharpNoteArray.slice(0);
    // loop through all notes
    for (var string = 0, arrayLength = sharpNoteArray.length; string < arrayLength; string++) {
        // regex test for sharps is true
        if (/([A-G])#/.test(sharpNoteArray[string]) === true) {
            // convert note to flat and replace note in array with its converted equivalent
            convertedArray[string] = sharpToFlat(sharpNoteArray[string], matchingSharpAndFlat);
        }
    }
    // return complete array with all of the sharp to flat conversions in place
    return convertedArray;
}

// function to convert an array of notes which may contain undesirable enharmonic equivalents where applicable
function arrayCorrectEnharmonic(enharmonicArray, matchingEnharmonic) {
    // copy supplied array of notes
    var convertedArray = enharmonicArray.slice(0);
    // loop through all notes
    for (var string = 0, arrayLength = enharmonicArray.length; string < arrayLength; string++) {
        // regex test for enharmonics is true
        if (/(Fb|E#|B#|Cb)/.test(enharmonicArray[string]) === true) {
            // convert note to proper enharmonic equivalent and replace note in array with its converted equivalent
            convertedArray[string] = correctEnharmonic(enharmonicArray[string], matchingEnharmonic);
        }
    }
    // return complete array with all of enharmonic conversions in place
    return convertedArray;
}

function validateUserTuning() {
    var customTuningArray;
    // harvest custom user supplied tuning
    var customInputTuning = $("input[name='userTuningInputValue']").val().trim();
    // regex validation of user supplied tuning string fails
    if (/^([A-G](b|#)?){6}$/.test(customInputTuning) === false) {
        displayError('Please make sure the tuning follows these rules:<br>6 notes, no spaces.<br>Uppercase A-G.<br>b = flat.<br># = sharp.', 4000, 'tuningSelectError');
    }
    // regex validation of user supplied tuning succeeds
    else {
        if (boardOrientation === 'leftHand' && isVertical) {
            // use regex to parse user tuning value into array and do not reverse for left hand
            customTuningArray = customInputTuning.match(/([A-G](b|#)?)/g);
        } else {
            // use regex to parse user tuning value into array and reverse for proper order
            customTuningArray = customInputTuning.match(/([A-G](b|#)?)/g).reverse();
        }
        // correct any user supplied enharmonic equivalents
        var correctedTuning = arrayCorrectEnharmonic(customTuningArray, matchingEnharmonic);
        // return output tuning by converting tuning array to sharps
        return arrayFlatToSharp(correctedTuning, matchingSharpAndFlat);
    }
}

// function to get string note names in order given a certain string tuning
function getStringNoteNames(stringRootNote, notes) {
    var accidentalState = getAccidentalState();
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

function singleStringFrets(scaleRootNote, stringRootNote, scalePattern) {
    var accidentalState = getAccidentalState();
    // checks for flat accidental state
    if (accidentalState === 'flat' && /([A-G])(b|#)/.test(scaleRootNote) === true) {
        // converts scale root note to flat
        scaleRootNote = sharpToFlat(scaleRootNote, matchingSharpAndFlat);
    }
    // get note names for each fret given the tuning of the string
    var workingNoteSet = getStringNoteNames(stringRootNote, notes);
    // copy scale pattern
    var workingScalePattern = scalePattern.slice(0);
    // find fret number of key root note on string
    var noteAdd = workingNoteSet.indexOf(scaleRootNote.toString());
    // for every note in the scale pattern add noteAdd so the pattern begins on the key root note
    for (var a = 0, arrayLength = workingScalePattern.length; a < arrayLength; a++) {
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
    for (var b = 0, arrayLength = patternAboveTwelve.length; b < arrayLength; b++) {
        patternAboveTwelve[b] += 12;
    }
    // add the frets above 12 to get the full fret numbers up to fret 23
    var fullFretNumbers = workingScalePattern.concat(patternAboveTwelve);
    // if we detect the 12th fret exists in the array push the 24th fret to the end of the array
    for (var c = 0, arrayLength = fullFretNumbers.length; c < arrayLength; c++) {
        if (fullFretNumbers[c] === 12) {
            fullFretNumbers.push(24);
        }
    }
    return {
        fullFretNumbers: fullFretNumbers,
        noteAdd: noteAdd,
        workingNoteSet: workingNoteSet,
    }
}

function singleStringHtml(selectedKey, selectedScale, stringRootNote, stringNumber, boardOrientation) {
    var singleStringResult = '';
    var singleString = singleStringFrets(selectedKey, stringRootNote, selectedScale);
    var fullFretNumbers = singleString.fullFretNumbers;
    var noteAdd = singleString.noteAdd;
    var workingNoteSet = singleString.workingNoteSet;
    for (var fretCounter = 0, arrayLength = fullFretNumbers.length; fretCounter < arrayLength; fretCounter++) {
        var highlightRoot = '';
        if ((fullFretNumbers[fretCounter] === noteAdd) || (fullFretNumbers[fretCounter] === noteAdd + 12) || (fullFretNumbers[fretCounter] === noteAdd + 24)) {
            highlightRoot = 'scale-root-note';
        }
        if (boardOrientation === 'rightHand') {
            singleStringResult += '<div class="note-marker string-' + stringNumber + ' fret-' + fullFretNumbers[fretCounter] + ' ' + highlightRoot + '"><span>' + workingNoteSet[fullFretNumbers[fretCounter]] + '</span></div>';
        }
        if (boardOrientation === 'leftHand') {
            singleStringResult += '<div class="note-marker-lh string-' + stringNumber + ' fret-lh-' + fullFretNumbers[fretCounter] + ' ' + highlightRoot + '"><span>' + workingNoteSet[fullFretNumbers[fretCounter]] + '</span></div>';
            //singleStringResult += '<div class="note-marker string-' + stringNumber + ' fret-' + fullFretNumbers[fretCounter] + ' ' + highlightRoot + '"><span>' + workingNoteSet[fullFretNumbers[fretCounter]] + '</span></div>';
        }
    }
    return singleStringResult;
}

// ------------------------------------- //

function allStringsHtml(selectedKey, selectedScale, selectedTuning, notes, boardOrientation) {
    var allStringsResult = '';
    for (var stringCounter = 0, arrayLength = selectedTuning.length; stringCounter < arrayLength; stringCounter++) {
        var stringName = ((selectedTuning[stringCounter]).toString());
        allStringsResult += singleStringHtml(selectedKey, selectedScale, stringName, (stringCounter + 1), boardOrientation);
    }
    return allStringsResult;
}

function displayCurrentTuning(selectedTuning, boardOrientation, isVertical) {
    var accidentalState = getAccidentalState();
    if (accidentalState === 'flat') {
        selectedTuning = arraySharpToFlat(selectedTuning, matchingSharpAndFlat);
    }
    var tuningHtml = '';
    for (var stringCounter = 0, arrayLength = selectedTuning.length; stringCounter < arrayLength; stringCounter++) {
        tuningHtml += '<div class="tuning-note-marker string-' + (stringCounter + 1) + '"><span>' + (selectedTuning[stringCounter]) + '</span></div>';
    }
    return tuningHtml;
}

function appendBoardHtml(outputTuning, boardOrientation, isVertical, allStringsOutput, allStringsOutputLH) {
    var tuningOutput, hand;
    if (boardOrientation === 'rightHand') {
        // fill tuning HTML template with values from selected tuning
        var tuningOutput = displayCurrentTuning(outputTuning, boardOrientation, isVertical);
        hand = 'rh';
    }
    else {
      tuningOutput = displayCurrentTuning(outputTuning, boardOrientation, isVertical);
      hand = 'lh';
    }
    // append HTML of selected tuning to display current tuning
    $('.tuning-'+hand).html(tuningOutput);
    $('.notes-display-'+hand).html(allStringsOutput);
}

function toggleCustomTuning(tuningValue) {
    if (tuningValue === "custom") {
        $(".custom-tuning-select").show();
    } else {
        $(".custom-tuning-select").hide();
    }
}

function displayError(message, fadeTime, classTarget) {
    fadeTime = fadeTime || 2000;
    $('.' + classTarget + ' p').html(message).fadeIn(fadeTime, function() {
        setTimeout(function() {
            $('.' + classTarget + ' p').fadeOut(fadeTime);
        }, fadeTime);
    });
}

// function to be triggered upon user click or enter keypress, processes final fretboard output
function eventListenerTrigger() {
    // reset output to avoid cumulative build up of incorrect notes on fretboard
    var allStringsOutput = '';
    var selectedTuning = getTuning();
    var keyAndScale = getKeyAndScale();
    var selectedKey = keyAndScale.selectedKey;
    var selectedScale = keyAndScale.selectedScale;
    if (validateKeyAndScale(selectedKey, selectedScale) === false) {
        // conditional check for whether a custom user supplied tuning is being used
        if (selectedTuning === 'custom') {
            var outputTuning = validateUserTuning();
            var outputTuningLH = outputTuning.slice(0).reverse();
            console.log('Right Hand Tuning:', outputTuning);
            console.log('Left Hand Tuning:', outputTuningLH);
        }
        // if predefined tuning is selected
        else {
            var predefinedTuning = selectedTuning;
            // define output tuning by matching to existing tuning array
            var outputTuning = stringTuning[predefinedTuning];
            var outputTuningLH = outputTuning.slice(0).reverse();
            console.log('Right Hand Tuning:', outputTuning);
            console.log('Left Hand Tuning:', outputTuningLH);
        }
        // Run singleStringHtml for all 6 strings given user selected tuning, scale, and key
        var allStringsOutput = allStringsHtml(selectedKey, scales[selectedScale], outputTuning, notes, boardOrientation, isVertical);
        var allStringsOutputLH = allStringsHtml(selectedKey, scales[selectedScale], outputTuningLH, notes, boardOrientation, isVertical);
        appendBoardHtml(outputTuning, boardOrientation, isVertical, allStringsOutput, allStringsOutputLH);
    }
}

//-----------------CALLING FUNCTIONS-----------------//

// When document is ready
$(document).ready(function() {
    // run window size check on initial page load
    checkSize();
    // run window size check on resize of the window
    $(window).resize(checkSize);
});

// On keypress of enter key
$(document).on('keypress', function(key) {
    //keyCode == 13 is the ENTER key
    if (key.keyCode === 13) {
        // if enter key is struck, do not submit form
        key.preventDefault();
        // trigger final display output function
        eventListenerTrigger();
    }
});

// On click of "Show Scale" button
$('#showNotesOnFretboard').on('click', function() {
    // trigger final display output function
    eventListenerTrigger();
});

// On click of "Left Hand" button
$('#switchToLeft').on('click', function() {
    if (isVertical === true) {
        $('.neck-container-rh').hide();
        $('.neck-container-lh').hide();
        $('.neck-container-lh-vert').show();
    } else {
        $('.neck-container-rh').hide();
        $('.neck-container-lh-vert').hide();
        $('.neck-container-lh').show();
    }
    switchToLeftHand();
    eventListenerTrigger();
});

// On click of "Right Hand" button
$('#switchToRight').on('click', function() {
    $('.neck-container-lh').hide();
    $('.neck-container-lh-vert').hide();
    $('.neck-container-rh').show();
    switchToRightHand();
    eventListenerTrigger();
});

// hide the left hand neck container
$('.neck-container-lh').hide();
$('.neck-container-lh-vert').hide();

// hides custom tuning select upon initial page load
$(".custom-tuning-select").hide();

// looks for changes in tuning selection dropdown and runs custom tuning toggle function with selection as parameter upon change
$("#tuningSelect").change(function() {
    var tuningValue = getTuning();
    toggleCustomTuning(tuningValue);
});
