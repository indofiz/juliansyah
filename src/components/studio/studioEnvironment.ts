import * as THREE from "three";

/**
 * A product-photo studio as a reflection map: a dark room that is a little
 * lighter at the top, a big soft key light upper left, a broad top light,
 * two tall strips behind for the rim highlights on the metal edges, and a
 * dim fill on the right. All neutral white: the site adds its own accent glow.
 *
 * Built in code (no HDR file to download), rendered once into a PMREM.
 */
export function studioEnvironment(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const env = new THREE.Scene();
  const disposables: { dispose(): void }[] = [];

  const roomGeo = new THREE.SphereGeometry(30, 48, 24);
  const pos = roomGeo.getAttribute("position");
  const colours: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) / 30 + 1) / 2; // 0 at the floor, 1 at the ceiling
    const v = 0.02 + 0.16 * t * t;
    colours.push(v, v, v);
  }
  roomGeo.setAttribute("color", new THREE.Float32BufferAttribute(colours, 3));
  const roomMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide });
  env.add(new THREE.Mesh(roomGeo, roomMat));
  disposables.push(roomGeo, roomMat);

  const panel = (w: number, h: number, intensity: number, x: number, y: number, z: number) => {
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1).multiplyScalar(intensity), side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
    disposables.push(geo, mat);
  };
  panel(10, 10, 6, -10, 8, 8); // key, upper left front
  panel(14, 6, 3, 0, 14, 0); // top
  // Strips level with the phone light the rounded edges in a front view
  // (a 45° edge reflects what's straight to the side), so the outline
  // reads on a dark page. The ones behind light the sides when it turns.
  panel(1.4, 18, 12, -12, 2, 1);
  panel(1.4, 18, 12, 12, 2, 1);
  panel(1.6, 16, 10, -10, 1, -8);
  panel(1.6, 16, 10, 10, 1, -8);
  panel(7, 7, 1.6, 11, 2, 8); // fill, right front
  panel(12, 2.4, 0.8, 0, -4, 12); // low card in front, a faint sheen on the glass

  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(env, 0.035);
  pmrem.dispose();
  disposables.forEach((d) => d.dispose());
  return target;
}

