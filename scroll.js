        // https://pudding.cool/process/introducing-scrollama/
        // https://russellsamora.github.io/scrollama/sticky-side/

        let scrolly = d3.select("#scrolly");
        let graphic = scrolly.select("#gender-map");
        let chart = graphic.select(".chart-container");
        let textContainer = scrolly.select(".scrolly_text");
		let step = textContainer.selectAll(".step");

        // initialize the scrollama
        var scroller = scrollama();

        // resize function to set dimensions on load and on page resize
        function handleResize() {
            
            // update height of step elements for breathing room between steps
            var stepHeight = Math.floor(window.innerHeight * 0.5);
            
            step.style('height', stepHeight + 'px');

            var graphicHeight = window.innerHeight / 2;
			var graphicMarginTop = (window.innerHeight - graphicHeight) / 2;

            graphic
                .style('height', graphicHeight + 'px')
                .style('top', graphicMarginTop + 'px');

            // tell scrollama to update new element dimensions
            scroller.resize();
        }

        function handleStepEnter(response) {
            // response = { element, direction, index }
        
            // fade in current step
            step.classed('is-active', function (d, i) {
                return i === response.index;
            })
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
                .onStepEnter(handleStepEnter);

            // setup resize event
            window.addEventListener('resize', handleResize);
        }

        // start it up
        init();
