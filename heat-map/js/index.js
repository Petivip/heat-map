var height = 600, width = 1000,
    margin = {
      left: 100, right: 20, top: 30, bottom: 120
    },
    url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",
    months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
var color = d3.schemeOranges[9];


var tf=d3.time.format("%Y");
 
var svg=d3.select("#main").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom )
          .append("g")
          .attr("transform","translate(100,80)");
 
var tooltip=d3.select("#main").append("div")
              .attr("class","tooltip")
              .style("opacity",0);

var heading = d3.select(".con")
                .append("h1")
                .attr('id', 'title')
                .text("Monthly Global Land-Surface Temperature");
  
      
      
 
var xScale = d3.time.scale().range([0,width]);
var yScale = d3.scale.ordinal().domain(months).rangeBands([0,height]);
var colorScale=d3.scale.quantize().range(color);

d3.json(url, callback);

function callback(data){
  
  data=data.monthlyVariance;
  
  data.map(function(d){
d.month = months[d.month-1];   
d.year = tf.parse(d.year.toString());
    
  })

  var minyear=d3.min(data,(d)=>d.year);
  var maxyear=d3.max(data,(d)=>d.year);
  
xScale.domain([minyear,maxyear]);

  var minvar=d3.min(data,(d)=>d.variance);
  var maxvar=d3.max(data,(d)=>d.variance);
  
 colorScale.domain([minvar, maxvar])
                    
  var yAxis=d3.svg.axis().scale(yScale).orient("left").tickSize(10, 1).ticks(12);
  
  svg.append("g")
     .attr("class","y-axis")
     .attr("transform", "translate(6,0)")
     .call(yAxis)
     .append("text")
     .attr("x", 80)
     .attr("y",90)
     .attr("transform","rotate(90)")
     .attr("font-size","1.5em")
     .attr("text-anchor","end")
     .text("Months");
  
 var xAxis=d3.svg.axis().scale(xScale).orient("bottom").tickSize(10, 1).tickFormat(d3.time.format("%Y"));

  
            
svg.append("g")
     .attr("class","x-axis")
     .attr("transform", "translate(6, "+ height + ")")
     .call(xAxis)
     .append("text")
     .attr("x",width-30)
     .attr("y", 50)
     .attr("font-size","1.5em")
     .attr("text-anchor","end")
     .text("Years");
  
  svg.selectAll("g")
     .data(data)
     .enter()
     .append("g")
     .attr("transform", (d)=>"translate(" + xScale(d.year) + "," + yScale(d.month) + ")")
     .append("rect")
     .attr("width",(width/ (data.length / 12)))
     .attr("height",yScale.rangeBand())
     .attr("fill", (d)=>colorScale(d.variance))
     .on("mouseover", function(d){
       tooltip.style("opacity", 0.9)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 20) + "px")
              .html("Year: " + d.year +", " + d.month + "</br> variance: " + d.variance )
     })
    .on("mouseout", function(){
    tooltip.style("opacity", 0);
  })
              
      
}