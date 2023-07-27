// Thank you Russell Samora
// 
// scrollama
// https://github.com/russellsamora/scrollama
// https://github.com/russellsamora/scrollama/blob/main/dev/multiple.html
// 


// Global const
let main = d3.select("main");
// Text-only scroll
let scrolly = main.selectAll(".scrolly");
let scrollyStep = scrolly.selectAll(".step");
// Section Heading scroll
let sectionHeading1 = main.select("#sectionHeading1");
let head1Step = sectionHeading1.selectAll("step");
// Quote scroll
let quote = main.select("#quote");
let quoteStep = quote.selectAll(".step");
// Intro scroll
let Intro = main.select("#Intro");
let IntroStep = Intro.selectAll(".step");
// Treemap scroll
let treeMap = main.select("#treeMap");
let treeMapViz = treeMap.select("#treeMapViz");
let chart = treeMapViz.select(".chart-container");
let textContainer = treeMap.select("#treeMap-text");
let treeMapStep = textContainer.selectAll(".step");
// What's evocative visualization 
let evocative = main.select("#evocative");
let evocativeStep = evocative.selectAll(".step");
// Bubble chart scroll
let bubbleChartText = main.select("#bubbleChart-text");
let bubbleStep = bubbleChartText.selectAll(".step");

// let bubbleChart = main.select("#bubbleChart");
// let bubbleViz = bubbleChart.select("#bubbleViz");
// let bChartContainer = bubbleViz.select(".chart-container");
// let bTextContainer = bubbleChart.select("#bubbleChart-text");
// let bubbleStep = bTextContainer.selectAll(".step");
// Video scroll
let video = main.select("#video");
let videoStep = video.selectAll(".step");
// Guaridan image scroll
let guardian = main.select("#guardian");
let guaridanImg = guardian.select("#guardianImg");
let gtextContainer = guardian.select("#guardianText");
let guardianStep = gtextContainer.selectAll(".step")



// initialize the scrollama
var scrollyScroller = scrollama();
var heading1Scroller = scrollama();
var quoteScroller = scrollama();
var IntroScroller = scrollama();
var treeMapScroller = scrollama();
var evocativeScroller = scrollama();
var bubbleScroller = scrollama();
var videoScroller = scrollama();
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

    // bubbleViz
    //     .style("height", bubbleVizHeight + "px")
    //     .style("top", graphicMarginTop + "px");
    
    guaridanImg
        .style("height", guardianHeight + "px")
        .style("top", graphicMarginTop + "px");


    // tell scrollama to update new element dimensions
    treeMapScroller.resize();
    // bubbleScroller.resize();
    guardianScroller.resize();
}

// stepEnter
function handleStepEnter(response) {
    // response = { element, direction, index }
    // add to color to current step
    response.element.classList.add("is-active");
}

// stepExit
function handleStepExit(response) {
    // response = { element, direction, index }
    // remove color from current step
    response.element.classList.remove("is-active");
}

function init() {

    // Call handle resize
    handleResize();

    var stepHeight = Math.floor(window.innerHeight * 0.3);

    // *************************************************************************************
    // Introduction
    IntroStep.style("padding-bottom", stepHeight + "px");
    IntroScroller 
         .setup({
             step: "#Intro .step",
             debug: false,
             offset: 0.4,
             progress: true
         })
         .onStepEnter(handleStepEnter);

    // ************************************************************************************* 
    // Quote section
    quote.style("padding-bottom", stepHeight + "px");
    quoteScroller 
        .setup({
            step: "#quote .step",
            debug: false,
            offset: 0.4,
            progress: true
        })
        .onStepEnter(handleStepEnter);

    // *************************************************************************************
    // Treemap section
    treeMapStep.style("padding-bottom", stepHeight + "px");
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

    // *************************************************************************************
    // What's an evocative visualization?
    evocativeStep.style("padding-bottom", stepHeight + "px");
    evocativeScroller
    .setup({
        step: '#evocative .step', // the step elements
        offset: 0.4, // set the trigger to be 1/2 way down screen
        debug: false, // display the trigger offset for testing
    })
    .onStepEnter(handleStepEnter);

    // *************************************************************************************
    // Bubble chart section
    bubbleStep.style("padding-bottom", stepHeight + "px");
    bubbleScroller
        .setup({
            // container: '#bubbleChart', // our outermost scrollytelling element
            // bubbleViz: '#bubbleViz', // the graphic
            // bubbleChartText: '#bubbleChart-text', // the step container
            step: '#bubbleChart-text .step', // the step elements
            offset: 0.4, // set the trigger to be 1/2 way down screen
            debug: false, // display the trigger offset for testing
        })
        .onStepEnter(handleStepEnter);
     
    // *************************************************************************************
    // FirstName video section
    videoStep.style("padding-bottom", stepHeight + "px");
    videoScroller
         .setup({
             step: "#video .step",
             debug: false,
             offset: 0.4,
             progress: true
         })
         .onStepEnter(handleStepEnter);
 

    // *************************************************************************************
    // Guardian interactive map section
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

    // *************************************************************************************
    // Bottom scroll section
    scrollyStep.style("padding-bottom", stepHeight + "px");
    scrollyScroller 
        .setup({
            step: ".scrolly .step",
            debug: false,
            offset: 0.4,
            progress: true
        })
        .onStepEnter(handleStepEnter);

        

    // setup resize event
    window.addEventListener('resize', handleResize);
}

// kick things off
init();



