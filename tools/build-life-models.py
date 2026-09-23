"""Rebuild the timeline's Blender source scenes, GLBs, and preview renders."""
import math
from pathlib import Path
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "source/life/assets/blender"
OUT.mkdir(parents=True, exist_ok=True)
SOURCES = ROOT / "art/life-blender"
SOURCES.mkdir(parents=True, exist_ok=True)


def material(name, color, metallic=0, roughness=0.4, emission=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Emission Color"].default_value = (*color, 1)
    shader.inputs["Emission Strength"].default_value = emission
    return mat


def reset():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    return [
        material("Graphite anodized aluminum", (0.065, 0.085, 0.1), 0.75),
        material("Brushed silver", (0.38, 0.46, 0.5), 0.8, 0.28),
        material("Mint indicators", (0.2, 0.85, 0.55), emission=2),
        material("Blue glass display", (0.09, 0.38, 0.85), 0.3, 0.22, 0.5),
        material("Warm copper", (0.75, 0.38, 0.1), 0.75, 0.25),
    ]


def finish(obj, name, pos, mat):
    obj.name = name
    obj.location = (pos[0], -pos[2], pos[1])
    obj.data.materials.append(mat)
    return obj


def box(name, pos, size, mat, bevel=0.04):
    bpy.ops.mesh.primitive_cube_add()
    obj = finish(bpy.context.object, name, pos, mat)
    obj.dimensions = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = obj.modifiers.new("Machined edges", "BEVEL")
        mod.width = bevel
        mod.segments = 3
        obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return obj


def cylinder(name, pos, radius, depth, mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=radius, depth=depth)
    return finish(bpy.context.object, name, pos, mat)


def ring(name, pos, radius, mat):
    bpy.ops.mesh.primitive_torus_add(major_segments=64, minor_segments=12,
                                   major_radius=radius, minor_radius=0.035)
    obj = finish(bpy.context.object, name, pos, mat)
    obj.rotation_euler.x = math.pi / 2
    return obj


def device(x, y, mats):
    dark, silver, mint, blue, copper = mats
    box("Device enclosure", (x, y, 0), (0.65, 1.1, 0.14), dark)
    box("Display", (x, y, 0.08), (0.53, 0.88, 0.025), blue, 0.025)
    box("Speaker", (x, y + 0.49, 0.085), (0.16, 0.018, 0.012), silver, 0.005)
    for i in range(3):
        box("Message line", (x, y + 0.2 - i * 0.17, 0.1),
            (0.34 - i * 0.05, 0.035, 0.01), mint, 0.005)


def rack(x, y, mats, scale=1):
    dark, silver, mint, blue, copper = mats
    box("Rack chassis", (x, y, 0), (1.05 * scale, 2.8 * scale, 0.9), dark)
    for side in [-1, 1]:
        box("Rack rail", (x + side * 0.47 * scale, y, 0.49),
            (0.045, 2.6 * scale, 0.08), silver, 0.01)
    for i in range(7):
        row = y + (i - 3) * 0.35 * scale
        box("Server sled", (x, row, 0.48), (0.83 * scale, 0.27 * scale, 0.09), silver, 0.015)
        for j in range(5):
            box("Air intake", (x - 0.25 * scale + j * 0.09 * scale, row, 0.535),
                (0.025, 0.14 * scale, 0.015), dark, 0.003)
        box("Status LED", (x + 0.32 * scale, row, 0.545), (0.035, 0.035, 0.018), mint, 0.008)


def save(name):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(filepath=str(OUT / (name + ".glb")),
                              export_format="GLB", use_selection=True, export_apply=True)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 24
    scene.world.color = (0.08, 0.08, 0.08)
    for pos, power, color, size in [
        ((2, -7, 8), 1800, (0.8, 0.9, 1), 7),
        ((-6, -3, 3), 1400, (0.4, 0.8, 1), 5),
        ((3, 4, 6), 2200, (1, 0.65, 0.35), 4),
    ]:
        bpy.ops.object.light_add(type="AREA", location=pos)
        light = bpy.context.object
        light.data.energy = power
        light.data.color = color
        light.data.shape = "DISK"
        light.data.size = size
        light.rotation_euler = (-light.location).to_track_quat("-Z", "Y").to_euler()
    bpy.ops.object.camera_add(location=(6, -15, 8))
    camera = bpy.context.object
    camera.rotation_euler = (-camera.location).to_track_quat("-Z", "Y").to_euler()
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 11
    scene.camera = camera
    scene.render.resolution_x = 1000
    scene.render.resolution_y = 750
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(SOURCES / (name + ".png"))
    bpy.ops.wm.save_as_mainfile(filepath=str(SOURCES / (name + ".blend")))
    bpy.ops.render.render(write_still=True)


m = reset()
dark, silver, mint, blue, copper = m
box("Router body", (0, -0.8, 0), (3.8, 0.8, 2.1), dark, 0.16)
box("Top panel", (0, -0.36, 0), (3.5, 0.09, 1.8), silver)
for i in range(16):
    box("Vent slot", (-1.4 + i * 0.185, -0.30, 0), (0.07, 0.035, 1), dark, 0.01)
for i in range(4):
    box("Ethernet port", (-1.2 + i * 0.62, -0.85, 1.055), (0.42, 0.28, 0.035), silver, 0.02)
    box("Port opening", (-1.2 + i * 0.62, -0.85, 1.08), (0.32, 0.19, 0.02), dark, 0.01)
    box("Port activity", (-1.05 + i * 0.62, -0.62, 1.08), (0.045, 0.035, 0.025), mint, 0.005)
for x in [-1.5, 0, 1.5]:
    cylinder("Antenna base", (x, -0.1, -0.7), 0.14, 0.3, copper)
    cylinder("Antenna", (x, 0.8, -0.7), 0.06, 1.7, dark)
for i in range(4):
    device(3.4 if i % 2 else -3.4, 2.4 if i < 2 else -2.1, m)
save("bonton-router")

m = reset()
rack(-2.8, 0, m)
for x, y in [(0, 1.7), (2.3, 0.2), (0.6, -1.7)]:
    rack(x, y, m, 0.48)
    ring("Cloud boundary", (x, y, -0.3), 1, m[3])
save("multicloud")

m = reset()
cylinder("Tower mast", (0, 0, 0), 0.11, 4.5, m[1])
box("Tower base", (0, -2.3, 0), (1.3, 0.18, 1.3), m[0])
for x in [-0.4, 0.4]:
    box("Radio antenna", (x, 1.65, 0), (0.25, 1.05, 0.25), m[1])
for r in [0.8, 1.2, 1.6]:
    ring("Radio wave", (0, 1.9, -0.3), r, m[2])
device(-3.3, -1.3, m)
rack(3.1, -0.8, m, 0.7)
save("wavelength")

for name, pipeline in [("freedom2hear", False), ("message-pipeline", True)]:
    m = reset()
    if pipeline:
        rack(0, 0, m)
    else:
        box("Inference processor", (0, 0, 0), (1.45, 1.45, 0.6), m[0], 0.12)
        box("Processor die", (0, 0, 0.34), (0.95, 0.95, 0.09), m[3], 0.05)
        for i in range(9):
            for side in [-1, 1]:
                box("Copper contact", ((i - 4) * 0.14, side * 0.82, 0.05),
                    (0.05, 0.22, 0.06), m[4], 0.01)
    ring("Processing orbit", (0, 0, -0.4), 1.7, m[2])
    for i in range(4):
        y = (i - 1.5) * 1.4
        device(-3.7, y, m)
        box("Output channel", (3.6, y, 0), (0.7, 0.48, 0.5), m[0])
        box("Output indicator", (3.6, y, 0.27), (0.48, 0.05, 0.025), m[2])
    save(name)
