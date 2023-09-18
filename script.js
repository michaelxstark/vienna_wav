
let sliderSpeed;
let sliderMinYear;
let sliderMaxYear;

let speedy;
let minYear1;
let maxYear1;

let gameStarted = false;

let counter = 0;

let newFont = "";

let xRun = 0;

let outputSpeed = document.getElementById("speedDisplay");
let outputminYear = document.getElementById("minYearDisplay");
let outputmaxYear = document.getElementById("maxYearDisplay");


let initialValueSpeed;
let initialValueMinYear;
let initialValueMaxYear;

let waveForms;
let waveform;

let scaleSelect;
let scaleOn;

let deltaYear;

function startAudio(){
  Tone.start();
  console.log("Audio has Started");
  loop();
}


function stopTone(){
  gameStarted = false;
  counter = 0;
  xRun = 0;
  console.log(gameStarted);
}


function startAudioVisLoop(){
  gameStarted = true;
  counter = 0;
  xRun = 0;
}


function preload(){

  data = loadTable("avg_temp_year.csv", "csv", "header");
  newFont = loadFont("Arialn.ttf");

}


// Notes

let notesMinor = ["C3", "G3", "D#4", "C5", "D#5",
                  "C6", "D6", "D#6", "G7", "G7"];

let notesPhrygian = ["C#3", "G#3", "C4", "G4", "C#5",
                     "G#5", "C6", "C#6", "G7", "G#7"];

let notesLydian = ["C3", "G3", "E4", "F#4", "C5",
                   "E5", "C6", "G6", "C7", "F#7"];




// FX

let filterS;
let filterLow;
let stWide;
let chor;
let rev;
let rev2;
let highPass;
let highPass2;

// Instruments

let kick;
let noiseS;
let pluck;
let synth;


function setup() {

  let canvas = createCanvas(500, 500, WEBGL);
  canvas.id('mycanvas');
  textFont(newFont);
  textSize(18);
  fill(0);

  // Tempo  of Animation
  sliderSpeed = document.getElementById("Speed");

  // minYear and maxYear
  sliderMinYear = document.getElementById("minYear");
  sliderMaxYear = document.getElementById("maxYear");

  speedInit = parseInt(sliderSpeed.getAttribute("value"));
  minYearInit = parseInt(sliderMinYear.getAttribute("value"));
  maxYearInit = parseInt(sliderMaxYear.getAttribute("value"));

  sliderSpeed.value = speedInit;
  sliderMinYear.value = minYearInit;
  sliderMaxYear.value = maxYearInit;

  // Setting up FX
  filterS = new Tone.Filter(1000, "lowpass");
  filterLow = new Tone.Filter(5000, "lowpass");
  stWide = new Tone.Chorus(4, 2.5, 0.5).toDestination();
  chor = new Tone.Chorus(10, 2.5, 1);

  rev = new Tone.Reverb(2).toDestination();
  rev.wet.value = 0.1;

  rev2 = new Tone.Reverb(0.5).toDestination();
  rev2.wet.value = 0.2;

  highPass = new Tone.Filter(5000, "highpass");

  highPass2 = new Tone.Filter(120, "highpass");

  // Setting up Instruments

  kick = new Tone.MembraneSynth().toDestination();
  kick.volume.value = -8;

  noiseS = new Tone.NoiseSynth();
  noiseS.volume.value = -10;
  noiseS.set({
    "envelope" : {
  		"attack" : 0.01,
      "decay" : 0.05,
      "sustain" : 1,
      "release" : 0.05
  	}
  })
  noiseS.connect(chor);
  chor.connect(filterLow);
  filterLow.connect(highPass2);
  highPass2.connect(rev2);


  pluck = new Tone.NoiseSynth().toDestination();
  pluck.connect(highPass);
  highPass.connect(stWide);
  pluck.set({
    "envelope" : {
  		"attack" : 0.005,
      "decay" : 0.01,
      "sustain" : 0.5,
      "release" : 0.01
  	}
  })
  pluck.volume.value = -28;

  waveForms = document.getElementById("waveForms");
  waveform = waveForms.value;

  synth = new Tone.PolySynth(Tone.Synth);

  synth.set({
  	"envelope" : {
  		"attack" : 0.005,
      "decay" : 0.1,
      "sustain" : 1,
      "release" : 0.1
  	},
    "oscillator" : {"type" : waveform}
  });


  synth.set({
    detune: -50
  });

  synth.maxPolyphony.value = 32;

  synth.connect(filterS);
  filterS.connect(rev);

  scaleSelect = document.getElementById("tonality");
  scaleOn = scaleSelect.value;

}





