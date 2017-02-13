// ALL ANGLES ARE IN radian

var Point = function(x, y) {
    this.x = x;
    this.y = y;
};

Point.prototype = {
    constructor: Point,

    translate : function(x, y) {
        return new Point(this.x+x, this.y+y);
    },

    scale : function(s) {
        return new Point(this.x*s, this.y*s);
    },

    rotate : function(angle, x, y) {
        x = x || 0;
        y = y || 0;

        var point = new Point(this.x-x, this.y-y).rotate_about_origin(angle);
        return point.translate(x, y);
    },

    rotate_about_origin : function(angle) {
        var r = this.magnitude();
        return new Point(r*Math.cos(angle), r*Math.sin(angle));
    },

    magnitude : function() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    },
};

var Circle = function(x, y, r) {
    this.center = new Point(x, y);
    this.r = r;
    this.curr_position = this.center.translate(r, 0); // means angle 0
    this.velocity = 1; //angular velocity

    this.circumference = 2*Math.PI*r;

    this.surface = null;
};

Circle.prototype = {
    constructor: Circle,

    offset : function(angle) {
        var currpos = this.curr_position;
        this.curr_position = this.curr_position.rotate(angle, this.center.x, this.center.y);
    },

    get_position : function(t) {
        this.curr_position = this.curr_position.rotate(this.velocity*t, this.center.x, this.center.y);
        var surface_point = this.surface!=null?this.surface.get_position(t):new Point(0,0);
        return this.curr_position.translate(surface_point.x, surface_point.y);
    },
    set_surface: function(surface) {
        this.surface = surface;
    }
}

var Plane = function(x1,y1,x2,y2) {
    this.velocity = 15;
    this.curr_position = new Point(x1,y1);
    this.dy = y2-y1;
    this.dx = x2-x1;
    this.vector = new Point(this.dx, this.dy);
    var mag = this.vector.magnitude();
    this.vector.x/=mag;
    this.vector.y/=mag;
    this.surface = null;
}

Plane.prototype = {
    constructor: Plane,
    offset: function(point) {
        this.curr_position = this.curr_position.translate(point.x, point.y);
    },
    get_position : function(t) {
        var scaled = this.vector.scale(t*this.velocity);
        var surface_point = this.surface!=null?this.surface.get_position(t):new Point(0,0);
        return this.curr_position.translate(scaled.x, scaled.y).translate(surface_point.x, surface_point.y);
        //return this.curr_position;
    },
    set_surface : function(surface) {
        this.surface = surface;
    }
}
