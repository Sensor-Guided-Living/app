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

    // Convenience function to setup a webcam
    const size = 500;
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
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));

        //console.log(labelContainer);
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
        console.log(prediction[i].className);


    }

    // finally draw the poses
    drawPose(pose);
}

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




//camare
const {
    resolve
} = require('path')
const cloneDeep = require('lodash.clonedeep');
const TerserPlugin = require('terser-webpack-plugin');
const outputPath = resolve('dist');

/**
 * This is the base Webpack Config
 * depending on options, such as --mode=production, the config will be altered
 * each time it executes.
 */
const baseConfig = {
    entry: './src/index.ts',
    output: {
        path: outputPath,
        library: ['tmPose'],
        filename: 'teachablemachine-pose.min.js'
    },
    mode: 'development',
    watchOptions: {
        ignored: /src\/version\.ts/
    },
    module: {
        rules: [{
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    externals: {
        "@tensorflow/tfjs": "tf"
    },
    devtool: 'inline-source-map'
}

module.exports = function (opts, argv) {

    const {
        bold,
        green
    } = colorizer(argv.color && typeof argv.color === 'function' && argv.color().hasBasic === true);

    console.log(`${bold('Mode')}: ${green(argv.mode)}`);
    console.log(`${bold('Reporter')}:  ${green(argv.reporter)}`);

    const config = cloneDeep(baseConfig);

    if (argv.mode === 'production') {
        config.output.path = resolve(`${outputPath}`);
        //turn off source maps
        config.devtool = 'none';

        config.optimization = {
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    cache: './.terser_build_cache',
                    //exclude: /transpiledLibs/,
                    terserOptions: {
                        warnings: false,
                        ie8: false
                    }
                })
            ]
        };
    }

    return [config];

}


/**
 * Simple Utility for adding color to logs
 * @param {boolean} supported
 */
function colorizer(supported) {
    if (supported) {
        return {
            green: (str) => `\u001b[32m${str}\u001b[39m`,
            bold: (str) => `\u001b[1m${str}\u001b[22m`
        };
    }

    const identity = (str) => str;

    return {
        green: identity,
        bold: identity
    };
};