function draw() {
  speedy = sliderSpeed.value;
  sliderSpeed.oninput = function(){
    outputSpeed.innerHTML = "Speed " + this.value;
  }

  minYear1 = sliderMinYear.value;
  sliderMinYear.oninput = function(){
    outputminYear.innerHTML = "minYear " + this.value;
  }


  maxYear1 = sliderMaxYear.value;
  sliderMaxYear.oninput = function(){
    outputmaxYear.innerHTML = "maxYear " + this.value;
  }

  waveForms.addEventListener("change", function() {
    waveform = waveForms.value;
});

  //console.log(waveform)

  scaleSelect.addEventListener("change", function(){
    scaleOn = scaleSelect.value;
  });

  //console.log(scaleOn);

  deltaYear = minYear1 - 1873;

  synth.set({
    "oscillator" : {"type" : waveform}
  });


  if (gameStarted){
    console.log(gameStarted);
    // speed for viz

    if(xRun % speedy == 0){
      let row = data.getRow(counter + deltaYear);
      let year = row.get("Year");
      let avgTemp = row.get("AVG_TEMP");
      let aTstr = row.get("AVG_TEMP").toString();
      let noteend = Math.floor((avgTemp - 7.52) / 0.5);
      console.log(noteend);


      background(255);
      ambientMaterial(255);
      directionalLight(map(avgTemp, 7.52, 12.41, 100, 255), 0, 0, -0.2, 0, -1);

      text(year, -200, -225);

      tempSplit = aTstr.split(".");

      if (tempSplit[0].length == 1 && tempSplit[1].length == 2){
        text("0" + avgTemp +  "\u00B0" + "C", 150, -225);
      }

      else if (tempSplit[0].length == 1 && tempSplit[1].length == 1){
        text("0" + avgTemp + "0" + "\u00B0" + "C", 150, -225);
      }

      else if (tempSplit[0].length == 2 && tempSplit[1].length == 1){
        text(avgTemp + "0" + "\u00B0" + "C", 150, -225);
      }

      else{
        text(avgTemp +  "\u00B0" + "C", 150, -225);
      }

      push();
      noStroke();
      translate(0, 0);
      rotateZ(radians(frameCount));
      rotateY(sin(frameCount));
      fill(255);
      sphere(avgTemp * 11, 250, 24);
      pop();

      filterS.frequency.value = map(avgTemp, 7.52, 12.41, 50, 10000);
      filterLow.frequency.value = map(avgTemp, 7.52, 12.41, 2000, 5000);
      synth.volume.value = map(avgTemp, 7.52, 12.41, -40, -18);


      if (noteend > 0) {
        if(scaleOn == "minor"){
          synth.triggerAttackRelease(notesMinor.slice(0, noteend), 0.1);
        }
        else if(scaleOn == "lydian"){
          synth.triggerAttackRelease(notesLydian.slice(0, noteend), 0.1);
        }

        else {
          synth.triggerAttackRelease(notesPhrygian.slice(0, noteend), 0.1);
        }
      }
      else {
        if(scaleOn == "minor"){
          synth.triggerAttackRelease(notesMinor[0], 0.1);
        }

        else if(scaleOn == "lydian"){
          synth.triggerAttackRelease(notesLydian[0], 0.1);
        }

        else{
          synth.triggerAttackRelease(notesPhrygian[0], 0.1);
        }
      };

      if (avgTemp - 7.52 > 2){
        pluck.triggerAttackRelease(0.05, Tone.now());
      }

      if (avgTemp - 7.52 > 3){
        noiseS.triggerAttackRelease(0.05, Tone.now());
      }

      if (avgTemp - 7.52 > 4){
        kick.triggerAttackRelease("C2", 0.1);
      }


      counter += 1;
      if (year == maxYear1){
        stopTone();

      }
    }
    xRun += 1;
  }
}
