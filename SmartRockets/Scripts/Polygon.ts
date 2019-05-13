/// <reference path="PageContent.ts" />

class Polygon {

    private points: Vector[] = [];
    private length: number = 0;


    public addPoint(point: Vector): void {
        this.points.push(point);
        this.length++;
    }

    public getPoints(): Vector[] { return this.points; }

    public drawPath(ctx: CanvasRenderingContext2D): void {
        if (this.points.length > 1) {
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for (let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.lineTo(this.points[0].x, this.points[0].y);
        }
    }


    /**
    * Helper function to determine whether there is an intersection between the two polygons described
    * by the lists of vertices. Uses the Separating Axis Theorem
    *
    * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
    * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
    * @return true if there is any intersection between the 2 polygons, false otherwise
    */
    public collisionDetection(b: Polygon) {
        let polygons = [this, b];
        let minA, maxA, projected, i, i1, j, minB, maxB;

        for (i = 0; i < polygons.length; i++) {

            // for each polygon, look at each edge of the polygon, and determine if it separates
            // the two shapes
            let polygon = polygons[i];
            for (i1 = 0; i1 < polygon.length; i1++) {

                // grab 2 vertices to create an edge
                var i2 = (i1 + 1) % polygon.length;
                var p1 = polygon.getPoints()[i1];
                var p2 = polygon.getPoints()[i2];

                // find the line perpendicular to this edge
                var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

                minA = maxA = undefined;
                // for each vertex in the first shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                for (j = 0; j < this.length; j++) {
                    projected = normal.x * this.getPoints()[j].x + normal.y * this.getPoints()[j].y;
                    if (minA === undefined || projected < minA) {
                        minA = projected;
                    }
                    if (maxA === undefined || projected > maxA) {
                        maxA = projected;
                    }
                }

                // for each vertex in the second shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                minB = maxB = undefined;
                for (j = 0; j < b.length; j++) {
                    projected = normal.x * b.getPoints()[j].x + normal.y * b.getPoints()[j].y;
                    if (minB === undefined || projected < minB) {
                        minB = projected;
                    }
                    if (maxB === undefined || projected > maxB) {
                        maxB = projected;
                    }
                }

                // if there is no overlap between the projects, the edge we are looking at separates the two
                // polygons, and we know there is no overlap
                if (maxA < minB || maxB < minA) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Determines if a polygon and a circle are colliding
     * @param {Polygon} a The source polygon to test
     * @param {Circle} b The target circle to test against
     * @param {Result} [result = null] A Result object on which to store information about the collision
     * @param {Boolean} [reverse = false] Set to true to reverse a and b in the result parameter when testing circle->polygon instead of polygon->circle
     * @returns {Boolean}
     */
    public polygonCircle(a, b, result = null, reverse = false) {
        const a_coords = a._coords;
        const a_edges = a._edges;
        const a_normals = a._normals;
        const b_x = b.x;
        const b_y = b.y;
        const b_radius = b.radius * b.scale;
        const b_radius2 = b_radius * 2;
        const radius_squared = b_radius * b_radius;
        const count = a_coords.length;

        let a_in_b = true;
        let b_in_a = true;
        let overlap = null;
        let overlap_x = 0;
        let overlap_y = 0;

        // Handle points specially
        if (count === 2) {
            const coord_x = b_x - a_coords[0];
            const coord_y = b_y - a_coords[1];
            const length_squared = coord_x * coord_x + coord_y * coord_y;

            if (length_squared > radius_squared) {
                return false;
            }

            if (result) {
                const length = Math.sqrt(length_squared);

                overlap = b_radius - length;
                overlap_x = coord_x / length;
                overlap_y = coord_y / length;
                b_in_a = false;
            }
        }
        else {
            for (let ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
                const coord_x = b_x - a_coords[ix];
                const coord_y = b_y - a_coords[iy];
                const edge_x = a_edges[ix];
                const edge_y = a_edges[iy];
                const dot = coord_x * edge_x + coord_y * edge_y;
                const region = dot < 0 ? -1 : dot > edge_x * edge_x + edge_y * edge_y ? 1 : 0;

                let tmp_overlapping = false;
                let tmp_overlap = 0;
                let tmp_overlap_x = 0;
                let tmp_overlap_y = 0;

                if (result && a_in_b && coord_x * coord_x + coord_y * coord_y > radius_squared) {
                    a_in_b = false;
                }

                if (region) {
                    const left = region === -1;
                    const other_x = left ? (ix === 0 ? count - 2 : ix - 2) : (ix === count - 2 ? 0 : ix + 2);
                    const other_y = other_x + 1;
                    const coord2_x = b_x - a_coords[other_x];
                    const coord2_y = b_y - a_coords[other_y];
                    const edge2_x = a_edges[other_x];
                    const edge2_y = a_edges[other_y];
                    const dot2 = coord2_x * edge2_x + coord2_y * edge2_y;
                    const region2 = dot2 < 0 ? -1 : dot2 > edge2_x * edge2_x + edge2_y * edge2_y ? 1 : 0;

                    if (region2 === -region) {
                        const target_x = left ? coord_x : coord2_x;
                        const target_y = left ? coord_y : coord2_y;
                        const length_squared = target_x * target_x + target_y * target_y;

                        if (length_squared > radius_squared) {
                            return false;
                        }

                        if (result) {
                            const length = Math.sqrt(length_squared);

                            tmp_overlapping = true;
                            tmp_overlap = b_radius - length;
                            tmp_overlap_x = target_x / length;
                            tmp_overlap_y = target_y / length;
                            b_in_a = false;
                        }
                    }
                }
                else {
                    const normal_x = a_normals[ix];
                    const normal_y = a_normals[iy];
                    const length = coord_x * normal_x + coord_y * normal_y;
                    const absolute_length = length < 0 ? -length : length;

                    if (length > 0 && absolute_length > b_radius) {
                        return false;
                    }

                    if (result) {
                        tmp_overlapping = true;
                        tmp_overlap = b_radius - length;
                        tmp_overlap_x = normal_x;
                        tmp_overlap_y = normal_y;

                        if (b_in_a && length >= 0 || tmp_overlap < b_radius2) {
                            b_in_a = false;
                        }
                    }
                }

                if (tmp_overlapping && (overlap === null || overlap > tmp_overlap)) {
                    overlap = tmp_overlap;
                    overlap_x = tmp_overlap_x;
                    overlap_y = tmp_overlap_y;
                }
            }
        }

        if (result) {
            result.a_in_b = reverse ? b_in_a : a_in_b;
            result.b_in_a = reverse ? a_in_b : b_in_a;
            result.overlap = overlap;
            result.overlap_x = reverse ? -overlap_x : overlap_x;
            result.overlap_y = reverse ? -overlap_y : overlap_y;
        }

        return true;
    }
}