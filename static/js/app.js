function buildMetadata(sample) {

    // Use d3 to select the panel with id of `#sample-metadata`
     var metadata = d3.select("#sample-metadata")
    // Use `d3.json` to fetch the metadata for a sample
      d3.json(`/metadata/${sample}`).then(successHandle).catch(errorHandle)
      function successHandle(result){
        var metadata = d3.select("#sample-metadata")
        console.log(`Result is`, result)
        // Clear any existing data
        metadata.html("")
        for( var key in result){
          metadata.append("h6").text(key + ":" + result[key])
        }
      }
      function errorHandle(error){
        console.log(`error is :`,error)
      }    
      // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);
  }
  
  function buildCharts(sample) {
  
    // Use `d3.json` to fetch the sample data for the plots
       var url =`/samples/${sample}`
       d3.json(url).then(successHandle).catch(errorHandle)
       function successHandle(data){
         console.log(data)
         var piedata =[{
           values:data.sample_values.slice(0, 10),
           labels:data.otu_ids.slice(0, 10),
           hovertext:data.otu_labels.slice(0, 10),
           hoverinfo:'hovertext',
           type:"pie"
          }]
         var layout = {
          height: 400,
          width: 500,
         } 
         Plotly.newPlot("pie",piedata,layout)
         var bubbledata =[{
          x:data.otu_ids,
          y:data.sample_values,
          mode:'markers',
          marker:{
            color:data.otu_ids,
            size:data.sample_values
          },
          text:data.otu_labels
        }]
        var layout = {
          margin: {t :0},
          showlegend: false
        };
        Plotly.newPlot("bubble",bubbledata,layout)
       }
       function errorHandle(error){
         console.log(`error is:`,error)
       }    
   }
  
  function init() {
    // Get a reference to dropdown menu
    var selector = d3.select("#selDataset");
  
    // Populate dropdown menu options with list of sample names
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Build initial plots with first sample
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Get new sample data each when user selects new sample
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Run the page
  init();