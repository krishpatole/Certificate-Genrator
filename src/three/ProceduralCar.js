import * as THREE from 'three';
import gsap from 'gsap';

/**
 * Procedural Stylized Supercar for VeloX Configurator
 * Built with native Three.js geometries, PBR physical materials, and smooth transitions
 */
export class ProceduralCar {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'VeloX_SportsCar';

    // Materials dictionary
    this.materials = {};

    // Track dynamic components
    this.wheelGroups = [];
    this.caliperMeshes = [];
    this.interiorMeshes = [];
    this.headlightMeshes = [];
    this.taillightMeshes = [];

    this._initMaterials();
    this._buildCar();
  }

  _initMaterials() {
    // 1. Exterior Car Paint (PBR Clearcoat Paint)
    this.materials.body = new THREE.MeshPhysicalMaterial({
      color: 0x0a0c0f,
      metalness: 0.92,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.95,
      envMapIntensity: 1.2,
    });

    // 2. Tinted Automotive Glass
    this.materials.glass = new THREE.MeshPhysicalMaterial({
      color: 0x0a101d,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.72,
      transparent: true,
      opacity: 0.85,
      ior: 1.52,
      thickness: 0.4,
    });

    // 3. Carbon Fiber Aero Trim
    this.materials.carbon = new THREE.MeshStandardMaterial({
      color: 0x111317,
      metalness: 0.35,
      roughness: 0.45,
    });

    // 4. Gloss Black Accents & Mesh Grilles
    this.materials.glossBlack = new THREE.MeshStandardMaterial({
      color: 0x06080b,
      metalness: 0.85,
      roughness: 0.15,
    });

    // 5. Polished Mirror / Chrome
    this.materials.chrome = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 1.0,
      roughness: 0.04,
    });

    // 6. Tires (Performance Rubber)
    this.materials.tire = new THREE.MeshStandardMaterial({
      color: 0x141518,
      metalness: 0.05,
      roughness: 0.82,
    });

    // 7. Brake Rotors (Cross-Drilled Steel)
    this.materials.rotor = new THREE.MeshStandardMaterial({
      color: 0x88929e,
      metalness: 0.95,
      roughness: 0.22,
    });

    // 8. Brake Calipers (Brembo Gloss Paint)
    this.materials.caliper = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.7,
      roughness: 0.25,
    });

    // 9. Wheel Rims
    this.materials.rim = new THREE.MeshStandardMaterial({
      color: 0xd8dde6,
      metalness: 0.95,
      roughness: 0.18,
    });

    // 10. Matrix LED Headlight DRLs
    this.materials.headlightDRL = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00f0ff,
      emissiveIntensity: 4.5,
      metalness: 0.1,
      roughness: 0.1,
    });

    // 11. Headlight Projector Lenses
    this.materials.headlightLens = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 3.5,
      metalness: 0.2,
      roughness: 0.1,
    });

    // 12. OLED Taillight Lightbar
    this.materials.taillight = new THREE.MeshStandardMaterial({
      color: 0xff0022,
      emissive: 0xff0022,
      emissiveIntensity: 5.0,
      metalness: 0.2,
      roughness: 0.15,
    });

    // 13. Interior Upholstery
    this.materials.interior = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      metalness: 0.15,
      roughness: 0.65,
    });
  }

  _buildCar() {
    const carRoot = new THREE.Group();

    // ==========================================
    // 1. UNDERBODY & MAIN MONOCOQUE CHASSIS
    // ==========================================
    const underbodyGeo = new THREE.BoxGeometry(1.92, 0.1, 4.4);
    const underbody = new THREE.Mesh(underbodyGeo, this.materials.carbon);
    underbody.position.set(0, 0.22, 0);
    underbody.castShadow = true;
    underbody.receiveShadow = true;
    carRoot.add(underbody);

    // ==========================================
    // 2. SCULPTED MAIN LOWER BODY & WAISTLINE
    // ==========================================
    // Central cabin lower tub
    const tubGeo = new THREE.BoxGeometry(1.78, 0.32, 2.3);
    const lowerTub = new THREE.Mesh(tubGeo, this.materials.body);
    lowerTub.position.set(0, 0.4, 0);
    lowerTub.castShadow = true;
    carRoot.add(lowerTub);

    // Sculpted Doors with deep waist side aerodynamic intake scallops
    const doorLGeo = new THREE.BoxGeometry(0.12, 0.3, 1.8);
    const doorL = new THREE.Mesh(doorLGeo, this.materials.body);
    doorL.position.set(-0.91, 0.42, 0);
    doorL.rotation.y = 0.04;
    doorL.castShadow = true;
    carRoot.add(doorL);

    const doorR = doorL.clone();
    doorR.position.set(0.91, 0.42, 0);
    doorR.rotation.y = -0.04;
    carRoot.add(doorR);

    // Side Rocker Panels / Carbon Aero Blades
    const sideBladeL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 2.2), this.materials.carbon);
    sideBladeL.position.set(-0.98, 0.22, 0);
    sideBladeL.castShadow = true;
    carRoot.add(sideBladeL);

    const sideBladeR = sideBladeL.clone();
    sideBladeR.position.set(0.98, 0.22, 0);
    carRoot.add(sideBladeR);

    // Side Radiator / Intercooler Inlets
    const sideScoopL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.45), this.materials.glossBlack);
    sideScoopL.position.set(-0.94, 0.44, -0.65);
    carRoot.add(sideScoopL);

    const sideScoopR = sideScoopL.clone();
    sideScoopR.position.set(0.94, 0.44, -0.65);
    carRoot.add(sideScoopR);

    // ==========================================
    // 3. FRONT NOSE, HOOD & FRONT FENDERS
    // ==========================================
    // Front Lower Bumper
    const frontBumperGeo = new THREE.BoxGeometry(1.84, 0.22, 0.7);
    const frontBumper = new THREE.Mesh(frontBumperGeo, this.materials.body);
    frontBumper.position.set(0, 0.36, 1.95);
    frontBumper.castShadow = true;
    carRoot.add(frontBumper);

    // Front Aerodynamic Carbon Splitter with Endplate Winglets
    const splitterCenter = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.04, 0.55), this.materials.carbon);
    splitterCenter.position.set(0, 0.18, 2.12);
    splitterCenter.castShadow = true;

    const wingletL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.3), this.materials.carbon);
    wingletL.position.set(-0.98, 0.24, 2.12);
    const wingletR = wingletL.clone();
    wingletR.position.set(0.98, 0.24, 2.12);

    carRoot.add(splitterCenter, wingletL, wingletR);

    // Front Grille Air Ducts (Gloss Black mesh simulation)
    const grilleLeft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.1), this.materials.glossBlack);
    grilleLeft.position.set(-0.5, 0.32, 2.3);
    grilleLeft.rotation.y = 0.15;
    const grilleRight = grilleLeft.clone();
    grilleRight.position.set(0.5, 0.32, 2.3);
    grilleRight.rotation.y = -0.15;
    carRoot.add(grilleLeft, grilleRight);

    // Aerodynamic Sloping Hood with Central Spine
    const hoodGeo = new THREE.CylinderGeometry(0.82, 0.94, 1.4, 6, 1, false, 0, Math.PI);
    hoodGeo.scale(1.06, 0.26, 1.0);
    hoodGeo.rotateX(Math.PI / 2);
    hoodGeo.rotateY(Math.PI / 4);
    const hood = new THREE.Mesh(hoodGeo, this.materials.body);
    hood.position.set(0, 0.54, 1.25);
    hood.rotation.x = 0.09;
    hood.castShadow = true;
    carRoot.add(hood);

    // Hood Heat Extraction Vents (Carbon)
    const hoodVentL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.4), this.materials.carbon);
    hoodVentL.position.set(-0.35, 0.62, 1.3);
    hoodVentL.rotation.x = 0.12;
    const hoodVentR = hoodVentL.clone();
    hoodVentR.position.set(0.35, 0.62, 1.3);
    hoodVentR.rotation.x = 0.12;
    carRoot.add(hoodVentL, hoodVentR);

    // Muscular Flared Front Fenders (Left & Right)
    const frontFenderLGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.95, 6, 1, false, 0, Math.PI);
    frontFenderLGeo.scale(0.32, 0.52, 1.0);
    frontFenderLGeo.rotateZ(Math.PI / 2);
    const frontFenderL = new THREE.Mesh(frontFenderLGeo, this.materials.body);
    frontFenderL.position.set(-0.92, 0.52, 1.35);
    frontFenderL.castShadow = true;
    carRoot.add(frontFenderL);

    const frontFenderR = frontFenderL.clone();
    frontFenderR.position.set(0.92, 0.52, 1.35);
    frontFenderR.scale.x = -1;
    carRoot.add(frontFenderR);

    // ==========================================
    // 4. REAR HAUNCHES, ENGINE DECK & DIFFUSER
    // ==========================================
    // Wide Muscular Rear Haunches
    const rearFenderLGeo = new THREE.CylinderGeometry(0.52, 0.56, 1.05, 6, 1, false, 0, Math.PI);
    rearFenderLGeo.scale(0.38, 0.58, 1.0);
    rearFenderLGeo.rotateZ(Math.PI / 2);
    const rearFenderL = new THREE.Mesh(rearFenderLGeo, this.materials.body);
    rearFenderL.position.set(-0.95, 0.56, -1.35);
    rearFenderL.castShadow = true;
    carRoot.add(rearFenderL);

    const rearFenderR = rearFenderL.clone();
    rearFenderR.position.set(0.95, 0.56, -1.35);
    rearFenderR.scale.x = -1;
    carRoot.add(rearFenderR);

    // Rear Engine Decklid / Fastback Spine
    const rearDeckGeo = new THREE.BoxGeometry(1.68, 0.28, 1.35);
    const rearDeck = new THREE.Mesh(rearDeckGeo, this.materials.body);
    rearDeck.position.set(0, 0.62, -1.4);
    rearDeck.castShadow = true;
    carRoot.add(rearDeck);

    // Rear Engine Louvered Air Outlets
    for (let i = 0; i < 3; i++) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.02, 0.09), this.materials.carbon);
      louver.position.set(0, 0.77, -1.0 - i * 0.24);
      carRoot.add(louver);
    }

    // Rear Bumper Lower Apron
    const rearBumperGeo = new THREE.BoxGeometry(1.86, 0.26, 0.5);
    const rearBumper = new THREE.Mesh(rearBumperGeo, this.materials.body);
    rearBumper.position.set(0, 0.44, -2.05);
    rearBumper.castShadow = true;
    carRoot.add(rearBumper);

    // Formula 1 Grade Carbon Rear Diffuser with 4 Venturi Strakes
    const diffuserBase = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.16, 0.55), this.materials.carbon);
    diffuserBase.position.set(0, 0.22, -2.15);
    diffuserBase.rotation.x = -0.15;
    diffuserBase.castShadow = true;

    for (let s = -3; s <= 3; s++) {
      const strake = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.45), this.materials.carbon);
      strake.position.set(s * 0.25, 0.22, -2.15);
      strake.rotation.x = -0.15;
      carRoot.add(strake);
    }
    carRoot.add(diffuserBase);

    // Dual Polished Oval Titanium Exhaust Tips
    const exhaustL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 20), this.materials.chrome);
    exhaustL.rotation.x = Math.PI / 2;
    exhaustL.position.set(-0.48, 0.32, -2.25);
    const exhaustR = exhaustL.clone();
    exhaustR.position.set(0.48, 0.32, -2.25);
    carRoot.add(exhaustL, exhaustR);

    // Active High-Downforce Carbon GT Rear Wing
    const wingPylons = new THREE.Group();
    const pylonL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.14), this.materials.carbon);
    pylonL.position.set(-0.48, 0.82, -1.95);
    pylonL.rotation.x = -0.25;

    const pylonR = pylonL.clone();
    pylonR.position.set(0.48, 0.82, -1.95);

    const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.04, 0.36), this.materials.carbon);
    wingBlade.position.set(0, 0.98, -2.0);
    wingBlade.rotation.x = 0.08;
    wingBlade.castShadow = true;

    const wingPlateL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.42), this.materials.carbon);
    wingPlateL.position.set(-0.99, 0.98, -2.0);
    const wingPlateR = wingPlateL.clone();
    wingPlateR.position.set(0.99, 0.98, -2.0);

    wingPylons.add(pylonL, pylonR, wingBlade, wingPlateL, wingPlateR);
    carRoot.add(wingPylons);

    // ==========================================
    // 5. GREENHOUSE / CANOPY / GLASS & ROOF
    // ==========================================
    // Sculpted Carbon Roof Panel
    const roofGeo = new THREE.BoxGeometry(1.32, 0.06, 1.55);
    const roof = new THREE.Mesh(roofGeo, this.materials.carbon);
    roof.position.set(0, 1.04, -0.15);
    roof.castShadow = true;
    carRoot.add(roof);

    // Curved Aerodynamic Glass Cockpit
    const cabinGlassGeo = new THREE.CylinderGeometry(0.66, 0.88, 1.7, 6, 1, false, 0, Math.PI);
    cabinGlassGeo.scale(1.0, 0.54, 1.0);
    cabinGlassGeo.rotateX(Math.PI / 2);
    cabinGlassGeo.rotateY(Math.PI / 4);
    const windshield = new THREE.Mesh(cabinGlassGeo, this.materials.glass);
    windshield.position.set(0, 0.86, 0.08);
    windshield.castShadow = true;
    carRoot.add(windshield);

    // Aerodynamic Side Mirrors with Chrome Mirrors
    const createMirror = (isLeft) => {
      const mirror = new THREE.Group();
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.15, 8), this.materials.carbon);
      stalk.rotation.z = isLeft ? Math.PI / 3 : -Math.PI / 3;
      stalk.rotation.x = 0.2;

      const housing = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.11, 0.14), this.materials.body);
      housing.position.set(isLeft ? -0.12 : 0.12, 0.06, 0);
      housing.rotation.y = isLeft ? -0.2 : 0.2;

      const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.08), this.materials.chrome);
      glassPane.rotation.y = isLeft ? -Math.PI / 2 - 0.2 : Math.PI / 2 + 0.2;
      glassPane.position.set(isLeft ? -0.13 : 0.13, 0.06, -0.06);

      mirror.add(stalk, housing, glassPane);
      mirror.position.set(isLeft ? -0.86 : 0.86, 0.78, 0.7);
      return mirror;
    };

    carRoot.add(createMirror(true));
    carRoot.add(createMirror(false));

    // ==========================================
    // 6. HIGH-END INTERIOR COCKPIT
    // ==========================================
    const interiorGroup = new THREE.Group();
    interiorGroup.name = 'Interior';

    // Dashboard
    const dashGeo = new THREE.BoxGeometry(1.22, 0.16, 0.42);
    const dash = new THREE.Mesh(dashGeo, this.materials.interior);
    dash.position.set(0, 0.72, 0.58);
    interiorGroup.add(dash);
    this.interiorMeshes.push(dash);

    // Panoramic 6K OLED Display
    const hudScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.12, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    hudScreen.position.set(0, 0.78, 0.44);
    hudScreen.rotation.x = -0.25;
    interiorGroup.add(hudScreen);

    // Contoured Bucket Seats (Driver & Passenger)
    const createBucketSeat = (posX) => {
      const seat = new THREE.Group();

      // Lower cushion with side bolsters
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.48), this.materials.interior);
      cushion.position.set(0, 0.38, 0.05);

      // Backrest with lateral support wings
      const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.56, 0.12), this.materials.interior);
      backrest.position.set(0, 0.65, -0.18);
      backrest.rotation.x = -0.22;

      // Headrest with embossed logo plate
      const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.1), this.materials.interior);
      headrest.position.set(0, 0.95, -0.25);
      headrest.rotation.x = -0.22;

      seat.add(cushion, backrest, headrest);
      seat.position.x = posX;
      this.interiorMeshes.push(cushion, backrest, headrest);
      return seat;
    };

    interiorGroup.add(createBucketSeat(-0.35));
    interiorGroup.add(createBucketSeat(0.35));

    // Center Bridge Console
    const consoleBridge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.75), this.materials.carbon);
    consoleBridge.position.set(0, 0.48, 0.05);
    interiorGroup.add(consoleBridge);

    // Flat-Bottom Racing Steering Wheel
    const wheelTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.12, 0.018, 12, 24),
      this.materials.interior
    );
    wheelTorus.position.set(-0.35, 0.74, 0.36);
    wheelTorus.rotation.x = -0.38;
    this.interiorMeshes.push(wheelTorus);
    interiorGroup.add(wheelTorus);

    carRoot.add(interiorGroup);

    // ==========================================
    // 7. LIGHTING CLUSTERS (MATRIX LED & OLED TAILLIGHT)
    // ==========================================
    // Front Matrix LED Headlights (Dual Projector Lenses + Angled DRL Strips)
    const createHeadlight = (isLeft) => {
      const hlGroup = new THREE.Group();

      // Slanted DRL Blade
      const drlBlade = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.04, 0.16),
        this.materials.headlightDRL
      );
      drlBlade.rotation.y = isLeft ? 0.32 : -0.32;
      drlBlade.rotation.z = isLeft ? -0.1 : 0.1;

      // Projector Lens 1
      const proj1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 16, 16),
        this.materials.headlightLens
      );
      proj1.position.set(isLeft ? -0.1 : 0.1, 0.01, 0.05);

      // Projector Lens 2
      const proj2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 16, 16),
        this.materials.headlightLens
      );
      proj2.position.set(isLeft ? 0.06 : -0.06, 0.01, 0.02);

      hlGroup.add(drlBlade, proj1, proj2);
      hlGroup.position.set(isLeft ? -0.68 : 0.68, 0.54, 2.06);

      this.headlightMeshes.push(drlBlade, proj1, proj2);
      return hlGroup;
    };

    carRoot.add(createHeadlight(true));
    carRoot.add(createHeadlight(false));

    // Full-Width Continuous Rear Neon Red OLED Lightbar
    const taillightBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.72, 0.05, 0.06),
      this.materials.taillight
    );
    taillightBar.position.set(0, 0.6, -2.12);
    this.taillightMeshes.push(taillightBar);
    carRoot.add(taillightBar);

    // ==========================================
    // 8. WHEEL ASSEMBLIES (4 CORNERS) & BRAKE CALIPERS
    // ==========================================
    const wheelPositions = [
      { x: -0.98, y: 0.36, z: 1.35, isLeft: true, width: 0.28, radius: 0.36 },  // FL
      { x: 0.98, y: 0.36, z: 1.35, isLeft: false, width: 0.28, radius: 0.36 }, // FR
      { x: -1.02, y: 0.38, z: -1.35, isLeft: true, width: 0.32, radius: 0.38 }, // RL (wider rear tire)
      { x: 1.02, y: 0.38, z: -1.35, isLeft: false, width: 0.32, radius: 0.38 }, // RR
    ];

    this.wheelAssemblies = [];

    wheelPositions.forEach((pos, idx) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(pos.x, pos.y, pos.z);

      // Realistic Tire Tread & Sidewall
      const tireTreadGeo = new THREE.CylinderGeometry(pos.radius, pos.radius, pos.width, 32);
      tireTreadGeo.rotateZ(Math.PI / 2);
      const tireTread = new THREE.Mesh(tireTreadGeo, this.materials.tire);
      tireTread.castShadow = true;

      // Tire rounded sidewall lip
      const sidewallGeo = new THREE.TorusGeometry(pos.radius - 0.04, 0.04, 16, 32);
      sidewallGeo.rotateY(Math.PI / 2);
      const sidewall = new THREE.Mesh(sidewallGeo, this.materials.tire);
      sidewall.position.x = pos.isLeft ? -pos.width / 2 + 0.02 : pos.width / 2 - 0.02;

      wheelAssembly.add(tireTread, sidewall);

      // Drilled Steel Brake Disc Rotor
      const rotorGeo = new THREE.CylinderGeometry(pos.radius * 0.72, pos.radius * 0.72, 0.03, 28);
      rotorGeo.rotateZ(Math.PI / 2);
      const rotor = new THREE.Mesh(rotorGeo, this.materials.rotor);
      rotor.position.x = pos.isLeft ? 0.04 : -0.04;
      wheelAssembly.add(rotor);

      // High-Detail 6-Piston Brake Caliper (Prominently positioned and visible)
      const caliperGroup = new THREE.Group();
      const caliperBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.15, 0.22),
        this.materials.caliper
      );
      const caliperClamp = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.06, 0.24),
        this.materials.caliper
      );
      caliperClamp.position.y = 0.05;
      caliperGroup.add(caliperBody, caliperClamp);

      caliperGroup.position.set(pos.isLeft ? 0.05 : -0.05, 0.12, 0.1);
      caliperGroup.rotation.x = -0.35;
      wheelAssembly.add(caliperGroup);
      this.caliperMeshes.push(caliperBody, caliperClamp);

      // Dynamic Swappable Rim Group
      const rimGroup = new THREE.Group();
      rimGroup.name = `RimGroup_${idx}`;
      wheelAssembly.add(rimGroup);
      this.wheelGroups.push({ group: rimGroup, isLeft: pos.isLeft, radius: pos.radius, width: pos.width });

      carRoot.add(wheelAssembly);
      this.wheelAssemblies.push(wheelAssembly);
    });

    // Build initial default Sport Rims
    this._rebuildRims({
      type: 'sport',
      spokeCount: 5,
      spokeWidth: 0.045,
      finishColor: 0xd8dde6,
      metalness: 0.95,
      roughness: 0.18,
      hasAeroRing: false,
    });

    this.group.add(carRoot);
  }

  _rebuildRims(wheelConfig) {
    if (!wheelConfig) return;

    this.materials.rim.color.setHex(wheelConfig.finishColor || 0xd8dde6);
    this.materials.rim.metalness = wheelConfig.metalness ?? 0.95;
    this.materials.rim.roughness = wheelConfig.roughness ?? 0.18;
    this.materials.rim.needsUpdate = true;

    this.wheelGroups.forEach(({ group, isLeft, radius, width }) => {
      // Clear previous rim geometries
      while (group.children.length > 0) {
        const child = group.children[0];
        group.remove(child);
        if (child.geometry) child.geometry.dispose();
      }

      const outerX = isLeft ? -width / 2 - 0.01 : width / 2 + 0.01;

      // 1. Center Hub with Emblem Cap
      const hubGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 20);
      hubGeo.rotateZ(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, this.materials.rim);
      hub.position.x = outerX;
      group.add(hub);

      // Emblem center badge (Cyan highlight)
      const badgeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.01, 16);
      badgeGeo.rotateZ(Math.PI / 2);
      const badge = new THREE.Mesh(
        badgeGeo,
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      badge.position.x = outerX + (isLeft ? -0.032 : 0.032);
      group.add(badge);

      // 2. Outer Rim Barrel Lip
      const lipGeo = new THREE.TorusGeometry(radius * 0.78, 0.022, 16, 32);
      lipGeo.rotateY(Math.PI / 2);
      const rimLip = new THREE.Mesh(lipGeo, this.materials.rim);
      rimLip.position.x = outerX;
      group.add(rimLip);

      // 3. Optional Carbon Aero Ring (For Performance & Luxury)
      if (wheelConfig.hasAeroRing) {
        const ringGeo = new THREE.RingGeometry(radius * 0.48, radius * 0.74, 32);
        ringGeo.rotateY(Math.PI / 2);
        const aeroRing = new THREE.Mesh(
          ringGeo,
          wheelConfig.type === 'performance' ? this.materials.carbon : this.materials.glossBlack
        );
        aeroRing.position.x = outerX - (isLeft ? -0.01 : 0.01);
        group.add(aeroRing);
      }

      // 4. Distinct Spoke Architecture
      const count = wheelConfig.spokeCount || 5;
      const spokeW = wheelConfig.spokeWidth || 0.04;
      const spokeLength = radius * 0.74;

      for (let i = 0; i < count; i++) {
        const angle = (i * (Math.PI * 2)) / count;
        const spokeGeo = new THREE.BoxGeometry(0.04, spokeW, spokeLength);
        const spoke = new THREE.Mesh(spokeGeo, this.materials.rim);
        spoke.position.x = outerX;
        spoke.position.y = Math.sin(angle) * (spokeLength * 0.5);
        spoke.position.z = Math.cos(angle) * (spokeLength * 0.5);
        spoke.rotation.x = angle;
        group.add(spoke);

        // For Sport 5-spoke: add dual-split blade pair
        if (wheelConfig.type === 'sport') {
          const splitAngle = angle + 0.12;
          const spoke2 = new THREE.Mesh(spokeGeo, this.materials.rim);
          spoke2.position.x = outerX;
          spoke2.position.y = Math.sin(splitAngle) * (spokeLength * 0.5);
          spoke2.position.z = Math.cos(splitAngle) * (spokeLength * 0.5);
          spoke2.rotation.x = splitAngle;
          group.add(spoke2);
        }
      }
    });
  }

  // ==========================================
  // DYNAMIC CONFIGURATION & GSAP TRANSITIONS
  // ==========================================

  setExteriorColor(colorConfig) {
    if (!colorConfig) return;

    const targetColor = new THREE.Color(colorConfig.threeColor);

    // Smooth GSAP Color Transition
    gsap.to(this.materials.body.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.65,
      ease: 'power2.out',
      onUpdate: () => {
        this.materials.body.needsUpdate = true;
      },
    });

    gsap.to(this.materials.body, {
      roughness: colorConfig.roughness ?? 0.14,
      metalness: colorConfig.metalness ?? 0.9,
      clearcoat: colorConfig.clearcoat ?? 1.0,
      clearcoatRoughness: colorConfig.clearcoatRoughness ?? 0.03,
      duration: 0.65,
      ease: 'power2.out',
    });
  }

  setWheelType(wheelConfig) {
    if (!wheelConfig) return;
    this._rebuildRims(wheelConfig);
  }

  setBrakeCaliper(caliperConfig) {
    if (!caliperConfig) return;
    const targetColor = new THREE.Color(caliperConfig.threeColor);

    gsap.to(this.materials.caliper.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        this.materials.caliper.needsUpdate = true;
      },
    });
  }

  setInterior(interiorConfig) {
    if (!interiorConfig) return;
    const targetColor = new THREE.Color(interiorConfig.threeColor);

    gsap.to(this.materials.interior.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        this.materials.interior.needsUpdate = true;
      },
    });
  }

  setHeadlights(enabled) {
    const intensity = enabled ? 4.5 : 0.4;
    const lensIntensity = enabled ? 3.5 : 0.2;

    gsap.to(this.materials.headlightDRL, {
      emissiveIntensity: intensity,
      duration: 0.4,
    });
    gsap.to(this.materials.headlightLens, {
      emissiveIntensity: lensIntensity,
      duration: 0.4,
    });
    gsap.to(this.materials.taillight, {
      emissiveIntensity: intensity,
      duration: 0.4,
    });
  }
}
