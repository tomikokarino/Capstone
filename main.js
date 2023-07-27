/* LOAD DATA */
d3.csv('Data/MoMAArtists.csv', d3.autoType)
  .then(MoMAArtists => {
    // console.log('MoMA artists', MoMAArtists)
    
    
    const width = window.innerWidth; //window.innerWidth | 900
    const height = window.innerHeight; //window.innerHeight | 900
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    
// **************************************************
// Filter out the Null gender first                  
// **************************************************

    const noNullGender = MoMAArtists
    .filter(function(d) {return d.Gender != null})
    // console.log(noNullGender)

// ******************************************************
// Group by FirstName and Gender and count the FirstName
// then sort by the FirstName count in descending order
// ******************************************************

    const nameGender = d3.flatRollup(noNullGender, v => v.length, d => d.FirstName, d => d.Gender)
                          .sort(([,,a],[,,b]) => d3.descending(a,b))
                          .map(([firstname, gender, value]) => ({ ["firstName"]: firstname, ["gender"]: gender, ["value"]:value }))
                          .filter(function(d) {return d.value >= 28})
    console.log("nameGender: ", nameGender) 

    const valueSum = d3.sum(nameGender, d => d.value)
    console.log("value sum", valueSum)



// *******************************************
// Top 30 first names
// *******************************************

const top30Names = nameGender.filter(function(d) {return d.value >= 50})


// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //                                                                                                                    //
// //                                                Gender treemap                                                      //
// //                                                                                                                    //
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // *************************************
// // Group by gender
// // *************************************

const groupedByGender = d3.group(noNullGender, d => d.Gender)
// console.log("groupedByGender:", groupedByGender)

// // ***********************************************
// // Create hierarchy
// // then sort by Gender count in descending order
// // ***********************************************

const hierarchyGroup = d3.hierarchy(groupedByGender)
    .count(d => d.value)
    .sort((a,b) => b.value - a.value)
    // console.log("hierarchyGroup:", hierarchyGroup)

const treemap = d3.treemap()
.size([1280, 708])
.round(true)


const treemapRoot = treemap(hierarchyGroup)
// console.log('treemapRoot.children', treemapRoot.children)

// // *************************************
// // Color scale
// // *************************************
const treeMapcolorScale = d3.scaleOrdinal()
        .domain(treemapRoot.children)
        .range(["#D1FDEB","#E2BEFD","#F4FDBE"])  // color palette (middle three colors) https://coolors.co/palette/393e41-d3d0cb-e2c044-587b7f-1e2019
        // .range(["#75FC9A","#9169FC","#F5FD43"])  // color palette (middle three colors) https://coolors.co/palette/393e41-d3d0cb-e2c044-587b7f-1e2019

// // *************************************
// // Treemap chart
// // *************************************
const treemapChart = d3.select("#gender-map-chart")
  .append("svg")
  .attr("viewBox", `0 0 1280 708`)
  // .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .classed("gender-map", true)
  .style("background-color", "#ffffff")
  // .style("border-color", "blue")
  // .style("border-width", 5)
  // .style("border-style", "solid")



const g = treemapChart.append('g')
  .attr('class', 'treemap-container')

const gender = g.selectAll('g.gender')
.data(treemapRoot.children)
.join('g')
.attr('class', 'gender')
.attr('transform', d => `translate(${ d.x0 },${ d.y0 })`)
.style('font-size', 24)
// console.log('data[1]', treemapRoot.children)

gender.append('rect')
.attr('fill', d => treeMapcolorScale(d))
.style("stroke", "#01579B")
.style("stroke-width", 1) 
// .attr('opacity', 0.55)
// the width is the right edge position - the left edge position
.attr('width', d => d.x1 - d.x0)
// same for height, but bottom - top
.attr('height', d => d.y1 - d.y0)
// make corners rounded
.attr('rx', 3)
.attr('ry', 3)

gender.each((d, i, arr) => {

// The current leaf element
const current = arr[i]

const left = d.x0,
right = d.x1,
// calculate its width from the data
width = right - left,
top = d.y0,
bottom = d.y1,
// calculate its height from the data
height = d.y1 - d.y0

// too small to show text
const tooSmall = width < 34 || height < 25

// and append the text (you saw something similar with the pie chart (day 6)
const text = d3.select( current ).append('text')
// If it's too small, don't show the text
.attr('opacity', tooSmall ? 0 : 0.9)
.selectAll('tspan')
.data(d => [ d.data[0], d.value.toLocaleString() ])
.join('tspan')
.attr('x', 3)
.attr('y', (d,i) => i ? '2.5em' : '1.15em')
.attr('class', 'gender-label')
.text(d => d)
})

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //                                                                                                                    //
// //                                                  Bubble chart                                                         //
// //                                                                                                                    //
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// *************************************
// Scales
// *************************************
const bubbleColor = d3.scaleOrdinal()
  .domain(["Male", "Female", "Non-Binary"])
  .range(["#D1FDEB","#E2BEFD","#F4FDBE"])  // color palette (middle three colors) https://coolors.co/palette/393e41-d3d0cb-e2c044-587b7f-1e2019
  // .range(["#75FC9A","#9169FC","#F5FD43"]); // color palette https://coolors.co/palette/f6bd60-f7ede2-f5cac3-84a59d-f28482


const bubbleSize = d3.scaleLinear()
  .domain([5, 200])
  .range([10, 50]) 


// *************************************
// Bubble chart
// *************************************

const bubbleChart = d3.select("#bubble-chart")
  .append("svg")
  // .attr("viewBox", `0 0 900 900`)
  .attr("viewBox", `0 0 ${width*0.4} ${height*0.7}`)
  // .attr("viewBox", `0 0 ${width*0.35} ${height*0.6}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .classed("bubble", true)
  // .style("border-style", "solid")
  // .style("border-width", 1)
  // .style("border-color", "green")

// 
// Thank you Russell Samora
//
// enter-view
// https://github.com/russellsamora/enter-view
//
  enterView({
    selector: '#bubbleViz',
    offset: 0.3,
    enter: function() {
        const circle_delay = 23000;
        const nodes = bubbleChart.selectAll("g.node")
                        .attr("x", width)
                        .attr("y", height)
                        .data(nameGender)
                        .join(
                            function(enter) {
                            return enter
                            .append("g")
                            .attr("class", "node")
                            .style("opacity", 0)
                            .transition()
                            .delay(function(d,i){
                                return i / nameGender.length * circle_delay;
                            })
                            .duration(1000)
                            .style("opacity", 1)
                            // .style("border-style", "solid")
                            // .style("border-width", 0)
                            // .style("border-color", "blue")
                            }
                        )

        const circles = nodes.append("circle")
                    .attr("r", d => bubbleSize(d.value))
                    .style("fill", d => bubbleColor(d.gender))
                    .style("stroke", "#6da1c9")
                    .style("stroke-width", 1) 
                    // .attr('opacity', 0.55)


        const nameLabels = nodes.append("text")
                        .text(function(d) {return d.firstName})
                        .attr("text-anchor", "middle")
                        .attr('class', 'name-label')

        const valueLabels = nodes.append("text")
                        .text(function(d) {return d.value})
                        .attr("text-anchor", "middle")
                        .attr('class', 'value-label')


        const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width * 0.18).y(height * 0.29)) // Attraction to the center of the svg area
        // .force("center", d3.forceCenter().x(width * 0.4).y(height * 0.4)) // Attraction to the center of the svg area
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (bubbleSize(d.value)+3) }).iterations(1)) // Force that avoids circle overlapping

        simulation
        .nodes(nameGender)
        .on("tick", function(d){
                
            circles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            
            nameLabels 
            .attr("x", d => d.x)
            .attr("y", d => d.y)

            valueLabels 
            .attr("x", d => d.x)
            .attr("y", d => d.y+10)

        })   
    }
});


  })


  