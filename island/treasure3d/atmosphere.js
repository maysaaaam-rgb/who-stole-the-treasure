/* island/treasure3d/atmosphere.js
 * Dynamic Story Time-of-Day & Walk-In Lantern Cave Atmosphere Controller
 * Smoothly blends sky dome, directional sun, hemisphere bounce, fog, and StylizedWater
 * across the 5 Treasure Island zones:
 *   Zone 1: Crisp Morning Sunlight
 *   Zone 2: Bright Tropical Midday
 *   Zone 3: Sunny Lagoon Afternoon
 *   Zone 4: Golden Late Afternoon (+ Smooth Walk-In Dark Lantern Cave!)
 *   Zone 5: Warm Golden-Coral Sunset Finale
 */
(function (root) {
  'use strict';

  var T3 = root.THREE;
  var TI3D = root.TI3D = root.TI3D || {};

  var PRESETS = {
    morning: {
      zenith: 0x3b98f2, mid: 0x8ad9ff, horizon: 0xfff5e2,
      fog: 0xe6f5ff, fogDensity: 0.0022,
      sunCol: 0xfff4dc, sunInt: 2.35, sunDir: [42, 36, 28],
      hemiSky: 0xa6e4ff, hemiGnd: 0xd4aa78, hemiInt: 0.62,
      rimCol: 0xffe8be, rimInt: 0.55,
      waterShallow: 0x2fd3e2, waterMid: 0x168fd6, waterDeep: 0x0e63ad,
      exposure: 1.06
    },
    midday: {
      zenith: 0x2484e6, mid: 0x76d1ff, horizon: 0xfef6e6,
      fog: 0xe4f4ff, fogDensity: 0.0020,
      sunCol: 0xfff7e6, sunInt: 2.55, sunDir: [24, 56, 22],
      hemiSky: 0x9ce0ff, hemiGnd: 0xc89e6e, hemiInt: 0.58,
      rimCol: 0xffe6b8, rimInt: 0.58,
      waterShallow: 0x26dae6, waterMid: 0x1288d0, waterDeep: 0x0c5ca8,
      exposure: 1.07
    },
    afternoon: {
      zenith: 0x2d88e4, mid: 0x82d4ff, horizon: 0xfff0d6,
      fog: 0xe8f3ff, fogDensity: 0.0023,
      sunCol: 0xffefd0, sunInt: 2.48, sunDir: [-32, 44, 26],
      hemiSky: 0xa0dcff, hemiGnd: 0xc99c6b, hemiInt: 0.57,
      rimCol: 0xffdfaa, rimInt: 0.62,
      waterShallow: 0x28c8da, waterMid: 0x1482c8, waterDeep: 0x0d5ba2,
      exposure: 1.06
    },
    lateAfternoon: {
      zenith: 0x3c7dd9, mid: 0x92c8f8, horizon: 0xffe2ba,
      fog: 0xf4ecdf, fogDensity: 0.0025,
      sunCol: 0xffe3b3, sunInt: 2.35, sunDir: [-44, 30, 18],
      hemiSky: 0xffdfc2, hemiGnd: 0xba8b5e, hemiInt: 0.56,
      rimCol: 0xffcf8c, rimInt: 0.68,
      waterShallow: 0x2ec2d0, waterMid: 0x197ab8, waterDeep: 0x104f8e,
      exposure: 1.05
    },
    sunset: {
      zenith: 0x4867c4, mid: 0xf29f7e, horizon: 0xffd596,
      fog: 0xfce4cc, fogDensity: 0.0026,
      sunCol: 0xffc982, sunInt: 2.25, sunDir: [-56, 17, -12],
      hemiSky: 0xffcaa6, hemiGnd: 0xb07c56, hemiInt: 0.60,
      rimCol: 0xffb36b, rimInt: 0.78,
      waterShallow: 0x3cc0c6, waterMid: 0x2674a8, waterDeep: 0x18457c,
      exposure: 1.08
    },
    cave: {
      zenith: 0x162038, mid: 0x1f2d4a, horizon: 0x2b3b5c,
      fog: 0x1a243b, fogDensity: 0.012,
      sunCol: 0x8da8d6, sunInt: 0.22, sunDir: [0, 30, 20],
      hemiSky: 0x4a628a, hemiGnd: 0x2a2438, hemiInt: 0.34,
      rimCol: 0x6b8cff, rimInt: 0.25,
      waterShallow: 0x1c6f88, waterMid: 0x124868, waterDeep: 0x0b2c48,
      exposure: 1.02
    }
  };

  function createAtmosphere(scene, renderer, waterMesh) {
    var cur = {
      zenith: new T3.Color(PRESETS.morning.zenith),
      mid: new T3.Color(PRESETS.morning.mid),
      horizon: new T3.Color(PRESETS.morning.horizon),
      fog: new T3.Color(PRESETS.morning.fog),
      fogDensity: PRESETS.morning.fogDensity,
      sunCol: new T3.Color(PRESETS.morning.sunCol),
      sunInt: PRESETS.morning.sunInt,
      sunDir: new T3.Vector3().fromArray(PRESETS.morning.sunDir),
      hemiSky: new T3.Color(PRESETS.morning.hemiSky),
      hemiGnd: new T3.Color(PRESETS.morning.hemiGnd),
      hemiInt: PRESETS.morning.hemiInt,
      rimCol: new T3.Color(PRESETS.morning.rimCol),
      rimInt: PRESETS.morning.rimInt,
      waterShallow: new T3.Color(PRESETS.morning.waterShallow),
      waterMid: new T3.Color(PRESETS.morning.waterMid),
      waterDeep: new T3.Color(PRESETS.morning.waterDeep),
      exposure: PRESETS.morning.exposure
    };

    var sunDirNorm = { value: cur.sunDir.clone().normalize() };

    // Gradient Sky Dome
    var skyMat = new T3.ShaderMaterial({
      side: T3.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uZenith: { value: cur.zenith.clone() },
        uMid: { value: cur.mid.clone() },
        uHorizon: { value: cur.horizon.clone() },
        uSunCol: { value: new T3.Color(0xfff6de) },
        uSunDir: sunDirNorm
      },
      vertexShader: [
        'varying vec3 vDir;',
        'void main() {',
        '  vDir = position;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uZenith;',
        'uniform vec3 uMid;',
        'uniform vec3 uHorizon;',
        'uniform vec3 uSunCol;',
        'uniform vec3 uSunDir;',
        'varying vec3 vDir;',
        'void main() {',
        '  vec3 d = normalize(vDir);',
        '  float h = clamp(d.y, -0.15, 1.0);',
        '  vec3 col = mix(uHorizon, uMid, smoothstep(-0.02, 0.24, h));',
        '  col = mix(col, uZenith, smoothstep(0.22, 0.80, h));',
        '  float sunAmt = max(0.0, dot(d, normalize(uSunDir)));',
        '  col += uSunCol * pow(sunAmt, 12.0) * 0.25;',
        '  col += uSunCol * smoothstep(0.9962, 0.9992, sunAmt) * 0.78;',
        '  gl_FragColor = vec4(col, 1.0);',
        '}'
      ].join('\n')
    });
    var skyDome = new T3.Mesh(new T3.SphereGeometry(340, 32, 20), skyMat);
    skyDome.frustumCulled = false;
    skyDome.renderOrder = -10;
    scene.add(skyDome);

    // Soft puffy 3D instanced clouds
    var cloudMesh = null;
    if (root.GameQualityCore && root.GameQualityCore.Atmosphere && root.GameQualityCore.Atmosphere.createDriftingClouds) {
      cloudMesh = root.GameQualityCore.Atmosphere.createDriftingClouds(12, { radiusMin: 95, radiusMax: 185, yMin: 34, yMax: 52 });
      scene.add(cloudMesh);
    }

    // Lights: Sun (with crisp shadow map following player), Hemisphere, Warm Rim, and Player Lantern PointLight
    var hemi = new T3.HemisphereLight(cur.hemiSky.getHex(), cur.hemiGnd.getHex(), cur.hemiInt);
    scene.add(hemi);

    var sun = new T3.DirectionalLight(cur.sunCol.getHex(), cur.sunInt);
    sun.castShadow = true;
    var isMob = !!(root.K3 && root.K3.MOBILE);
    var smSize = isMob ? 1024 : 2048;
    sun.shadow.mapSize.set(smSize, smSize);
    sun.shadow.camera.near = 2;
    sun.shadow.camera.far = 135;
    var sb = 32;
    sun.shadow.camera.left = -sb;
    sun.shadow.camera.right = sb;
    sun.shadow.camera.top = sb;
    sun.shadow.camera.bottom = -sb;
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);
    scene.add(sun.target);

    var rim = new T3.DirectionalLight(cur.rimCol.getHex(), cur.rimInt);
    rim.position.set(-28, 22, -32);
    scene.add(rim);

    // Warm Golden Player Hand-Lantern Light (shines brightly in Cave or when Lantern tool is equipped!)
    var lanternLight = new T3.PointLight(0xffb84a, 0.0, 17.5, 1.45);
    lanternLight.castShadow = false;
    scene.add(lanternLight);

    var tmpC = new T3.Color();
    var tmpV = new T3.Vector3();
    var activeZoneKey = 'morning';
    var caveBlend = 0;
    var shadowTick = 0;

    function pickZonePreset(x, z, questProgress) {
      // Sunset Cove (Zone 5: North-West)
      if (x < -23 && z < -2) return 'sunset';
      // Zone 4 Highlands / Tower / Fort
      if (z < -10) return 'lateAfternoon';
      // Zone 3 Lagoon & Shipwreck Island (East)
      if (x > 16) return 'afternoon';
      // Zone 2 Jungle Camp (Central)
      if (x > -21 && z < 26) return 'midday';
      // If all quests done, warm celebratory golden hour
      if (questProgress >= 5) return 'sunset';
      return 'morning';
    }

    function update(dt, elapsed, playerPos, inCaveFactor, lanternActive, questProgress) {
      activeZoneKey = pickZonePreset(playerPos.x, playerPos.z, questProgress || 0);
      var baseP = PRESETS[activeZoneKey] || PRESETS.morning;
      caveBlend += (Math.max(0, Math.min(1, inCaveFactor || 0)) - caveBlend) * Math.min(1, dt * 3.8);

      var rate = 1 - Math.exp(-dt * 2.2);

      function blendColor(curr, hexA, hexB) {
        tmpC.setHex(hexA);
        if (caveBlend > 0.001) {
          var cB = new T3.Color(hexB);
          tmpC.lerp(cB, caveBlend);
        }
        curr.lerp(tmpC, rate);
      }

      blendColor(cur.zenith, baseP.zenith, PRESETS.cave.zenith);
      blendColor(cur.mid, baseP.mid, PRESETS.cave.mid);
      blendColor(cur.horizon, baseP.horizon, PRESETS.cave.horizon);
      blendColor(cur.fog, baseP.fog, PRESETS.cave.fog);
      blendColor(cur.sunCol, baseP.sunCol, PRESETS.cave.sunCol);
      blendColor(cur.hemiSky, baseP.hemiSky, PRESETS.cave.hemiSky);
      blendColor(cur.hemiGnd, baseP.hemiGnd, PRESETS.cave.hemiGnd);
      blendColor(cur.rimCol, baseP.rimCol, PRESETS.cave.rimCol);
      blendColor(cur.waterShallow, baseP.waterShallow, PRESETS.cave.waterShallow);
      blendColor(cur.waterMid, baseP.waterMid, PRESETS.cave.waterMid);
      blendColor(cur.waterDeep, baseP.waterDeep, PRESETS.cave.waterDeep);

      var tgtFogD = baseP.fogDensity + (PRESETS.cave.fogDensity - baseP.fogDensity) * caveBlend;
      var tgtSunI = baseP.sunInt + (PRESETS.cave.sunInt - baseP.sunInt) * caveBlend;
      var tgtHemiI = baseP.hemiInt + (PRESETS.cave.hemiInt - baseP.hemiInt) * caveBlend;
      var tgtRimI = baseP.rimInt + (PRESETS.cave.rimInt - baseP.rimInt) * caveBlend;
      var tgtExp = baseP.exposure + (PRESETS.cave.exposure - baseP.exposure) * caveBlend;

      cur.fogDensity += (tgtFogD - cur.fogDensity) * rate;
      cur.sunInt += (tgtSunI - cur.sunInt) * rate;
      cur.hemiInt += (tgtHemiI - cur.hemiInt) * rate;
      cur.rimInt += (tgtRimI - cur.rimInt) * rate;
      cur.exposure += (tgtExp - cur.exposure) * rate;

      tmpV.fromArray(baseP.sunDir);
      cur.sunDir.lerp(tmpV, rate);
      sunDirNorm.value.copy(cur.sunDir).normalize();

      skyMat.uniforms.uZenith.value.copy(cur.zenith);
      skyMat.uniforms.uMid.value.copy(cur.mid);
      skyMat.uniforms.uHorizon.value.copy(cur.horizon);
      skyDome.position.set(playerPos.x, 0, playerPos.z);

      if (scene.fog) {
        scene.fog.color.copy(cur.fog);
        scene.fog.density = cur.fogDensity;
      }
      scene.background = cur.fog;

      hemi.color.copy(cur.hemiSky);
      hemi.groundColor.copy(cur.hemiGnd);
      hemi.intensity = cur.hemiInt;

      sun.color.copy(cur.sunCol);
      sun.intensity = cur.sunInt;
      sun.target.position.set(playerPos.x, playerPos.y, playerPos.z);
      sun.position.set(
        playerPos.x + cur.sunDir.x,
        playerPos.y + cur.sunDir.y,
        playerPos.z + cur.sunDir.z
      );

      rim.color.copy(cur.rimCol);
      rim.intensity = cur.rimInt;

      if (renderer) {
        renderer.toneMappingExposure = cur.exposure;
        shadowTick++;
        if (!renderer.shadowMap.autoUpdate && shadowTick % 2 === 0) {
          renderer.shadowMap.needsUpdate = true;
        }
      }

      // Update StylizedWater colors & sun direction
      if (waterMesh && waterMesh.material && waterMesh.material.uniforms) {
        var wu = waterMesh.material.uniforms;
        if (wu.uShallow) wu.uShallow.value.copy(cur.waterShallow);
        if (wu.uMid) wu.uMid.value.copy(cur.waterMid);
        if (wu.uDeep) wu.uDeep.value.copy(cur.waterDeep);
        if (wu.uFogColor) wu.uFogColor.value.copy(cur.fog);
        if (wu.uFogDensity) wu.uFogDensity.value = cur.fogDensity;
        if (wu.uSunDir) wu.uSunDir.value.copy(sunDirNorm.value);
        if (wu.uTime) wu.uTime.value = elapsed;
      }

      // Drifting clouds
      if (cloudMesh && cloudMesh.userData && cloudMesh.userData.update) {
        cloudMesh.visible = caveBlend < 0.82;
        cloudMesh.userData.update(elapsed);
      }

      // Warm flickering Lantern PointLight
      var wantLantern = lanternActive ? (caveBlend > 0.25 ? 3.4 : 1.15) : (caveBlend > 0.35 ? 1.8 : 0.0);
      var flicker = 1.0 + Math.sin(elapsed * 13.7) * 0.05 + Math.cos(elapsed * 21.3) * 0.03;
      lanternLight.intensity += (wantLantern * flicker - lanternLight.intensity) * Math.min(1, dt * 8);
    }

    return {
      skyDome: skyDome,
      sun: sun,
      hemi: hemi,
      lanternLight: lanternLight,
      update: update,
      getActivePresetName: function () { return caveBlend > 0.5 ? 'cave' : activeZoneKey; }
    };
  }

  TI3D.createAtmosphere = createAtmosphere;
})(typeof window !== 'undefined' ? window : this);
