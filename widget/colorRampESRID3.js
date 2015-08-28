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

    "esri/renderers/DotDensityRenderer",
    "esri/renderers/ScaleDependentRenderer",

], function (

    declare, lang, dom, mouse,

    Extent,
    FeatureLayer, InfoTemplate, Legend,
    SimpleRenderer, Color,
    SimpleFillSymbol, SimpleLineSymbol,

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

        colorRamp:function(color , type){

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


                if(this.map.graphicsLayerIds.length == 0){
                    this.map.addLayer(this.layer);
                    this.legend.startup();
                } else {
                    this.legend.refresh();
                }
        }
    });
});