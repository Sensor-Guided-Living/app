const URL = "https://teachablemachine.withgoogle.com/models/9PSd-i9l/";
let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
  alert(
    "hello, our platform works on the following OS, [Android, Windows, Linux]"
  );
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  /*  */
  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  const uploadModel = document.getElementById("upload-model");
  const uploadWeights = document.getElementById("upload-weights");
  const uploadMetadata = document.getElementById("upload-metadata");
  /* web cam */

  const size = 250;
  const flip = true; // whether to flip the webcam
  webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append/get elements to the DOM
  const canvas = document.getElementById("canvas");
  canvas.width = size;
  canvas.height = size;
  ctx = canvas.getContext("2d");

  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));

    //console.log(labelContainer); //el div
    //console.log(i);
  }
}

async function loop(timestamp) {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  // Prediction #1: run input through posenet
  // estimatePose can take in an image, video or canvas html element
  const {
    pose,
    posenetOutput
  } = await model.estimatePose(webcam.canvas);
  // Prediction 2: run input through teachable machine classification model
  const prediction = await model.predict(posenetOutput);

  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
    //console.log(prediction[i].className);
    //console.log(prediction.length);
    //console.log(prediction[i].probability);

    /*  *var cuenta = [];
        for (classPrediction.className = 0; classPrediction.className < 10; classPrediction.className++) {

            cuenta.push("ejerciciios" + classPrediction.className);


        }
        console.log(cuenta); 
         */
    //console.log(prediction[1].className);
    // console.log(prediction[1].probability);

    //while (prediction[1].classNa === "gestos: 1.00") {
    // console.log("wilky");
    // }
    //console.log(prediction[0].className);
  }
  /* extraer valores de variables */
  cuenta = prediction[1].className + prediction[1].probability; //uno significa el segundo valor del
  //console.log(cuenta);
  var cond = "gestos1";


  var lac = "repeticiones es:";
  var contadore = 1;
  var i = 0;
  /*   while (i < 850) {
     console.log("Hola mundo");
     i = i + 1;
   }*/
  function m() {
    console.log(cuenta);
  }


  if (cuenta == cond) {
    var n = 0;
    var l = document.getElementById("number");
    window.setInterval(function () {
      l.innerHTML = n;
      n++;
    }, 2000);
    m();


  }
  //if (cuenta == cond) {
  //function contador() {
  //var contador = document.getElementById("contador");
  //contador.innerHTML = cont;
  //cont++;
  //}
  //setInterval("contador()", 1000);
  //document.getElementById("contador").innerHTML = cont;

  //for (cuenta == cond; contadore < 100; contadore++) {
  // console.log(contadore);
  //document.getElementById("tuti").innerHTML = contadore;

  //

  //while (cuenta == cond) {
  //document.getElementById("tuti").innerHTML = contadore;*
  //setInterval(contadore++, 3000);

  //console.log(contadore);-ppppppppppppppppppppppppppppppppppp`

  /* if (cuenta == cond) {
    var numberSelected = 0;
  for (var i = 0; i < selectObject.options.length; i++) {
    if (selectObject.options[i].selected) {
      numberSelected++;
      document.getElementById("tuti").innerHTML;
    }
  }
  return numberSelected;
} */

  //setTimeout(console.log(rutina), 100);

  //function incrementar() {
  // var c = document.getElementById("div").childElementCount;
  // document.getElementById("tuti").innerHTML = c;
  //contadore + sum;

  //++;
  // document.getElementById("tuti").innerText = contadore;

  //document.getElementById("tuti").innerHTML = contadore;
  // }
  //incrementar();
  //console.log(contadore);
  // }

  // finally draw the poses
  drawPose(pose);
}

//var cuenta = document.getElementsByName("div id = 'a'").onclick.imp;

function drawPose(pose) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
    // draw the keypoints and skeleton
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
  }
}