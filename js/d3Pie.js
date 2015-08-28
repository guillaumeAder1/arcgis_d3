function mathRadians (degrees) {	return degrees * Math.PI / 180;	};
function mathDegrees (radians) {	return radians * 180 / Math.PI;	};

function pieChart(data, rad, iRad, duration, posx, posy, _div){
    // data doit contenir les valeur texte "label", les valeur numérique "value" et les couleurs "color"
    //
    pieChart.CIRCULAR = "circular";
    pieChart.SCALING = "scaling";
    pieChart.SEMI_SCALING = "semi-scaling";
    var _type,
        _displayed = false,
        _trgDiv = _div,
        _inRadius = iRad,
        _duration = duration,
        _radius = rad,
        _x = posx,
        _y = posy,
    // Setup all the constants
        _width = rad*2,
        _height = rad*2,
    //var radius = Math.floor(Math.min(width/2, height/2) * 0.9);
        _angl = 0,
    // Test Data
        _data = data,
        _donut,
        _arc,
        _arcs,
        _arc_grp,
        _label_group,
        _svg,
        _sliceLabel,
        _labelHidden = false;
    //////////////////////////////
    //////////////////////////////
    // Update the data
    var updateChart = function(dataset, type) {
        _arcs.style("opacity", 1);
        _donut.endAngle(mathRadians(360));
        _arcs.data(_donut(dataset))
            .attr("fill", function(d, i) {return d.data.color;})
            .attr("alt", function(d){return d.value+" "+d.data.label;});
        if(type == pieChart.CIRCULAR){
            _arcs.transition()
                .duration(_duration)
                .attrTween("d", arcTween);
        }else if(type == pieChart.SCALING){
            _arc.outerRadius(_radius)
                .innerRadius(_inRadius);
            _arcs.transition()
                .duration(_duration)
                .attr("d", _arc);
        }else if(type == pieChart.SEMI_SCALING){
            _arcs.transition()
                .duration(_duration)
                .attr("d", _arc);
            _arc.outerRadius(_radius);
            _arcs.transition()
                .duration(_duration)
                .delay(_duration)
                .attr("d", _arc);
        }
        if(_labelHidden)
            return;
        //
        _sliceLabel.data(_donut(dataset));
        _sliceLabel.transition()
            .duration(_duration)
            .attr("transform", function(d) {return "translate(" + (_arc.centroid(d)) + ")";})
            .style("fill-opacity", 1)
    };
    // public call for updating data
    this.upChart = function (_d){
        _displayed = true;
        var interval = setInterval(function() {
            clearInterval(interval);
            return updateChart(_d, _type);
        }, 200);
    }
    //////////////////////////////
    //////////////////////////////
    // Set the initial data
    this.init = function (){
        var color = d3.scale.category20();
        _donut = d3.layout.pie()
            .sort(null)
            .endAngle(mathRadians(_angl))
            .value(function(d) {
                if(d.value == "null")
                    return 0;
                return d.value;
            });
        _arc = d3.svg.arc()
            .innerRadius(function(){
                if(_type == pieChart.CIRCULAR)
                    return _inRadius;
                else if(_type == pieChart.SEMI_SCALING)
                    return _inRadius;
                else
                    return 1;
            })
            .outerRadius(function() {
                if(_type == pieChart.CIRCULAR)
                    return _radius;
                else if(_type == pieChart.SEMI_SCALING)
                    return _inRadius;
                else
                    return 1;
            });
        svg = d3.select(_trgDiv).append("g")
            .attr("id", "pieControl")
            .attr("transform", "translate(" + _x + "," + _y + ")")
            .append("svg")
            .attr("class", "pChart")
            .style("margin-left", 100)
            .attr("width", _width)
            .attr("height", _height);
        //
        _arc_grp = svg.append("g")
            .attr("class", "arcGrp")
            .attr("transform", "translate(" + (_width/2) + "," + (_height/2) + ")");
        _label_group = svg.append("g")
            .attr("class", "lblGroup")
            .attr("transform", "translate(" + (_width/2) + "," + (_height/2) + ")");
        //
        _arcs = _arc_grp.selectAll("path")
            .data(_donut(_data));
        _arcs.enter()
            .append("path")
            .attr("stroke", "white")
            .attr("stroke-width", 0.8)
            .attr("alt", function(d){return d.value+" "+d.data.label;})
            .attr("fill", function(d, i) {return d.data.color;})
            .attr("d", _arc)
            .on("mouseover", function(){
                if(_myPopup){
                    _myPopup.displayPopup(_mouseX, _mouseY, d3.select(this).attr("fill"));
                }else{
                    _myPopup = new dynPopup();
                    _myPopup.setPopup(50, 50, null, null, C_ROUND_RECT);
                }
                _myPopup.setText(d3.select(this).attr("alt"));
            })
            .on("mouseout", function(){
                if(_myPopup)
                    _myPopup.hidePopup();
            })
            .on("mousemove", function(){
                _myPopup.displayPopup(_mouseX, _mouseY, d3.select(this).attr("fill"));
            })
            .each(function(d) {return this.current = d;});
        //
        _sliceLabel = _label_group.selectAll("text")
            .data(_donut(_data));
        _sliceLabel.enter()
            .append("text")
            .attr("class", "arcLabel")
            .attr("transform", function(d) {return "translate(" + (_arc.centroid(d)) + ")";})
            .attr("text-anchor", "middle")
            .style("fill-opacity", 0)
            .text(function(d) {
                if(d.data[0] == "null")
                    return "";
                return d.data.label;
            });
        // màj données
        this.upChart(_data);
    }
    function _reset(_t){
        if(!_donut || !_arcs)
            return;
        _angl = 0;
        _arc.innerRadius(function(){
            if(_t == pieChart.CIRCULAR)
                return _inRadius;
            else if(_t == pieChart.SEMI_SCALING)
                return _inRadius;
            else
                return 1;
        })
            .outerRadius(function() {
                if(_t == pieChart.CIRCULAR)
                    return _radius;
                else if(_t == pieChart.SEMI_SCALING)
                    return _inRadius;
                else
                    return 1;
            });
        //
        if(_t == pieChart.SCALING)
            _angl = 360;
        _donut.endAngle(mathRadians(_angl))
            .value(function(d) {return d.value;});
        _arcs.data(_donut(_data))
            .attr("d", _arc);
    }
    /// FUNCTION GUI A 
    // association d'une classe a une piechart'
    this.setClassPie = function(nameClass){
        d3.selectAll("#pieControl:last-child").attr("class" , nameClass);
    }

    // Tween Function
    var arcTween = function(a) {
        var i = d3.interpolate(this.current, a);
        this.current = i(0);
        return function(t) {return _arc(i(t));};
    };
    // Setter
    this.setAnimType = function (_aT){
        _type = _aT;
        //
        _reset(_type);
    }
    this.addWidthAndHeight = function (_w, _h){
        _width += _w;
        _height += _h;
    }
    this.hideLabel = function(){
        _sliceLabel.style("display", "none");
        _labelHidden = true;
    }
    this.hide = function(_t, _callback) {
        if(_t == pieChart.CIRCULAR){
            _angl = 0;
            _donut.endAngle(mathRadians(_angl));
            _arcs.data(_donut(_data));
            _arcs.transition()
                .duration(_duration)
                .attrTween("d", arcTween)
                .each("end", endHide);
        }else if(_t == pieChart.SCALING){
            _arc.outerRadius(1)
                .innerRadius(1);
            _arcs.transition()
                .duration(_duration)
                .attr("d", _arc)
                .each("end", endHide);
        }else if(_t == pieChart.SEMI_SCALING){
            _arc.outerRadius(_inRadius);
            _arcs.transition()
                .duration(_duration)
                .attr("d", _arc)
                .each("end", endHide);
        }
        //
        _sliceLabel.transition()
            .duration(_duration)
            .style("fill-opacity", 0);
        //
        function endHide(){
            _arcs.style("opacity", 0);
            _displayed = false;
            if(_callback != null)
                _callback();
        }
    }
    this.setRadius = function(_oradius, _iradius){
        _arc.outerRadius(_oradius);
        _arc.innerRadius(_iradius);
        svg.attr("width", _oradius*2)
            .attr("height", _oradius*2);
        _arc_grp.attr("transform", "translate(" + _oradius + "," + _oradius + ")");
        _label_group.attr("transform", "translate(" + _oradius + "," + _oradius + ")");
    }
    this.setPosition = function(_x, _y){
        d3.select("#pieControl").attr("transform", "translate(" + _x + "," + _y + ")")
    }

    this.isDisplayed = function(){return _displayed;}
    this.getData = function(){return _data;}
    this.getWidth = function(){return _width;}
    this.getHeight = function(){return _height;}
}