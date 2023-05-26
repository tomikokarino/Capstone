        // https://pudding.cool/process/introducing-scrollama/

        let scrolly = d3.select("#scrolly");
        let graphic = scrolly.select("#gender-map");
        let chart = graphic.select(".chart-container");
        let textContainer = scrolly.select(".scrolly_text");
		let step = textContainer.selectAll(".step");

        // initialize the scrollama
        var scroller = scrollama();

        // resize function to set dimensions on load and on page resize
        function handleResize() {
            
            // 1. update height of step elements for breathing room between steps
            var stepHeight = Math.floor(window.innerHeight * 0.75);
            
            step.style('height', stepHeight + 'px');


            // 2. update height of graphic element
            var bodyWidth = d3.select('body').node().offsetWidth;

            graphic
                .style('height', window.innerHeight + 'px');

            // 3. update width of chart by subtracting from text width
            var chartMargin = 32;
            var textWidth = textContainer.node().offsetWidth;
            var chartWidth = graphic.node().offsetWidth - textWidth - chartMargin;
            // make the height 1/2 of viewport
            var chartHeight = Math.floor(window.innerHeight / 2);

            chart
                .style('width', chartWidth + 'px')
                .style('height', chartHeight + 'px');

            // 4. tell scrollama to update new element dimensions
            scroller.resize();
        }

        function handleStepEnter(response) {
            // response = { element, direction, index }
        
            // fade in current step
            step.classed('is-active', function (d, i) {
                return i === response.index;
            })
        }
        
        function handleContainerEnter(response) {
            // response = { direction }
        
            // sticky the graphic
            graphic.classed('is-fixed', true);
            graphic.classed('is-bottom', false);
        }
        
        function handleContainerExit(response) {
            // response = { direction }
        
            // un-sticky the graphic, and pin to top/bottom of container
            graphic.classed('is-fixed', false);
            graphic.classed('is-bottom', response.direction === 'down');
        }

        // kick-off code to run once on load
        function init() {
            // 1. call a resize on load to update width/height/position of elements
            handleResize();

            // 2. setup the scrollama instance
            // 3. bind scrollama event handlers (this can be chained like below)
            scroller
                .setup({
                    container: '#scrolly', // our outermost scrollytelling element
                    graphic: '#gender-map', // the graphic
                    textContainer: '.scrolly_text', // the step container
                    step: '.scrolly_text .step', // the step elements
                    offset: 0.5, // set the trigger to be 1/2 way down screen
                    debug: false, // display the trigger offset for testing
                })
                .onStepEnter(handleStepEnter)
                .onContainerEnter(handleContainerEnter)
                .onContainerExit(handleContainerExit);

            // setup resize event
            window.addEventListener('resize', handleResize);
        }

        // start it up
        init();





		// // initialize the scrollama
		// var scroller = scrollama();

		// // scrollama event handlers
		// function handleStepEnter(response) {
		// 	// response = { element, direction, index }
		// 	console.log(response);
		// 	// add to color to current step
		// 	response.element.classList.add("is-active");
		// }

		// function handleStepExit(response) {
		// 	// response = { element, direction, index }
		// 	console.log(response);
		// 	// remove color from current step
		// 	response.element.classList.remove("is-active");
		// }

		// function init() {
		// 	// set random padding for different step heights (not required)
		// 	step.forEach(function (step) {
		// 		// var v = 100 + Math.floor((Math.random() * window.innerHeight) / 4);
		// 		step.style.padding = 150 + "px 0px";
		// 	});

		// 	// 1. setup the scroller with the bare-bones options
		// 	// 		this will also initialize trigger observations
		// 	// 2. bind scrollama event handlers (this can be chained like below)
		// 	scroller
		// 		.setup({
		// 			step: ".row .col-4  .step",
		// 			debug: false,
		// 			offset: 0.4,
		// 			progress: true
		// 		})
		// 		.onStepEnter(handleStepEnter)
		// 		.onStepExit(handleStepExit);

		// }

		// // kick things off
		// init();
	