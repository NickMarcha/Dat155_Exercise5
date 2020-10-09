
export default class CollisionObject {

    constructor(mesh, isStatic = true) {

        this.mesh = mesh;

        this._onIntersect = null;

        this._destroy = false;

        this.isStatic = isStatic;

    }

    setOnIntersectListener(listener) {
        this._onIntersect = listener.bind(this);
    }

    destroy() {
        this._destroy = true;
    }
 }