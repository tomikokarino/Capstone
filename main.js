/* LOAD DATA */
d3.csv('../Data/MoMAArtists.csv', d3.autoType)
  .then(MoMAArtists => {
    // console.log('MoMA artists', MoMAArtists)
    
    
    const width = 900; //window.innerWidth
    const height = 900; //window.innerHeight
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

// *******************************************
// Top 30 first names
// *******************************************

const top30Names = nameGender.filter(function(d) {return d.value >= 50})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                                Gender treemap                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// *************************************
// Group by gender
// *************************************

const groupedByGender = d3.group(noNullGender, d => d.Gender)
console.log("groupedByGender:", groupedByGender)

// ***********************************************
// Create hierarchy
// then sort by Gender count in descending order
// ***********************************************

const hierarchyGroup = d3.hierarchy(groupedByGender)
    .count(d => d.value)
    .sort((a,b) => b.value - a.value)
    console.log("hierarchyGroup:", hierarchyGroup)

const treemap = d3.treemap()
.size([650, 400])
.round(true)


const treemapRoot = treemap(hierarchyGroup)
console.log('treemapRoot.children', treemapRoot.children)

// *************************************
// Color scale
// *************************************
const treeMapcolorScale = d3.scaleOrdinal()
        .domain(treemapRoot.children)
        .range(["#D3D0CB","#E2C044","#587B7F"])  // color palette (middle three colors) https://coolors.co/palette/393e41-d3d0cb-e2c044-587b7f-1e2019

// *************************************
// Treemap chart
// *************************************
const treemapChart = d3.select("#gender-map-chart")
  .append("svg")
  .attr("viewBox", `0 0 ${width*1.2} ${height*0.4}`)
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
.style('font-size', 14)
// console.log('data[1]', treemapRoot.children)

gender.append('rect')
.attr('fill', d => treeMapcolorScale(d))
.attr('stroke', 'white')
.attr('opacity', 0.7)
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
.text(d => d)
.style("font-weight", "bold")
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                                  Bar chart                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// **************
// Scales
//**************

const xScale = d3.scaleBand()
                .domain(nameGender.map(d => d.firstName))
                .range([margin.left, (width + margin.left + margin.right)])
                .padding(0.1);

const yScale = d3.scaleLinear()
                .domain([0, d3.max(nameGender, d => d.value)])
                .range([height, 0]);

const barColor = d3.scaleOrdinal()
                .domain(["Male", "Female", "Non-Binary"])
                .range(["#F6BD60","#F5CAC3","#F28482"]); // color palette https://coolors.co/palette/f6bd60-f7ede2-f5cac3-84a59d-f28482
              


const barChart = d3.select("#bar-chart")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)


// **************
// X-axis
// **************

barChart.append("g")
        .attr("calss", "x-axis")
        .style("transform", `translate(0,${width}px)`)
        .call(d3.axisBottom(xScale))

// **************
// Y-axis
// **************

barChart.append("g")
        .attr("class", "y-axis")
        .style("transform", `translate(${margin.left}px, 0px)`)
        .call(d3.axisLeft(yScale))


// *************************************
// Bar chart
// *************************************

barChart.selectAll(".bar")
        .data(nameGender)
        .join("rect")
        .attr("class", "bar")
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.value))
        .attr("x", d => xScale(d.firstName))
        .attr("y", d => yScale(d.value))
        .attr("fill", d => barColor(d.gender));


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
//                                                  Bubble chart                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// *************************************
// Scales
// *************************************
const bubbleColor = d3.scaleOrdinal()
  .domain(["Male", "Female", "Non-Binary"])
  .range(["#F6BD60","#F5CAC3","#F28482"]); // color palette https://coolors.co/palette/f6bd60-f7ede2-f5cac3-84a59d-f28482

const bubbleSize = d3.scaleLinear()
.domain([5, 200])
.range([10, 50]) 


// *************************************
// Bubble chart
// *************************************

const bubbleChart = d3.select("#bubble-chart")
  .append("svg")
  .attr("viewBox", `0 0 ${width*0.8} ${height*0.8}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .classed("bubble", true)
  .style("border-style", "solid")
  .style("border-width", 0)



const bubbleNode = bubbleChart.append("g")
        .selectAll("circle")
        .data(nameGender)
        .join("circle")
        .attr("class", "bubbleNode")
        .attr("r", d => bubbleSize(d.value))
        .attr("cx", width / 2)
        .attr("cy", height /2)
        .style("fill", d => bubbleColor(d.gender))
        .style("fill-opacity", 0.9)
        .attr("stroke", "#4A4E69")
        .style("stroke-width", 1)


bubbleNode.append("text")
          .attr("dx", function(d) {return -20})
          .text(function(d) {return d.firstName})



const simulation = d3.forceSimulation()
.force("center", d3.forceCenter().x(width * 0.4).y(height * 0.4)) // Attraction to the center of the svg area
.force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (bubbleSize(d.value)+3) }).iterations(1)) // Force that avoids circle overlapping

simulation
.nodes(nameGender)
.on("tick", function(d){
bubbleNode
.attr("cx", d => d.x)
.attr("cy", d => d.y)
}
);             
  

  })