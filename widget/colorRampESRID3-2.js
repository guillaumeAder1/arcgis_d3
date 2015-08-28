/**
 * Created by GAder on 21/08/2015.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom",
    "dojo/mouse",

    "esri/geometry/Extent",
    "esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/dijit/Legend",
    "esri/renderers/SimpleRenderer", "esri/Color",
    "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "dojo/on",
    "esri/renderers/DotDensityRenderer",
    "esri/renderers/ScaleDependentRenderer",

], function (

    declare, lang, dom, mouse,

    Extent,
    FeatureLayer, InfoTemplate, Legend,
    SimpleRenderer, Color,
    SimpleFillSymbol, SimpleLineSymbol,
    on,
    DotDensityRenderer,ScaleDependentRenderer




    ) {

    return declare([], {

        myvariable:null,
        map:null,
        legend:null,
        layer:null,



        constructor: function (param) {


            this.map = param.map;
            this.legend = param.legend;
            this.layer =  param.layer;

        },



        layerAdded: function () {

            console.log(this.map , this.legend, this.layer);
            //this.colorRamp();
        },

        colorRamp:function(color ){
alert("colorRamp")
            if(color == null){ color = [127, 127, 0] }

                    var renderer = new SimpleRenderer(new SimpleFillSymbol().setOutline(new SimpleLineSymbol().setWidth(0.1)));
                    renderer.setColorInfo({
                        field: "M086_07",
                        minDataValue: 0,
                        maxDataValue: 100,
                        colors: [
                            new Color([255, 255, 255, 0]),
                            new Color(color)
                        ]
                    });
                    this.layer.setRenderer(renderer);//

                    this.map.addLayer(this.layer);

//                    this.layer.on("graphic-draw" , function(evt){
//                        //evt.preventDefault();
//                        console.log("fkljsgnk");
//                    });


                    this.legend.startup();

        },

        d3colorFct: function(color){
alert("d3 color fct")
            var totalElement = d3.select("body").selectAll("path")[0].length;

            d3.select("body").selectAll("path").each( function(d,i){

                d3.select(this).transition().duration(500).delay(i * .6).style("fill" , color).each("end", function(){

                    if(i + 1 == totalElement){
                       // wdgt.colorRamp(color);
                    }
                });
            });

        }
    });
});