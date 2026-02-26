from PIL import Image

tl = Image.open("tile-tl.png")
tr = Image.open("tile-tr.png")
bl = Image.open("tile-bl.png")
br = Image.open("tile-br.png")

w, h = tl.size

result = Image.new("RGB", (w * 2, h * 2))
result.paste(tl, (0, 0))
result.paste(tr, (w, 0))
result.paste(bl, (0, h))
result.paste(br, (w, h))

result.save("najarpur-map.png")
print(f"Done! Saved as najarpur-map.png ({w*2}x{h*2}px)")
