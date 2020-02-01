const URL = "https://teachablemachine.withgoogle.com/models/9PSd-i9l/";
let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // Note: the pose library adds a tmPose object to your window (window.tmPose)
  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  const uploadModel = document.getElementById("upload-model");
  const uploadWeights = document.getElementById("upload-weights");
  const uploadMetadata = document.getElementById("upload-metadata");

  // Convenience function to setup a webcam
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
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
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

  var rutina = 0;
  var cond = "gestos1";
  var contadore = 0;

  if (cuenta == cond) {
    rutina++;
    setTimeout(console.log(rutina), 100);

    function incrementar() {
      contadore++;
      console.log("El contador ahora vale :" + contadore);
      document.getElementById("demo").innerHTML = cuenta;
    }
    incrementar();
  }

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
