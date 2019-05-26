MG.tunnelWall = (function (rootNode) {
    var DTHETA = 20;
    var NUM_SEGMENTS = 6;

    var NEAR_CLIPPING_PLANE = 25;

    var GRADIENT_START = MG.LINE_OF_SIGHT;
    var GRADIENT_STOP = GRADIENT_START - MG.BARRIER_SPACING;


    var mTheta = 0;

    var mSegments = [];

    return {
        init: function (rootNode) {
            const COLORS = ['#a71930', '#1e1e1e', '#00693c'];

            var gradient = {},
                gradientStart = {},
                gradientStop = {};
            for (let i = 0; i < 3; i++) {
                gradient[i] = document.createElementNS(NAMESPACE_SVG, 'linearGradient');
                gradient[i].id = `tunnel-wall-segment-fade-gradient${i}`;
                gradient[i].setAttribute('gradientUnits', 'userSpaceOnUse');
                rootNode.appendChild(gradient[i]);

                gradientStart[i] = document.createElementNS(NAMESPACE_SVG, 'stop');
                gradientStart[i].setAttribute('offset', (5 * NEAR_CLIPPING_PLANE / GRADIENT_START) + '');
                gradientStart[i].setAttribute('stop-color', '#fff');
                gradient[i].appendChild(gradientStart[i]);

                gradientStop[i] = document.createElementNS(NAMESPACE_SVG, 'stop');
                gradientStop[i].setAttribute('offset', (5 * NEAR_CLIPPING_PLANE / GRADIENT_STOP) + '');
                gradientStop[i].setAttribute('stop-color', COLORS[i % 3]);
                gradient[i].appendChild(gradientStop[i]);
            }

            for (var i = 0; i < NUM_SEGMENTS; i++) {

                mSegments[i] = document.createElementNS(NAMESPACE_SVG, 'path');
                mSegments[i].setAttribute('class', 'wall-segment-dark');
                mSegments[i].setAttribute('d', 'M 0,0 l 1000,50 l 0,-50 z');

                mSegments[i].setAttribute('fill', `url(#tunnel-wall-segment-fade-gradient${i % 3})`);

                rootNode.appendChild(mSegments[i]);
            }

            this.updateDOM(0, 0, 0);
        },

        update: function (dt) {
            mTheta = mTheta + dt * DTHETA;
            mTheta %= 360;
        },

        updateDOM: function (x, y, offset) {

            for (var i = 0; i < NUM_SEGMENTS; i++) {
                var segmentTheta = mTheta + 360 * i / NUM_SEGMENTS;

                var x_ = -x * Math.cos(segmentTheta * Math.PI / 180) + -y * Math.sin(segmentTheta * Math.PI / 180);
                var y_ = -x * Math.sin(segmentTheta * Math.PI / 180) + y * Math.cos(segmentTheta * Math.PI / 180);

                var scale_x_ = 0.1 * MG.PROJECTION_PLANE_DISTANCE * (1 - x_ / MG.TUNNEL_RADIUS)
                    / (Math.tan(Math.PI * MG.FIELD_OF_VIEW / 360.0) * NEAR_CLIPPING_PLANE);
                var scale_y_ = 0.1 * MG.PROJECTION_PLANE_DISTANCE
                    / (Math.tan(Math.PI * MG.FIELD_OF_VIEW / 360.0) * NEAR_CLIPPING_PLANE);

                var skew = 180 * Math.atan(y_ / MG.TUNNEL_RADIUS) / Math.PI;

                mSegments[i].setAttribute('transform', 'rotate(' + segmentTheta + ') '
                    + 'scale(' + scale_x_ + ',' + scale_y_ + ') '
                    + 'skewY(' + skew + ')');


            }
        }
    }
}());
