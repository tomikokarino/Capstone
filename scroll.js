// Thank you Russell Samora
// 
// scrollama
// https://github.com/russellsamora/scrollama
// https://github.com/russellsamora/scrollama/blob/main/dev/multiple.html
// 


// Global
let main = d3.select("main");
// Text-only scroll
let scrolly = main.selectAll(".scrolly");
let scrollyStep = scrolly.selectAll(".step");
// Treemap scroll
let treeMap = main.select("#treeMap");
let treeMapViz = treeMap.select("#treeMapViz");
let chart = treeMapViz.select(".chart-container");
let textContainer = treeMap.select("#treeMap-text");
let treeMapStep = textContainer.selectAll(".step");
// Bubble chart scroll
let bubbleChart = main.select("#bubbleChart");
let bubbleViz = bubbleChart.select("#bubbleViz");
let bChartContainer = bubbleViz.select(".chart-container");
let bTextContainer = bubbleChart.select("#bubbleChart-text");
let bubbleStep = bTextContainer.selectAll(".step");
// Guaridan image scroll
let guardian = main.select("#guardian");
let guaridanImg = guardian.select("#guardianImg");
let gtextContainer = guardian.select("#guardianText");
let guardianStep = gtextContainer.selectAll(".step")



// initialize the scrollama
var scrollyScroller = scrollama();
var treeMapScroller = scrollama();
var bubbleScroller = scrollama();
var guardianScroller = scrollama();

// resize function to set dimensions on load and on page resize
function handleResize() {

    // update height of step elements for breathing room between steps
    var treeMapHeight = window.innerHeight * 0.5;
    var bubbleVizHeight = window.innerHeight * 0.8;
    var guardianHeight = window.innerHeight * 0.5;
    var graphicMarginTop = (window.innerHeight - treeMapHeight) / 2;

    treeMapViz
        .style("height", treeMapHeight + "px")
        .style("top", graphicMarginTop + "px");

    bubbleViz
        .style("height", bubbleVizHeight + "px")
        .style("top", graphicMarginTop + "px");
    
    guaridanImg
        .style("height", guardianHeight + "px")
        .style("top", graphicMarginTop + "px");


    // tell scrollama to update new element dimensions
    treeMapScroller.resize();
    bubbleScroller.resize();
    guardianScroller.resize();
}

// stepEnter
function handleStepEnter(response) {
    // response = { element, direction, index }
    console.log("handleStepEnter response", response);
    // add to color to current step
    response.element.classList.add("is-active");
}

// stepExit
function handleStepExit(response) {
    // response = { element, direction, index }
    console.log(response);
    // remove color from current step
    response.element.classList.remove("is-active");
}

function init() {

    // Call handle resize
    handleResize();

    var stepHeight = Math.floor(window.innerHeight * 0.3);

    // Bottom padding for the step elements
    scrollyStep.style("padding-bottom", stepHeight + "px");
    // console.log("stepHeight", stepHeight * 0.4)

    scrollyScroller 
        .setup({
            step: ".scrolly .step",
            debug: false,
            offset: 0.4,
            progress: true
        })
        .onStepEnter(handleStepEnter);

    // Bottom padding for the step element
    treeMapStep.style("padding-bottom", stepHeight + "px");
    // treeMapStep.style('height', stepHeight + 'px');

    treeMapScroller
        .setup({
            container: '#treeMap', // our outermost scrollytelling element
            treeMapViz: '#treeMapViz', // the graphic
            textContainer: '#treeMap-text', // the step container
            step: '#treeMap #treeMap-text .step', // the step elements
            offset: 0.4, // set the trigger to be 1/2 way down screen
            debug: false, // display the trigger offset for testing
        })
        .onStepEnter(handleStepEnter);

    // Bottom padding for the step elements
    bubbleStep.style("padding-bottom", stepHeight + "px");
    bubbleChart.style("padding-bottom", stepHeight + "px");


    bubbleScroller
        .setup({
            container: '#bubbleChart', // our outermost scrollytelling element
            bubbleViz: '#bubbleViz', // the graphic
            bTextContainer: '#bubbleChart-text', // the step container
            step: '#bubbleChart #bubbleChart-text .step', // the step elements
            offset: 0.4, // set the trigger to be 1/2 way down screen
            debug: false, // display the trigger offset for testing
        })
        .onStepEnter(handleStepEnter);

    guardianStep.style("padding-bottom", stepHeight + "px");
    guardian.style("padding-bottom", stepHeight + "px");

    guardianScroller
        .setup({
            container: '#guardian', // our outermost scrollytelling element
            bubbleViz: '#guardianImg', // the graphic
            bTextContainer: '#guardianText', // the step container
            step: '#guardian #guardianText .step', // the step elements
            offset: 0.4, // set the trigger to be 1/2 way down screen
            debug: false, // display the trigger offset for testing
        })
        .onStepEnter(handleStepEnter);

    // setup resize event
    window.addEventListener('resize', handleResize);
}

// kick things off
init();



