import sys,glob
from PIL import Image,ImageDraw
pat,out,w=sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 360
fs=sorted(glob.glob(pat),key=lambda f:float(f.rsplit('_',1)[1][:-4]))
ims=[Image.open(f) for f in fs];h=int(ims[0].height*w/ims[0].width)
sh=Image.new('RGB',(w*len(ims),h+24),'gray');d=ImageDraw.Draw(sh)
for i,(f,im) in enumerate(zip(fs,ims)):sh.paste(im.resize((w,h)),(i*w,24));d.text((i*w+4,4),f.rsplit('_',1)[1],fill='white')
sh.save(out,quality=85)
