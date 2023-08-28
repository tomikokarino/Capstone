/* LOAD DATA */
d3.csv('Data/MoMAArtists.csv', d3.autoType)
  .then(MoMAArtists => {
    
    const width = window.innerWidth; //window.innerWidth | 900
    const height = window.innerHeight; //window.innerHeight | 900
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    
// **************************************************
// Filter out the Null gender first                  
// **************************************************

    const noNullGender = MoMAArtists
    .filter(function(d) {return d.Gender != null})

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

// // ***********************************************
// // Create hierarchy
// // then sort by Gender count in descending order
// // ***********************************************

const hierarchyGroup = d3.hierarchy(groupedByGender)
    .count(d => d.value)
    .sort((a,b) => b.value - a.value)

const treemap = d3.treemap()
.size([1280, 708])
.round(true)


const treemapRoot = treemap(hierarchyGroup)

// // *************************************
// // Color scale
// // *************************************

const treeMapcolorScale = d3.scaleOrdinal()
        .domain(treemapRoot.children)
        .range(["#D1FDEB","#E2BEFD","#F4FDBE"])  // color palette (middle three colors) https://coolors.co/palette/393e41-d3d0cb-e2c044-587b7f-1e2019

// // *************************************
// // Treemap chart
// // *************************************

const treemapChart = d3.select("#gender-map-chart")
  .append("svg")
  .attr("viewBox", `0 0 1280 708`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .classed("gender-map", true)
  .style("background-color", "#ffffff")

const g = treemapChart.append('g')
  .attr('class', 'treemap-container')

const gender = g.selectAll('g.gender')
.data(treemapRoot.children)
.join('g')
.attr('class', 'gender')
.attr('transform', d => `translate(${ d.x0 },${ d.y0 })`)
.style('font-size', 24)

gender.append('rect')
.attr('fill', d => treeMapcolorScale(d))
.style("stroke", "#01579B")
.style("stroke-width", 1) 
.attr('width', d => d.x1 - d.x0)
.attr('height', d => d.y1 - d.y0)
.attr('rx', 3)
.attr('ry', 3)

gender.each((d, i, arr) => {

const current = arr[i]

const left = d.x0,
right = d.x1,
width = right - left,
top = d.y0,
bottom = d.y1,
height = d.y1 - d.y0

const tooSmall = width < 34 || height < 25

const text = d3.select( current ).append('text')
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

const bubbleSize = d3.scaleLinear()
  .domain([5, 200])
  .range([10, 50]) 


// *************************************
// Bubble chart
// *************************************

const bubbleChart = d3.select("#bubble-chart")
  .append("svg")
  .attr("viewBox", `0 0 ${width*0.4} ${height*0.7}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .classed("bubble", true)

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
                            }
                        )

        const circles = nodes.append("circle")
                    .attr("r", d => bubbleSize(d.value))
                    .style("fill", d => bubbleColor(d.gender))
                    .style("stroke", "#6da1c9")
                    .style("stroke-width", 1)

        const nameLabels = nodes.append("text")
                        .text(function(d) {return d.firstName})
                        .attr("text-anchor", "middle")
                        .attr('class', 'name-label')

        const valueLabels = nodes.append("text")
                        .text(function(d) {return d.value})
                        .attr("text-anchor", "middle")
                        .attr('class', 'value-label')


        const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width * 0.18).y(height * 0.29))
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (bubbleSize(d.value)+3) }).iterations(1))

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


  